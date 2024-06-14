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
import { type TreeType } from "../../../types/plantType";
import * as treeTypeActionCreators from "../../../redux/actions/plantTypeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import AddTreeType from "./AddEvents";
import CircularProgress from "@mui/material/CircularProgress";
import EditEvents from "./EditEvents";

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

export const EventsComponent = () => {
  const dispatch = useAppDispatch();
  const { getTreeTypes, createTreeType, updateTreeType, deleteTreeType } =
    bindActionCreators(treeTypeActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
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
            onClick={() => handleDeleteTreeType(params.row as any)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assigned_by",
      headerName: "Assigned By",
      width: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "site_id",
      headerName: "Site ID",
      width: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "event_location",
      headerName: "Event Location",
      width: 150,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 200,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "memories",
      headerName: "Memories",
      width: 250,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "event_date",
      headerName: "Event Date",
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
      type: "dateTime",
    },
  ];

  const data = [
    {
      "id": 1,
      "assigned_by": 294,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-01-04T22:03:14.000Z"
    },
    {
      "id": 2,
      "assigned_by": 265,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-28T10:12:06.000Z"
    },
    {
      "id": 3,
      "assigned_by": 265,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-28T10:22:02.000Z"
    },
    {
      "id": 4,
      "assigned_by": 336,
      "site_id": null,
      "type": "2",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-04-02T01:56:54.000Z"
    },
    {
      "id": 5,
      "assigned_by": 294,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-18T06:49:39.000Z"
    }
  ];


  type RowType = {
    id: string;
    name: string;
  };

  const handleDeleteTreeType = (row: any) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: any) => {
    updateTreeType(formData);
  };

  const handleCreateEventsData = (formData: any) => {
    console.log(formData);
};

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button
          variant="contained"
          style={{ backgroundColor: "blue" }}
          onClick={handleModalOpen}>
          Add Events
        </Button>
        <AddTreeType
          open={open}
          handleClose={handleModalClose}
          createEvents={handleCreateEventsData}
        />
      </div>

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
        //   rowCount={treeTypesData.totalTreeTypes}
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
            Do you want to delete {selectedItem?.id}?
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
        <EditEvents
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
