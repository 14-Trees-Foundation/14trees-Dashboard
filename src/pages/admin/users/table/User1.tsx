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
  Divider,
  Typography,
  Link,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
import CombineUserForm from "./CombineUserForm";
import { toast } from "react-toastify";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AccountBalance, Forest, Share, MoreVert, Dashboard } from "@mui/icons-material";
import UserForm from "./UserForm";
import GeneralTable from "../../../../components/GenTable";
import PersonalDashboardShareDialog from "../components/PersonalDashboardShareDialog";

export const User1 = () => {
  const dispatch = useAppDispatch();
  const { getUsers, searchUsers, createUser, createBulkUsers, updateUser, deleteUser } =
    bindActionCreators(userActionCreators, dispatch);

  const [loading, setLoading] = useState(false);
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
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [tableRows, setTableRows] = useState<User[]>([]);
  const [userTreeCounts, setUserTreeCounts] = useState<Record<number, {
    mapped_trees: number;
    sponsored_trees: number;
    assigned_trees: number;
    gifted_trees: number;
    received_gift_trees: number;
  }>>({});

  const [userCombineModal, setUserCombineModal] = useState(false);
  const [primaryUser, setPrimaryUser] = useState<User | null>(null);
  const [secondaryUser, setSecondaryUser] = useState<User | null>(null);
  const [deleteSecondary, setDeleteSecondary] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuUser, setSelectedMenuUser] = useState<User | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  let usersList: User[] = [];
  const usersData = useAppSelector((state: RootState) => state.usersData);
  if (usersData) {
    usersList = Object.values(usersData.users);
    usersList = usersList.sort((a, b) => b.id - a.id);
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  }

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getUserData();
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (usersData.loading) return;

      const records: User[] = [];
      const maxLength = Math.min((page + 1) * pageSize, usersData.totalUsers);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(usersData.paginationMapping, i)) {
          const id = usersData.paginationMapping[i];
          const record = usersData.users[id];
          if (record) {
            records.push(record);
          }
        } else {
          getUserData();
          break;
        }
      }

      setTableRows(records);
      
      // Fetch tree counts for the current page users
      if (records.length > 0) {
        fetchTreeCountsForUsers(records);
      }
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [pageSize, page, usersData]);

  const getUserData = async () => {
    let filtersData = Object.values(filters);
    setLoading(true);
    getUsers(page * pageSize, pageSize, filtersData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const fetchTreeCountsForUsers = async (users: User[]) => {
    const apiClient = new ApiClient();
    const counts: Record<number, {
      mapped_trees: number;
      sponsored_trees: number;
      assigned_trees: number;
      gifted_trees: number;
      received_gift_trees: number;
    }> = {};
    
    try {
      await Promise.all(
        users.map(async (user) => {
          try {
            const result = await apiClient.getTreesCountForUser(user.id);
            counts[user.id] = {
              mapped_trees: result?.trees?.mapped_trees || 0,
              sponsored_trees: result?.trees?.sponsored_trees || 0,
              assigned_trees: result?.trees?.assigned_trees || 0,
              gifted_trees: result?.trees?.gifted_trees || 0,
              received_gift_trees: result?.trees?.received_gift_trees || 0,
            };
          } catch (error) {
            console.error(`Failed to fetch tree count for user ${user.id}`, error);
            counts[user.id] = {
              mapped_trees: 0,
              sponsored_trees: 0,
              assigned_trees: 0,
              gifted_trees: 0,
              received_gift_trees: 0,
            };
          }
        })
      );
      setUserTreeCounts(prev => ({ ...prev, ...counts }));
    } catch (error) {
      console.error('Error fetching tree counts:', error);
    }
  };

  const columns: TableColumnsType<User> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 150,
      fixed: 'left',
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      align: "center",
      width: 200,
      fixed: 'left',
      ...getColumnSearchProps('email', filters, handleSetFilters)
    },
    {
      dataIndex: "communication_email",
      key: "communication_email",
      title: "Communication Email",
      align: "center",
      width: 200,
      ...getColumnSearchProps('communication_email', filters, handleSetFilters)
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      align: "center",
      width: 120,
      render: (value: string) => {
        if (!value || value === "0") return "-";
        if (value.endsWith('.0')) return value.slice(0, -2);
        else return value;
      },
      ...getColumnSearchProps('phone', filters, handleSetFilters)
    },
    {
      key: "sponsor_dashboard",
      title: "Sponsor Dashboard",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        const treeCounts = userTreeCounts[record.id];
        const sponsoredCount = treeCounts?.sponsored_trees || 0;
        return (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                window.open("http://" + host + "/dashboard/" + record.id);
              } else {
                window.open("https://" + hostname + "/dashboard/" + record.id);
              }
            }}
            style={{ 
              textDecoration: 'none',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Forest fontSize="small" />
            {sponsoredCount}
          </Link>
        );
      },
    },
    {
      key: "reserved_trees",
      title: "Reserved Trees",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        const treeCounts = userTreeCounts[record.id];
        const mappedCount = treeCounts?.mapped_trees || 0;
        return (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                window.open("http://" + host + "/ww/" + record.email);
              } else {
                window.open("https://" + hostname + "/ww/" + record.email);
              }
            }}
            style={{ 
              textDecoration: 'none',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <AccountBalance fontSize="small" />
            {mappedCount}
          </Link>
        );
      },
    },
    {
      key: "profile_dashboard",
      title: "Profile Dashboard",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        const treeCounts = userTreeCounts[record.id];
        const assignedCount = treeCounts?.assigned_trees || 0;
        return (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                window.open("http://" + host + "/profile/user/" + record.id);
              } else {
                window.open("https://" + hostname + "/profile/user/" + record.id);
              }
            }}
            style={{ 
              textDecoration: 'none',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <AccountCircleRoundedIcon fontSize="small" />
            {assignedCount}
          </Link>
        );
      },
    },
    {
      key: "self_serve_dashboard",
      title: "Self-Serve Portal",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        const treeCounts = userTreeCounts[record.id];
        const totalTrees = (treeCounts?.mapped_trees || 0) + (treeCounts?.sponsored_trees || 0) + (treeCounts?.assigned_trees || 0);
        return (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                window.open("http://" + host + "/personal/dashboard/" + record.id);
              } else {
                window.open("https://" + hostname + "/personal/dashboard/" + record.id);
              }
            }}
            style={{ 
              textDecoration: 'none',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Dashboard fontSize="small" />
            {totalTrees}
          </Link>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: 80,
      align: "center",
      render: (value, record, index) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, record)}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const getAllUsersData = async () => {
    const apiClient = new ApiClient();
    try {
      const usersResp = await apiClient.getUsers(0, -1, Object.values(filters));
      return usersResp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  const handleDelete = (row: User) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: User) => {
    updateUser(formData);
    setSelectedEditRow(null);
    setEditModal(false);
  };

  const handleCreateUserData = (formData: User) => {
    createUser(formData);
  };

  const handleBulkCreateUserData = (file: Blob) => {
    // If file is not already a Blob
    if (!(file instanceof Blob)) {
      file = new Blob([file], { type: 'text/csv' }); // Change 'text/csv' to the actual file type if different
    }

    createBulkUsers(file);
  };

  const handleCancelCombineUser = () => {
    setPrimaryUser(null);
    setSecondaryUser(null);
    setDeleteSecondary(true);
    setUserCombineModal(false);
  }

  const handleCombineUser = async () => {
    if (!primaryUser || !secondaryUser) {
      toast.error("Please select both the users in order to combine them!");
      return;
    }

    try {
      const apiClient = new ApiClient();
      await apiClient.combineUsers(primaryUser.id, secondaryUser.id, deleteSecondary);
    } catch (error: any) {
      toast.error(error.message);
    }

    handleCancelCombineUser();
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    // Don't clear selectedMenuUser here - let individual handlers manage it
  };

  const handleEditFromMenu = () => {
    if (selectedMenuUser) {
      setSelectedEditRow(selectedMenuUser);
      setOpen(true);
    }
    handleMenuClose();
    setSelectedMenuUser(null); // Clear after handling
  };

  const handleDeleteFromMenu = () => {
    if (selectedMenuUser) {
      handleDelete(selectedMenuUser);
    }
    handleMenuClose();
    setSelectedMenuUser(null); // Clear after handling
  };

  const handleShareFromMenu = () => {
    handleMenuClose();
    // Add a small delay to ensure menu closes before dialog opens
    setTimeout(() => {
      setShareDialogOpen(true);
    }, 100);
    // Don't clear selectedMenuUser here - it's needed for the dialog
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>People</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "10px", textTransform: 'none' }}
            onClick={() => { setUserCombineModal(true); }}>
            Combine Users
          </Button>
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "10px", textTransform: 'none' }}
            onClick={handleModalOpen}>
            Add User
          </Button>
          {/* <AddUser
            open={open}
            handleClose={handleModalClose}
            createUser={handleCreateUserData}
            searchUser={searchUsers}
          /> */}
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "10px", textTransform: 'none' }}
            onClick={handleBulkModalOpen}>
            Bulk Add
          </Button>
          <AddBulkUser
            open={bulkModalOpen}
            handleClose={handleBulkModalClose}
            createBulkUsers={handleBulkCreateUserData}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ height: 840, width: "100%" }}>
        <GeneralTable
          loading={usersData.loading}
          rows={tableRows}
          columns={columns}
          totalRecords={usersData.totalUsers}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDownload={getAllUsersData}
          footer
          tableName="Users"
          scroll={{ x: 1200 }}
        />
      </Box >

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete {selectedItem?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} color="error">
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
            variant="contained"
            color="success"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={userCombineModal} maxWidth="md">
        <DialogTitle>Merge users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <CombineUserForm
              primaryUser={primaryUser}
              secondaryUser={secondaryUser}
              deleteSecondary={deleteSecondary}
              onPrimaryUserChange={user => { setPrimaryUser(user); }}
              onSecondaryUserChange={user => { setSecondaryUser(user); }}
              onDeleteSecondaryChange={value => { setDeleteSecondary(value); }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelCombineUser} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleCombineUser}
            variant="contained"
            color="success"
          >
            Merge
          </Button>
        </DialogActions>
      </Dialog>

      {
        selectedEditRow && (
          <EditUser
            row={selectedEditRow}
            openeditModal={editModal}
            onClose={() => {
              setEditModal(false);
              setSelectedEditRow(null);
            }}
            editSubmit={handleEditSubmit}
          />
        )
      }

      <UserForm
        user={selectedEditRow}
        open={open}
        onClose={() => {
          setSelectedEditRow(null);
          setOpen(false);
        }}
      />

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => {
          handleMenuClose();
          // Clear selectedMenuUser only if share dialog is not open
          if (!shareDialogOpen) {
            setSelectedMenuUser(null);
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditFromMenu}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteFromMenu}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareFromMenu}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Self-Serve Portal</ListItemText>
        </MenuItem>
      </Menu>

      {selectedMenuUser && (
        <PersonalDashboardShareDialog 
          user={selectedMenuUser}
          open={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setSelectedMenuUser(null);
          }}
          onUsersAdded={() => {
            toast.success(`Personal dashboard access updated for ${selectedMenuUser.name}`);
            setShareDialogOpen(false);
            setSelectedMenuUser(null);
          }}
        />
      )}
    </>
  );
};
