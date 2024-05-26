import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
} from "@mui/material";

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

  const [open, setOpen] = useState(false);

  
  const columns: GridColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button>
            <EditIcon />
          </Button>
          <Button>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
        field: "donation_date",
        headerName: "Donation Date",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "donor_name",
        headerName: "Donor Name",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "donor_type",
        headerName: "Donor Type",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Phone",
        headerName: "Phone",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Email",
        headerName: "Email",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "PAN",
        headerName: "PAN",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Pledged",
        headerName: "Pledged",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Land_type",
        headerName: "Land Type",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Zone",
        headerName: "Zone",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Grove",
        headerName: "Grove",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "PlantationLandType",
        headerName: "Plantation Land Type",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "DashboardStatus",
        headerName: "Dashboard Status",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Assigned_plot",
        headerName: "Assigned Plot",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Tree_planted",
        headerName: "Tree Planted",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Assigner_dashboard",
        headerName: "Assigner's Dashboard",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
    },
    {
        field: "Remarks_for_inventory",
        headerName: "Remarks for Inventory",
        width: 150,
        align: "center",
        editable: true,
        headerAlign: "center",
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
      
      <Box sx={{ height: 540, width: "100%", marginTop:'40px' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: LoadingOverlay,
          }}
        />
      </Box>

    </>
  );
};
