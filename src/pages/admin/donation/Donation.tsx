import { useEffect, useState } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Dropdown, Menu, TableColumnsType } from "antd";
import { Donation } from "../../../types/donation";
import getColumnSearchProps from "../../../components/Filter";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import { ToastContainer, toast } from "react-toastify";
import DonationForm from "./Forms/DonationForm";
import { Delete, Edit, Email, Landscape, MenuOutlined, NotesOutlined, Wysiwyg } from "@mui/icons-material";
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

export const DonationComponent = () => {

  const dispatch = useAppDispatch();
  const { getDonations, createDonation, updateDonation, deleteDonation, assignTreesToDonationUsers, createWorkOrderForDonation } = bindActionCreators(
    donationActionCreators,
    dispatch
  );

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [tableRows, setTableRows] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isDeleteAltOpen, setIsDeleteAltOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [donationReqId, setDonationReqId] = useState<string | null>(null);

  // plot selection
  const [plotSelectionModalOpen, setPlotSelectionModalOpen] = useState(false);
  const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [diversifyTrees, setDiversifyTrees] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (selectedDonation) {

        try {
          const apiClient = new ApiClient();
          const users = await apiClient.getDonationUsers(selectedDonation.id);
          setUsers(users);
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
      await apiClient.bookTreesForDonation(selectedDonation.id, selectedPlots.map(plot => plot.id), selectedTrees, diversifyTrees);
      toast.success(`Successfully booked trees for donation id: ${selectedDonation.id}!`);
    } catch (error: any) {
      toast.error(error.message);
    }

    handlePlotSelectionClose();
  }


  // Send Emails
  const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);

  const handleEmailModalClose = () => {
    setEmailConfirmationModal(false);
    setSelectedDonation(null);
  }

  const handleSendEmails = async (emailDonor: boolean, emailReceiver: boolean, emailAssignee: boolean, testMails: string[], ccMails: string[], templateType: string) => {
    if (!selectedDonation) {
      toast.error("Invalid input!");
      return;
    }

    try {
      const apiClient = new ApiClient();
      await apiClient.sendAckEmailToDonor(selectedDonation.id, testMails, ccMails);
      toast.success(`Successfully acknowledgement mail to donor!`);
    } catch (error: any) {
      toast.error(error.message);
    }

    handleEmailModalClose();
  }

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  let donationList: Donation[] = [];
  const donationsData = useAppSelector((state: RootState) => state.donationsData);
  if (donationsData) {
    donationList = Object.values(donationsData.donations);
    donationList = donationList.sort((a, b) => b.id - a.id);
  }


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

  }, [filters]);

  const fetchDonations = () => {
    setLoading(true);
    let filtersData = Object.values(filters);
    getDonations(page * pageSize, pageSize, filtersData);
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


  const handleModalClose = () => {
    setIsFormOpen(false);
    setSelectedDonation(null);
    setRequestId(null);
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

  const handleUpdateDonation = async (user: User, group: Group | null, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, logo?: string | null) => {
    if (!selectedDonation) return;

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

    updateDonation(data, users);
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
    const resp = await apiClient.getDonations(0, -1, filtersList);
    return resp.results;
  }


  const getActionsMenu = (record: Donation) => (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item key="00" onClick={() => { }} icon={<Wysiwyg />}>
          View Summary
        </Menu.Item>
        <Menu.Item key="01" onClick={() => { handleModalOpen(record); }} icon={<Edit />}>
          Edit Request
        </Menu.Item>
        <Menu.Item key="02" danger onClick={() => { setIsDeleteAltOpen(true); setSelectedDonation(record); }} icon={<Delete />}>
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
      </Menu.ItemGroup>
    </Menu>
  );

  const columns: TableColumnsType<Donation> = [
    {
      dataIndex: "id",
      key: "id",
      title: "Donation ID",
      align: "right",
      width: 75,
    },
    {
      dataIndex: "user_name",
      key: "user_name",
      title: "Donor",
      align: "center",
      width: 200,
      ...getColumnSearchProps('user_name', filters, handleSetFilters)
    },
    {
      dataIndex: "group_name",
      key: "group_name",
      title: "Corporate/Personal",
      align: "center",
      width: 200,
      render: (value: string) => value ? value : 'Personal',
      ...getColumnSearchProps('group_name', filters, handleSetFilters)
    },
    {
      dataIndex: "pledged",
      key: "pledged",
      title: "Pledged",
      align: "center",
      width: 100,
      render: (value, record, index) => record.pledged ? record.pledged + " Trees" : record.pledged_area + " Acres"
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
      dataIndex: "created_at",
      key: "created_at",
      title: "Created on",
      align: "center",
      width: 150,
      render: getHumanReadableDate,
    },
    {
      dataIndex: "notes",
      key: "notes",
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button variant="contained" color="success" onClick={() => { handleModalOpen() }}>
            Donate
          </Button>
        </div>
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
          tableName="Plots"
        />
      </Box>

      <DonationForm
        donation={selectedDonation}
        open={isFormOpen}
        handleClose={handleModalClose}
        onSubmit={handleSubmit}
        requestId={requestId}
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
      />

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
