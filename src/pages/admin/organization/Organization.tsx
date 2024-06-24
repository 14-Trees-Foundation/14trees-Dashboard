import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddOrganization from "./AddOrganization";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAdd from '@mui/icons-material/GroupAdd';
import ErrorIcon from '@mui/icons-material/Error';
import { BulkUserGroupMappingResponse, Group } from "../../../types/Group";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import * as userGroupActionCreators from "../../../redux/actions/userGroupActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import EditOrganization from "./EditOrganization";
import { TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";
import FailedRecordsList from "./RecordList";

export const OrganizationComponent = () => {
  const dispatch = useAppDispatch();
  const {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  } = bindActionCreators(groupActionCreators, dispatch);
  const {
    bulkCreateUserGroupMapping
  } = bindActionCreators(userGroupActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Group | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Group | null>(null);
  const [failedRecords, setFailedRecords] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bulkCreate, setBulkCreate] = useState(false);
  const [bulkCreateFailed, setBulkCreateFailed] = useState(false);
  const [failedData, setFailedData] = useState<BulkUserGroupMappingResponse | null>(null);
  const [file, setFile] = useState(null);
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
      width: 200,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
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

  const userGroupMapping = useAppSelector((state: RootState) => state.userGroupsData);
  console.log(userGroupMapping);

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

  const handleBulkCreateUserGroupMapping = (e: any) => {
    e.preventDefault();
    setBulkCreate(false);
    if (file && selectedItem) {
      setTimeout(async () => {
        await bulkCreateUserGroupMapping(selectedItem.id, file);
      }, 1000);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button variant="outlined" color="primary" onClick={() => setFailedRecords(true)} disabled={Object.keys(userGroupMapping).length === 0}>
          <Badge badgeContent={Object.keys(userGroupMapping).length} color="error">
            <ErrorIcon/>
          </Badge>
        </Button>
        <Button variant="contained" color="success" style={{ marginLeft: "10px" }} onClick={() => setOpen(true)}>
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

      {failedRecords && (
        <FailedRecordsList
          open={failedRecords}
          handleClose={() => setFailedRecords(false)}
          failedRecords={userGroupMapping}
          groupsMap={groupsData.groups}
        />
      )}

      
      <Dialog open={bulkCreate} onClose={() => setBulkCreate(false)}>
        <DialogTitle>Create user-group Mapping for '{selectedItem?.name}'</DialogTitle>
        <form onSubmit={handleBulkCreateUserGroupMapping}>
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
            <Button onClick={() => setBulkCreate(false)} variant="contained" color="primary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={bulkCreateFailed} onClose={() => setBulkCreateFailed(false)}>
        <DialogTitle>Bulk Create Failed for '{failedData?.failed}' users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to retry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkCreateFailed(false)} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setBulkCreateFailed(false);
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
