import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import GiftCardsForm from "./Form/GiftCardForm";
import { User } from "../../../types/user";
import { Group } from "../../../types/Group";
import ApiClient from "../../../api/apiClient/apiClient";
import { ToastContainer, toast } from "react-toastify";
import { GiftCard, GiftRequestUser } from "../../../types/gift_card";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import * as giftCardActionCreators from "../../../redux/actions/giftCardActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import TableComponent from "../../../components/Table";
import { Dropdown, Menu, TableColumnsType } from "antd";
import { AssignmentInd, AssuredWorkload, CardGiftcard, Collections, Delete, Download, Edit, Email, ErrorOutline, FileCopy, Landscape, LocalOffer, ManageAccounts, MenuOutlined, NotesOutlined, Slideshow, Wysiwyg } from "@mui/icons-material";
import PlotSelection from "./Form/PlotSelection";
import { Plot } from "../../../types/plot";
import giftCardActionTypes from "../../../redux/actionTypes/giftCardActionTypes";
import GiftCardRequestInfo from "./GiftCardRequestInfo";
import GiftRequestNotes from "./Form/Notes";
import AlbumImageInput from "../../../components/AlbumImageInput";
import EmailConfirmationModal from "./Form/EmailConfirmationModal";
import EditUserDetailsModal from "./Form/EditUserDetailsModal";
import { getHumanReadableDate, getUniqueRequestId } from "../../../helpers/utils";
import PaymentComponent from "../../../components/payment/PaymentComponent";
import { useAuth } from "../auth/auth";
import { UserRoles } from "../../../types/common";
import { LoginComponent } from "../Login/LoginComponent";
import TagComponent from "./Form/TagComponent";
import AssignTrees from "./Form/AssignTrees";

const GiftTrees: FC = () => {
    const dispatch = useAppDispatch();
    const { getGiftCards, deleteGiftCardRequest, cloneGiftCardRequest } =
        bindActionCreators(giftCardActionCreators, dispatch);

    let auth = useAuth();
    const authRef = useRef<any>(null);

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
    const [bookNonGiftable, setBookNonGiftable] = useState(false);
    const [diversify, setDiversify] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [notesModal, setNotesModal] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
    const [albumImagesModal, setAlbumImagesModal] = useState(false);
    const [album, setAlbum] = useState<any>(null);
    const [userDetailsEditModal, setUserDetailsEditModal] = useState(false);
    const [tagModal, setTagModal] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [testingMail, setTestingMail] = useState(false);

    // payment
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectedPaymentGR, setSelectedPaymentGR] = useState<GiftCard | null>(null);

    useEffect(() => {
        const getUsers = async () => {
            if (selectedGiftCard) {
                const apiClient = new ApiClient();
                const usersResp = await apiClient.getBookedGiftTrees(selectedGiftCard?.id, 0, 50);
                setUsers(usersResp.results);
            }
        }

        if (plotModal) getUsers();
    }, [plotModal, selectedGiftCard]);

    useEffect(() => {

        const getTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getGiftRequestTags();
                setTags(tagsResp.results);
            } catch (error: any) {
                toast.error(error.message);
            }
        }

        getTags();

    }, []);

    useEffect(() => {
        authRef.current = auth;
    }, [auth])

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

    const handleAlbumModalOpen = async (record: GiftCard) => {
        setSelectedGiftCard(record);
        if (record.album_id) {
            const apiClient = new ApiClient();
            const album = await apiClient.getAlbum(record.album_id);
            setAlbum(album);
        }
        setAlbumImagesModal(true);
    }

    const handleAlbumModalClose = () => {
        setSelectedGiftCard(null);
        setAlbumImagesModal(false);
        setAlbum(null);
    }

    const handleAlbumSave = async (files: (File | string)[]) => {
        if (!selectedGiftCard) return;
        setAlbumImagesModal(false);

        const apiClient = new ApiClient();
        try {

            if (album) {
                await apiClient.updateAlbum(album.id, files);
                await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id, album.id);
            } else {
                const filesList: File[] = [];
                files.forEach(file => {
                    if (typeof file !== 'string') filesList.push(file);
                })

                const album = await apiClient.createAlbum(selectedGiftCard.event_name || selectedGiftCard.request_id, selectedGiftCard.user_name || '', selectedGiftCard.user_email || '', filesList);
                await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id, album.id);
            }

            toast.success("Tree card request album images updated!")
        } catch (error: any) {
            toast.error(error.message);
        }

        setAlbum(null);
        setSelectedGiftCard(null);
    }

    const handleDeleteAlbum = async () => {
        if (!selectedGiftCard) return;
        setAlbumImagesModal(false);

        const apiClient = new ApiClient();
        try {

            if (album) await apiClient.deleteAlbum(album.id);
            await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id);

            toast.success("Removed tree card request album images!")
        } catch (error: any) {
            toast.error(error.message);
        }

        setAlbum(null);
        setSelectedGiftCard(null);
    }

    useEffect(() => {
        getGiftCardData();
    }, [pageSize, page, filters, auth]);

    const getGiftCardData = async () => {
        // check if user logged in
        if (!authRef.current?.signedin) return;

        let filtersData = Object.values(filters);
        // if normal user the fetch user specific data
        if (authRef.current?.roles?.includes(UserRoles.User) && authRef.current?.userId) {
            filtersData.push({
                columnField: 'user_id',
                operatorValue: 'equals',
                value: authRef.current.userId
            })
        }

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

    const saveNewGiftCardsRequest = async (user: User, group: Group | null, treeCount: number, category: string, grove: string | null, users: any[], paymentId?: number, logo?: File, messages?: any, file?: File) => {
        if (!requestId) {
            toast.error("Something went wrong. Please try again later!");
            return;
        }
        const apiClient = new ApiClient();
        let giftCardId: number;
        try {
            const response = await apiClient.createGiftCard(requestId, auth.userId, treeCount, user.id, category, grove, group?.id, paymentId, logo, messages, file);
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
                const response = await apiClient.upsertGiftCardUsers(giftCardId, users);
                dispatch({
                    type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                    payload: response,
                });
            }
            toast.success("Tree cards requested!");
        } catch (error) {
            toast.error("Failed to create tree card users");
            return;
        }
    }

    const updateGiftCardRequest = async (user: User, group: Group | null, treeCount: number, category: string, grove: string | null, users: any[], paymentId?: number, logo?: File, messages?: any, file?: File) => {
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        let success = false;
        try {
            const response = await apiClient.updateGiftCard(selectedGiftCard, treeCount, user.id, category, grove, group?.id, paymentId, logo, messages, file);
            toast.success("Tree Request updated successfully");
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            success = true;
            setRequestId(null);
            setSelectedGiftCard(null);
        } catch (error) {
            toast.error("Failed to update tree card request");
            return;
        }

        if (success) {
            try {
                if (users.length > 0) {
                    const response = await apiClient.upsertGiftCardUsers(selectedGiftCard.id, users);
                    dispatch({
                        type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                        payload: response,
                    });
                }
                toast.success("Tree cards requested!");
            } catch (error) {
                toast.error("Failed to create gift card users");
                return;
            }
        }
    }

    const handleSubmit = (user: User, group: Group | null, treeCount: number, category: string, grove: string | null, users: any[], paymentId?: number, logo?: File, messages?: any, file?: File) => {
        handleModalClose();

        if (changeMode === 'add') {
            saveNewGiftCardsRequest(user, group, treeCount, category, grove, users, paymentId, logo, messages, file);
        } else if (changeMode === 'edit') {
            updateGiftCardRequest(user, group, treeCount, category, grove, users, paymentId, logo, messages, file);
        }
    }

    const handlePlotSelectionCancel = () => {
        setPlotModal(false);
        setSelectedPlots([]);
        setSelectedGiftCard(null);
        setDiversify(false);
        setBookNonGiftable(false);
    }

    const handlePlotSelectionSubmit = async () => {
        if (!selectedGiftCard) return;
        setPlotModal(false);

        const apiClient = new ApiClient();
        if (selectedPlots.length !== 0) {
            try {
                await apiClient.createGiftCardPlots(selectedGiftCard.id, selectedPlots.map(plot => plot.id));
                toast.success("Saved selected plot for tree card request!");

                await apiClient.bookGiftCards(selectedGiftCard.id, selectedTrees.length > 0 ? selectedTrees : undefined, bookNonGiftable, diversify);                
                toast.success("Tree cards booked successfully");
                getGiftCardData();
            } catch {
                toast.error("Something went wrong!");
            }
        }

        handlePlotSelectionCancel();
    }

    const handleUserDetailsEditClose = () => {
        setUserDetailsEditModal(false);
        setSelectedGiftCard(null);
    }

    const handleUserDetailsEditSave = async (users: GiftRequestUser[]) => {
        handleUserDetailsEditClose();

        if (users.length === 0) return;

        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftRequestUserDetails(users);
            toast.success("Tree card request users updated!")
        } catch (error: any) {
            toast.error(error.message);
        }

    }

    const handleSendEmails = async (emailSponsor: boolean, emailReceiver: boolean, emailAssignee: boolean, testMails: string[], sponsorCC: string[], receiverCC: string[], eventType: string, attachCard: boolean) => {
        const giftCardRequestId = selectedGiftCard?.id
        if (testMails.length === 0) handleEmailModalClose();
        else setTestingMail(true);

        if (!giftCardRequestId) return;
        const apiClient = new ApiClient();
        try {
            await apiClient.sendEmailToGiftRequestUsers(giftCardRequestId, emailSponsor, emailReceiver, emailAssignee, eventType, attachCard, sponsorCC, receiverCC, testMails);
            toast.success("Emails sent successfully!")
        } catch (error: any) {
            toast.error(error.message)
        }

        setTestingMail(false);
    }

    const handleEmailModalClose = () => {
        setEmailConfirmationModal(false);
        setSelectedGiftCard(null);
    }

    const handleGenerateGiftCards = async (id: number) => {
        const apiClient = new ApiClient();
        apiClient.generateGiftCardTemplates(id);
        toast.success("Tree card creation may take upto 10mins. Please refresh the page after some time.")
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
            const response = await apiClient.updateGiftCard({ ...selectedGiftCard, notes: text }, selectedGiftCard.no_of_cards, selectedGiftCard.user_id, selectedGiftCard.category, selectedGiftCard.grove);
            toast.success("Tree card request updated successfully");
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

    const handlePaymentModalOpen = (request: GiftCard) => {
        setSelectedPaymentGR(request);
        setPaymentModal(true);
    }

    const handlePaymentFormSubmit = async (paymentId: number) => {
        if (!selectedPaymentGR || selectedPaymentGR.payment_id) return;

        try {
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(selectedPaymentGR, selectedPaymentGR.no_of_cards, selectedPaymentGR.user_id, selectedPaymentGR.category, selectedPaymentGR.grove, selectedPaymentGR.group_id, paymentId);
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Tag request

    const handleTagModalOpen = (request: GiftCard) => {
        setSelectedGiftCard(request);
        setTagModal(true);
    }

    const handleTagModalClose = () => {
        setSelectedGiftCard(null);
        setTagModal(false);
    }

    const handleTagTreeCardRequestSubmit = async (tags: string[]) => {
        if (!selectedGiftCard) return;

        setTagModal(false);
        try {
            const data = { ...selectedGiftCard };
            data.tags = tags;
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(data, selectedGiftCard.no_of_cards, selectedGiftCard.user_id, selectedGiftCard.category, selectedGiftCard.grove, selectedGiftCard.group_id);
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            toast.success("Updated the tree cards request tags!")
        } catch (error: any) {
            toast.error(error.message)
        }

        handleTagModalClose();
    }

    const getStatus = (card: GiftCard) => {
        if (card.status === 'pending_plot_selection') {
            return 'Pending Plot Selection';
        } else if (card.status === 'pending_assignment') {
            return 'Pending assignment';
        } else if (card.status === 'pending_gift_cards') {
            return 'Pending Tree cards creation';
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
            <Menu.ItemGroup>
                <Menu.Item key="00" onClick={() => { setSelectedGiftCard(record); setInfoModal(true); }} icon={<Wysiwyg />}>
                    View Summary
                </Menu.Item>
                <Menu.Item key="01" onClick={() => { handleModalOpenEdit(record); }} icon={<Edit />}>
                    Edit Request
                </Menu.Item>
                <Menu.Item key="02" onClick={() => { handleCloneGiftCardRequest(record); }} icon={<FileCopy />}>
                    Clone Request
                </Menu.Item>
                {((record.status === 'pending_plot_selection' || record.status === 'pending_assignment')) &&
                    <Menu.Item key="03" danger onClick={() => { setDeleteModal(true); setSelectedGiftCard(record); }} icon={<Delete />}>
                        Delete Request
                    </Menu.Item>
                }
            </Menu.ItemGroup>
            <Menu.Divider style={{ backgroundColor: '#ccc' }} />
            <Menu.ItemGroup>
                <Menu.Item key="10" onClick={() => { handleAlbumModalOpen(record); }} icon={<Collections />}>
                    Add Pictures
                </Menu.Item>
                {(record.validation_errors === null || !record.validation_errors.includes('MISSING_USER_DETAILS')) &&
                    <Menu.Item key="11" onClick={() => { setSelectedGiftCard(record); setUserDetailsEditModal(true); }} icon={<ManageAccounts />}>
                        Edit Recipient Details
                    </Menu.Item>
                }
            </Menu.ItemGroup>
            {(record.status === 'completed' || record.status === 'pending_gift_cards' || record.booked > 0) && <Menu.Divider style={{ backgroundColor: '#ccc' }} />}
            {(record.status === 'completed' || record.status === 'pending_gift_cards' || record.booked > 0) &&
                <Menu.ItemGroup>
                    {record.booked > 0 &&
                        <Menu.Item key="20" onClick={() => { handleGenerateGiftCards(record.id) }} icon={<CardGiftcard />}>
                            Generate Gift Cards
                        </Menu.Item>
                    }
                    {(record.status === 'completed' || record.status === 'pending_gift_cards') &&
                        <Menu.Item key="21" onClick={() => { setSelectedGiftCard(record); setEmailConfirmationModal(true); }} icon={<Email />}>
                            Send Emails
                        </Menu.Item>
                    }
                </Menu.ItemGroup>
            }
            {record.presentation_id && <Menu.Divider style={{ backgroundColor: '#ccc' }} />}
            {record.presentation_id && <Menu.ItemGroup>
                <Menu.Item key="30" onClick={() => { handleDownloadCards(record.id, record.user_name + '_' + record.no_of_cards, 'zip') }} icon={<Download />}>
                    Download Tree Cards
                </Menu.Item>
                <Menu.Item key="31" onClick={() => { window.open('https://docs.google.com/presentation/d/' + record.presentation_id); }} icon={<Slideshow />}>
                    Tree Cards Slide
                </Menu.Item>
            </Menu.ItemGroup>}
            {!auth.roles.includes(UserRoles.User) && <Menu.Divider style={{ backgroundColor: '#ccc' }} />}
            {!auth.roles.includes(UserRoles.User) && <Menu.ItemGroup>
                <Menu.Item key="40" onClick={() => { setSelectedGiftCard(record); setPlotModal(true); }} icon={<Landscape />}>
                    Book Trees
                </Menu.Item>
                <Menu.Item key="41" onClick={() => { setSelectedGiftCard(record); setAutoAssignModal(true); }} icon={<AssignmentInd />}>
                    Assign Trees
                </Menu.Item>
                <Menu.Item key="42" onClick={() => { handlePaymentModalOpen(record); }} icon={<AssuredWorkload />}>
                    Payment Details
                </Menu.Item>
                <Menu.Item key="43" onClick={() => { handleTagModalOpen(record); }} icon={<LocalOffer />}>
                    Tag Request
                </Menu.Item>
            </Menu.ItemGroup>}
        </Menu>
    );

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "id",
            key: "id",
            title: "Req. No.",
            align: "right",
            width: 100,
        },
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "Sponsor",
            align: "center",
            width: 200,
            ...getColumnSearchProps('user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "group_name",
            key: "group_name",
            title: "Sponsorship (Corporate/Personal)",
            align: "center",
            width: 200,
            render: (value: string) => value ? value : 'Personal',
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
            dataIndex: "created_by_name",
            key: "created_by_name",
            title: "Created by",
            align: "center",
            width: 200,
            ...getColumnSearchProps('created_by_name', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 200,
            render: value => value?.join(", ") || '',
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
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
            width: 120,
            render: (value) => value && value.length > 0 ? (
                <Tooltip title={<div>{getValidationErrors(value).map(item => (<p>{item}</p>))}</div>}>
                    <IconButton>
                        <ErrorOutline color="error" />
                    </IconButton>
                </Tooltip>
            ) : '',
        },
        {
            dataIndex: "amount",
            key: "amount",
            title: "Total Amount",
            align: "center",
            width: 150,
            render: (value, record, index) => record.no_of_cards * (record.category === "Foundation" ? 3000 : 1500)
        },
        {
            dataIndex: "payment_status",
            key: "payment_status",
            title: "Payment Status",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "notes",
            key: "notes",
            title: "Notes",
            align: "center",
            width: 100,
            render: (value, record) => (
                <IconButton onClick={() => { setSelectedGiftCard(record); setNotesModal(true); }}>
                    <Badge variant="dot" color="success" invisible={(!value || value.trim() === '') ? true : false}>
                        <NotesOutlined />
                    </Badge>
                </IconButton>
            ),
        },
        {
            dataIndex: "created_at",
            key: "created_at",
            title: "Created on",
            align: "center",
            width: 200,
            render: getHumanReadableDate,
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
                <Typography variant="h4" style={{ marginTop: '5px' }}>Tree Cards</Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "5px",
                        marginTop: "5px",
                    }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleModalOpenAdd}
                        style={{ textTransform: 'none', fontSize: 16 }}
                    >
                        Request Tree Cards
                    </Button>
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

            {auth.signedin && <Box sx={{ height: 840, width: "100%" }}>
                <TableComponent
                    loading={giftCardsData.loading}
                    dataSource={giftCards}
                    columns={columns}
                    totalRecords={giftCardsData.totalGiftCards}
                    fetchAllData={getAllGiftCardsData}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    tableName="Tree Trees"
                />
            </Box>}

            {!auth.signedin &&
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    mt={10}
                >
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleModalOpenAdd}
                        style={{ textTransform: 'none', fontSize: 16 }}
                    >
                        Request Tree Cards
                    </Button>
                    <Typography
                        fontSize={18}
                        color={"#51815A"}
                        mb={1}
                        mt={5}
                    >Login to see your previous tree cards requests!</Typography>
                    <LoginComponent />
                </Box>
            }

            <GiftCardsForm giftCardRequest={selectedGiftCard ?? undefined} requestId={requestId} open={modalOpen} handleClose={handleModalClose} onSubmit={handleSubmit} />

            <Dialog open={plotModal} onClose={() => setPlotModal(false)} fullWidth maxWidth="xl">
                <DialogTitle>Book Trees</DialogTitle>
                <DialogContent dividers>
                    {selectedGiftCard && <PlotSelection
                        giftCardRequestId={selectedGiftCard.id}
                        onTreeSelection={(trees: any[]) => { setSelectedTrees(trees); }}
                        requiredTrees={selectedGiftCard.no_of_cards - Number(selectedGiftCard.booked)}
                        plots={selectedPlots}
                        onPlotsChange={plots => setSelectedPlots(plots)}
                        bookNonGiftable={bookNonGiftable}
                        onBookNonGiftableChange={(value) => { setBookNonGiftable(value) }}
                        diversify={diversify}
                        onDiversifyChange={(value) => { setDiversify(value) }}
                    />}
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

            <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} fullWidth maxWidth='md'>
                <DialogTitle>Delete tree cards request</DialogTitle>
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

            <Dialog open={paymentModal} fullWidth maxWidth='md'>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent dividers>
                    <PaymentComponent
                        initialAmount={(selectedPaymentGR?.no_of_cards || 0) * 3000}
                        paymentId={selectedPaymentGR?.payment_id}
                        onChange={handlePaymentFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentModal(false)} color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedGiftCard && <AssignTrees 
                open={autoAssignModal}
                onClose={() => { setAutoAssignModal(false) }}
                giftCardRequestId={selectedGiftCard.id}
                onSubmit={() => { getGiftCardData(); }}
            />}

            <EmailConfirmationModal
                loading={testingMail}
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

            <AlbumImageInput
                open={albumImagesModal}
                onClose={handleAlbumModalClose}
                onSave={handleAlbumSave}
                onDeleteAlbum={handleDeleteAlbum}
                imageUrls={album?.images}
            />

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

            <TagComponent
                defaultTags={tags}
                tags={selectedGiftCard?.tags || []}
                open={tagModal}
                onClose={handleTagModalClose}
                onSubmit={handleTagTreeCardRequestSubmit}
            />
        </div>
    );
};

export default GiftTrees;