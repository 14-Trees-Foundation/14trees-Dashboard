import { toast } from 'react-toastify';
import ApiClient from '../../../../api/apiClient/apiClient';
import { GiftCard, GiftRequestType_CARDS_REQUEST, GiftRequestUser, SponsorshipType } from '../../../../types/gift_card';
import { User } from '../../../../types/user';
import { Group } from '../../../../types/Group';
import { getUniqueRequestId } from '../../../../helpers/utils';
import giftCardActionTypes from '../../../../redux/actionTypes/giftCardActionTypes';
import { Plot } from '../../../../types/plot';

interface UseGiftCardHandlersProps {
    selectedGiftCard: GiftCard | null;
    setSelectedGiftCard: (card: GiftCard | null) => void;
    selectedPlots: Plot[];
    setSelectedPlots: (plots: Plot[]) => void;
    selectedTrees: any[];
    setSelectedTrees: (trees: any[]) => void;
    bookNonGiftable: boolean;
    diversify: boolean;
    bookAllHabits: boolean;
    album: any;
    setAlbum: (album: any) => void;
    requestId: string | null;
    setRequestId: (id: string | null) => void;
    changeMode: 'add' | 'edit';
    setChangeMode: (mode: 'add' | 'edit') => void;
    setStep: (step: number) => void;
    setModalOpen: (open: boolean) => void;
    setPlotModal: (open: boolean) => void;
    setAlbumImagesModal: (open: boolean) => void;
    setDeleteModal: (open: boolean) => void;
    setNotesModal: (open: boolean) => void;
    setEmailConfirmationModal: (open: boolean) => void;
    setUserDetailsEditModal: (open: boolean) => void;
    setTagModal: (open: boolean) => void;
    setPaymentModal: (open: boolean) => void;
    setPrsConfirm: (confirm: boolean) => void;
    setAutoAssignModal: (open: boolean) => void;
    setBookNonGiftable: (value: boolean) => void;
    setDiversify: (value: boolean) => void;
    setBookAllHabits: (value: boolean) => void;
    setSavingChange: (saving: boolean) => void;
    setTestingMail: (testing: boolean) => void;
    setAutoProcessing: (processing: boolean) => void;
    setGiftCardNotification: (notification: boolean) => void;
    selectedPaymentGR: GiftCard | null;
    setSelectedPaymentGR: (card: GiftCard | null) => void;
    getGiftCardData: () => void;
    deleteGiftCardRequest: (card: GiftCard) => void;
    cloneGiftCardRequest: (id: number, requestId: string) => void;
    dispatch: any;
}

export const useGiftCardHandlers = (props: UseGiftCardHandlersProps) => {
    const {
        selectedGiftCard,
        setSelectedGiftCard,
        selectedPlots,
        setSelectedPlots,
        selectedTrees,
        setSelectedTrees,
        bookNonGiftable,
        diversify,
        bookAllHabits,
        album,
        setAlbum,
        requestId,
        setRequestId,
        changeMode,
        setChangeMode,
        setStep,
        setModalOpen,
        setPlotModal,
        setAlbumImagesModal,
        setDeleteModal,
        setNotesModal,
        setEmailConfirmationModal,
        setUserDetailsEditModal,
        setTagModal,
        setPaymentModal,
        setPrsConfirm,
        setAutoAssignModal,
        setBookNonGiftable,
        setDiversify,
        setBookAllHabits,
        setSavingChange,
        setTestingMail,
        setAutoProcessing,
        setGiftCardNotification,
        selectedPaymentGR,
        setSelectedPaymentGR,
        getGiftCardData,
        deleteGiftCardRequest,
        cloneGiftCardRequest,
        dispatch
    } = props;

    // Modal handlers
    const handleModalOpenAdd = () => {
        setChangeMode('add');
        setSelectedGiftCard(null);
        const uniqueRequestId = getUniqueRequestId();
        setRequestId(uniqueRequestId);
        setModalOpen(true);
    };

    const handleModalOpenEdit = (record: GiftCard, step: number = 0) => {
        setChangeMode('edit');
        setSelectedGiftCard(record);
        setRequestId(record.request_id);
        setStep(step);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSavingChange(false);
        setSelectedGiftCard(null);
        setRequestId(null);
    };

    // Album handlers
    const handleAlbumModalOpen = async (record: GiftCard) => {
        setSelectedGiftCard(record);
        if (record.album_id) {
            const apiClient = new ApiClient();
            const album = await apiClient.getAlbum(record.album_id);
            setAlbum(album);
        }
        setAlbumImagesModal(true);
    };

    const handleAlbumModalClose = () => {
        setSelectedGiftCard(null);
        setAlbumImagesModal(false);
        setAlbum(null);
    };

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
                });

                const album = await apiClient.createAlbum(
                    selectedGiftCard.event_name || selectedGiftCard.request_id,
                    selectedGiftCard.user_name || '',
                    selectedGiftCard.user_email || '',
                    filesList
                );
                await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id, album.id);
            }

            toast.success("Tree card request album images updated!");
        } catch (error: any) {
            toast.error(error.message);
        }

        setAlbum(null);
        setSelectedGiftCard(null);
    };

    const handleDeleteAlbum = async () => {
        if (!selectedGiftCard) return;
        setAlbumImagesModal(false);

        const apiClient = new ApiClient();
        try {
            if (album) await apiClient.deleteAlbum(album.id);
            await apiClient.updateAlbumImagesForGiftRequest(selectedGiftCard.id);

            toast.success("Removed tree card request album images!");
        } catch (error: any) {
            toast.error(error.message);
        }

        setAlbum(null);
        setSelectedGiftCard(null);
    };

    // Plot selection handlers
    const handlePlotSelectionCancel = () => {
        setPlotModal(false);
        setSelectedPlots([]);
        setSelectedGiftCard(null);
        setDiversify(false);
        setBookNonGiftable(false);
        setBookAllHabits(false);
        setSelectedTrees([]);
    };

    const handlePlotSelectionSubmit = async () => {
        if (!selectedGiftCard) return;
        setPlotModal(false);

        const apiClient = new ApiClient();
        if (selectedPlots.length !== 0) {
            try {
                await apiClient.createGiftCardPlots(selectedGiftCard.id, selectedPlots.map(plot => plot.id));
                await apiClient.bookGiftCards(
                    selectedGiftCard.id,
                    selectedTrees.length > 0 ? selectedTrees : undefined,
                    bookNonGiftable,
                    diversify,
                    bookAllHabits
                );
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
    };

    // Delete handler
    const handleGiftCardRequestDelete = () => {
        if (!selectedGiftCard) return;

        deleteGiftCardRequest(selectedGiftCard);
        setDeleteModal(false);
        setSelectedGiftCard(null);
    };

    // Clone handler
    const handleCloneGiftCardRequest = (request: GiftCard) => {
        cloneGiftCardRequest(request.id, getUniqueRequestId());
    };

    // Payment handlers
    const handlePaymentModalOpen = (request: GiftCard) => {
        setSelectedPaymentGR(request);
        setPaymentModal(true);
    };

    const handlePaymentFormSubmit = async (paymentId: number) => {
        if (!selectedPaymentGR || selectedPaymentGR.payment_id) return;

        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftCard(
                selectedPaymentGR,
                selectedPaymentGR.no_of_cards,
                selectedPaymentGR.user_id,
                selectedPaymentGR.sponsor_id,
                selectedPaymentGR.category,
                selectedPaymentGR.grove,
                selectedPaymentGR.request_type ?? GiftRequestType_CARDS_REQUEST,
                selectedPaymentGR.gifted_on,
                selectedPaymentGR.group_id,
                paymentId
            );
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Email handlers
    const handleSendEmails = async (
        emailSponsor: boolean,
        emailReceiver: boolean,
        emailAssignee: boolean,
        testMails: string[],
        sponsorCC: string[],
        receiverCC: string[],
        eventType: string,
        attachCard: boolean
    ) => {
        const giftCardRequestId = selectedGiftCard?.id;
        if (testMails.length === 0) handleEmailModalClose();
        else setTestingMail(true);

        if (!giftCardRequestId) return;
        const apiClient = new ApiClient();
        try {
            const message = await apiClient.sendEmailToGiftRequestUsers(
                giftCardRequestId,
                emailSponsor,
                emailReceiver,
                emailAssignee,
                eventType,
                attachCard,
                sponsorCC,
                receiverCC,
                testMails
            );
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes("already sent")) {
                toast.error(message);
            } else {
                toast.success(message || "Emails sent successfully!");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to send emails.");
        }

        setTestingMail(false);
    };

    const handleEmailModalClose = () => {
        setEmailConfirmationModal(false);
        setSelectedGiftCard(null);
    };

    // User details handlers
    const handleUserDetailsEditClose = () => {
        setUserDetailsEditModal(false);
        setSelectedGiftCard(null);
    };

    const handleUserDetailsEditSave = async (users: GiftRequestUser[]) => {
        handleUserDetailsEditClose();

        if (users.length === 0) return;

        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftRequestUserDetails(users);
            toast.success("Tree card request users updated!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Notes handler
    const handleNotesSave = async (text: string) => {
        setNotesModal(false);
        if (!selectedGiftCard) return;

        try {
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(
                { ...selectedGiftCard, notes: text },
                selectedGiftCard.no_of_cards,
                selectedGiftCard.user_id,
                selectedGiftCard.sponsor_id,
                selectedGiftCard.category,
                selectedGiftCard.grove,
                selectedGiftCard.request_type ?? GiftRequestType_CARDS_REQUEST,
                selectedGiftCard.gifted_on
            );
            toast.success("Tree card request updated successfully");
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            setSelectedGiftCard(null);
        } catch (error: any) {
            if (error?.response?.data?.message) toast.error(error.response.data.message);
            else toast.error("Please try again later!");
        }
    };

    // Tag handlers
    const handleTagModalOpen = (request: GiftCard) => {
        setSelectedGiftCard(request);
        setTagModal(true);
    };

    const handleTagModalClose = () => {
        setSelectedGiftCard(null);
        setTagModal(false);
    };

    const handleTagTreeCardRequestSubmit = async (tags: string[]) => {
        if (!selectedGiftCard) return;

        setTagModal(false);
        try {
            const data = { ...selectedGiftCard };
            data.tags = tags;
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(
                data,
                selectedGiftCard.no_of_cards,
                selectedGiftCard.user_id,
                selectedGiftCard.sponsor_id,
                selectedGiftCard.category,
                selectedGiftCard.grove,
                selectedGiftCard.request_type ?? GiftRequestType_CARDS_REQUEST,
                selectedGiftCard.gifted_on,
                selectedGiftCard.group_id
            );
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            toast.success("Updated the tree cards request tags!");
        } catch (error: any) {
            toast.error(error.message);
        }

        handleTagModalClose();
    };

    // Auto process handler
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

            toast.success("Auto processed request!");
            setSelectedGiftCard(null);
            setPrsConfirm(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAutoProcessing(false);
        }
    };

    // Pick request handler
    const handlePickGiftRequest = async (giftCardId: number) => {
        try {
            const apiClient = new ApiClient();
            const currentUserId = localStorage.getItem('userId');

            if (!currentUserId) {
                toast.error('User not authenticated');
                return;
            }

            await apiClient.pickGiftCardRequest(giftCardId, parseInt(currentUserId));

            toast.success('Request picked successfully');
            getGiftCardData(); // Refresh the data
        } catch (error: any) {
            console.error('Error picking Request:', error);
            toast.error(error.message || 'Failed to pick Request');
        }
    };

    // Download handlers
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
    };

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
    };

    // Generate gift cards handler
    const handleGenerateGiftCards = async (id: number) => {
        const apiClient = new ApiClient();
        apiClient.generateGiftCardTemplates(id);
        setGiftCardNotification(true);
    };

    const handleUpdateGiftCardImagess = async (id: number) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.updateGiftCardImages(id);
            setGiftCardNotification(true);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Sponsorship details handler
    const handleSponsorshipDetailsSubmit = async (
        sponsorshipType: string,
        donationReceiptNumber: string | null,
        amountReceived: number,
        donationDate: string | null
    ) => {
        if (!selectedPaymentGR) return;

        const data = { ...selectedPaymentGR };
        data.sponsorship_type = sponsorshipType as SponsorshipType;
        data.amount_received = amountReceived;
        data.donation_receipt_number = donationReceiptNumber;
        data.donation_date = donationDate;

        try {
            const apiClient = new ApiClient();
            const response = await apiClient.updateGiftCard(
                data,
                selectedPaymentGR.no_of_cards,
                selectedPaymentGR.user_id,
                selectedPaymentGR.sponsor_id,
                selectedPaymentGR.category,
                selectedPaymentGR.grove,
                selectedPaymentGR.request_type ?? GiftRequestType_CARDS_REQUEST,
                selectedPaymentGR.gifted_on
            );
            dispatch({
                type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                payload: response,
            });
            toast.success("Sponsorship details Updated!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return {
        handleModalOpenAdd,
        handleModalOpenEdit,
        handleModalClose,
        handleAlbumModalOpen,
        handleAlbumModalClose,
        handleAlbumSave,
        handleDeleteAlbum,
        handlePlotSelectionCancel,
        handlePlotSelectionSubmit,
        handleGiftCardRequestDelete,
        handleCloneGiftCardRequest,
        handlePaymentModalOpen,
        handlePaymentFormSubmit,
        handleSendEmails,
        handleEmailModalClose,
        handleUserDetailsEditClose,
        handleUserDetailsEditSave,
        handleNotesSave,
        handleTagModalOpen,
        handleTagModalClose,
        handleTagTreeCardRequestSubmit,
        handleAutoProcess,
        handlePickGiftRequest,
        handleDownloadCards,
        handleDownloadFundRequest,
        handleGenerateGiftCards,
        handleUpdateGiftCardImagess,
        handleSponsorshipDetailsSubmit,
    };
};