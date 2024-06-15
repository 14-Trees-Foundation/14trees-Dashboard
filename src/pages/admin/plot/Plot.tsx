import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {GridColumns, GridFilterItem } from "@mui/x-data-grid";
import AddPlot from "./AddPlot";
import { Forms } from "../Forms/Forms"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Plot } from "../../../types/plot";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditPlot from "./EditPlot";
import { TableColumnsType } from "antd";
import getColumnSearchProps from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import { ToastContainer } from "react-toastify";


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
  const [selectedEditRow, setSelectedEditRow] = useState<Plot | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  const columns: TableColumnsType<Plot> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 150,
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
            onClick={() => {
              setSelectedEditRow(record);
              setEditModal(true);
            }}>
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => handleDelete(record)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 300,
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "plot_id",
      key: "plot_id",
      title: "Plot ID",
      align: "center",
      width: 150,
      ...getColumnSearchProps('plot_id', filters, handleSetFilters)
    },
    {
      dataIndex: "category",
      key: "category",
      title: "Category",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "trees_count",
      key: "trees_count",
      title: "Total Trees",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "mapped_trees_count",
      key: "mapped_trees_count",
      title: "Booked Trees",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "assigned_trees_count",
      key: "assigned_trees_count",
      title: "Assigned Trees",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "available_trees_count",
      key: "available_trees_count",
      title: "Available Trees",
      align: "center",
      width: 150,
    },
    // {
    //   dataIndex: "boundaries.type",
    //   key: "boundaries.type",
    //   title: "Boundaries Type",
    //   width: 200,
    //   render: (value, record, index) => {
    //     if (record.boundaries?.type) {
    //       return record.boundaries.type;
    //     }
    //     return ''
    //   },
    // },
    // {
    //   dataIndex: "center.type",
    //   key: "center.type",
    //   title: "Center Type",
    //   width: 150,
    //   render: (value, record, index) => {
    //     if (record.center?.type) {
    //       return record.center.type;
    //     }
    //     return ''
    //   },
    // },
    // {
    //   dataIndex: "center.coordinates",
    //   key: "center.coordinates",
    //   title: "Center Coordinates",
    //   width: 320,
    //   render: (value, record, index) => {
    //     if (record.center?.coordinates) {
    //       return JSON.stringify(record.center.coordinates);
    //     }
    //     return ''
    //   },
    // },
  ];

  useEffect(() => {
    getPlotData();
  }, [page, filters]);

  const getPlotData = async () => {
    setTimeout(async () => {
      let filtersData = Object.values(filters);
      await getPlots(page * 10, 10, filtersData);
    }, 1000);
  };
  
  let plotsList: Plot[] = [];
  const plotsData = useAppSelector((state: RootState) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots);
  }

  const getAllPlotData = async () => {
    setTimeout(async () => {
      let filtersData = Object.values(filters);
      await getPlots(0, plotsData.totalPlots, filtersData);
    }, 1000);
  };

  const handleDelete = (row: Plot) => {
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
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button variant="contained" style={{ backgroundColor: 'blue' }} onClick={handleModalOpen}>
          Add Plot
        </Button>
        <AddPlot
          open={open}
          handleClose={handleModalClose}
          createPlot={handleCreatePlotData}
        />
      </div>
      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={plotsList}
          columns={columns}
          totalRecords={plotsData.totalPlots}
          fetchAllData={getAllPlotData}
          setPage={setPage}
        />
      </Box>
      <Forms />

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
