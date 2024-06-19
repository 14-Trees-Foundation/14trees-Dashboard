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
import AddOrganization from "./AddOrganization";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Group } from "../../../types/Group";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditOrganization from "./EditOrganization";
import { getFormattedDate } from "../../../helpers/utils";
import { TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";

export const OrganizationComponent = () => {
  const dispatch = useAppDispatch();
  const {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  } = bindActionCreators(groupActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Group | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Group | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getGroupsData();
  }, [page]);

  const getGroupsData = async () => {
    setTimeout(async () => {
      await getGroups(page*10, 10);
    }, 1000);
  };

  const columns: TableColumnsType<Group> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 250,
      align: 'center',
    },
    {
      dataIndex: "type",
      key: "type",
      title: "Type",
      width: 150,
      align: 'center',
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 450,
      align: 'center',
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
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
            color="error"
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => handleDelete(record)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  let groupList: Group[] = [];
  const groupsData = useAppSelector(
    (state: RootState) => state.groupsData
  );
  if (groupsData) {
    groupList = Object.values(groupsData.groups);
  }

  const getAllGroupsData = async () => {
    setTimeout(async () => {
      await getGroups(0, groupsData.totalGroups);
    }, 1000);
  };

  const handleDelete = (row: Group) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Group) => {
    updateGroup(formData);
    setSelectedEditRow(null);
  };

  const handleCreateUserData = (formData: Group) => {
    createGroup(formData);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button variant="contained" style={{ backgroundColor:'blue' }} onClick={() => setOpen(true)}>
          Add Organization
        </Button>
        <AddOrganization
          open={open}
          handleClose={() => setOpen(false)}
          createOrganization={handleCreateUserData}
        />
      </div>
      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={groupList}
          columns={columns}
          totalRecords={groupsData.totalGroups}
          fetchAllData={getAllGroupsData}
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
                deleteGroup(selectedItem);
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
          handleClose={() => { setEditModal(false); setSelectedEditRow(null); }}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
