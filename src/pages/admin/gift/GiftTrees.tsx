import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import GiftTreesChart from "./Components/GiftTreesChart";
import GiftCardsForm from "./Components/GiftCardForm";
import { User } from "../../../types/user";
import { Group } from "../../../types/Group";
import ApiClient from "../../../api/apiClient/apiClient";
import { ToastContainer, toast } from "react-toastify";
import { GiftCard, GiftRequestType_CARDS_REQUEST, GiftRequestType_NORAML_ASSIGNMENT, GiftRequestType_VISIT, GiftRequestUser, SponsorshipType } from "../../../types/gift_card";
import { GridFilterItem } from "@mui/x-data-grid";
import * as giftCardActionCreators from "../../../redux/actions/giftCardActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import PlotSelection from "./Form/PlotSelection";
import { Plot } from "../../../types/plot";
import giftCardActionTypes from "../../../redux/actionTypes/giftCardActionTypes";
import GiftCardRequestInfo from "./Components/GiftCardRequestInfo";
import GiftRequestNotes from "./Components/Notes";
import AlbumImageInput from "../../../components/AlbumImageInput";
import EmailConfirmationModal from "./Components/EmailConfirmationModal";
import EditUserDetailsModal from "./Components/EditUserDetailsModal";
import { getUniqueRequestId } from "../../../helpers/utils";
import PaymentComponent from "../../../components/payment/PaymentComponent";
import AutoPrsPlots from "../../../components/AutoPrsPlots/AutoPrsPlots"
import { useAuth } from "../auth/auth";
import { Order, UserRoles } from "../../../types/common";
import { LoginComponent } from "../Login/LoginComponent";
import TagComponent from "./Components/TagComponent";
import AssignTrees from "./Components/AssignTrees";
import GiftCardCreationModal from "./Components/GiftCardCreationModal";
import GeneralTable from "../../../components/GenTable";
import AutoProcessConfirmationModal from "./Components/AutoProcessConfirmationModal";
import { createTableColumns, pendingPlotSelection } from "./config/tableColumns";
import { createActionsMenu } from "./config/actionsMenu";
import TableSummary from "./components/TableSummary";



const GiftTrees: FC = () => {
    const dispatch = useAppDispatch();
    const { getGiftCards, deleteGiftCardRequest, cloneGiftCardRequest } =
        bindActionCreators(giftCardActionCreators, dispatch);

    let auth = useAuth();
    const authRef = useRef<any>(null);

    const [changeMode, setChangeMode] = useState<'add' | 'edit'>('add');
    const [step, setStep] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [plotModal, setPlotModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [autoAssignModal, setAutoAssignModal] = useState(false);
    const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
    const [bookNonGiftable, setBookNonGiftable] = useState(false);
    const [diversify, setDiversify] = useState(false);
    const [bookAllHabits, setBookAllHabits] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [notesModal, setNotesModal] = useState(false);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
    const [albumImagesModal, setAlbumImagesModal] = useState(false);
    const [album, setAlbum] = useState<any>(null);
    const [userDetailsEditModal, setUserDetailsEditModal] = useState(false);
    const [tagModal, setTagModal] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [testingMail, setTestingMail] = useState(false);
    const [giftCardNotification, setGiftCardNotification] = useState(false);
    const [selectedGiftRequestIds, setSelectedGiftRequestIds] = useState<number[]>([]);

    // create/update loading
    const [savingChange, setSavingChange] = useState(false);

    // Chart
    const [corporateCount, setCorporateCount] = useState(0);
    const [personalCount, setPersonalCount] = useState(0);

    // payment
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectedPaymentGR, setSelectedPaymentGR] = useState<GiftCard | null>(null);

    // Auto process request
    const [autoPrsConfirm, setPrsConfirm] = useState(false);
    const [autoProcessing, setAutoProcessing] = useState(false);

    let giftCards: GiftCard[] = [];
    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

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

    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, auth]);

    useEffect(() => {

        const handler = setTimeout(() => {

            if (giftCardsData.loading) return;

            const records: GiftCard[] = [];
            const maxLength = Math.min((page + 1) * pageSize, giftCardsData.totalGiftCards);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (!Object.hasOwn(giftCardsData.paginationMapping, i)) {
                    getGiftCardData();
                    break;
                }

                const id = giftCardsData.paginationMapping[i];
                const record = giftCardsData.giftCards[id];
                if (record) records.push(record);
            }

            setTableRows(records);
        }, 300)

        return () => { clearTimeout(handler) };
    }, [pageSize, page, giftCardsData]);

    // Chart Useffect
    useEffect(() => {
        if (!giftCards || !Array.isArray(giftCards)) return;

        const corporate = giftCards.filter(card => card.group_name && card.group_name !== 'Personal').length || 0;
        const personal = giftCards.filter(card => !card.group_name || card.group_name === 'Personal').length || 0;

        setCorporateCount(corporate);
        setPersonalCount(personal);
    }, [giftCards]);

    // console.log("Gift Cards:", giftCards);
    // console.log("Corporate Count:", corporateCount);
    // console.log("Personal Count:", personalCount);


    const getFilters = (filters: any) => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'status') {
                item.value = (item.value as string[]).map(value => {
                    if (value === pendingPlotSelection) return 'pending_plot_selection';
                    else if (value === 'Pending assignment') return 'pending_assignment';
                    else return 'completed'
                })
            } else if (item.columnField === 'validation_errors' || item.columnField === 'notes') {
                if ((item.value as string[]).includes('Yes')) {
                    item.operatorValue = 'isNotEmpty';
                } else {
                    item.operatorValue = 'isEmpty'
                }
            }
        })

        // if normal user the fetch user specific data
        if (authRef.current?.roles?.includes(UserRoles.User) && authRef.current?.userId) {
            filtersData.push({
                columnField: 'user_id',
                operatorValue: 'equals',
                value: authRef.current.userId
            })
        }

        return filtersData;
    }

    const getGiftCardData = async () => {
        // check if user logged in (skip if VITE_BYPASS_AUTH is enabled)
        if (!authRef.current?.signedin && import.meta.env.VITE_BYPASS_AUTH !== 'true') return;

        const filtersData = getFilters(filters);

        getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
    };

    const getAllGiftCardsData = async () => {
        let filtersData = getFilters(filters);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };


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

    const handleModalOpenEdit = (record: GiftCard, step: number = 0) => {
        setChangeMode('edit');
        setSelectedGiftCard(record);
        setRequestId(record.request_id);
        setStep(step);

        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
        setSavingChange(false);
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

    const saveNewGiftCardsRequest = async (user: User, sponsor: User | null, createdBy: User, group: Group | null, treeCount: number, category: string, grove: string | null, requestType: string, users: any[], giftedOn: string, paymentId?: number, logo?: string, messages?: any, file?: File) => {
        if (!requestId) {
            toast.error("Something went wrong. Please try again later!");
            return;
        }
        const apiClient = new ApiClient();
        let giftCardId: number;
        try {
            const response = await apiClient.createGiftCard(requestId, createdBy.id, treeCount, user.id, sponsor?.id || null, category, grove, requestType, giftedOn, group?.id, paymentId, logo, messages, file);
            giftCardId = response.id;

            getGiftCardData();
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

    const updateGiftCardRequest = async (user: User, sponsor: User | null, createdBy: User, group: Group | null, treeCount: number, category: string, grove: string | null, requestType: string, users: any[], giftedOn: string, paymentId?: number, logo?: string, messages?: any, file?: File) => {
        if (!selectedGiftCard) return;

        const apiClient = new ApiClient();
        let success = false;
        try {

            const data = { ...selectedGiftCard };
            data.created_by = createdBy.id;
            const response = await apiClient.updateGiftCard(data, treeCount, user.id, sponsor?.id || null, category, grove, requestType, giftedOn, group?.id, paymentId, logo, messages, file);

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
            } catch (error: any) {
                toast.error(error.message);
                return;
            }
        }
    }

    const handleSubmit = async (user: User, sponsor: User | null, createdBy: User, group: Group | null, treeCount: number, category: string, grove: string | null, requestType: string, users: any[], giftedOn: string, paymentId?: number, logo?: string, messages?: any, file?: File) => {

        const updatedUsers: any[] = []
        if (users && users.length > 0) {
            users.forEach(item => {
                const updated = { ...item }
                if (updated.recipient_email.includes(".donor")) {
                    updated.recipient_email = updated.recipient_email.replace(".donor", "." + (sponsor?.name || user.name).trim().toLowerCase().replaceAll(" ", ''))
                }

                if (updated.assignee_email.includes(".donor")) {
                    updated.assignee_email = updated.assignee_email.replace(".donor", "." + (sponsor?.name || user.name).trim().toLowerCase().replaceAll(" ", ''))
                }

                updatedUsers.push(updated)
            })
        }

        if (changeMode === 'add') {
            await saveNewGiftCardsRequest(user, sponsor, createdBy, group, treeCount, category, grove, requestType, updatedUsers, giftedOn, paymentId, logo, messages, file);
        } else if (changeMode === 'edit') {
            await updateGiftCardRequest(user, sponsor, createdBy, group, treeCount, category, grove, requestType, updatedUsers, giftedOn, paymentId, logo, messages, file);
        }

        handleModalClose();
    }

    const handlePlotSelectionCancel = () => {
        setPlotModal(false);
        setSelectedPlots([]);
        setSelectedGiftCard(null);
        setDiversify(false);
        setBookNonGiftable(false);
        setBookAllHabits(false);
        setSelectedTrees([]);
    }

    const handlePlotSelectionSubmit = async () => {
        if (!selectedGiftCard) return;
        setPlotModal(false);

        const apiClient = new ApiClient();
        if (selectedPlots.length !== 0) {
            try {
                await apiClient.createGiftCardPlots(selectedGiftCard.id, selectedPlots.map(plot => plot.id));

                await apiClient.bookGiftCards(selectedGiftCard.id, selectedTrees.length > 0 ? selectedTrees : undefined, bookNonGiftable, diversify, bookAllHabits);
                toast.success("Successfully reserved trees for tree card request!");
                getGiftCardData();
            } catch (error: any) {
                // Display the specific error message from the backend
                const errorMessage = error.message || "Failed to book trees for gift card request";
                toast.error(errorMessage);
                console.error("Gift card booking error:", error);
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

    const handleSendEmails = async ( emailSponsor: boolean, emailReceiver: boolean, emailAssignee: boolean, testMails: string[], sponsorCC: string[], receiverCC: string[], eventType: string, attachCard: boolean ) => {
        const giftCardRequestId = selectedGiftCard?.id
        if (testMails.length === 0) handleEmailModalClose();
        else setTestingMail(true);
    
        if (!giftCardRequestId) return;
        const apiClient = new ApiClient();
        try {
            const message = await apiClient.sendEmailToGiftRequestUsers( giftCardRequestId, emailSponsor, emailReceiver, emailAssignee, eventType, attachCard, sponsorCC, receiverCC, testMails );
            const lowerMsg = message.toLowerCase();
            if (
                lowerMsg.includes("already sent")
            ) {
                toast.error(message);
            } else {
                toast.success(message || "Emails sent successfully!");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to send emails.");
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
        setGiftCardNotification(true);
    }

    const handleUpdateGiftCardImagess = async (id: number) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftCardImages(id);
            setGiftCardNotification(true);
        } catch (error: any) {
            toast.error(error.message);
        }
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
            const response = await apiClient.updateGiftCard({ ...selectedGiftCard, notes: text }, selectedGiftCard.no_of_cards, selectedGiftCard.user_id, selectedGiftCard.sponsor_id, selectedGiftCard.category, selectedGiftCard.grove, selectedGiftCard.request_type ?? GiftRequestType_CARDS_REQUEST, selectedGiftCard.gifted_on);
            toast.success("Tree card request updated successfully");
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            setSelectedGiftCard(null);
        } catch (error: any) {
            if (error?.response?.data?.message) toast.error(error.response.data.message);
            else toast.error("Please try again later!")
        }
    }

    const handleGiftCardRequestDelete = () => {
        if (!selectedGiftCard) return;

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
            const response = await apiClient.updateGiftCard(selectedPaymentGR, selectedPaymentGR.no_of_cards, selectedPaymentGR.user_id, selectedPaymentGR.sponsor_id, selectedPaymentGR.category, selectedPaymentGR.grove, selectedPaymentGR.request_type ?? GiftRequestType_CARDS_REQUEST, selectedPaymentGR.gifted_on, selectedPaymentGR.group_id, paymentId);
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleSponsorshipDetailsSubmit = async (sponsorshipType: string, donationReceiptNumber: string | null, amountReceived: number, donationDate: string | null) => {
        if (!selectedPaymentGR) return;

        const data = { ...selectedPaymentGR };
        data.sponsorship_type = sponsorshipType as SponsorshipType;
        data.amount_received = amountReceived;
        data.donation_receipt_number = donationReceiptNumber;
        data.donation_date = donationDate;

        try {
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(data, selectedPaymentGR.no_of_cards, selectedPaymentGR.user_id, selectedPaymentGR.sponsor_id, selectedPaymentGR.category, selectedPaymentGR.grove, selectedPaymentGR.request_type ?? GiftRequestType_CARDS_REQUEST, selectedPaymentGR.gifted_on);
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            toast.success("Sponsorship details Updated!")
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
            const response = await apiClient.updateGiftCard(data, selectedGiftCard.no_of_cards, selectedGiftCard.user_id, selectedGiftCard.sponsor_id, selectedGiftCard.category, selectedGiftCard.grove, selectedGiftCard.request_type ?? GiftRequestType_CARDS_REQUEST, selectedGiftCard.gifted_on, selectedGiftCard.group_id);
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

    const handleDownloadFundRequest = async (id: number) => {
        try {
            const apiClient = new ApiClient();
            const url = await apiClient.generateFundRequest(id);

            const link = document.createElement('a');
            link.href = url;
            link.download = url.split('/')?.slice(-1)[0];
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error downloading the file:', error.message);
        }
    }



    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = () => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        }

        if (sorter.field) {
            setPage(0);
            updateOrder();
            setOrderBy(newOrder);
        }
    }

    const handleSelectionChanges = (giftRequestIds: number[]) => {
        setSelectedGiftRequestIds(giftRequestIds);
    }

    const handleAutoProcess = async () => {
        if (!selectedGiftCard) return;
        const giftRequestId = selectedGiftCard.id;

        setAutoProcessing(true);
        try {
            const apiClient = new ApiClient();
            const giftRequest = await apiClient.autoProcessGiftRequest(giftRequestId);
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_REQUESTED,
                payload: giftRequest,
            });

            toast.success("Auto processed request!")
            setSelectedGiftCard(null);
            setPrsConfirm(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAutoProcessing(false);
        }
    }



    const handlePickGiftRequest = async (giftCardId: number) => {
        try {
            const apiClient = new ApiClient();
            const currentUserId = localStorage.getItem('userId');

            if (!currentUserId) {
                toast.error('User not authenticated');
                return;
            }

            const response = await apiClient.pickGiftCardRequest(giftCardId, parseInt(currentUserId));

            toast.success('Request picked successfully');
            getGiftCardData(); // Refresh the data

        } catch (error: any) {
            console.error('Error picking Request:', error);
            toast.error(error.message || 'Failed to pick Request');
        }
    };



    // Create handlers object for actions menu
    const actionHandlers = {
        handleModalOpenEdit,
        setSelectedGiftCard,
        setInfoModal,
        handleTagModalOpen,
        handleCloneGiftCardRequest,
        setDeleteModal,
        handleAlbumModalOpen,
        setUserDetailsEditModal,
        handleGenerateGiftCards,
        setEmailConfirmationModal,
        handleDownloadCards,
        handleUpdateGiftCardImagess,
        setBookNonGiftable,
        setPlotModal,
        setAutoAssignModal,
        setPrsConfirm,
        handlePaymentModalOpen,
        handleDownloadFundRequest,
        handlePickGiftRequest
    };

    const getActionsMenu = (record: GiftCard) => createActionsMenu({ 
        record, 
        auth, 
        handlers: actionHandlers 
    });

    const columns = createTableColumns({
        filters,
        handleSetFilters,
        orderBy,
        handleSortingChange,
        tags,
        getActionsMenu,
        setSelectedGiftCard,
        setNotesModal
    });


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

            {(auth.signedin || import.meta.env.VITE_BYPASS_AUTH === 'true') && <Box sx={{ height: 840, width: "100%" }}>
                <GeneralTable
                    loading={giftCardsData.loading}
                    rows={tableRows}
                    columns={columns}
                    totalRecords={giftCardsData.totalGiftCards}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={getAllGiftCardsData}
                    onSelectionChanges={handleSelectionChanges}
                    summary={(totalColumns: number) => {
                        if (totalColumns < 5) return undefined;
                        return <TableSummary 
                            giftRequests={tableRows} 
                            selectedGiftRequestIds={selectedGiftRequestIds} 
                            totalColumns={totalColumns} 
                        />
                    }}
                    footer
                    tableName="Tree Cards"
                />
            </Box>}

            {!auth.signedin && import.meta.env.VITE_BYPASS_AUTH !== 'true' &&
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

            <GiftCardsForm
                loading={savingChange}
                setLoading={(value) => { setSavingChange(value) }}
                loggedinUserId={authRef.current?.userId}
                step={step}
                giftCardRequest={selectedGiftCard ?? undefined}
                requestId={requestId}
                open={modalOpen}
                handleClose={handleModalClose}
                onSubmit={handleSubmit}
            />

            <Dialog open={plotModal} onClose={() => setPlotModal(false)} fullWidth maxWidth="xl">
                <DialogTitle>Reserve Trees</DialogTitle>
                <DialogContent dividers>
                    {selectedGiftCard && <PlotSelection
                        giftCardRequestId={selectedGiftCard.id}
                        onTreeSelection={(trees: any[]) => { setSelectedTrees(trees); }}
                        totalTrees={selectedGiftCard.no_of_cards}
                        requiredTrees={selectedGiftCard.no_of_cards - Number(selectedGiftCard.booked)}
                        plots={selectedPlots}
                        onPlotsChange={plots => setSelectedPlots(plots)}
                        bookNonGiftable={bookNonGiftable}
                        onBookNonGiftableChange={(value) => { setBookNonGiftable(value) }}
                        diversify={diversify}
                        onDiversifyChange={(value) => { setDiversify(value) }}
                        bookAllHabits={bookAllHabits}
                        onBookAllHabitsChange={(value) => { setBookAllHabits(value) }}
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
                    <Typography variant='body1' fontWeight='bold'>Are you sure you want to delete this tree card request?</Typography>
                    <Typography variant='body1'>This action will unassing and unreserve all the trees from this request. It will also delete any payment/donation details as well.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModal(false)} color="success" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleGiftCardRequestDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={paymentModal} fullWidth maxWidth='xl'>
                <DialogTitle>Sponsorship/Payment Details</DialogTitle>
                <DialogContent dividers>
                    <PaymentComponent
                        initialAmount={(selectedPaymentGR?.no_of_cards || 0) * (selectedPaymentGR?.category === 'Foundation' ? 3000 : selectedPaymentGR?.request_type === 'Normal Assignment' ? 1500 : 2000)}
                        paymentId={selectedPaymentGR?.payment_id}
                        onChange={handlePaymentFormSubmit}
                        sponsorshipType={selectedPaymentGR?.sponsorship_type}
                        donationReceipt={selectedPaymentGR?.donation_receipt_number}
                        amountReceived={selectedPaymentGR?.amount_received}
                        donationDate={selectedPaymentGR?.donation_date}
                        onSponsorshipDetailsSave={handleSponsorshipDetailsSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setPaymentModal(false)}
                        color="error"
                        variant="outlined"
                        sx={{ mr: 2 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedGiftCard && <AssignTrees
                open={autoAssignModal}
                onClose={() => { setAutoAssignModal(false); setSelectedGiftCard(null); }}
                giftCardRequestId={selectedGiftCard.id}
                onSubmit={() => { getGiftCardData(); setSelectedGiftCard(null); }}
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

            {selectedGiftCard && <AutoProcessConfirmationModal
                loading={autoProcessing}
                open={autoPrsConfirm}
                onClose={() => {
                    setPrsConfirm(false);
                    setSelectedGiftCard(null);
                }}
                treesToBook={selectedGiftCard?.no_of_cards - Number(selectedGiftCard?.booked)}
                onConfirm={handleAutoProcess}
                giftId={selectedGiftCard?.id}
            />}

            <GiftCardCreationModal open={giftCardNotification} onClose={() => { setGiftCardNotification(false) }} />

            <Divider sx={{ my: 4, backgroundColor: 'transparent' }} />
                    <Box sx={{ minHeight: 540 }}>
                        <AutoPrsPlots type="gift-trees" />
                    </Box>
            <div style={{ marginTop: '20px' }}>
                <h2>Sponsorship Distribution</h2>
                <GiftTreesChart corporateCount={corporateCount} personalCount={personalCount} />
            </div>
        </div>
    );
};

export default GiftTrees;