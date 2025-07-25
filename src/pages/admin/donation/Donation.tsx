import { useEffect, useState, useRef } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Donation } from "../../../types/donation";
import { useAppDispatch } from "../../../redux/store/hooks";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import DonationForm from "./Forms/DonationForm";
import DirectEditDonationForm from "./Forms/Donationeditform";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import ApiClient from "../../../api/apiClient/apiClient";
import FeedbackForm from "./Forms/FeedbackForm";
import AutoPrsPlots from "../../../components/AutoPrsPlots/AutoPrsPlots"
import PlotSelection from "./Forms/PlotSelection";
import EmailConfirmationModal from "./components/EmailConfirmationModal";
import DonationInfo from "./DonationInfo";
import DonationTrees from "./Forms/DonationTrees";
import TagComponent from "../gift/Components/TagComponent";
import { Order } from "../../../types/common";
import AssignTrees from "./Forms/AssignTrees/AssignTrees";
import MapTrees from "./Forms/MapTrees/MapTrees";
import AutoProcessConfirmationModal from "./components/AutoProcessConfirmationModal";
import NotesModal from "./components/NotesModal";
import './components/DonationPayment.css';

// Import our new hooks and configs
import { useDonationData } from "./hooks/useDonationData";
import { useDonationHandlers } from "./hooks/useDonationHandlers";
import { getDonationColumns } from "./config/donationTableConfig";

export const DonationComponent = () => {
  const dispatch = useAppDispatch();
  const { getDonations, createDonation, updateDonation, deleteDonation } = bindActionCreators(
    donationActionCreators,
    dispatch
  );

  // State for pagination, filtering, and sorting
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const isMountedRef = useRef(true);

  // Use our custom hooks
  const {
    loading,
    setLoading,
    tableRows,
    setTableRows,
    tags,
    donationsData,
    fetchDonations
  } = useDonationData(page, pageSize, filters, orderBy, getDonations);

  const handlers = useDonationHandlers(
    dispatch,
    getDonations,
    createDonation,
    updateDonation,
    deleteDonation,
    page,
    pageSize,
    filters,
    orderBy,
    setLoading,
    setTableRows,
    fetchDonations
  );

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get users for plot selection
  useEffect(() => {
    const getUsers = async () => {
      if (handlers.selectedDonation) {
        try {
          const apiClient = new ApiClient();
          const donationUsers = await apiClient.getDonationUsers(0, -1, [
            { columnField: 'donation_id', operatorValue: 'equals', value: handlers.selectedDonation.id }
          ]);
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            handlers.setUsers(donationUsers.results);
          }
        } catch (error: any) {
          console.error(error.message);
        }
      }
    }

    if (handlers.plotSelectionModalOpen) getUsers();
  }, [handlers.plotSelectionModalOpen, handlers.selectedDonation]);

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
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

  // Configure table columns with all necessary handlers
  const columns = getDonationColumns({
    filters,
    handleSetFilters,
    orderBy,
    handleSortingChange,
    tags,
    handleViewSummary: handlers.handleViewSummary,
    handleEditModalOpen: handlers.handleEditModalOpen,
    handleTagModalOpen: handlers.handleTagModalOpen,
    setIsDeleteAltOpen: handlers.setIsDeleteAltOpen,
    setSelectedDonation: handlers.setSelectedDonation,
    setPlotSelectionModalOpen: handlers.setPlotSelectionModalOpen,
    setEmailConfirmationModal: handlers.setEmailConfirmationModal,
    setReserveTreesModalOpen: handlers.setReserveTreesModalOpen,
    setAssignTreesModalOpen: handlers.setAssignTreesModalOpen,
    setMapTreesOpen: handlers.setMapTreesOpen,
    setPrsConfirm: handlers.setPrsConfirm,
    handlePickDonation: handlers.handlePickDonation,
    handleNotesModalOpen: handlers.handleNotesModalOpen,
  });

  return (
    <>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>Donations</Typography>
      </div>
      <Box sx={{ width: '100%' }}>
        <Divider sx={{ backgroundColor: "black", mb: 2 }} />

        <Box id="donations-table" sx={{ height: 540, width: "100%", px: 2, scrollMarginTop: '20px' }}>
          <GeneralTable
            loading={loading}
            rows={tableRows}
            columns={columns}
            totalRecords={donationsData.totalDonations}
            page={page}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            onDownload={handlers.handleDownloadDonations}
            footer
            tableName="Donations"
            rowClassName={(record) => record.status === 'PendingPayment' ? 'pending-payment-row' : ''}
          />
        </Box>

        {/* Auto Processing Plots Section */}
        <Divider sx={{ my: 18, backgroundColor: 'transparent'}} /> 
          <Box id="auto-processing-config" sx={{ minHeight: 540, scrollMarginTop: '20px' }}>
            <AutoPrsPlots type="donate" />
          </Box>
        </Box>

      {/* Original Donation Form for creating new donations */}
      <DonationForm
        donation={handlers.selectedDonation}
        open={handlers.isFormOpen}
        handleClose={handlers.handleModalClose}
        onSubmit={handlers.handleSubmit}
        requestId={handlers.requestId}
      />

      {/* New Direct Edit Form for editing existing donations */}
      <DirectEditDonationForm
        donation={handlers.selectedDonation}
        open={handlers.isEditFormOpen}
        handleClose={handlers.handleEditModalClose}
        onSubmit={handlers.handleDirectDonationUpdate}
      />

      <FeedbackForm
        open={handlers.isFeedbackFormOpen}
        onClose={() => { handlers.setSelectedDonation(null); }}
        onSubmit={handlers.handleFeedbackSubmit}
      />

      <EmailConfirmationModal
        open={handlers.emailConfirmationModal}
        onClose={handlers.handleEmailModalClose}
        onSubmit={handlers.handleSendEmails}
        donorMail={handlers.selectedDonation?.user_email}
        donation_id={handlers.selectedDonation?.id?.toString() || ''}
      />

      <DonationInfo
        open={handlers.infoModalOpen}
        onClose={() => handlers.setInfoModalOpen(false)}
        data={handlers.selectedDonation}
      />

      <DonationTrees
        open={handlers.reserveTreesModalOpen}
        onClose={() => handlers.setReserveTreesModalOpen(false)}
        donation={handlers.selectedDonation}
      />

      <TagComponent
        defaultTags={tags}
        tags={handlers.selectedDonation?.tags || []}
        open={handlers.tagModal}
        onClose={handlers.handleTagModalClose}
        onSubmit={handlers.handleTagDonationSubmit}
      />

      {handlers.selectedDonation && <AssignTrees
        donationId={handlers.selectedDonation.id}
        donation={handlers.selectedDonation}
        open={handlers.assignTreesModalOpen}
        onClose={() => {
          handlers.setAssignTreesModalOpen(false);
          handlers.setSelectedDonation(null);
        }}
      />}

      {handlers.selectedDonation && handlers.mapTreesOpen && <MapTrees
        open={handlers.mapTreesOpen}
        onClose={() => { handlers.setMapTreesOpen(false); }}
        donation={handlers.selectedDonation}
      />}

      {handlers.selectedDonation && <AutoProcessConfirmationModal
        loading={handlers.autoProcessing}
        open={handlers.autoPrsConfirm}
        onClose={() => {
          handlers.setPrsConfirm(false);
          handlers.setSelectedDonation(null);
        }}
        onConfirm={handlers.handleAutoProcess}
        donationId={handlers.selectedDonation.id}
        treesToBook={handlers.selectedDonation.trees_count - (handlers.selectedDonation.booked || 0)}
      />}

      <Dialog open={handlers.plotSelectionModalOpen} onClose={() => handlers.setPlotSelectionModalOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle>Select Plots</DialogTitle>
        <DialogContent dividers>
          <PlotSelection
            users={handlers.users}
            onUserTreeMapping={(trees: any[]) => { handlers.setSelectedTrees(trees); }}
            requiredTrees={handlers.selectedDonation?.pledged ?? 0}
            requiredArea={handlers.selectedDonation?.pledged_area ?? 0}
            plots={handlers.selectedPlots}
            onPlotsChange={plots => handlers.setSelectedPlots(plots)}
            diversify={handlers.diversifyTrees}
            onDiversifyChange={(value) => { handlers.setDiversifyTrees(value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlers.handlePlotSelectionClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handlers.handlePlotSelectionSubmit} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={handlers.isDeleteAltOpen} fullWidth maxWidth='md'>
        <DialogTitle>Delete donation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">Are you sure you want to delete this donation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handlers.setIsDeleteAltOpen(false); handlers.setSelectedDonation(null); }} color="error">
            Cancel
          </Button>
          <Button onClick={handlers.handleDeleteDonation} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <NotesModal
        open={handlers.notesModalOpen}
        onClose={handlers.handleNotesModalClose}
        donation={handlers.selectedDonation}
        onSave={handlers.handleSaveNotes}
      />
    </>
  );
};

export default DonationComponent;