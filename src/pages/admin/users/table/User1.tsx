import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns, GridCellParams, GridFilterItem } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddUser from "./AddUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type User } from "../../../../types/user";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditUser from "./EditUser";
import AddBulkUser from "./AddBulkUser";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

import { Table } from 'antd'
import type { TableColumnsType } from 'antd';
import getColumnSearchProps from "../../../../components/Filter";
import { getFormattedDate } from "../../../../helpers/utils";

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

export const User1 = () => {
  const dispatch = useAppDispatch();
  const { searchUsers, createUser, createBulkUsers, updateUser, deleteUser, getUsersByFilters } =
    bindActionCreators(userActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<User | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const handleBulkModalOpen = () => setBulkModalOpen(true);
  const handleBulkModalClose = () => setBulkModalOpen(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getUserData();
  }, [page, filters]);

  const getUserData = async () => {
    let filtersData = Object.values(filters);
    setTimeout(async () => {
      await getUsersByFilters(page*10, 10, filtersData);
    }, 1000);
  };

  const handleClick = (e: GridCellParams<any, any, any>) => {
    if (e.field === "email") {
      window.open("http://localhost:3000/ww/" + e.formattedValue);
    }
  };


  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: User) => ({
        name: record.name,
    }),
  };

  const columns: GridColumns = [
    {
      field: "action",
      headerName: "Actions",
      width: 200,
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
            onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </Button>
          <Button
            onClick={() => {
              window.open("http://localhost:3000/ww/" + params.row.email);
            }}
          >
            <AccountCircleRoundedIcon />
          </Button>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 100,
    },
    
  ];

  const antdColumns: TableColumnsType<User> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 200,
      align: "center",
      render: (value, record, index )=> (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            onClick={() => {
              setSelectedEditRow(record);
              setEditModal(true);
            }}>
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDelete(record)}>
            <DeleteIcon />
          </Button>
          <Button
            onClick={() => {
              window.open("http://localhost:3000/ww/" + record.email);
            }}
          >
            <AccountCircleRoundedIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 150,
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      width: 200,
      ...getColumnSearchProps('email', filters, handleSetFilters)
    },
    {
      dataIndex: "dob",
      key: "dob",
      title: "Date of Birth",
      width: 200,
      render: getFormattedDate,
      ...getColumnSearchProps('dob', filters, handleSetFilters)
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      width: 100,
      ...getColumnSearchProps('phone', filters, handleSetFilters)
    },    
  ];

  let usersList: User[] = [];
  const usersData = useAppSelector((state: RootState) => state.usersData);
  if (usersData) {
    usersList = Object.values(usersData.users);
  }

  const handleDelete = (row: User) => {
    console.log("Delete", row);
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: User) => {
    console.log(formData);
    updateUser(formData);
  };

  const handleCreateUserData = (formData: User) => {
    console.log(formData);
    createUser(formData);
  };

  const handleBulkCreateUserData = (file: Blob) => {
    // If file is not already a Blob
    if (!(file instanceof Blob)) {
      file = new Blob([file], { type: 'text/csv' }); // Change 'text/csv' to the actual file type if different
    }
  
    createBulkUsers(file);
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
          Add User
        </Button>
        <AddUser
          open={open}
          handleClose={handleModalClose}
          createUser={handleCreateUserData}
          searchUser={searchUsers}
        />
        <Button
          variant="contained"
          style={{ marginLeft: "10px", backgroundColor:'blue' }}
          onClick={handleBulkModalOpen}>
          Bulk Create
        </Button>
        <AddBulkUser
          open={bulkModalOpen}
          handleClose={handleBulkModalClose}
          createBulkUsers={handleBulkCreateUserData}
        />
      </div>
      {/* <Box sx={{ height: 540, width: "100%" }}>
        <DataGrid
          rows={usersList}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          onPageChange={(page) => { if((usersList.length / 10) === page) setPage(page); }}
          rowCount={usersData.totalUsers}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: LoadingOverlay,
          }}
        />
      </Box> */}

      <Box sx={{ height: 840, width: "100%" }}>
        <Table
          style={{ borderRadius: 20 }}
          dataSource={usersList}
          columns={antdColumns}
          pagination={{ position: ['bottomRight'], showSizeChanger: false, pageSize: 10, defaultCurrent: 1, total: usersData.totalUsers, simple: true, onChange: (page, pageSize) => { if(page*pageSize > usersList.length) setPage(page-1); } }}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
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
                deleteUser(selectedItem);
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
        <EditUser
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
