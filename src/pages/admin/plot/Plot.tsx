import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import AddPlot from "./AddPlot";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Plot } from "../../../types/plot";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
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
import EditPlot from "./EditPlot";

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


export const PlotComponent = () => {
  const dispatch = useAppDispatch();
  const { getPlots, createPlot, updatePlot, deletePlot } = bindActionCreators(
    plotActionCreators,
    dispatch
  );

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Plot | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);

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
          <Button
            onClick={() => {
              setSelectedEditRow(params.row);
              setEditModal(true);
            }}>
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDelete(params.row as Plot)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    // {
    //   field: "_id",
    //   headerName: "ID",
    //   width: 90,
    //   align: "center",
    //   editable: true,
    //   headerAlign: "center",
    // },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "plot_id",
      headerName: "Plot ID",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "district",
      headerName: "District",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "gat",
      headerName: "Gat",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "land_type",
      headerName: "Land Type",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "taluka",
      headerName: "Taluka",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "village",
      headerName: "Village",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "zone",
      headerName: "Zone",
      width: 150,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "__v",
      headerName: "Version",
      width: 90,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "boundaries.type",
      headerName: "Boundaries Type",
      width: 250,
      align: "center",
      editable: true,
      headerAlign: "center",
      valueGetter: (params) => JSON.stringify(params.row.boundaries.type),
    },
    {
      field: "boundaries.coordinates",
      headerName: "Boundaries Coordinates",
      width: 250,
      align: "center",
      editable: true,
      headerAlign: "center",
      valueGetter: (params) =>
        JSON.stringify(params.row.boundaries.coordinates),
    },
    {
      field: "center.type",
      headerName: "Center Type",
      width: 250,
      align: "center",
      editable: true,
      headerAlign: "center",
      valueGetter: (params) => JSON.stringify(params.row.center.type),
    },
    {
      field: "center.coordinates",
      headerName: "Center Coordinates",
      width: 250,
      align: "center",
      editable: true,
      headerAlign: "center",
      valueGetter: (params) => JSON.stringify(params.row.center.coordinates),
    },
  ];

  useEffect(() => {
    getPlotData();
  }, [page]);

  const getPlotData = async () => {
    setTimeout(async () => {
      await getPlots(page*10, 10);
    }, 1000);
  };

  let plotsList: Plot[] = [];
  const plotsData = useAppSelector((state: RootState) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots);
  }

  type RowType = {
    id: string;
    name: string;
  };

  const handleDelete = (row: Plot) => {
    console.log("Delete", row);
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Plot) => {
    console.log(formData);
    updatePlot(formData);
  };

  const handleCreatePlotData = (formData: Plot) => {
    console.log(formData);
    createPlot(formData);
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
          Add Plot
        </Button>
        <AddPlot
          open={open}
          handleClose={handleModalClose}
          createPlot={handleCreatePlotData}
        />
        {/* <Button
          variant="contained"
          style={{ marginLeft: "10px", backgroundColor:'blue' }}
          onClick={handleModalOpen}>
          Bulk Create
        </Button> */}
      </div>
      <Box sx={{ height: 540, width: "100%" }}>
        <DataGrid
          rows={plotsList}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          onPageChange={(page) => { if((plotsList.length / 10) === page) setPage(page); }}
          rowCount={plotsData.totalPlots}
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
            Do you want to delete "{selectedItem?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...");
              if (selectedItem !== null) {
                deletePlot(selectedItem);
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
        <EditPlot
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
