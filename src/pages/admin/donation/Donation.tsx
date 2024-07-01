import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridToolbar, GridColumns ,GridFilterItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";
import { Donation } from "../../../types/donation";
import CircularProgress from "@mui/material/CircularProgress";
import getColumnSearchProps ,  { getColumnSelectedItemFilter } from "../../../components/Filter";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import AddDonation  from "./AddDonation";
import EditDonation from "./EditDonation";


function LoadingOverlay() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}>
      <CircularProgress />
    </div>
  );
}



export const DonationComponent = () => {


  const dispatch = useAppDispatch();
  const { getDonations, createDonation, updateDonation, deleteDonation } = bindActionCreators(
    donationActionCreators,
      dispatch
  );

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);





  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }
  
  
  
  useEffect(() => {
    getDonationData();
  }, [page, filters]);

  const getDonationData = async () => {
      console.log('Filters Object : ' , filters)
      let filtersData = Object.values(filters);
      console.log('filtered data : ' , filtersData)
      setTimeout(async () => {
          await getDonations(page*10, 10 ,filtersData);
      }, 1000);
  };


  let donationList: Donation[] = [];
  const donationsData = useAppSelector((state: RootState) => state.donationsData);
  console.log('Donation Data : ',donationsData)
  if (donationsData) {
      donationList = Object.values(donationsData.donations);
      console.log('list of sites: ' , donationList);
  }

  const getAllDonationData = async () => {
      let filtersData = Object.values(filters);
      setTimeout(async () => {
          await getDonations(0, donationsData.totalDonations ,filtersData );
      }, 1000);
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
      width: 100,
      align: "center",
      render: (value, record, index )=> (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setEditModal(true);
              setSelectedEditRow(record);
              console.log(" donation row to edit : ",record)
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
    // {
    //   dataIndex: "donation_date",
    //   key: "donation_date",
    //   title: "Donation Date",
    //   width: 220,
    //   align: "center",
    //   // ...getColumnSearchProps('donation_date', filters, handleSetFilters)
    // },
    {
      dataIndex: "Name",
      key: "donor_name",
      title: "Name",
      width: 220,
      align: "center",
      ...getColumnSearchProps('Name', filters, handleSetFilters)
    },
    {
      dataIndex: "Donor Type",
      key: "donor_type",
      title: "Donor Type",
      width: 180,
      align: "center",
      ...getColumnSearchProps('Donor_type', filters, handleSetFilters)
    },
    {
      dataIndex: "Phone",
      key: "Phone",
      title: "Phone",
      width: 150,
      align: "center",
      ...getColumnSearchProps('Phone', filters, handleSetFilters)
    },
    {
      dataIndex: "Email Address",
      key: "Email",
      title: "Email",
      width: 150,
      align: "center",
      ...getColumnSearchProps('Email', filters, handleSetFilters)
    },
    {
      dataIndex: "PAN",
      key: "PAN",
      title: "PAN",
      width: 150,
      align: "center",
      ...getColumnSearchProps('PAN', filters, handleSetFilters)
    },
    {
      dataIndex: "Pledged",
      key: "Pledged",
      title: "Pledged",
      width: 150,
      align: "center",
      ...getColumnSearchProps('Pledged', filters, handleSetFilters)

    },
    {
      dataIndex: "Land type",
      key: "Land_type",
      title: "Land_type",
      width: 150,
      align: "center",
      // ...getColumnSearchProps('Land_type', filters, handleSetFilters)
      ...getColumnSelectedItemFilter({ dataIndex: 'Land_type', filters, handleSetFilters, options: typesList }),

    },
    {
      dataIndex: "Zone",
      key: "Zone",
      title: "Zone",
      width: 150,
      align: "center",
      ...getColumnSearchProps('Zone', filters, handleSetFilters)

    },
    // {
    //   dataIndex: "PlantationLandType",
    //   key: "PlantationLandType",
    //   title: "PlantationLandType",
    //   width: 150,
    //   align: "center",
    // },
    {
      dataIndex: "DashboardStatus",
      key: "DashboardStatus",
      title: "DashboardStatus",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "Assigned plot",
      key: "Assigned_plot",
      title: "Assigned_plot",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "Tree planted",
      key: "Tree_planted",
      title: "Tree_planted",
      width: 200,
      align: "center",
    },
    // {
    //   dataIndex: "Assigner's dashboard",
    //   key: "Assigner_dashboard",
    //   title: "Assigner_dashboard",
    //   width: 200,
    //   align: "center",
    // },
    {
      dataIndex: "Remarks for inventory",
      key: "Remarks_for_inventory",
      title: "Remarks_for_inventory",
      width: 180,
      align: "center",
    },
];

const data = [
  {
    '_id': '60f5f7d4c1c9a4001b2b7f4c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': 'Paid for 294 trees but form for 300 trees',
  },
  {
    '_id': '60f5f7d4c1c9a491b2b7f4c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '9881491487',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': 'Paid for 294 trees but form for 300 trees',
  },
  {
    '_id': '60f5f7d4c1c9a1201b2b7f4c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '9881491487',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': 'Paid for 294 trees but form for 300 trees',
  },
  {
    '_id': '60f5f7d4c1c9a4043b2b7f4c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '9881491487',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': 'Paid for 294 trees but form for 300 trees',
  },
  {
    '_id': '60f5f7d4c1c9a4001b32334c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '9881491487',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': '',
  },
  {
    '_id': '60f5f7d4c1c9a4001b2b721c',
    'donation_date': '2020-07-27',
    'donor_name': 'Zubin Kabraji',
    'donor_type': 'Individual - Non IIT',
    'Phone': '9881491487',
    'Email': 'goodfrogfried@gmail.com',
    'PAN': 'AKMPK0863F',
    'Pledged': 4,
    'Land_type': 'Society',
    'Zone': 'Anand Park',
    'Grove': 'Anand Park',
    'PlantationLandType': 'I want my trees to be planted on Anand Park plot #1 only. Do not plant my sponsored tree anywhere else.',
    'DashboardStatus': 'Dashboards already exist',
    'Assigned_plot': 'Plot 1',
    'Tree_planted': 'Assign',
    "Assigner_dashboard": 'https://dashboard.14trees.org/profile/10077',
    'Remarks_for_inventory': '',
  },
  // ... Add the rest of the data here
];



  return (
    <>
    <div
          style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
          }}>
          <Button variant="contained" color="success" onClick={handleModalOpen}>
              Add Donation
          </Button>
          <AddDonation
              open={open}
              handleClose={handleModalClose}
              createDonation={handleCreateDonationData}
          />
        </div>
      
      <Box sx={{ height: 540, width: "100%", marginTop:'40px' }}>
      <TableComponent
          dataSource={donationList}
          columns={columns}
          totalRecords={donationsData.totalDonations}
          fetchAllData={getAllDonationData}
          setPage={setPage}
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


    </>
  );
};
