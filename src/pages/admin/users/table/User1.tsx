import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
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
import EditUser from "./EditUser";
import AddBulkUser from "./AddBulkUser";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import type { TableColumnsType } from 'antd';
import getColumnSearchProps from "../../../../components/Filter";
import { getFormattedDate } from "../../../../helpers/utils";
import TableComponent from "../../../../components/Table";

export const User1 = () => {
  const dispatch = useAppDispatch();
  const { getUsers,searchUsers, createUser, createBulkUsers, updateUser, deleteUser } =
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
      await getUsers(page*10, 10, filtersData);
    }, 1000);
  };

  const antdColumns: TableColumnsType<User> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 150,
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      align: "center",
      width: 200,
      ...getColumnSearchProps('email', filters, handleSetFilters)
    },
    {
      dataIndex: "birth_date",
      key: "birth_date",
      title: "Date of Birth",
      align: "center",
      width: 100,
      render: getFormattedDate,
      ...getColumnSearchProps('birth_date', filters, handleSetFilters)
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      align: "center",
      width: 100,
      render: (value: string) => { 
        if (!value || value === "0") return "-";
        if (value.endsWith('.0')) return value.slice(0, -2);
        else return value;
      },
      ...getColumnSearchProps('phone', filters, handleSetFilters)
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
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
            onClick={() => {
              window.open("https://dashboard.14trees.org/ww/" + record.email);
            }}
          >
            <AccountCircleRoundedIcon />
          </Button>
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
        </div>
      ),
    },  
  ];

  let usersList: User[] = [];
  const usersData = useAppSelector((state: RootState) => state.usersData);
  if (usersData) {
    usersList = Object.values(usersData.users);
  }
  console.log(usersData)

  const getAllUsersData = async () => {
    setTimeout(async () => {
      let filtersData = Object.values(filters);
      await getUsers(0, usersData.totalUsers, filtersData);
    }, 1000);
};

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

      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={usersList}
          columns={antdColumns}
          totalRecords={usersData.totalUsers}
          fetchAllData={getAllUsersData}
          setPage={setPage}
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
