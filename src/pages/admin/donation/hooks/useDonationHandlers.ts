import { useState } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Donation } from "../../../../types/donation";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import { Plot } from "../../../../types/plot";
import ApiClient from "../../../../api/apiClient/apiClient";
import { getUniqueRequestId } from "../../../../helpers/utils";
import { Order } from "../../../../types/common";
import donationActionTypes from "../../../../redux/actionTypes/donationActionTypes";

export const useDonationHandlers = (
  dispatch: any,
  getDonations: any,
  createDonation: any,
  updateDonation: any,
  deleteDonation: any,
  page: number,
  pageSize: number,
  filters: Record<string, GridFilterItem>,
  orderBy: Order[],
  setLoading: (loading: boolean) => void,
  setTableRows: (rows: Donation[]) => void,
  fetchDonations: () => void
) => {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isDeleteAltOpen, setIsDeleteAltOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [donationReqId, setDonationReqId] = useState<string | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [assignTreesModalOpen, setAssignTreesModalOpen] = useState(false);
  const [mapTreesOpen, setMapTreesOpen] = useState(false);
  const [autoPrsConfirm, setPrsConfirm] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [plotSelectionModalOpen, setPlotSelectionModalOpen] = useState(false);
  const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
  const [reserveTreesModalOpen, setReserveTreesModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [diversifyTrees, setDiversifyTrees] = useState(false);
  const [bookAllHabits, setBookAllHabits] = useState(false);
  const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);

  const handlePlotSelectionClose = () => {
    setSelectedPlots([]);
    setSelectedTrees([]);
    setUsers([]);
    setDiversifyTrees(false);
    setPlotSelectionModalOpen(false);
  }

  const handlePlotSelectionSubmit = async () => {
    if (!selectedDonation || (selectedPlots.length === 0 && selectedTrees.length === 0)) {
      toast.error("Invalid input!");
      return;
    }

    try {
      const apiClient = new ApiClient();
      await apiClient.reserveTreesForDonation(
        selectedDonation.id,
        selectedTrees.map(tree => tree.id),
        selectedTrees.length === 0,
        selectedPlots.map(plot => ({ plot_id: plot.id, trees_count: 1 })),
        diversifyTrees,
        bookAllHabits
      );
      toast.success(`Successfully reserved trees for donation id: ${selectedDonation.id}!`);
    } catch (error: any) {
      toast.error(error.message);
    }

    handlePlotSelectionClose();
  }

  const handleTagModalOpen = (donation: Donation) => {
    setSelectedDonation(donation);
    setTagModal(true);
  }

  const handleTagModalClose = () => {
    setSelectedDonation(null);
    setTagModal(false);
  }

  const handleTagDonationSubmit = async (tags: string[]) => {
    if (!selectedDonation) return;

    setTagModal(false);
    try {
      const data = { ...selectedDonation };
      data.tags = tags;
      const apiClient = new ApiClient();

      const updatePayload = {
        updateFields: ['tags'],
        data: { tags }
      };

      const response = await apiClient.updateDonation(data, []);
      toast.success("Updated the donation tags!");
      fetchDonations();
    } catch (error: any) {
      toast.error(error.message);
    }

    handleTagModalClose();
  }

  const handleEmailModalClose = () => {
    setEmailConfirmationModal(false);
    setSelectedDonation(null);
  }

  const handleSendEmails = async (
    email_sponsor: boolean,
    email_recipient: boolean,
    email_assignee: boolean,
    test_mails: string[],
    sponsor_cc_mails: string[],
    recipient_cc_mails: string[],
    assignee_cc_mails: string[],
    event_type: string
  ) => {
    if (!selectedDonation) {
      toast.error("Invalid input!");
      return;
    }

    try {
      const apiClient = new ApiClient();
      await apiClient.sendEmailForDonation(
        selectedDonation.id,
        test_mails,
        sponsor_cc_mails,
        recipient_cc_mails,
        assignee_cc_mails,
        event_type,
        email_sponsor,
        email_recipient,
        email_assignee
      );
      toast.success(`Successfully sent emails for donation id: ${selectedDonation.id}!`);
    } catch (error: any) {
      toast.error(error.message);
    }

    handleEmailModalClose();
  }

  const handleModalOpen = (record?: Donation) => {
    setSelectedDonation(record ? record : null);
    if (record) setRequestId(record.request_id);
    else {
      const uniqueRequestId = getUniqueRequestId();
      setRequestId(uniqueRequestId);
    }
    setIsFormOpen(true);
  }

  const handleEditModalOpen = (record: Donation) => {
    setSelectedDonation(record);
    setIsEditFormOpen(true);
  }

  const handleModalClose = () => {
    setIsFormOpen(false);
    setSelectedDonation(null);
    setRequestId(null);
  }

  const handleEditModalClose = () => {
    setIsEditFormOpen(false);
    setSelectedDonation(null);
  }

  const handleCreateDonation = async (user: User, group: Group | null, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, logo?: string | null) => {
    if (!requestId) {
      toast.error("Something went wrong. Please try again later!");
      return;
    }

    createDonation(requestId, user.id, user.id, pledged, pledgedArea, category, grove, preference, eventName, alternateEmail, users, paymentId, group?.id, logo);
    setIsFeedbackFormOpen(true);
    setDonationReqId(requestId);
  }

  const handleDirectDonationUpdate = (updatedDonation: Donation) => {
    try {
      const donationToUpdate = { ...updatedDonation };
      const users: any[] = [];

      console.log("Updating donation with data:", donationToUpdate);

      updateDonation(donationToUpdate, users);
      handleEditModalClose();
      toast.success("Donation updated successfully!");
    } catch (error) {
      console.error("Error updating donation:", error);
      toast.error("Failed to update donation. Please try again.");
    }
  }

  const handleUpdateDonation = async (user: User, group: Group | null, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, logo?: string | null) => {
    if (!selectedDonation) return;

    try {
      const data = { ...selectedDonation };

      data.user_id = user.id;
      data.pledged = pledged;
      data.pledged_area = pledgedArea;
      data.group_id = group ? group.id : null;
      data.category = category as any;
      data.grove = grove;
      data.payment_id = paymentId ? paymentId : null;
      data.preference = preference;
      data.event_name = eventName?.trim() ? eventName.trim() : null;
      data.alternate_email = alternateEmail?.trim() ? alternateEmail.trim() : null;

      if (!data.trees_count && selectedDonation.trees_count) {
        data.trees_count = selectedDonation.trees_count;
      }
      if (!data.contribution_options && selectedDonation.contribution_options) {
        data.contribution_options = selectedDonation.contribution_options;
      }
      if (!data.created_by) {
        data.created_by = selectedDonation.created_by;
      }

      console.log("Updating donation with data:", data);

      updateDonation(data, users);
      toast.success("Donation updated successfully!");
    } catch (error) {
      console.error("Error updating donation:", error);
      toast.error("Failed to update donation. Please try again.");
    }
  }

  const handleSubmit = (user: User, group: Group | null, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, logo?: string | null) => {
    if (!selectedDonation) {
      handleCreateDonation(user, group, pledged, pledgedArea, category, grove, preference, eventName, alternateEmail, users, paymentId, logo);
    } else {
      handleUpdateDonation(user, group, pledged, pledgedArea, category, grove, preference, eventName, alternateEmail, users, paymentId, logo);
    }
  }

  const handleFeedbackSubmit = async (feedback: string, sourceInfo: string) => {
    if (!donationReqId) {
      toast.error("Something went wrong. Please try again later!");
      return;
    }

    try {
      const apiClient = new ApiClient();
      await apiClient.updateDonationFeedback(donationReqId, feedback, sourceInfo);
    } catch (error: any) {
      toast.error(error.message)
    }

    setDonationReqId(null);
    setIsFeedbackFormOpen(false);
  }

  const handleDeleteDonation = () => {
    if (!selectedDonation) return;

    deleteDonation(selectedDonation);
    setSelectedDonation(null);
    setIsDeleteAltOpen(false);
  }

  const handleDownloadDonations = async () => {
    const apiClient = new ApiClient();
    const filtersList = Object.values(filters);
    const resp = await apiClient.getDonations(0, -1, filtersList, orderBy);
    return resp.results;
  }

  const handleViewSummary = (record: Donation) => {
    setSelectedDonation(record);
    setInfoModalOpen(true);
  }

  const handleNotesModalOpen = (record: Donation) => {
    setSelectedDonation(record);
    setNotesModalOpen(true);
  }

  const handleNotesModalClose = () => {
    setSelectedDonation(null);
    setNotesModalOpen(false);
  }

  const handleSaveNotes = async (donationId: number, notes: string) => {
    try {
      const apiClient = new ApiClient();
      const updatedDonation = await apiClient.updateDonationNotes(donationId, notes);
      
      setTableRows(prevRows => 
        prevRows.map(row => 
          row.id === donationId ? { ...row, notes: updatedDonation.notes } : row
        )
      );
      
      if (selectedDonation && selectedDonation.id === donationId) {
        setSelectedDonation({ ...selectedDonation, notes: updatedDonation.notes });
      }
      
      dispatch({
        type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
        payload: updatedDonation,
      });
      
      toast.success('Notes updated successfully!');
    } catch (error: any) {
      console.error('Failed to save notes:', error);
      throw new Error(error.message || 'Failed to save notes');
    }
  }

  const handleAutoProcess = async () => {
    if (!selectedDonation) return;
    const donationId = selectedDonation.id;

    setAutoProcessing(true);
    try {
      const apiClient = new ApiClient();
      const donation = await apiClient.autoProcessDonation(donationId);
      dispatch({
        type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
        payload: donation,
      });

      toast.success("Auto processed request!")
      setSelectedDonation(null);
      setPrsConfirm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAutoProcessing(false);
    }
  }

  const handlePickDonation = async (donationId: number) => {
    try {
      const apiClient = new ApiClient();
      const currentUserId = localStorage.getItem('userId');

      if (!currentUserId) {
        toast.error('User not authenticated');
        return;
      }

      const response = await apiClient.pickDonation(donationId, parseInt(currentUserId));

      toast.success('Donation picked successfully');
      fetchDonations();

    } catch (error: any) {
      console.error('Error picking donation:', error);
      toast.error(error.message || 'Failed to pick donation');
    }
  };

  return {
    // State
    selectedDonation,
    isFormOpen,
    isEditFormOpen,
    requestId,
    isDeleteAltOpen,
    isFeedbackFormOpen,
    donationReqId,
    infoModalOpen,
    tagModal,
    assignTreesModalOpen,
    mapTreesOpen,
    autoPrsConfirm,
    autoProcessing,
    notesModalOpen,
    plotSelectionModalOpen,
    selectedPlots,
    selectedTrees,
    reserveTreesModalOpen,
    users,
    diversifyTrees,
    bookAllHabits,
    emailConfirmationModal,
    
    // Setters
    setSelectedDonation,
    setSelectedPlots,
    setSelectedTrees,
    setUsers,
    setDiversifyTrees,
    setBookAllHabits,
    setIsDeleteAltOpen,
    setPlotSelectionModalOpen,
    setReserveTreesModalOpen,
    setAssignTreesModalOpen,
    setMapTreesOpen,
    setPrsConfirm,
    setInfoModalOpen,
    setEmailConfirmationModal,
    
    // Handlers
    handlePlotSelectionClose,
    handlePlotSelectionSubmit,
    handleTagModalOpen,
    handleTagModalClose,
    handleTagDonationSubmit,
    handleEmailModalClose,
    handleSendEmails,
    handleModalOpen,
    handleEditModalOpen,
    handleModalClose,
    handleEditModalClose,
    handleCreateDonation,
    handleDirectDonationUpdate,
    handleUpdateDonation,
    handleSubmit,
    handleFeedbackSubmit,
    handleDeleteDonation,
    handleDownloadDonations,
    handleViewSummary,
    handleNotesModalOpen,
    handleNotesModalClose,
    handleSaveNotes,
    handleAutoProcess,
    handlePickDonation,
  };
};