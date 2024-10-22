import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import GiftCardsForm from "./Form/GiftCardForm";
import { User } from "../../../types/user";
import { Group } from "../../../types/Group";
import ApiClient from "../../../api/apiClient/apiClient";
import { ToastContainer, toast } from "react-toastify";
import { GiftCard } from "../../../types/gift_card";
import getColumnSearchProps from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import * as giftCardActionCreators from "../../../redux/actions/giftCardActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import TableComponent from "../../../components/Table";
import { TableColumnsType } from "antd";
import { AssignmentTurnedInOutlined, CardGiftcardOutlined, DeleteOutline, DownloadOutlined, EditOutlined, EmailOutlined, ErrorOutline, InfoOutlined, LandscapeOutlined, LinkOutlined } from "@mui/icons-material";
import PlotSelection from "./Form/PlotSelection";
import { Plot } from "../../../types/plot";
import giftCardActionTypes from "../../../redux/actionTypes/giftCardActionTypes";
import GiftCardRequestInfo from "./GiftCardRequestInfo";

const GiftTrees: FC = () => {
    const dispatch = useAppDispatch();
    const { getGiftCards, deleteGiftCardRequest } =
        bindActionCreators(giftCardActionCreators, dispatch);

    const [changeMode, setChangeMode] = useState<'add' | 'edit'>('add');
    const [modalOpen, setModalOpen] = useState(false);
    const [plotModal, setPlotModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [autoAssignModal, setAutoAssignModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handleModalOpenAdd = () => {
        setChangeMode('add');
        const uniqueRequestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setRequestId(uniqueRequestId);
        setModalOpen(true);
    }
    const handleModalOpenEdit = (record: GiftCard) => {
        setChangeMode('edit');
        setSelectedGiftCard(record);
        setRequestId(record.request_id);

        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedGiftCard(null);
        setRequestId(null);
    }

    useEffect(() => {
        getGiftCardData();
    }, [pageSize, page, filters]);

    const getGiftCardData = async () => {
        let filtersData = Object.values(filters);
        getGiftCards(page * pageSize, pageSize, filtersData);
    };

    let giftCards: GiftCard[] = [];
    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

    const getAllGiftCardsData = async () => {
        let filtersData = Object.values(filters);
        getGiftCards(0, giftCardsData.totalGiftCards, filtersData);
    };

    const saveNewGiftCardsRequest = async (user: User, group: Group | null, treeCount: number, users: any[], logo?: File, messages?: any, file?: File) => {
        if (!requestId) {
            toast.error("Something went wrong. Please try again later!");
            return;
        }
        const apiClient = new ApiClient();
        let giftCardId: number;
        try {
            const response = await apiClient.createGiftCard(requestId, treeCount, user.id, group?.id, logo, messages, file);
            giftCardId = response.id;
            dispatch({
                type: giftCardActionTypes.CREATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            setRequestId(null);
        } catch (error) {
            toast.error("Failed to create gift card");
            return;
        }

        try {
            if (users.length > 0) {
                const response = await apiClient.createGiftCardUsers(giftCardId, users);
                dispatch({
                    type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                    payload: response,
                });
            }
            toast.success("Gift cards requested!");
        } catch (error) {
            toast.error("Failed to create gift card users");
            return;
        }
    }

    const updateGiftCardRequest = async (user: User, group: Group | null, treeCount: number, users: any[], logo?: File, messages?: any, file?: File) => {
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        let success = false;
        try {
            const response = await apiClient.updateGiftCard(selectedGiftCard, treeCount, user.id, group?.id, logo, messages, file);
            toast.success("Gift Request updated successfully");
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            success = true;
            setRequestId(null);
            setSelectedGiftCard(null);
        } catch (error) {
            toast.error("Failed to update gift request");
            return;
        }

        if (success) {
            try {
                if (users.length > 0) {
                    const response = await apiClient.createGiftCardUsers(selectedGiftCard.id, users);
                    dispatch({
                        type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                        payload: response,
                    });
                }
                toast.success("Gift cards requested!");
            } catch (error) {
                toast.error("Failed to create gift card users");
                return;
            }
        }
    }

    const handleSubmit = (user: User, group: Group | null, treeCount: number, users: any[], logo?: File, messages?: any, file?: File) => {
        handleModalClose();

        if (changeMode === 'add') {
            saveNewGiftCardsRequest(user, group, treeCount, users, logo, messages, file);
        } else if (changeMode === 'edit') {
            updateGiftCardRequest(user, group, treeCount, users, logo, messages, file);
        }
    }

    const handlePlotSelectionSubmit = async () => {
        setPlotModal(false);
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        if (selectedPlots.length !== 0) {
            try {
                await apiClient.createGiftCardPlots(selectedGiftCard.id, selectedPlots.map(plot => plot.id));
                toast.success("Saved selected plot for gift card request!");

                await apiClient.bookGiftCards(selectedGiftCard.id);
                toast.success("Gift cards booked successfully");
                getGiftCardData();
            } catch {
                toast.error("Something went wrong!");
            }
        }
    }

    const handleAutoAssignTrees = async () => {
        setAutoAssignModal(false);
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        try {
            await apiClient.autoAssignTrees(selectedGiftCard.id);
            getGiftCardData();
            toast.success("Successfully assigned trees to users!");
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const handleGenerateGiftCards = async (id: number) => {
        const apiClient = new ApiClient();
        apiClient.generateGiftCardTemplates(id);
        toast.success("Gift card creation ma take upto 10mins. Please come back after some time.")
    }

    const handleDownloadCards = async (id: number, name: string, type: 'pdf' | 'ppt' | 'zip') => {
        try {
            const apiClient = new ApiClient();
            const data = await apiClient.downloadGiftCards(id, type);

            const blob = new Blob([data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = name + '.' + type;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }

    }

    const handleSendEmail = async (id: number) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.sendEmailToGiftRequestUsers(id);

            toast.success("Emails sent successfully!")
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    const handleGiftCardRequestDelete = () => {
        if (!selectedGiftCard || selectedGiftCard.status === 'pending_gift_cards' || selectedGiftCard.status === 'completed') return;

        deleteGiftCardRequest(selectedGiftCard);
        setDeleteModal(false);
        setSelectedGiftCard(null);
    }

    const getStatus = (card: GiftCard) => {
        if (card.status === 'pending_plot_selection') {
            return 'Pending Plot Selection';
        } else if (card.status === 'pending_assignment') {
            return 'Pending assignment';
        } else if (card.status === 'pending_gift_cards') {
            return 'Pending Gift cards creation';
        } else {
            return 'Completed';
        }
    }

    const getValidationErrors = (errorValues: string[]) => {
        let errors = []
        if (errorValues.includes('MISSING_LOGO')) errors.push('Missing Company Logo');
        if (errorValues.includes('MISSING_USER_DETAILS')) errors.push('Missing user details for assignment');

        return errors;
    }

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "User",
            align: "center",
            width: 200,
            ...getColumnSearchProps('user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "group_name",
            key: "group_name",
            title: "Group",
            align: "center",
            width: 200,
            ...getColumnSearchProps('group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "no_of_cards",
            key: "no_of_cards",
            title: "# Cards",
            align: "center",
            width: 100,
            ...getColumnSearchProps('no_of_cards', filters, handleSetFilters)
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            align: "center",
            width: 150,
            render: (value, record, index) => getStatus(record),
        },
        {
            dataIndex: "validation_errors",
            key: "validation_errors",
            title: "Validation Errors",
            align: "center",
            width: 100,
            render: (value) => value && value.length > 0 ? (
                <Tooltip title={<div>{getValidationErrors(value).map(item => (<p>{item}</p>) )}</div>}>
                    <IconButton>
                        <ErrorOutline color="error"/>
                    </IconButton>
                </Tooltip>
            ) : '',
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 250,
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
                            setInfoModal(true);
                        }}>
                        <InfoOutlined />
                    </Button>
                    {record.status === 'pending_plot_selection' && <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        disabled={record.validation_error === 'MISSING_LOGO'}
                        onClick={() => {
                            setSelectedGiftCard(record);
                            setPlotModal(true);
                        }}>
                        <LandscapeOutlined />
                    </Button>}
                    {record.status === 'pending_assignment' && <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        disabled={record.validation_error === 'MISSING_USER_DETAILS'}
                        onClick={() => {
                            setSelectedGiftCard(record);
                            setAutoAssignModal(true);
                        }}>
                        <AssignmentTurnedInOutlined />
                    </Button>}
                    {record.status === 'completed' && <div>
                        <Button
                            variant="outlined"
                            style={{ margin: "0 5px" }}
                            disabled={!record.presentation_id}
                            onClick={() => { window.open('https://docs.google.com/presentation/d/' + record.presentation_id) }}
                        >
                            <LinkOutlined />
                        </Button>
                    </div>}
                    {record.status === 'completed' && <div>
                        <Button
                            variant="outlined"
                            style={{ margin: "0 5px" }}
                            disabled={!record.presentation_id}
                            onClick={() => { handleDownloadCards(record.id, record.user_name + '_' + record.no_of_cards, 'zip') }}
                        >
                            <DownloadOutlined />
                        </Button>
                    </div>}
                    {record.status === 'completed' && <div>
                        <Button
                            variant="outlined"
                            style={{ margin: "0 5px" }}
                            onClick={() => { handleSendEmail(record.id) }}
                        >
                            <EmailOutlined />
                        </Button>
                    </div>}
                    {record.status === 'pending_gift_cards' && <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => { handleGenerateGiftCards(record.id) }}
                    >
                        <CardGiftcardOutlined />
                    </Button>}
                    <Button
                        variant="outlined"
                        disabled={record.status !== 'pending_plot_selection'}
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            handleModalOpenEdit(record);
                        }}>
                        <EditOutlined />
                    </Button>
                    {(record.status === 'pending_assignment' || record.status === 'pending_plot_selection') && <Button
                        variant="outlined"
                        color='error'
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setDeleteModal(true);
                            setSelectedGiftCard(record);
                        }}>
                        <DeleteOutline />
                    </Button>}
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
                <Typography variant="h4" style={{ marginTop: '5px' }}>Gift Cards</Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "5px",
                        marginTop: "5px",
                    }}>
                    <Button variant="contained" color="success" onClick={handleModalOpenAdd}>
                        Create Gift Request
                    </Button>
                </div>
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

            <GiftCardsForm giftCardRequest={selectedGiftCard ?? undefined} requestId={requestId} open={modalOpen} handleClose={handleModalClose} onSubmit={handleSubmit} />

            <Dialog open={plotModal} onClose={() => setPlotModal(false)} fullWidth maxWidth="lg">
                <DialogTitle>Select Plots</DialogTitle>
                <DialogContent dividers>
                    <PlotSelection requiredTrees={selectedGiftCard?.no_of_cards ?? 0} plots={selectedPlots} onPlotsChange={plots => setSelectedPlots(plots)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPlotModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePlotSelectionSubmit} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={autoAssignModal} onClose={() => setAutoAssignModal(false)} fullWidth maxWidth="lg">
                <DialogTitle>Auto-assign trees to gift card request users</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1">Are you sure you want to auto assign trees to users?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAutoAssignModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAutoAssignTrees} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} fullWidth maxWidth='md'>
                <DialogTitle>Auto-assign trees to gift card request users</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1">Are you sure you want to delete this gift card request? It will delete related plot selection on booked trees.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleGiftCardRequestDelete} color="success" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            
            <GiftCardRequestInfo 
                open={infoModal}
                onClose={() => { setInfoModal(false) }}
                data={selectedGiftCard}
            />
        </div>
    );
};

export default GiftTrees;