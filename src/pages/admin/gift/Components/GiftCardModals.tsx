import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { GiftCard, GiftRequestUser } from '../../../../types/gift_card';
import { Plot } from '../../../../types/plot';
import PlotSelection from '../Components/PlotSelection';
import EmailConfirmationModal from './EmailConfirmationModal';
import EditUserDetailsModal from './EditUserDetailsModal';
import AlbumImageInput from '../../../../components/AlbumImageInput';
import GiftCardRequestInfo from './GiftCardRequestInfo';
import GiftRequestNotes from './Notes';
import TagComponent from './TagComponent';
import PaymentComponent from '../../../../components/payment/PaymentComponent';
import AssignTrees from './AssignTrees';
import AutoProcessConfirmationModal from '../Components/AutoProcessConfirmationModal';
import GiftCardCreationModal from '../Components/GiftCardCreationModal';

interface GiftCardModalsProps {
    // Plot Modal
    plotModal: boolean;
    setPlotModal: (open: boolean) => void;
    selectedGiftCard: GiftCard | null;
    selectedPlots: Plot[];
    setSelectedPlots: (plots: Plot[]) => void;
    selectedTrees: any[];
    setSelectedTrees: (trees: any[]) => void;
    bookNonGiftable: boolean;
    setBookNonGiftable: (value: boolean) => void;
    diversify: boolean;
    setDiversify: (value: boolean) => void;
    bookAllHabits: boolean;
    setBookAllHabits: (value: boolean) => void;
    handlePlotSelectionCancel: () => void;
    handlePlotSelectionSubmit: () => void;

    // Delete Modal
    deleteModal: boolean;
    setDeleteModal: (open: boolean) => void;
    handleGiftCardRequestDelete: () => void;

    // Payment Modal
    paymentModal: boolean;
    setPaymentModal: (open: boolean) => void;
    selectedPaymentGR: GiftCard | null;
    handlePaymentFormSubmit: (paymentId: number) => void;
    handleSponsorshipDetailsSubmit: (
        sponsorshipType: string,
        donationReceiptNumber: string | null,
        amountReceived: number,
        donationDate: string | null
    ) => void;

    // Auto Assign Modal
    autoAssignModal: boolean;
    setAutoAssignModal: (open: boolean) => void;
    setSelectedGiftCard: (card: GiftCard | null) => void;
    getGiftCardData: () => void;

    // Email Modal
    emailConfirmationModal: boolean;
    testingMail: boolean;
    handleEmailModalClose: () => void;
    handleSendEmails: (
        emailSponsor: boolean,
        emailReceiver: boolean,
        emailAssignee: boolean,
        testMails: string[],
        sponsorCC: string[],
        receiverCC: string[],
        eventType: string,
        attachCard: boolean
    ) => void;

    // User Details Modal
    userDetailsEditModal: boolean;
    handleUserDetailsEditClose: () => void;
    handleUserDetailsEditSave: (users: GiftRequestUser[]) => void;

    // Album Modal
    albumImagesModal: boolean;
    handleAlbumModalClose: () => void;
    handleAlbumSave: (files: (File | string)[]) => void;
    handleDeleteAlbum: () => void;
    album: any;

    // Info Modal
    infoModal: boolean;
    setInfoModal: (open: boolean) => void;

    // Notes Modal
    notesModal: boolean;
    setNotesModal: (open: boolean) => void;
    handleNotesSave: (text: string) => void;

    // Tag Modal
    tagModal: boolean;
    tags: string[];
    handleTagModalClose: () => void;
    handleTagTreeCardRequestSubmit: (tags: string[]) => void;

    // Auto Process Modal
    autoPrsConfirm: boolean;
    autoProcessing: boolean;
    setPrsConfirm: (confirm: boolean) => void;
    handleAutoProcess: () => void;

    // Gift Card Notification Modal
    giftCardNotification: boolean;
    setGiftCardNotification: (notification: boolean) => void;
}

export const GiftCardModals: React.FC<GiftCardModalsProps> = ({
    plotModal,
    setPlotModal,
    selectedGiftCard,
    selectedPlots,
    setSelectedPlots,
    selectedTrees,
    setSelectedTrees,
    bookNonGiftable,
    setBookNonGiftable,
    diversify,
    setDiversify,
    bookAllHabits,
    setBookAllHabits,
    handlePlotSelectionCancel,
    handlePlotSelectionSubmit,
    deleteModal,
    setDeleteModal,
    handleGiftCardRequestDelete,
    paymentModal,
    setPaymentModal,
    selectedPaymentGR,
    handlePaymentFormSubmit,
    handleSponsorshipDetailsSubmit,
    autoAssignModal,
    setAutoAssignModal,
    setSelectedGiftCard,
    getGiftCardData,
    emailConfirmationModal,
    testingMail,
    handleEmailModalClose,
    handleSendEmails,
    userDetailsEditModal,
    handleUserDetailsEditClose,
    handleUserDetailsEditSave,
    albumImagesModal,
    handleAlbumModalClose,
    handleAlbumSave,
    handleDeleteAlbum,
    album,
    infoModal,
    setInfoModal,
    notesModal,
    setNotesModal,
    handleNotesSave,
    tagModal,
    tags,
    handleTagModalClose,
    handleTagTreeCardRequestSubmit,
    autoPrsConfirm,
    autoProcessing,
    setPrsConfirm,
    handleAutoProcess,
    giftCardNotification,
    setGiftCardNotification,
}) => {
    return (
        <>
            {/* Plot Selection Modal */}
            <Dialog open={plotModal} onClose={() => setPlotModal(false)} fullWidth maxWidth="xl">
                <DialogTitle>Reserve Trees</DialogTitle>
                <DialogContent dividers>
                    {selectedGiftCard && (
                        <PlotSelection
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
                        />
                    )}
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

            {/* Delete Modal */}
            <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} fullWidth maxWidth='md'>
                <DialogTitle>Delete tree cards request</DialogTitle>
                <DialogContent dividers>
                    <Typography variant='body1' fontWeight='bold'>
                        Are you sure you want to delete this tree card request?
                    </Typography>
                    <Typography variant='body1'>
                        This action will unassing and unreserve all the trees from this request. 
                        It will also delete any payment/donation details as well.
                    </Typography>
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

            {/* Payment Modal */}
            <Dialog open={paymentModal} fullWidth maxWidth='xl'>
                <DialogTitle>Sponsorship/Payment Details</DialogTitle>
                <DialogContent dividers>
                    <PaymentComponent
                        initialAmount={(selectedPaymentGR?.no_of_cards || 0) * (
                            selectedPaymentGR?.category === 'Foundation' ? 3000 : 
                            selectedPaymentGR?.request_type === 'Normal Assignment' ? 1500 : 2000
                        )}
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

            {/* Auto Assign Modal */}
            {selectedGiftCard && (
                <AssignTrees
                    open={autoAssignModal}
                    onClose={() => { setAutoAssignModal(false); setSelectedGiftCard(null); }}
                    giftCardRequestId={selectedGiftCard.id}
                    onSubmit={() => { getGiftCardData(); setSelectedGiftCard(null); }}
                />
            )}

            {/* Email Confirmation Modal */}
            <EmailConfirmationModal
                loading={testingMail}
                sponsorMail={selectedGiftCard?.user_email}
                open={emailConfirmationModal}
                onClose={handleEmailModalClose}
                onSubmit={handleSendEmails}
            />

            {/* User Details Edit Modal */}
            <EditUserDetailsModal
                giftRequestId={selectedGiftCard?.id}
                requestId={selectedGiftCard?.request_id}
                open={userDetailsEditModal}
                onClose={handleUserDetailsEditClose}
                onSave={handleUserDetailsEditSave}
            />

            {/* Album Images Modal */}
            <AlbumImageInput
                open={albumImagesModal}
                onClose={handleAlbumModalClose}
                onSave={handleAlbumSave}
                onDeleteAlbum={handleDeleteAlbum}
                imageUrls={album?.images}
            />

            {/* Gift Card Request Info Modal */}
            <GiftCardRequestInfo
                open={infoModal}
                onClose={() => { setInfoModal(false) }}
                data={selectedGiftCard}
            />

            {/* Notes Modal */}
            <GiftRequestNotes
                open={notesModal}
                handleClose={() => { setNotesModal(false) }}
                onSave={handleNotesSave}
                initialText={selectedGiftCard?.notes ?? ''}
            />

            {/* Tag Modal */}
            <TagComponent
                defaultTags={tags}
                tags={selectedGiftCard?.tags || []}
                open={tagModal}
                onClose={handleTagModalClose}
                onSubmit={handleTagTreeCardRequestSubmit}
            />

            {/* Auto Process Confirmation Modal */}
            {selectedGiftCard && (
                <AutoProcessConfirmationModal
                    loading={autoProcessing}
                    open={autoPrsConfirm}
                    onClose={() => {
                        setPrsConfirm(false);
                        setSelectedGiftCard(null);
                    }}
                    treesToBook={selectedGiftCard?.no_of_cards - Number(selectedGiftCard?.booked)}
                    onConfirm={handleAutoProcess}
                    giftId={selectedGiftCard?.id}
                />
            )}

            {/* Gift Card Creation Notification Modal */}
            <GiftCardCreationModal 
                open={giftCardNotification} 
                onClose={() => { setGiftCardNotification(false) }} 
            />
        </>
    );
};