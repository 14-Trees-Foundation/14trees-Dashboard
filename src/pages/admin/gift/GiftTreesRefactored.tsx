import React from 'react';
import { Box, Button, Divider, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../auth/auth";
import { LoginComponent } from "../Login/LoginComponent";
import GiftCardsForm from "./Components/workflow/GiftCardForm";
import GeneralTable from "../../../components/GenTable";
import AutoPrsPlots from "../../../components/AutoPrsPlots/AutoPrsPlots";
import GiftTreesChart from "./Components/GiftTreesChart";
import TableSummary from "./Components/TableSummary";
import { GiftCardModals } from "./Components/GiftCardModals";
import { useGiftCardState } from "./hooks/useGiftCardState";
import { useGiftCardData } from "./hooks/useGiftCardData";
import { useGiftCardHandlers } from "./hooks/useGiftCardHandlers";
import { useTableLogic } from "./hooks/useTableLogic";
import { GiftCardService } from "./services/giftCardService";
import { User } from "../../../types/user";
import { Group } from "../../../types/Group";

const GiftTrees: React.FC = () => {
    const auth = useAuth();
    const giftCardService = new GiftCardService();
    
    // All state management
    const state = useGiftCardState();
    
    // Data management
    const dataHook = useGiftCardData({
        filters: state.filters,
        orderBy: state.orderBy,
        page: state.page,
        pageSize: state.pageSize,
        setTableRows: state.setTableRows,
        setTags: state.setTags,
        setCorporateCount: state.setCorporateCount,
        setPersonalCount: state.setPersonalCount,
    });

    // Event handlers
    const handlers = useGiftCardHandlers({
        ...state,
        getGiftCardData: dataHook.getGiftCardData,
        deleteGiftCardRequest: dataHook.deleteGiftCardRequest,
        cloneGiftCardRequest: dataHook.cloneGiftCardRequest,
        dispatch: dataHook.dispatch,
    });

    // Table logic
    const actionHandlers = {
        handleModalOpenEdit: handlers.handleModalOpenEdit,
        setSelectedGiftCard: state.setSelectedGiftCard,
        setInfoModal: state.setInfoModal,
        handleTagModalOpen: handlers.handleTagModalOpen,
        handleCloneGiftCardRequest: handlers.handleCloneGiftCardRequest,
        setDeleteModal: state.setDeleteModal,
        handleAlbumModalOpen: handlers.handleAlbumModalOpen,
        setUserDetailsEditModal: state.setUserDetailsEditModal,
        handleGenerateGiftCards: handlers.handleGenerateGiftCards,
        setEmailConfirmationModal: state.setEmailConfirmationModal,
        handleDownloadCards: handlers.handleDownloadCards,
        handleUpdateGiftCardImagess: handlers.handleUpdateGiftCardImagess,
        setBookNonGiftable: state.setBookNonGiftable,
        setPlotModal: state.setPlotModal,
        setAutoAssignModal: state.setAutoAssignModal,
        setPrsConfirm: state.setPrsConfirm,
        handlePaymentModalOpen: handlers.handlePaymentModalOpen,
        handleDownloadFundRequest: handlers.handleDownloadFundRequest,
        handlePickGiftRequest: handlers.handlePickGiftRequest
    };

    const handleSetFilters = (filters: Record<string, any>) => {
        state.setPage(0);
        state.setFilters(filters);
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...state.orderBy];
        const updateOrder = () => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        };

        if (sorter.field) {
            state.setPage(0);
            updateOrder();
            state.setOrderBy(newOrder);
        }
    };

    const tableLogic = useTableLogic({
        filters: state.filters,
        handleSetFilters,
        orderBy: state.orderBy,
        handleSortingChange,
        tags: state.tags,
        setSelectedGiftCard: state.setSelectedGiftCard,
        setNotesModal: state.setNotesModal,
        auth,
        actionHandlers
    });

    const handleSubmit = async (
        user: User,
        sponsor: User | null,
        createdBy: User,
        group: Group | null,
        treeCount: number,
        category: string,
        grove: string | null,
        requestType: string,
        users: any[],
        giftedOn: string,
        paymentId?: number,
        logo?: string,
        messages?: any,
        file?: File
    ) => {
        const success = await giftCardService.handleSubmit(
            state.changeMode,
            state.requestId,
            state.selectedGiftCard,
            user,
            sponsor,
            createdBy,
            group,
            treeCount,
            category,
            grove,
            requestType,
            users,
            giftedOn,
            dataHook.dispatch,
            paymentId,
            logo,
            messages,
            file
        );

        if (success) {
            handlers.handleModalClose();
            dataHook.getGiftCardData();
        }
    };

    const handleSelectionChanges = (giftRequestIds: number[]) => {
        state.setSelectedGiftRequestIds(giftRequestIds);
    };

    const getRowClassName = (record: any, index: number) => {
        if (record.tags?.includes('PaymentFailed')) {
            return 'payment-failed-row';
        }
        return '';
    };

    return (
        <div>
            <ToastContainer />
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px" }}>
                <Typography variant="h4" style={{ marginTop: '5px' }}>Tree Cards</Typography>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px", marginTop: "5px" }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handlers.handleModalOpenAdd}
                        style={{ textTransform: 'none', fontSize: 16 }}
                    >
                        Request Tree Cards
                    </Button>
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

            {/* Main Content */}
            {(auth.signedin || import.meta.env.VITE_BYPASS_AUTH === 'true') && (
                <Box sx={{ height: 840, width: "100%" }}>
                    <GeneralTable
                        loading={dataHook.giftCardsData.loading}
                        rows={state.tableRows}
                        columns={tableLogic.columns}
                        totalRecords={dataHook.giftCardsData.totalGiftCards}
                        page={state.page}
                        pageSize={state.pageSize}
                        onPaginationChange={(page: number, pageSize: number) => { 
                            state.setPage(page - 1); 
                            state.setPageSize(pageSize); 
                        }}
                        onDownload={dataHook.getAllGiftCardsData}
                        onSelectionChanges={handleSelectionChanges}
                        rowClassName={getRowClassName}
                        summary={(totalColumns: number) => {
                            if (totalColumns < 5) return undefined;
                            return (
                                <TableSummary 
                                    giftRequests={state.tableRows} 
                                    selectedGiftRequestIds={state.selectedGiftRequestIds} 
                                    totalColumns={totalColumns} 
                                />
                            );
                        }}
                        footer
                        tableName="Tree Cards"
                    />
                </Box>
            )}

            {/* Login Section for Non-authenticated Users */}
            {!auth.signedin && import.meta.env.VITE_BYPASS_AUTH !== 'true' && (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={10}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handlers.handleModalOpenAdd}
                        style={{ textTransform: 'none', fontSize: 16 }}
                    >
                        Request Tree Cards
                    </Button>
                    <Typography fontSize={18} color={"#51815A"} mb={1} mt={5}>
                        Login to see your previous tree cards requests!
                    </Typography>
                    <LoginComponent />
                </Box>
            )}

            {/* Gift Cards Form */}
            <GiftCardsForm
                loading={state.savingChange}
                setLoading={state.setSavingChange}
                loggedinUserId={dataHook.authRef.current?.userId}
                step={state.step}
                giftCardRequest={state.selectedGiftCard ?? undefined}
                requestId={state.requestId}
                open={state.modalOpen}
                handleClose={handlers.handleModalClose}
                onSubmit={handleSubmit}
            />

            {/* All Modals */}
            <GiftCardModals
                plotModal={state.plotModal}
                setPlotModal={state.setPlotModal}
                selectedGiftCard={state.selectedGiftCard}
                selectedPlots={state.selectedPlots}
                setSelectedPlots={state.setSelectedPlots}
                selectedTrees={state.selectedTrees}
                setSelectedTrees={state.setSelectedTrees}
                bookNonGiftable={state.bookNonGiftable}
                setBookNonGiftable={state.setBookNonGiftable}
                diversify={state.diversify}
                setDiversify={state.setDiversify}
                bookAllHabits={state.bookAllHabits}
                setBookAllHabits={state.setBookAllHabits}
                handlePlotSelectionCancel={handlers.handlePlotSelectionCancel}
                handlePlotSelectionSubmit={handlers.handlePlotSelectionSubmit}
                deleteModal={state.deleteModal}
                setDeleteModal={state.setDeleteModal}
                handleGiftCardRequestDelete={handlers.handleGiftCardRequestDelete}
                paymentModal={state.paymentModal}
                setPaymentModal={state.setPaymentModal}
                selectedPaymentGR={state.selectedPaymentGR}
                handlePaymentFormSubmit={handlers.handlePaymentFormSubmit}
                handleSponsorshipDetailsSubmit={handlers.handleSponsorshipDetailsSubmit}
                autoAssignModal={state.autoAssignModal}
                setAutoAssignModal={state.setAutoAssignModal}
                setSelectedGiftCard={state.setSelectedGiftCard}
                getGiftCardData={dataHook.getGiftCardData}
                emailConfirmationModal={state.emailConfirmationModal}
                testingMail={state.testingMail}
                handleEmailModalClose={handlers.handleEmailModalClose}
                handleSendEmails={handlers.handleSendEmails}
                userDetailsEditModal={state.userDetailsEditModal}
                handleUserDetailsEditClose={handlers.handleUserDetailsEditClose}
                handleUserDetailsEditSave={handlers.handleUserDetailsEditSave}
                albumImagesModal={state.albumImagesModal}
                handleAlbumModalClose={handlers.handleAlbumModalClose}
                handleAlbumSave={handlers.handleAlbumSave}
                handleDeleteAlbum={handlers.handleDeleteAlbum}
                album={state.album}
                infoModal={state.infoModal}
                setInfoModal={state.setInfoModal}
                notesModal={state.notesModal}
                setNotesModal={state.setNotesModal}
                handleNotesSave={handlers.handleNotesSave}
                tagModal={state.tagModal}
                tags={state.tags}
                handleTagModalClose={handlers.handleTagModalClose}
                handleTagTreeCardRequestSubmit={handlers.handleTagTreeCardRequestSubmit}
                autoPrsConfirm={state.autoPrsConfirm}
                autoProcessing={state.autoProcessing}
                setPrsConfirm={state.setPrsConfirm}
                handleAutoProcess={handlers.handleAutoProcess}
                giftCardNotification={state.giftCardNotification}
                setGiftCardNotification={state.setGiftCardNotification}
            />

            {/* Footer Content */}
            <Divider sx={{ my: 4, backgroundColor: 'transparent' }} />
            <Box sx={{ minHeight: 540 }}>
                <AutoPrsPlots type="gift-trees" />
            </Box>
            <div style={{ marginTop: '20px' }}>
                <h2>Sponsorship Distribution</h2>
                <GiftTreesChart 
                    corporateCount={state.corporateCount} 
                    personalCount={state.personalCount} 
                />
            </div>
        </div>
    );
};

export default GiftTrees;