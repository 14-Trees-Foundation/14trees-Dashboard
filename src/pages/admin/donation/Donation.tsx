import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { GridFilterItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ForestIcon from "@mui/icons-material/Forest";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Dropdown, TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";
import { Donation } from "../../../types/donation";
import CircularProgress from "@mui/material/CircularProgress";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import AddDonation from "./AddDonation";
import EditDonation from "./EditDonation";
import { ToastContainer } from "react-toastify";
import DonationForm from "./Forms/DonationForm";

export const DonationComponent = () => {

  const dispatch = useAppDispatch();
  const { getDonations, createDonation, updateDonation, deleteDonation, assignTreesToDonationUsers, createWorkOrderForDonation } = bindActionCreators(
    donationActionCreators,
    dispatch
  );

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dorpDownOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAutoAssignTrees = (donationId: number) => {
    assignTreesToDonationUsers(donationId);
    setAnchorEl(null);
  };

  const handleCreateWorkOder = (donationId: number) => {
    createWorkOrderForDonation(donationId);
    setAnchorEl(null);
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getDonationData();
  }, [pageSize, page, filters]);

  const getDonationData = async () => {
    let filtersData = Object.values(filters);
    getDonations(page * pageSize, pageSize, filtersData);
  };


  let donationList: Donation[] = [];
  const donationsData = useAppSelector((state: RootState) => state.donationsData);
  if (donationsData) {
    donationList = Object.values(donationsData.donations);
    donationList = donationList.sort((a, b) => b.id - a.id);
  }

  const getAllDonationData = async () => {
    let filtersData = Object.values(filters);
    getDonations(0, donationsData.totalDonations, filtersData);
  };

  const handleCreateDonationData = (formData: Donation) => {
    createDonation(formData);
  };


  const handleDeleteDonations = (row: Donation) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Donation) => {
    updateDonation(formData);
    setSelectedEditRow(null);
  };

  const typesList = [
    "Society",
    "Farmer",
    "14T"
  ]


  const columns: TableColumnsType<Donation> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 220,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            aria-controls={dorpDownOpen ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={dorpDownOpen ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={dorpDownOpen}
            onClose={() => setAnchorEl(null)}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => { handleAutoAssignTrees(record.id) }}>Auto Assign Trees</MenuItem>
            <MenuItem onClick={() => { handleCreateWorkOder(record.id) }}>Create Work Order</MenuItem>
            <MenuItem >Send Email</MenuItem>
          </Menu> 
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setEditModal(true);
              setSelectedEditRow(record);
              console.log(" donation row to edit : ", record)
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => handleDeleteDonations(record)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 220,
      align: "center",
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    // {
    //   dataIndex: "donor_type",
    //   key: "donor_type",
    //   title: "Donor Type",
    //   width: 180,
    //   align: "center",
    //   ...getColumnSearchProps('donor_type', filters, handleSetFilters)
    // },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      width: 150,
      align: "center",
      ...getColumnSearchProps('phone', filters, handleSetFilters)
    },
    {
      dataIndex: "email_address",
      key: "email_address",
      title: "Email",
      width: 250,
      align: "center",
      ...getColumnSearchProps('email_address', filters, handleSetFilters)
    },
    {
      dataIndex: "pledged",
      key: "pledged",
      title: "Pledged",
      width: 150,
      align: "center",
      ...getColumnSearchProps('pledged', filters, handleSetFilters)

    },
    {
      dataIndex: "assigned_trees",
      key: "assigned_trees",
      title: "Assigned Trees",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "land_type",
      key: "land_type",
      title: "Land_type",
      width: 150,
      align: "center",
      ...getColumnSelectedItemFilter({ dataIndex: 'land_type', filters, handleSetFilters, options: typesList }),
    },
    {
      dataIndex: "grove",
      key: "grove",
      title: "Grove",
      width: 150,
      align: "center",
      ...getColumnSelectedItemFilter({ dataIndex: 'grove', filters, handleSetFilters, options: typesList }),
    },
    {
      dataIndex: "pan",
      key: "pan",
      title: "PAN",
      width: 150,
      align: "center",
      ...getColumnSearchProps('pan', filters, handleSetFilters)
    },
    // {
    //   dataIndex: "zone",
    //   key: "zone",
    //   title: "Zone",
    //   width: 150,
    //   align: "center",
    //   ...getColumnSearchProps('zone', filters, handleSetFilters)

    // },
    // {
    //   dataIndex: "dashboard_status",
    //   key: "dashboard_status",
    //   title: "Dashboard Status",
    //   width: 150,
    //   align: "center",
    // },
    // {
    //   dataIndex: "assigned_plot",
    //   key: "assigned_plot",
    //   title: "Assigned Plot",
    //   width: 180,
    //   align: "center",
    // },
    // {
    //   dataIndex: "remarks_for_inventory",
    //   key: "remarks_for_inventory",
    //   title: "Remarks for inventory",
    //   width: 180,
    //   align: "center",
    // },
    {
      dataIndex: "associated_tag",
      key: "associated_tag",
      title: "Associated Tag",
      width: 180,
      align: "center",
    },
  ];




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
          <Button variant="contained" color="success" onClick={handleModalOpen}>
            Add Donation
          </Button>
          {/* <AddDonation
            open={open}
            handleClose={handleModalClose}
            createDonation={handleCreateDonationData}
          /> */}
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

      <Box sx={{ height: 540, width: "100%" }}>
        <TableComponent
          dataSource={donationList}
          columns={columns}
          totalRecords={donationsData.totalDonations}
          fetchAllData={getAllDonationData}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteDonation(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {selectedEditRow && (
        <EditDonation
          row={selectedEditRow}
          openeditModal={editModal}
          closeEditModal={() => { setEditModal(false); setSelectedEditRow(null); }}
          editSubmit={handleEditSubmit}
        />
      )}

      <DonationForm 
        open={open}
        handleClose={handleModalClose}
      />

    </>
  );
};
