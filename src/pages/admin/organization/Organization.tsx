import React, { useEffect, useState, useMemo } from "react";
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
  Typography,
} from "@mui/material";
import AddOrganization from "./AddOrganization";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from '@mui/icons-material/Group';
import ErrorIcon from '@mui/icons-material/Error';
import { Group } from "../../../types/Group";
import * as groupActionCreators from "../../../redux/actions/groupActions";
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
import { toast, ToastContainer } from "react-toastify";
import { AccountBalance } from "@mui/icons-material";
import ApiClient from "../../../api/apiClient/apiClient";
import CombineGroupForm from "./CombineGroupForm";
import { LoadingButton } from "@mui/lab";
import { Order } from "../../../types/common";
import { getSortIcon } from "../../../components/Filter";

export const OrganizationComponent = () => {
  const dispatch = useAppDispatch();
  const {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  } = bindActionCreators(groupActionCreators, dispatch);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Group | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Group | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Group | null>(null);
  const [failedRecords, setFailedRecords] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [srNoPage, SetSrNoPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [groupType, setGroupType] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);

  const [groupCombineModal, setGroupCombineModal] = useState(false);
  const [primaryGroup, setPrimaryGroup] = useState<Group | null>(null);
  const [secondaryGroup, setSecondaryGroup] = useState<Group | null>(null);
  const [deleteSecondary, setDeleteSecondary] = useState(true);
  const [merging, setMerging] = useState(false);

  const groupsData = useAppSelector((state: RootState) => state.groupsData);
  const groupList: Group[] = groupsData?.paginationMapping
  ? Object.entries(groupsData.paginationMapping)
      .sort(([indexA], [indexB]) => Number(indexA) - Number(indexB)) 
      .map(([_, id]) => groupsData.groups[id])
  : [];

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

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

  const handleSortingChange = (param: { field: string; order?: 'ASC' | 'DESC' }) => {
    if (!param.order) {
      setOrderBy(orderBy.filter(item => item.column !== param.field));
      return;
    }
    const newOrderBy = orderBy.filter(item => item.column !== param.field);
    newOrderBy.push({ column: param.field, order: param.order });
    setOrderBy(newOrderBy);
  };

  const getSortableHeader = (header: string, key: string) => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
        {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
      </div>
    );
  };

  useEffect(() => {
    getGroupsData();
  }, [pageSize, page, filters, orderBy]);

  const getGroupsData = async () => {
    const dataFilters = Object.values(filters).map(item => {
      if (item.columnField === 'type') {
        item.value = (item.value as string[]).map(tp => tp.toString().toLowerCase());
      }
      return item;
    });

    setLoading(true);
    setTimeout(async () => {
      getGroups(page * pageSize, pageSize, dataFilters, orderBy);
      setLoading(false);
    }, 10);
  };

  const columns: TableColumnsType<Group> = [
    {
      dataIndex: "srNo",
      key: "srNo",
      title: "Sr. No.",
      width: 100,
      align: 'center',
      render: (value, record, index) => `${index + 1 + srNoPage * pageSize}.`,
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 250,
      align: 'center',
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "type",
      key: "type",
      title: "Type",
      width: 150,
      align: 'center',
      render: (value) => value ? value.toString().toUpperCase() : '',
      ...getColumnSelectedItemFilter({ dataIndex: 'type', filters, handleSetFilters, options: organizationTypes.map(item => item.label.toUpperCase()) })
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 450,
      align: 'center',
    },
    {
      dataIndex: "sponsored_trees",
      key: "sponsored_trees",
      title: getSortableHeader("Sponsored Trees", "sponsored_trees"),
      width: 150,
      align: 'center',
      render: (value) => value || '0',
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 300,
      align: "center",
      render: (value, record, index) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="success"
            style={{ margin: "0 5px" }}
            onClick={() => {
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                window.open("http://" + host + "/ww/group/" + record.id);
              } else {
                window.open("https://" + hostname + "/ww/group/" + record.id);
              }
            }}
          >
            <AccountBalance />
          </Button>
          <Button
            color="success"
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => { setSelectedOrg(record); }}
          >
            <GroupIcon />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => { setSelectedEditRow(record); setEditModal(true); }}
          >
            <EditIcon />
          </Button>
          <Button
            color="error"
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => handleDelete(record)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  const userGroupMapping = useAppSelector((state: RootState) => state.userGroupsData);
  const data = Object.entries(userGroupMapping).filter(([key, value]) => value.failed !== 0);
  const filteredUserGroupMapping = Object.fromEntries(data);

  const getAllGroupsData = async () => {
    getGroups(0, groupsData.totalGroups);
  };

  const handleDelete = (row: Group) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Group, logo?: File) => {
    updateGroup(formData, logo);
    setSelectedEditRow(null);
  };

  const handleCreateUserData = (formData: Group, logo?: File) => {
    createGroup(formData, logo);
  };

  const handleCancelCombineGroup = () => {
    setPrimaryGroup(null);
    setSecondaryGroup(null);
    setDeleteSecondary(true);
    setGroupCombineModal(false);
  };

  const handleCombineGroup = async () => {
    if (!primaryGroup || !secondaryGroup) {
      toast.error("Please select both the users in order to combine them!");
      return;
    }

    setMerging(true);
    try {
      const apiClient = new ApiClient();
      await apiClient.mergeGroups(primaryGroup.id, secondaryGroup.id, deleteSecondary);
    } catch(error: any) {
      toast.error(error.message);
    }
    setMerging(false);
    handleCancelCombineGroup();
  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}></div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px" }}>
        <Typography variant="h4" style={{ marginTop: '5px' }}>Group People</Typography>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px", marginTop: "5px" }}>
          <Button 
            style={{ marginLeft: "10px" }} 
            variant="outlined" 
            color="primary" 
            onClick={() => setFailedRecords(true)} 
            disabled={Object.keys(filteredUserGroupMapping).length === 0}
          >
            <Badge badgeContent={Object.keys(filteredUserGroupMapping).length} color="error">
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
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "10px", textTransform: 'none' }}
            onClick={() => { setGroupCombineModal(true); }}
          >
            Merge Groups
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
          loading={loading}
          dataSource={groupList}
          columns={columns}
          totalRecords={groupsData.totalGroups}
          fetchAllData={getAllGroupsData}
          setPage={setPage}
          setPageSize={setPageSize}
          setSrNoPage={SetSrNoPage}
          tableName="Groups"
        />
      </Box>
      <Divider style={{ marginBottom: "20px" }} />
      {selectedOrg && <OrganizationUsers selectedOrg={selectedOrg} />}

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to delete {selectedItem?.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteGroup(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="success"
            variant="contained"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={groupCombineModal} maxWidth="md">
        <DialogTitle>Merge groups</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <CombineGroupForm
              primaryGroup={primaryGroup}
              secondaryGroup={secondaryGroup}
              deleteSecondary={deleteSecondary}
              onPrimaryGroupChange={group => { setPrimaryGroup(group); }}
              onSecondaryGroupChange={group => { setSecondaryGroup(group); }}
              onDeleteSecondaryChange={value => { setDeleteSecondary(value); }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelCombineGroup} color="error">
            Cancel
          </Button>
          <LoadingButton
            loading={merging}
            onClick={handleCombineGroup}
            variant="contained"
            color="success"
          >
            Merge
          </LoadingButton>
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
          failedRecords={filteredUserGroupMapping}
          groupsMap={groupsData.groups}
        />
      )}
    </>
  );
};