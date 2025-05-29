import { useEffect, useState } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Dropdown, Menu, TableColumnsType } from "antd";
import { Donation } from "../../../types/donation";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortableHeader } from "../../../components/Filter";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import { ToastContainer, toast } from "react-toastify";
import DonationForm from "./Forms/DonationForm";
import DirectEditDonationForm from "./Forms/Donationeditform";
import { AssignmentInd, AutoMode, Delete, Edit, Email, Landscape, LocalOffer, MenuOutlined, NotesOutlined, Wysiwyg } from "@mui/icons-material";
import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import ApiClient from "../../../api/apiClient/apiClient";
import { getHumanReadableDate, getUniqueRequestId } from "../../../helpers/utils";
import { User } from "../../../types/user";
import { Group } from "../../../types/Group";
import FeedbackForm from "./Forms/FeedbackForm";
import { Plot } from "../../../types/plot";
import PlotSelection from "./Forms/PlotSelection";
import EmailConfirmationModal from "./components/EmailConfirmationModal";
import DonationInfo from "./DonationInfo";
import DonationTrees from "./Forms/DonationTrees";
import TagComponent from "../gift/Form/TagComponent";
import { Order } from "../../../types/common";
import AssignTrees from "./Forms/AssignTrees/AssignTrees";
import AutoProcessConfirmationModal from "./components/AutoProcessConfirmationModal";
import donationActionTypes from "../../../redux/actionTypes/donationActionTypes";

export const DonationComponent = () => {

  const dispatch = useAppDispatch();
  const { getDonations, createDonation, updateDonation, deleteDonation } = bindActionCreators(
    donationActionCreators,
    dispatch
  );

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const [tableRows, setTableRows] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isDeleteAltOpen, setIsDeleteAltOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [donationReqId, setDonationReqId] = useState<string | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [assignTreesModalOpen, setAssignTreesModalOpen] = useState(false);
  const [autoPrsConfirm, setPrsConfirm] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(false);

  // Get tags
  useEffect(() => {
    const getTags = async () => {
      try {
        const apiClient = new ApiClient();
        const tagsResp = await apiClient.getDonationTags();
        setTags(tagsResp.results);
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    getTags();
  }, []);

  // plot selection
  const [plotSelectionModalOpen, setPlotSelectionModalOpen] = useState(false);
  const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
  const [reserveTreesModalOpen, setReserveTreesModalOpen] = useState(false)
  const [users, setUsers] = useState<any[]>([]);
  const [diversifyTrees, setDiversifyTrees] = useState(false);
  const [bookAllHabits, setBookAllHabits] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (selectedDonation) {

        try {
          const apiClient = new ApiClient();
          const donationUsers = await apiClient.getDonationUsers(0, -1, [
            { columnField: 'donation_id', operatorValue: 'equals', value: selectedDonation.id }
          ]);
          setUsers(donationUsers.results);
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    }

    if (plotSelectionModalOpen) getUsers();
  }, [plotSelectionModalOpen, selectedDonation]);

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

  // Tag functionality
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

      // Create a payload with only the tags field
      const updatePayload = {
        updateFields: ['tags'],
        data: { tags }
      };

      const response = await apiClient.updateDonation(data, []);
      toast.success("Updated the donation tags!");
      fetchDonations(); // Refresh the data
    } catch (error: any) {
      toast.error(error.message);
    }

    handleTagModalClose();
  }

  // Send Emails
  const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);

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

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  const donationsData = useAppSelector((state: RootState) => state.donationsData);
  useEffect(() => {
    const handler = setTimeout(() => {
      const records: Donation[] = [];
      const maxLength = Math.min((page + 1) * pageSize, donationsData.totalDonations);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(donationsData.paginationMapping, i)) {
          const id = donationsData.paginationMapping[i];
          const record = donationsData.donations[id];
          if (record) {
            records.push(record);
          }
        } else {
          fetchDonations();
          return;
        }
      }

      setTableRows(records);
      setLoading(false);
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [pageSize, page, donationsData]);

  useEffect(() => {

    const handler = setTimeout(() => {
      fetchDonations();
    }, 300)

    return () => {
      clearTimeout(handler);
    }

  }, [filters, orderBy]);

  const fetchDonations = () => {
    setLoading(true);
    try {
      let filtersData = Object.values(filters);
      getDonations(page * pageSize, pageSize, filtersData, orderBy);
    } catch (error) {
      console.error('Error fetching donations:', error);
      // Don't show error toast, just set empty data
      setTableRows([]);
    } finally {
      setLoading(false);
    }
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
      // Make a copy of the donation to ensure we don't modify the state directly
      const donationToUpdate = { ...updatedDonation };

      // Empty users array since we're not modifying users in this form
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
      // Create a copy of the selected donation
      const data = { ...selectedDonation };

      // Update with new values
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

      // Make sure we keep these values from the original donation
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

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
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
      fetchDonations(); // Refresh the data

    } catch (error: any) {
      console.error('Error picking donation:', error);
      toast.error(error.message || 'Failed to pick donation');
    }
  };

  const getActionsMenu = (record: Donation) => (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item key="00" onClick={() => { handleViewSummary(record); }} icon={<Wysiwyg />}>
          View Summary
        </Menu.Item>
        <Menu.Item key="01" onClick={() => { handleEditModalOpen(record); }} icon={<Edit />}>
          Edit Request
        </Menu.Item>
        <Menu.Item key="02" onClick={() => { handleTagModalOpen(record); }} icon={<LocalOffer />}>
          Tag Request
        </Menu.Item>
        <Menu.Item key="03" danger onClick={() => { setIsDeleteAltOpen(true); setSelectedDonation(record); }} icon={<Delete />}>
          Delete Request
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider style={{ backgroundColor: '#ccc' }} />
      <Menu.ItemGroup>
        {(Number(record.booked) < (record.pledged || 0)) && <Menu.Item key="20" onClick={() => { setSelectedDonation(record); setPlotSelectionModalOpen(true); }} icon={<Landscape />}>
          Select Plots
        </Menu.Item>}
        <Menu.Item key="21" onClick={() => { setSelectedDonation(record); setEmailConfirmationModal(true); }} icon={<Email />}>
          Send Emails
        </Menu.Item>
        <Menu.Item key="22" onClick={() => { setSelectedDonation(record); setReserveTreesModalOpen(true); }} icon={<Landscape />}>
          Reserve Trees
        </Menu.Item>
        <Menu.Item key="23" onClick={() => { setSelectedDonation(record); setAssignTreesModalOpen(true); }} icon={<AssignmentInd />}>
          Assign Trees
        </Menu.Item>
        {record.donation_method === 'trees' && record.trees_count > (record.booked || 0) && <Menu.Item key="25" onClick={() => { setSelectedDonation(record); setPrsConfirm(true); }} icon={<AutoMode />}>
          Auto Process
        </Menu.Item>}
        {!record.processed_by && (
          <Menu.Item
            key="pick"
            onClick={() => handlePickDonation(record.id)}
            icon={<AssignmentInd />}
          >
            Pick This Up
          </Menu.Item>
        )}

      </Menu.ItemGroup>
    </Menu>
  );

  const columns: TableColumnsType<Donation> = [
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
    {
      dataIndex: "id",
      key: "Don. Id",
      title: "Don. Id",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "user_name",
      key: "Donor Name",
      title: "Donor Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('user_name', filters, handleSetFilters)
    },
    {
      dataIndex: "category",
      key: "Type",
      title: "Type",
      align: "center",
      width: 100,
      ...getColumnSelectedItemFilter({ dataIndex: 'category', filters, handleSetFilters, options: ['Foundation', 'Public'] })
    },
    {
      dataIndex: "trees_count",
      key: "Pledged Trees",
      title: getSortableHeader("Pledged Trees", 'trees_count', orderBy, handleSortingChange),
      align: "center",
      width: 100,
    },
    {
      dataIndex: "amount_donated",
      key: "Donation Amount",
      title: getSortableHeader("Donation Amount", 'amount_donated', orderBy, handleSortingChange),
      align: "center",
      width: 120,
    },
    {
      dataIndex: "tags",
      key: "Tags",
      title: "Tags",
      align: "center",
      width: 200,
      render: value => value?.join(", ") || '',
      ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
    },
    // {
    //   dataIndex: "pledged_area_acres",
    //   key: "Pledged Area (Acres)",
    //   title: getSortableHeader("Pledged Area (Acres)", 'pledged_area_acres', orderBy, handleSortingChange),
    //   align: "center",
    //   width: 150,
    //   render: (value) => value ? value : '-',
    // },
    {
      dataIndex: "contribution_options",
      key: "Contribution",
      title: "Additional Contribution",
      align: "center",
      width: 150,
      render: (contributions) => {
        if (!contributions) return '';
        if (Array.isArray(contributions)) {
          return contributions.join(', ');
        }
        return contributions;
      },
      ...getColumnSelectedItemFilter({ dataIndex: 'contribution_options', filters, handleSetFilters, options: ['CSR', 'Planing Visit', 'Other'] }),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "center",
      width: 120,
      render: (status) => {
        // Format the status for display
        switch (status) {
          case 'UserSubmitted':
            return 'Submitted';
          case 'OrderFulfilled':
            return 'Fulfilled';
          default:
            return 'Submitted'; // Default to UserSubmitted if not set
        }
      },
      ...getColumnSelectedItemFilter({ dataIndex: 'status', filters, handleSetFilters, options: ['UserSubmitted', 'OrderFulfilled'] }),
    },
    {
      dataIndex: "processed_by_name",
      key: "processed_by",
      title: "Processed By",
      align: "center",
      width: 150,
      render: (value, record) => {
        if (!value) return 'Pending';
        return record.processed_by_name || `User ${value}`;
      },
      ...getColumnSearchProps('processed_by_name', filters, handleSetFilters)
    },
    {
      dataIndex: "created_at",
      key: "Created On",
      title: "Created On",
      align: "center",
      width: 150,
      render: getHumanReadableDate,
      ...getColumnDateFilter({ dataIndex: 'created_at', filters, handleSetFilters, label: 'Created On' }),
    },
    {
      dataIndex: "notes",
      key: "Notes",
      title: "Notes",
      align: "center",
      width: 100,
      render: (value, record) => (
        <IconButton onClick={() => { }}>
          <Badge variant="dot" color="success" invisible={(!value || value.trim() === '') ? true : false}>
            <NotesOutlined />
          </Badge>
        </IconButton>
      ),
    },
  ]

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
        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button variant="contained" color="success" onClick={() => { handleModalOpen() }}>
            Donate
          </Button>
        </div> */}
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

      <Box sx={{ height: 540, width: "100%" }}>
        <GeneralTable
          loading={loading}
          rows={tableRows}
          columns={columns}
          totalRecords={donationsData.totalDonations}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDownload={handleDownloadDonations}
          footer
          tableName="Donations"
        />
      </Box>

      {/* Original Donation Form for creating new donations */}
      <DonationForm
        donation={selectedDonation}
        open={isFormOpen}
        handleClose={handleModalClose}
        onSubmit={handleSubmit}
        requestId={requestId}
      />

      {/* New Direct Edit Form for editing existing donations */}
      <DirectEditDonationForm
        donation={selectedDonation}
        open={isEditFormOpen}
        handleClose={handleEditModalClose}
        onSubmit={handleDirectDonationUpdate}
      />

      <FeedbackForm
        open={isFeedbackFormOpen}
        onClose={() => { setIsFeedbackFormOpen(false); }}
        onSubmit={handleFeedbackSubmit}
      />

      <EmailConfirmationModal
        open={emailConfirmationModal}
        onClose={handleEmailModalClose}
        onSubmit={handleSendEmails}
        donorMail={selectedDonation?.user_email}
        donation_id={selectedDonation?.id?.toString() || ''}
      />

      <DonationInfo
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        data={selectedDonation}
      />

      <DonationTrees
        open={reserveTreesModalOpen}
        onClose={() => setReserveTreesModalOpen(false)}
        donation={selectedDonation}
      />

      <TagComponent
        defaultTags={tags}
        tags={selectedDonation?.tags || []}
        open={tagModal}
        onClose={handleTagModalClose}
        onSubmit={handleTagDonationSubmit}
      />

      {selectedDonation && <AssignTrees
        donationId={selectedDonation.id}
        donation={selectedDonation}
        open={assignTreesModalOpen}
        onClose={() => {
          setAssignTreesModalOpen(false);
          setSelectedDonation(null);
        }}
      />}

      {selectedDonation && <AutoProcessConfirmationModal
        loading={autoProcessing}
        open={autoPrsConfirm}
        onClose={() => {
          setPrsConfirm(false);
          setSelectedDonation(null);
        }}
        onConfirm={handleAutoProcess}
      />}

      <Dialog open={plotSelectionModalOpen} onClose={() => setPlotSelectionModalOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle>Select Plots</DialogTitle>
        <DialogContent dividers>
          <PlotSelection
            users={users}
            onUserTreeMapping={(trees: any[]) => { setSelectedTrees(trees); }}
            requiredTrees={selectedDonation?.pledged ?? 0}
            requiredArea={selectedDonation?.pledged_area ?? 0}
            plots={selectedPlots}
            onPlotsChange={plots => setSelectedPlots(plots)}
            diversify={diversifyTrees}
            onDiversifyChange={(value) => { setDiversifyTrees(value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePlotSelectionClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handlePlotSelectionSubmit} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteAltOpen} fullWidth maxWidth='md'>
        <DialogTitle>Delete donation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">Are you sure you want to delete this donation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsDeleteAltOpen(false); setSelectedDonation(null); }} color="error">
            Cancel
          </Button>
          <Button onClick={handleDeleteDonation} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DonationComponent;
