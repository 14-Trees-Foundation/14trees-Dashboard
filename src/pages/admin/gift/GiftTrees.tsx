import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip, Typography } from "@mui/material";
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
import { Dropdown, Menu, TableColumnsType } from "antd";
import { ErrorOutline, MenuOutlined, NotesOutlined } from "@mui/icons-material";
import PlotSelection from "./Form/PlotSelection";
import { Plot } from "../../../types/plot";
import giftCardActionTypes from "../../../redux/actionTypes/giftCardActionTypes";
import GiftCardRequestInfo from "./GiftCardRequestInfo";
import GiftRequestNotes from "./Form/Notes";
import AlbumImageInput from "../../../components/AlbumImageInput";
import EmailConfirmationModal from "./Form/EmailConfirmationModal";
import EditUserDetailsModal from "./Form/EditUserDetailsModal";

const getUniqueRequestId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const GiftTrees: FC = () => {
    const dispatch = useAppDispatch();
    const { getGiftCards, deleteGiftCardRequest, cloneGiftCardRequest } =
        bindActionCreators(giftCardActionCreators, dispatch);

    const [changeMode, setChangeMode] = useState<'add' | 'edit'>('add');
    const [modalOpen, setModalOpen] = useState(false);
    const [plotModal, setPlotModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [autoAssignModal, setAutoAssignModal] = useState(false);
    const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [notesModal, setNotesModal] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [manualPlotSelection, setManualPlotSelection] = useState(false);
    const [albumImagesModal, setAlbumImagesModal] = useState(false);
    const [userDetailsEditModal, setUserDetailsEditModal] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if (selectedGiftCard) {
                const apiClient = new ApiClient();
                const usersResp = await apiClient.getBookedGiftCards(selectedGiftCard?.id, 0, 20);
                setUsers(usersResp.results);
            }
        }

        if (plotModal) getUsers();
    }, [plotModal, selectedGiftCard]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handleModalOpenAdd = () => {
        setChangeMode('add');
        setSelectedGiftCard(null);
        const uniqueRequestId = getUniqueRequestId();
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

    const handleAlbumModalOpen = (record: GiftCard) => {
        setSelectedGiftCard(record);
        setAlbumImagesModal(true);
    }

    const handleAlbumModalClose = () => {
        setSelectedGiftCard(null);
        setAlbumImagesModal(false);
    }

    const handleAlbumSave = async (files: File[]) => {
        if (!selectedGiftCard) return;
        setAlbumImagesModal(false);

        const apiClient = new ApiClient();
        try {
            const album = await apiClient.createAlbum(selectedGiftCard.event_name || selectedGiftCard.request_id, selectedGiftCard.user_name || '', selectedGiftCard.user_email || '', files);
            await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id, album.id);

            toast.success("Gift Request Album images updated!")
        } catch (error: any) {
            toast.error(error.message);
        }

        setSelectedGiftCard(null);
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

    const handlePlotSelectionCancel = () => {
        setPlotModal(false);
        setSelectedPlots([]);
        setManualPlotSelection(false);
        setSelectedGiftCard(null);
    }

    const handlePlotSelectionSubmit = async () => {
        if (manualPlotSelection && users.findIndex(user => !user.tree_id) !== -1) {
            toast.error("You haven't selected trees for all the users!");
            return;
        }

        setPlotModal(false);
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        if (selectedPlots.length !== 0) {
            try {
                await apiClient.createGiftCardPlots(selectedGiftCard.id, selectedPlots.map(plot => plot.id));
                toast.success("Saved selected plot for gift card request!");

                await apiClient.bookGiftCards(selectedGiftCard.id, manualPlotSelection ? users : undefined);
                toast.success("Gift cards booked successfully");
                getGiftCardData();
            } catch {
                toast.error("Something went wrong!");
            }
        }

        setSelectedGiftCard(null);
        setSelectedPlots([]);
        setManualPlotSelection(false);
    }

    const handleUserDetailsEditClose = () => {
        setUserDetailsEditModal(false);
        setSelectedGiftCard(null);
    }

    const handleUserDetailsEditSave = async (users: GiftCard[]) => {
        handleUserDetailsEditClose();

        if (users.length === 0) return; 

        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftRequestUserDetails(users);
            toast.success("Gift Request users updated!")
        } catch (error: any) {
            toast.error(error.message);
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

    const handleSendEmails = async (testMails: string[], ccMails: string[], attachCard: boolean) => {
        const giftCardRequestId = selectedGiftCard?.id
        handleEmailModalClose();

        if (!giftCardRequestId) return;
        const apiClient = new ApiClient();
        try {
            await apiClient.sendEmailToGiftRequestUsers(giftCardRequestId, attachCard, ccMails.length > 0 ? ccMails : undefined, testMails.length > 0 ? testMails : undefined);
            toast.success("Emails sent successfully!")
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    const handleEmailModalClose = () => {
        setEmailConfirmationModal(false);
        setSelectedGiftCard(null);
    }

    const handleGenerateGiftCards = async (id: number) => {
        const apiClient = new ApiClient();
        apiClient.generateGiftCardTemplates(id);
        toast.success("Gift card creation may take upto 10mins. Please refresh the page after some time.")
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

    const handleNotesSave = async (text: string) => {
        setNotesModal(false);
        if (!selectedGiftCard) return;

        try {
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard({ ...selectedGiftCard, notes: text }, selectedGiftCard.no_of_cards, selectedGiftCard.user_id);
            toast.success("Gift Request updated successfully");
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
        } catch (error: any) {
            if (error?.response?.data?.message) toast.error(error.response.data.message);
            else toast.error("Please try again later!")
        }
    }

    const handleGiftCardRequestDelete = () => {
        if (!selectedGiftCard || selectedGiftCard.status === 'pending_gift_cards' || selectedGiftCard.status === 'completed') return;

        deleteGiftCardRequest(selectedGiftCard);
        setDeleteModal(false);
        setSelectedGiftCard(null);
    }

    const handleCloneGiftCardRequest = (request: GiftCard) => {
        cloneGiftCardRequest(request.id, getUniqueRequestId());
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

    const getActionsMenu = (record: GiftCard) => (
        <Menu>
            <Menu.Item key="0" onClick={() => { setSelectedGiftCard(record); setInfoModal(true); }}>
                View Summary
            </Menu.Item>
            <Menu.Item key="1" onClick={() => { handleModalOpenEdit(record); }}>
                Edit Request
            </Menu.Item>
            <Menu.Item key="2" onClick={() => { handleAlbumModalOpen(record); }}>
                Add Album Images
            </Menu.Item>
            {(record.validation_errors === null || !record.validation_errors.includes('MISSING_USER_DETAILS')) && <Menu.Item key="10" onClick={() => { setSelectedGiftCard(record); setUserDetailsEditModal(true); }}>
                Edit User Details
            </Menu.Item>}
            {record.status === 'pending_plot_selection' && <Menu.Item key="3" onClick={() => { setSelectedGiftCard(record); setPlotModal(true); }}>
                Select Plots
            </Menu.Item>}
            {record.status === 'pending_assignment' && <Menu.Item key="4" onClick={() => { setSelectedGiftCard(record); setAutoAssignModal(true); }}>
                Assign Trees
            </Menu.Item>}
            {record.status === 'completed' && <Menu.Item key="5" onClick={() => { handleDownloadCards(record.id, record.user_name + '_' + record.no_of_cards, 'zip') }}>
                Download Gift Cards
            </Menu.Item>}
            {record.status === 'completed' && <Menu.Item key="6" onClick={() => { window.open('https://docs.google.com/presentation/d/' + record.presentation_id); }}>
                Gift Cards Slide
            </Menu.Item>}
            {(record.status === 'completed' || record.status === 'pending_gift_cards') && <Menu.Item key="7" onClick={() => { handleGenerateGiftCards(record.id) }}>
                Generate Gift Cards
            </Menu.Item>}
            {(record.status === 'completed' || record.status === 'pending_gift_cards') && <Menu.Item key="8" onClick={() => { setSelectedGiftCard(record); setEmailConfirmationModal(true); }}>
                Send Emails
            </Menu.Item>}
            <Menu.Item key="11" onClick={() => { handleCloneGiftCardRequest(record); }}>
                Clone Request
            </Menu.Item>
            {(record.status === 'pending_plot_selection' || record.status === 'pending_assignment') && <Menu.Item key="9" danger onClick={() => { setDeleteModal(true); setSelectedGiftCard(record); }}>
                Delete Request
            </Menu.Item>}
        </Menu>
    );

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "id",
            key: "id",
            title: "Req. No.",
            align: "right",
            width: 50,
        },
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
                <Tooltip title={<div>{getValidationErrors(value).map(item => (<p>{item}</p>))}</div>}>
                    <IconButton>
                        <ErrorOutline color="error" />
                    </IconButton>
                </Tooltip>
            ) : '',
        },
        {
            dataIndex: "notes",
            key: "notes",
            title: "Notes",
            align: "center",
            width: 100,
            render: (value, record) => (
                <IconButton onClick={() => { setSelectedGiftCard(record); setNotesModal(true); }}>
                    <NotesOutlined />
                </IconButton>
            ),
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Dropdown overlay={getActionsMenu(record)} trigger={['click']}>
                        <Button
                            variant='outlined'
                            color='success'
                            style={{ margin: "0 5px" }}
                        >
                            <MenuOutlined />
                        </Button>
                    </Dropdown>
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

            <Dialog open={plotModal} onClose={() => setPlotModal(false)} fullWidth maxWidth="xl">
                <DialogTitle>Select Plots</DialogTitle>
                <DialogContent dividers>
                    <PlotSelection
                        users={users}
                        onUsersChange={(users: any[]) => { setUsers(users) }}
                        requiredTrees={selectedGiftCard?.no_of_cards ?? 0}
                        plots={selectedPlots}
                        onPlotsChange={plots => setSelectedPlots(plots)}
                        manualPlotSelection={manualPlotSelection}
                        onPlotSelectionMethodChange={(value) => { setManualPlotSelection(value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePlotSelectionCancel} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handlePlotSelectionSubmit} color="success" variant="contained">
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

            <EmailConfirmationModal 
                sponsorMail={selectedGiftCard?.user_email}
                open={emailConfirmationModal}
                onClose={handleEmailModalClose}
                onSubmit={handleSendEmails}
            />
            
            <EditUserDetailsModal
                giftRequestId={selectedGiftCard?.id}
                requestId={selectedGiftCard?.request_id}
                open={userDetailsEditModal}
                onClose={handleUserDetailsEditClose}
                onSave={handleUserDetailsEditSave}
            />

            <AlbumImageInput open={albumImagesModal} onClose={handleAlbumModalClose} onSave={handleAlbumSave} />

            <GiftCardRequestInfo
                open={infoModal}
                onClose={() => { setInfoModal(false) }}
                data={selectedGiftCard}
            />

            <GiftRequestNotes
                open={notesModal}
                handleClose={() => { setNotesModal(false) }}
                onSave={handleNotesSave}
                initialText={selectedGiftCard?.notes ?? ''}
            />
        </div>
    );
};

export default GiftTrees;