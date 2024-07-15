import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import GroupAdd from '@mui/icons-material/GroupAdd';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
 
  GridFilterItem,
} from "@mui/x-data-grid";
import { TableColumnsType } from "antd";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";

//import components
import AddVisit from "./AddVisit";
import EditVisit from "./EditVisit";
import { VisitUsers } from "./VisitUser";
import getColumnSearchProps from "../../../components/Filter";
import TableComponent from "../../../components/Table";

//import types
import { Visit } from "../../../types/visits";

//import actions
import * as visitActionCreators from "../../../redux/actions/visitActions";
import * as visitUserActionCreators from "../../../redux/actions/visitUserActions";

//import state
import { RootState } from "../../../redux/store/store";


export const VisitsComponent = () => {
  const dispatch = useAppDispatch();
  const { getVisits, createVisit, updateVisit, deleteVisit } = bindActionCreators(
    visitActionCreators,
    dispatch
  );

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [selectedVisit , setSelectedVisit] = useState<Visit>({} as Visit);
  const [bulkCreate, setBulkCreate] = useState(false);
  const [file, setFile] = useState(null);



  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    getVisitData();
  }, [page, filters]);

  const getVisitData = async () => {
    
    let filtersData = Object.values(filters);
   
    setTimeout( async() => {
     await getVisits(page * 10, 10, filtersData);
    }, 1000);
  };

  const {
    createVisitUsersBulk
  } = bindActionCreators(visitUserActionCreators, dispatch);


  let visitsList: Visit[] = [];
  const visitsData = useAppSelector((state: RootState) => state.visitsData);
  console.log("Visit data in state: ", visitsData);
  if (visitsData) {
    visitsList = Object.values(visitsData.visits);
    
    visitsList = visitsList.sort((a, b) => b.id - a.id);
  }


  const getAllVisitsData = async () => {
    let filtersData = Object.values(filters);
    
    setTimeout( async() => {
     await getVisits(0, visitsData.totalVisits, filtersData);
    }, 1000);
  };

  const handleDeleteVisit = (row: Visit) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Visit) => {
    updateVisit(formData);
    setSelectedEditRow(null);
  };

  const handleCreateVisitData = (formData: Visit) => {
    createVisit(formData);
  };

  const columns: TableColumnsType<Visit>=[
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 180,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            color="success"
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setSelectedItem(record);
              setBulkCreate(true);
            }}>
            <GroupAdd />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setEditModal(true);
              setSelectedEditRow(record);
              
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => handleDeleteVisit(record)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },

    {
      dataIndex: "visit_name",
      key: "visit_name",
      title: "Visit Name",
      width: 220,
      align: "center",
      render: (value, record, index) => (
        <Button
          onClick={() => setSelectedVisit(record)}
          sx={{ textTransform: 'none', color: 'inherit' }} 
          fullWidth
          variant="text"
        >
          {value}
        </Button>),
      ...getColumnSearchProps("visit_name", filters, handleSetFilters),
    },

    {
      dataIndex: "visit_date",
      key: "visit_date",
      title: "Visit Date",
      width: 220,
      align: "center",
      ...getColumnSearchProps("visit_date", filters, handleSetFilters),
    },
  ]

  const handleBulkCreateVisitUserMapping = (e: any) => {
    e.preventDefault();
    setBulkCreate(false);
    if (file && selectedItem) {
      setTimeout(async () => {
        await createVisitUsersBulk(selectedItem.id, file);
      }, 1000);
    }
  }


  return (
    <>
    <ToastContainer />
    <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" color="success" onClick={handleModalOpen}>
          Add Visit
        </Button>
        <AddVisit
          open={open}
          handleClose={handleModalClose}
          createVisit={handleCreateVisitData}
        />
   
      </div>
      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={visitsList}
          columns={columns}
          totalRecords={visitsData.totalVisits}
          fetchAllData={getAllVisitsData}
          setPage={setPage}
        />
      </Box>
     <VisitUsers selectedVisit={selectedVisit}/>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete '{selectedItem?.visit_name}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteVisit(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <EditVisit
          row={selectedEditRow}
          openeditModal={editModal}
          closeEditModal={() => {
            setEditModal(false);
            setSelectedEditRow(null);
          }}
          editSubmit={handleEditSubmit}
        />
      )}

    <Dialog open={bulkCreate} onClose={() => setBulkCreate(false)}>
        <DialogTitle>Create visit-user Mapping for '{selectedItem?.visit_name}'</DialogTitle>
        <form onSubmit={handleBulkCreateVisitUserMapping}>
          <DialogContent>
            <TextField
              type="file"
              inputProps={{ accept: '.csv' }}
              onChange={(e: any) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <Button onClick={() => setBulkCreate(false)} variant="outlined" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success">
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )


}