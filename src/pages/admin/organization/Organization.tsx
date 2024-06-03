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
} from "@mui/material";
import AddOrganization from "./AddOrganization";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Organization } from "../../../types/organization";
import * as organizationActionCreators from "../../../redux/actions/organizationActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditOrganization from "./EditOrganization";
import { getFormattedDate } from "../../../helpers/utils";

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

export const OrganizationComponent = () => {
  const dispatch = useAppDispatch();
  const {
    getOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = bindActionCreators(organizationActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Organization | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getOrganizationsData();
  }, [page]);

  const getOrganizationsData = async () => {
    setTimeout(async () => {
      await getOrganizations(page*10, 10);
    }, 1000);
  };

  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      align: 'center',
      headerAlign: "center",
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: 250,
      align: 'center',
      headerAlign: "center",
      editable: true,
    },
    {
      field: "desc",
      headerName: "Description",
      width: 300,
      align: 'center',
      headerAlign: "center",
      editable: true,
    },
    {
      field: "date_added",
      headerName: "Date Added",
      width: 200,
      align: 'center',
      headerAlign: "center",
      editable: true,
      valueGetter: (params) => getFormattedDate(params.row.date_added)
    },
    // {
    //   field: "__v",
    //   headerName: "Version",
    //   width: 100,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "action",
      headerName: "Action",
      width: 250,
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
            onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  let organizationList: Organization[] = [];
  const organizationsData = useAppSelector(
    (state: RootState) => state.organizationsData
  );
  if (organizationsData) {
    organizationList = Object.values(organizationsData.organizations);
  }
  console.log(organizationList);

  type RowType = {
    id: string;
    name: string;
  };

  const handleDelete = (row: Organization) => {
    console.log("Delete", row);
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Organization) => {
    console.log(formData);
    updateOrganization(formData);
  };

  const handleCreateUserData = (formData: Organization) => {
    console.log(formData);
    createOrganization(formData);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button variant="contained" style={{ backgroundColor:'blue' }} onClick={handleModalOpen}>
          Add Organization
        </Button>
        <AddOrganization
          open={open}
          handleClose={handleModalClose}
          createOrganization={handleCreateUserData}
        />
      </div>
      <Box sx={{ height: 540, width: "100%" }}>
        <DataGrid
          rows={organizationList}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          onPageChange={(page) => { if((organizationList.length / 10) === page) setPage(page); }}
          rowCount={organizationsData.totalOrganizations}
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
            Do you want to delete {selectedItem?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...", selectedItem);
              if (selectedItem !== null) {
                deleteOrganization(selectedItem);
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
        <EditOrganization
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
