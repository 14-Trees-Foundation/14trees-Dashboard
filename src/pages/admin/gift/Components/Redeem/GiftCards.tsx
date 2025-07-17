
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as giftCardActionCreators from "../../../../../redux/actions/giftCardActions";
import { GiftCard, GiftCardUser } from "../../../../../types/gift_card";
import { RootState } from "../../../../../redux/store/store";
import { TableColumnsType } from "antd";
import { CardGiftcardOutlined } from "@mui/icons-material";
import TableComponent from "../../../../../components/Table";
import CardActivation from "./CardActivation";
import axios from "axios";
import { User } from "../../../../../types/user";
import { getGiftCards } from "../../../../../redux/actions/giftCardActions";

const GiftCards: FC = () => {
    const userId = 6428;
    const filtersData = [{
        columnField: 'user_id',
        operatorValue: 'equals',
        value: userId
    }]

    const dispatch = useAppDispatch();
    const { getGiftCards, getBookedGiftCards } =
        bindActionCreators(giftCardActionCreators, dispatch);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [bookedCardsPage, setBookedCardsPage] = useState(0);
    const [bookedCardsPageSize, setBookedCardsPageSize] = useState(10);
    const [activationModal, setActivationModal] = useState(false);
    const [selectedGiftCardUser, setSelectedGiftCardUser] = useState<GiftCardUser | null>(null);
    const [viewCardModal, setViewCardModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        getGiftCardData();
    }, [pageSize, page]);

    useEffect(() => {
        if (selectedGiftCard) {
            getBookedGiftCards(selectedGiftCard.id, bookedCardsPage * bookedCardsPageSize, bookedCardsPageSize);
        }
    }, [selectedGiftCard, bookedCardsPage, bookedCardsPageSize]);

    const getGiftCardData = async () => {
        getGiftCards(page * pageSize, pageSize, filtersData);
    };

    let giftCards: GiftCard[] = [];
    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

    let giftCardUsers: GiftCardUser[] = [];
    const giftCardUsersData = useAppSelector((state: RootState) => state.giftCardUsersData);
    if (giftCardUsersData) {
        giftCardUsers = Object.values(giftCardUsersData.giftCardUsers);
        giftCardUsers = giftCardUsers.sort((a, b) => b.id - a.id);
    }

    const getAllGiftCardsData = async () => {
        getGiftCards(0, giftCardsData.totalGiftCards, filtersData);
    };

    const getAllBookedGiftCardTreesData = async () => {
        if (selectedGiftCard) getBookedGiftCards(selectedGiftCard.id, 0, giftCardUsersData.totalGiftCardUsers);
    };

    const getStatus = (card: GiftCard) => {
        if (card.is_active) {
            return 'Active';
        } else if (card.plot_ids && card.plot_ids.length !== 0) {
            return 'Pending activation';
        } else {
            return 'Pending Plot Selection';
        }
    }

    const handleDownload = async () => {
        try {
            const imageUrl = selectedGiftCardUser?.card_image_url;
            if (!imageUrl) return;

            // Fetch the image data as a blob (binary data)
            const response = await axios.get(imageUrl, { responseType: 'blob' });

            // Create a URL for the blob and trigger download
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${selectedGiftCardUser.sapling_id}.jpg`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    const handleRedeemCard = () => {
        if (!selectedUser) {
            toast.error("Please select a user");
            return;
        }

        if (!selectedGiftCardUser) {
            toast.error("Please select a gift card");
            return;
        }

       /* if (selectedGiftCardUser.sapling_id && selectedGiftCardUser.tree_id) {
            redeemGiftCard(selectedGiftCardUser.id, selectedGiftCardUser.sapling_id, selectedGiftCardUser.tree_id, selectedUser);
        }*/
        setActivationModal(false);
    }

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "User",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "group_name",
            key: "group_name",
            title: "Group",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "no_of_cards",
            key: "no_of_cards",
            title: "# Cards",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            align: "center",
            width: 100,
            render: (value, record, index) => getStatus(record)
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 150,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedGiftCard(record);
                        }}>
                        <CardGiftcardOutlined />
                    </Button>
                </div>
            ),
        },
    ]

    const bookedCardsColumns: TableColumnsType<GiftCardUser> = [
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "User",
            align: "center",
            width: 250,
            render: (value) => value ? value : 'Unknown'
        },
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "Status",
            align: "center",
            width: 150,
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedGiftCardUser(record);
                            if (record.card_image_url) setViewCardModal(true);
                            else setActivationModal(true);
                        }}>
                        {record.card_image_url ? 'View' : 'Redeem'}
                    </Button>
                </div>
            ),
        },
    ]


    return (
        <div>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>Tree Cards</Typography>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

            <TableComponent
                dataSource={giftCards}
                columns={columns}
                totalRecords={giftCardsData.totalGiftCards}
                fetchAllData={getAllGiftCardsData}
                setPage={setPage}
                setPageSize={setPageSize}
            />

            <Divider sx={{ backgroundColor: "black", marginTop: '45px', marginBottom: '15px' }} />

            <TableComponent
                dataSource={giftCardUsers}
                columns={bookedCardsColumns}
                totalRecords={giftCardUsersData.totalGiftCardUsers}
                fetchAllData={getAllBookedGiftCardTreesData}
                setPage={setBookedCardsPage}
                setPageSize={setBookedCardsPageSize}
            />

            <Dialog open={activationModal && selectedGiftCardUser !== null} onClose={() => setActivationModal(false)} fullWidth maxWidth="xl">
                <DialogTitle>Redeem Your Gift Tree</DialogTitle>
                <DialogContent dividers>
                    {selectedGiftCardUser && <CardActivation giftCardUser={selectedGiftCardUser} onUserChange={setSelectedUser} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActivationModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRedeemCard} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={viewCardModal} onClose={() => setViewCardModal(false)} fullWidth maxWidth='md'>
                <DialogTitle>Your Tree</DialogTitle>
                <DialogContent dividers style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={selectedGiftCardUser?.card_image_url}
                        loading="lazy"
                        alt="Tree Card"
                        style={{ width: '800px', height: 'auto' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewCardModal(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleDownload} color="primary" variant="contained">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default GiftCards;