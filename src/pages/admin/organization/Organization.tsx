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
  Divider,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddOrganization from "./AddOrganization";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAdd from '@mui/icons-material/GroupAdd';
import ErrorIcon from '@mui/icons-material/Error';
import { Group } from "../../../types/Group";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import * as userGroupActionCreators from "../../../redux/actions/userGroupActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import EditOrganization from "./EditOrganization";
import { TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";
import FailedRecordsList from "./RecordList";
import { OrganizationUsers } from "./OrganizationUsers";
import { organizationTypes } from "./organizationType";
import { GridFilterItem } from "@mui/x-data-grid";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import { ToastContainer } from "react-toastify";

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
  const [selectedOrg, setSelectedOrg] = useState<Group | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Group | null>(null);
  const [failedRecords, setFailedRecords] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bulkCreate, setBulkCreate] = useState(false);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(0);
  const [srNoPage, SetSrNoPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [groupType, setGroupType] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
      setPage(0);
      setFilters(filters);
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (grpType: string) => {
    setAnchorEl(null);
    setGroupType(grpType);
    setOpen(true);
  };

  useEffect(() => {
    getGroupsData();
  }, [page, filters]);

  const getGroupsData = async () => {
    const dataFilters = Object.values(filters).map(item => {
      if (item.columnField === 'type') {
        item.value = (item.value as string[]).map(tp => tp.toString().toLowerCase());
      }
      return item;
    })
    setTimeout(async () => {
      await getGroups(page * 10, 10, dataFilters);
    }, 1000);
  };

  const columns: TableColumnsType<Group> = [
    {
      dataIndex: "srNo",
      key: "srNo",
      title: "Sr. No.",
      width: 100,
      align: 'center',
      render: (value, record, index) => `${index + 1 + srNoPage * 10}.`,
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 250,
      align: 'center',
      render: (value, record, index) => (
        <Button
          onClick={() => setSelectedOrg(record)}
          sx={{ textTransform: 'none', color: 'inherit' }} 
          fullWidth
          variant="text"
        >
          {value}
        </Button>),
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "type",
      key: "type",
      title: "Type",
      width: 150,
      align: 'center',
      render: (value) => value ? value.toString().toUpperCase() : '',
      ...getColumnSelectedItemFilter({dataIndex: 'type', filters, handleSetFilters, options: organizationTypes.map(item => item.label.toUpperCase())})
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
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>

      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>Group People</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button variant="outlined" color="primary" onClick={() => setFailedRecords(true)} disabled={Object.keys(userGroupMapping).length === 0}>
            <Badge badgeContent={Object.keys(userGroupMapping).length} color="error">
              <ErrorIcon />
            </Badge>
          </Button>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            variant="contained"
            color="success"
            style={{ marginLeft: "10px" }}
            onClick={handleClick}
          >
            +ADD
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {organizationTypes.map(({ id, label }) => (
              <MenuItem key={id} onClick={() => handleMenuItemClick(id)}>
                Add {label} Group
              </MenuItem>
            ))}
          </Menu>
          <AddOrganization
            open={open}
            groupType={groupType}
            handleClose={() => setOpen(false)}
            createOrganization={handleCreateUserData}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={groupList}
          columns={columns}
          totalRecords={groupsData.totalGroups}
          fetchAllData={getAllGroupsData}
          setPage={setPage}
          setSrNoPage={SetSrNoPage}
        />
      </Box>
      <Divider style={{ marginBottom: "20px" }} />
      <OrganizationUsers selectedOrg={selectedOrg}/>

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
    </>
  );
};
