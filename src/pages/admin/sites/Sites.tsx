import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import EditSites from "./EditSites";

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

export const SitesComponent = () => {
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);

  const columns: GridColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
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
              setSelectedEditRow(params.row);
              setEditModal(true);
            }}>
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => handleDeleteSites(params.row as any)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name_marathi",
      headerName: "Name (Marathi)",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name_english",
      headerName: "Name (English)",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "owner",
      headerName: "Owner",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "land_type",
      headerName: "Land Type",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "land_strata",
      headerName: "Land Strata",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "district",
      headerName: "District",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taluka",
      headerName: "Taluka",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "village",
      headerName: "Village",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "area_acres",
      headerName: "Area (Acres)",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "length_km",
      headerName: "Length (Km)",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tree_count",
      headerName: "Tree Count",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unique_id",
      headerName: "Unique ID",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "photo_album",
      headerName: "Photo Album",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          View Photos
        </a>
      ),
    },
    {
      field: "consent_letter",
      headerName: "Consent Letter",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "grove_type",
      headerName: "Grove Type",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "map_to",
      headerName: "Map To",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "notion_db_pictures",
      headerName: "Notion DB Pictures",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "split_village_name_1",
      headerName: "Split Village Name 1",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "split_village_name_2",
      headerName: "Split Village Name 2",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "create_id",
      headerName: "Create ID",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "site_key",
      headerName: "Site Key",
      width: 250,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "site_key_2",
      headerName: "Site Key 2",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "temp_backup_copy_of_old_site_name_english_marathi",
      headerName: "Temp Backup Copy of Old Site Name",
      width: 300,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "temp_copy_of_old_site_key",
      headerName: "Temp Copy of Old Site Key",
      width: 300,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "temp_old_site_name_in_english",
      headerName: "Temp Old Site Name (English)",
      width: 300,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "temp_old_site_name_in_marathi",
      headerName: "Temp Old Site Name (Marathi)",
      width: 300,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
      type: "dateTime",
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
      type: "dateTime",
    },
  ];

  const data = [
    {
      id: 1,
      name_marathi: "चास कमान धरण ते कडधे रस्ता",
      name_english: "Chas Kaman Dam To Kadadhe Road",
      owner: "Gram Panchayat (ग्राम पंचायत)",
      land_type: "Roadside (रस्ता)",
      land_strata: "Roadside (रस्ता काठ)",
      district: "Pune (पुणे)",
      taluka: "Khed (खेड)",
      village: "Kadadhe (कडधे)",
      area_acres: null,
      length_km: "0.84",
      tree_count: "124",
      unique_id: "PUB/KADAD/ROAD/0002",
      photo_album: "https://photos.app.goo.gl/1FXj7n3SsWMumiNq6",
      consent_letter: "14T - ग्राम पंचायत पत्र",
      grove_type: "14 T - Roadside",
      map_to: "#N/A",
      notion_db_pictures: "Combined record for Kadadhe in dB Pictures",
      split_village_name_1: "Kadadhe",
      split_village_name_2: null,
      create_id: "PUB/KADAD/ROAD/0002",
      site_key: "(कडधे)-(रस्ता)-(चास कमान धरण ते कडधे रस्ता)",
      site_key_2: "(कडधे)-(रस्ता)",
      temp_backup_copy_of_old_site_name_english_marathi:
        "Chas Kaman dam te Kadadhe rasta(चास कमान धरण ते कडधे रस्ता) ",
      temp_copy_of_old_site_key: "(कडधे)-(रस्ता)-(चास कमान धरण ते कडधे रस्ता)",
      temp_old_site_name_in_english: "Chas Kaman dam te Kadadhe rasta",
      temp_old_site_name_in_marathi: "चास कमान धरण ते कडधे रस्ता",
      created_at: "2021-09-16T12:39:00.000Z",
      updated_at: "2021-09-16T12:39:00.000Z",
    },
    {
      id: 2,
      name_marathi: "मंदिर रस्ता कडधे",
      name_english: "Temple Road Kadadhe",
      owner: "Gram Panchayat (ग्राम पंचायत)",
      land_type: "Roadside (रस्ता)",
      land_strata: "Roadside (रस्ता काठ)",
      district: "Pune (पुणे)",
      taluka: "Khed (खेड)",
      village: "Kadadhe (कडधे)",
      area_acres: null,
      length_km: "0.2",
      tree_count: null,
      unique_id: "PUB/KADAD/ROAD/0003",
      photo_album: "https://photos.app.goo.gl/1FXj7n3SsWMumiNq6",
      consent_letter: "14T - ग्राम पंचायत पत्र",
      grove_type: "14 T - Roadside",
      map_to: "#N/A",
      notion_db_pictures: "Combined record for Kadadhe in dB Pictures",
      split_village_name_1: "Kadadhe",
      split_village_name_2: null,
      create_id: "PUB/KADAD/ROAD/0003",
      site_key: "(कडधे)-(रस्ता)-(मंदिर रस्ता कडधे)",
      site_key_2: "(कडधे)-(रस्ता)",
      temp_backup_copy_of_old_site_name_english_marathi:
        "Mandir rasta Kadadhe(मंदिर रस्ता कडधे) ",
      temp_copy_of_old_site_key: "(कडधे)-(रस्ता)-(मंदिर रस्ता कडधे)",
      temp_old_site_name_in_english: "Mandir rasta Kadadhe",
      temp_old_site_name_in_marathi: "मंदिर रस्ता कडधे",
      created_at: "2021-09-16T12:44:54.000Z",
      updated_at: "2021-09-16T12:44:54.000Z",
    },
    {
      id: 3,
      name_marathi: "खंडोबा मंदिर पटांगण कडधे",
      name_english: "Khandoba Temple Ground Kadadhe",
      owner: "NGO (संस्था)",
      land_type: "Temple (मंदिर, मस्जिद)",
      land_strata: "Soil (माती)",
      district: "Pune (पुणे)",
      taluka: "Khed (खेड)",
      village: "Kadadhe (कडधे)",
      area_acres: null,
      length_km: null,
      tree_count: null,
      unique_id: "PUB/KADAD/TEMP/0004",
      photo_album: "https://photos.app.goo.gl/jjSj9Q2AnKM6GFuUA",
      consent_letter: "14T - ग्राम पंचायत पत्र",
      grove_type: "Sacred grove",
      map_to: "#N/A",
      notion_db_pictures: "Combined record for Kadadhe in dB Pictures",
      split_village_name_1: "Kadadhe",
      split_village_name_2: null,
      create_id: "PUB/KADAD/TEMP/0004",
      site_key: "(कडधे)-(मंदिर, मस्जिद)-(खंडोबा मंदिर पटांगण कडधे)",
      site_key_2: "(कडधे)-(मंदिर, मस्जिद)",
      temp_backup_copy_of_old_site_name_english_marathi:
        "Khandoba Mandir Patangan Kadadhe(खंडोबा मंदिर पटांगण कडधे) ",
      temp_copy_of_old_site_key:
        "(कडधे)-(मंदिर, मस्जिद)-(खंडोबा मंदिर पटांगण कडधे)",
      temp_old_site_name_in_english: "Khandoba Mandir Patangan Kadadhe",
      temp_old_site_name_in_marathi: "खंडोबा मंदिर पटांगण कडधे",
      created_at: "2021-09-16T12:50:48.000Z",
      updated_at: "2021-09-16T12:50:48.000Z",
    },
    {
      id: 4,
      name_marathi: "कान्हेवाडी स्मशानभूमी रस्ता",
      name_english: "Kanhewadi Smashanbhumi Road",
      owner: "Gram Panchayat (ग्राम पंचायत)",
      land_type: "Roadside (रस्ता)",
      land_strata: "Roadside (रस्ता काठ)",
      district: "Pune (पुणे)",
      taluka: "Khed (खेड)",
      village: "Kanhewadi (कान्हेवाडी)",
      area_acres: null,
      length_km: null,
      tree_count: null,
      unique_id: "PUB/KANHE/ROAD/0005",
      photo_album: "https://photos.app.goo.gl/nTzaixgWPihSSkLg9",
      consent_letter: "14T - ग्राम पंचायत पत्र",
      grove_type: "14 T - Roadside",
      map_to: "#N/A",
      notion_db_pictures: "Combined record for Kanhevadi in dB Pictures",
      split_village_name_1: "Kanhewadi",
      split_village_name_2: null,
      create_id: "PUB/KANHE/ROAD/0005",
      site_key: "(कान्हेवाडी)-(रस्ता)-(कान्हेवाडी स्मशानभूमी रस्ता)",
      site_key_2: "(कान्हेवाडी)-(रस्ता)",
      temp_backup_copy_of_old_site_name_english_marathi:
        "Kanhevadi Smashanbhumi Rasta(कान्हेवाडी स्मशानभूमी रस्ता) ",
      temp_copy_of_old_site_key:
        "(कान्हेवाडी)-(श्मशान भूमी, कब्रिस्तान)-(कान्हेवाडी स्मशानभूमी रस्ता)",
      temp_old_site_name_in_english: "Kanhevadi Smashanbhumi Rasta",
      temp_old_site_name_in_marathi: "कान्हेवाडी स्मशानभूमी रस्ता",
      created_at: "2021-09-16T12:52:17.000Z",
      updated_at: "2021-09-16T12:52:17.000Z",
    },
    {
      id: 5,
      name_marathi: "कान्हेवाडी सहाणेवस्ती रस्ता",
      name_english: "Kanhewadi Sahanevasti Road",
      owner: "Gram Panchayat (ग्राम पंचायत)",
      land_type: "Roadside (रस्ता)",
      land_strata: "Roadside (रस्ता काठ)",
      district: "Pune (पुणे)",
      taluka: "Khed (खेड)",
      village: "Kanhewadi (कान्हेवाडी)",
      area_acres: null,
      length_km: "0.415",
      tree_count: null,
      unique_id: "PUB/KANHE/ROAD/0006",
      photo_album: "https://photos.app.goo.gl/nTzaixgWPihSSkLg9",
      consent_letter: "14T - ग्राम पंचायत पत्र",
      grove_type: "14 T - Roadside",
      map_to: "#N/A",
      notion_db_pictures: "Combined record for Kanhevadi in dB Pictures",
      split_village_name_1: "Kanhewadi",
      split_village_name_2: null,
      create_id: "PUB/KANHE/ROAD/0006",
      site_key: "(कान्हेवाडी)-(रस्ता)-(कान्हेवाडी सहाणेवस्ती रस्ता)",
      site_key_2: "(कान्हेवाडी)-(रस्ता)",
      temp_backup_copy_of_old_site_name_english_marathi:
        "Kanhevadi Sahanevasti Rasta(कान्हेवाडी सहाणेवस्ती रस्ता) ",
      temp_copy_of_old_site_key:
        "(कान्हेवाडी)-(रस्ता)-(कान्हेवाडी सहाणेवस्ती रस्ता)",
      temp_old_site_name_in_english: "Kanhevadi Sahanevasti Rasta",
      temp_old_site_name_in_marathi: "कान्हेवाडी सहाणेवस्ती रस्ता",
      created_at: "2021-09-16T12:55:10.000Z",
      updated_at: "2021-09-16T12:55:10.000Z",
    },
  ];

  const handleDeleteSites = (row: any) => {
    // console.log("Delete", row);
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <>
      <Box sx={{ height: 540, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          //   getRowId={(row) => row._id}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          onPageChange={(page) => {
            if (data.length < (page + 1) * 10) setPage(page);
          }}
          //   rowCount={data}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: LoadingOverlay,
          }}
        />
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete {selectedItem?.name_english}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...", selectedItem);
              // if (selectedItem !== null) {
              //   deleteTreeType(selectedItem);
              // }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <EditSites
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
