import { MenuProps } from "antd";
import { 
    AssignmentInd, 
    AssuredWorkload, 
    AutoMode, 
    CardGiftcard, 
    Collections, 
    Delete, 
    Description, 
    Download, 
    Edit, 
    Email, 
    FileCopy, 
    Landscape, 
    LocalOffer, 
    ManageAccounts, 
    Photo, 
    Slideshow, 
    Wysiwyg 
} from "@mui/icons-material";
import { GiftCard, GiftRequestType_NORAML_ASSIGNMENT } from "../../../../types/gift_card";
import { UserRoles } from "../../../../types/common";

interface ActionsMenuProps {
    record: GiftCard;
    auth: any;
    handlers: {
        handleModalOpenEdit: (record: GiftCard, step?: number) => void;
        setSelectedGiftCard: (card: GiftCard | null) => void;
        setInfoModal: (open: boolean) => void;
        handleTagModalOpen: (record: GiftCard) => void;
        handleCloneGiftCardRequest: (record: GiftCard) => void;
        setDeleteModal: (open: boolean) => void;
        handleAlbumModalOpen: (record: GiftCard) => void;
        setUserDetailsEditModal: (open: boolean) => void;
        handleGenerateGiftCards: (id: number) => void;
        setEmailConfirmationModal: (open: boolean) => void;
        handleDownloadCards: (id: number, name: string, type: 'pdf' | 'ppt' | 'zip') => void;
        handleUpdateGiftCardImagess: (id: number) => void;
        setBookNonGiftable: (value: boolean) => void;
        setPlotModal: (open: boolean) => void;
        setAutoAssignModal: (open: boolean) => void;
        setPrsConfirm: (open: boolean) => void;
        handlePaymentModalOpen: (record: GiftCard) => void;
        handleDownloadFundRequest: (id: number) => void;
        handlePickGiftRequest: (id: number) => void;
    };
}

export const createActionsMenu = ({ record, auth, handlers }: ActionsMenuProps): MenuProps => {
    const {
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
    } = handlers;

    const items: MenuProps['items'] = [
        // First group
        {
            key: "50",
            label: "Edit Dashboard Details",
            icon: <Wysiwyg />,
            onClick: () => handleModalOpenEdit(record, 0)
        },
        ...(record.request_type !== 'Visit' && record.request_type !== 'Normal Assignment' ? [{
            key: "51",
            label: "Edit Card Messaging",
            icon: <CardGiftcard />,
            onClick: () => handleModalOpenEdit(record, 4)
        }] : []),
        {
            key: "52",
            label: "View/Make Payments",
            icon: <AssuredWorkload />,
            onClick: () => handleModalOpenEdit(record, 1)
        },
        {
            key: "53",
            label: "Add/Edit Recipient Details",
            icon: <ManageAccounts />,
            onClick: () => handleModalOpenEdit(record, 2)
        },
        { type: 'divider' },
        
        // Second group
        {
            key: "00",
            label: "View Summary",
            icon: <Wysiwyg />,
            onClick: () => { setSelectedGiftCard(record); setInfoModal(true); }
        },
        {
            key: "01",
            label: "Edit Request",
            icon: <Edit />,
            onClick: () => handleModalOpenEdit(record)
        },
        {
            key: "02",
            label: "Tag Request",
            icon: <LocalOffer />,
            onClick: () => handleTagModalOpen(record)
        },
        {
            key: "03",
            label: "Clone Request",
            icon: <FileCopy />,
            onClick: () => handleCloneGiftCardRequest(record)
        },
        ...(!auth.roles.includes(UserRoles.User) ? [{
            key: "04",
            label: "Delete Request",
            icon: <Delete />,
            danger: true,
            onClick: () => { setDeleteModal(true); setSelectedGiftCard(record); }
        }] : []),
        { type: 'divider' },
        
        // Third group
        {
            key: "10",
            label: "Update memories",
            icon: <Collections />,
            onClick: () => handleAlbumModalOpen(record)
        },
        ...((record.validation_errors === null || !record.validation_errors.includes('MISSING_USER_DETAILS')) ? [{
            key: "11",
            label: "Edit Recipient Details",
            icon: <ManageAccounts />,
            onClick: () => { setSelectedGiftCard(record); setUserDetailsEditModal(true); }
        }] : []),
        
        // Conditional divider and fourth group
        ...((record.status === 'completed' || record.status === 'pending_gift_cards' || record.booked > 0) ? [
            { type: 'divider' },
            ...(record.booked > 0 ? [{
                key: "20",
                label: "Generate Gift Cards",
                icon: <CardGiftcard />,
                onClick: () => handleGenerateGiftCards(record.id)
            }] : []),
            ...(Number(record.assigned) > 0 ? [{
                key: "21",
                label: "Send Emails",
                icon: <Email />,
                onClick: () => { setSelectedGiftCard(record); setEmailConfirmationModal(true); }
            }] : [])
        ] : []),
        
        // Conditional divider and fifth group
        ...((record.presentation_id || record.presentation_ids.length > 0) ? [
            { type: 'divider' },
            ...(record.presentation_id ? [{
                key: "30",
                label: "Download Tree Cards",
                icon: <Download />,
                onClick: () => handleDownloadCards(record.id, record.user_name + '_' + record.no_of_cards, 'zip')
            }] : []),
            {
                key: "31",
                label: "Tree Cards Slide",
                icon: <Slideshow />,
                onClick: () => window.open('https://docs.google.com/presentation/d/' + (record.presentation_id ? record.presentation_id : record.presentation_ids[0]))
            },
            {
                key: "32",
                label: "Update Cards Images",
                icon: <Photo />,
                onClick: () => handleUpdateGiftCardImagess(record.id)
            }
        ] : []),
        
        // Conditional divider and sixth group
        ...(!auth.roles.includes(UserRoles.User) ? [
            { type: 'divider' },
            {
                key: "40",
                label: "Reserve Trees",
                icon: <Landscape />,
                onClick: () => { setBookNonGiftable(record.request_type === GiftRequestType_NORAML_ASSIGNMENT || record.request_type === 'Visit' ? true : false); setSelectedGiftCard(record); setPlotModal(true); }
            },
            {
                key: "41",
                label: "Assign Trees",
                icon: <AssignmentInd />,
                onClick: () => { setSelectedGiftCard(record); setAutoAssignModal(true); }
            },
            ...(record.no_of_cards > (record.assigned || 0) ? [{
                key: "25",
                label: "Auto Process",
                icon: <AutoMode />,
                onClick: () => { setSelectedGiftCard(record); setPrsConfirm(true); }
            }] : []),
            {
                key: "42",
                label: "Payment Details",
                icon: <AssuredWorkload />,
                onClick: () => handlePaymentModalOpen(record)
            },
            ...(record.group_id ? [{
                key: "43",
                label: "Fund Request",
                icon: <Description />,
                onClick: () => handleDownloadFundRequest(record.id)
            }] : []),
            ...(!record.processed_by ? [{
                key: "pick",
                label: "Pick This Up",
                icon: <AssignmentInd />,
                onClick: () => handlePickGiftRequest(record.id)
            }] : [])
        ] : [])
    ];

    return { items };
};