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
import { UserRoles } from "../../../../types/common";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import EditUser from "./EditUser";
import AddBulkUser from "./AddBulkUser";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import type { TableColumnsType } from 'antd';
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter";
import { getFormattedDate } from "../../../../helpers/utils";
import TableComponent from "../../../../components/Table";
import CombineUserForm from "./CombineUserForm";
import { toast } from "react-toastify";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AccountBalance, Forest, Share, MoreVert, Dashboard, AdminPanelSettings, PersonRemove, Person, PhoneAndroid } from "@mui/icons-material";
import UserForm from "./UserForm";
import GeneralTable from "../../../../components/GenTable";
import PersonalDashboardShareDialog from "../components/PersonalDashboardShareDialog";
import { useTranslation } from "react-i18next";

export const User1 = () => {
  const { t } = useTranslation();
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
  const [mobileAccessDialogOpen, setMobileAccessDialogOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [selectedMobileRole, setSelectedMobileRole] = useState<'admin' | 'treelogging'>('treelogging');

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
      title: t('common.tableHeaders.name'),
      align: "center",
      width: 150,
      fixed: 'left',
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "email",
      key: "email",
      title: t('common.tableHeaders.email'),
      align: "center",
      width: 200,
      fixed: 'left',
      ...getColumnSearchProps('email', filters, handleSetFilters)
    },
    {
      dataIndex: "communication_email",
      key: "communication_email",
      title: t('people.tableHeaders.communicationEmail'),
      align: "center",
      width: 200,
      ...getColumnSearchProps('communication_email', filters, handleSetFilters)
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: t('common.tableHeaders.phone'),
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
      dataIndex: "created_at",
      key: "created_at",
      title: t('people.tableHeaders.createdDate'),
      align: "center",
      width: 150,
      render: getFormattedDate,
      exportValue: (value: string | Date) => {
        if (!value) return 'N/A';
        try {
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${month}-${day}-${year}`;
        } catch (e) {
          return 'Invalid Date';
        }
      }
    },
    {
      key: "sponsor_dashboard",
      title: t('people.tableHeaders.sponsorDashboard'),
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
      title: t('people.tableHeaders.reservedTrees'),
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
      title: t('people.tableHeaders.profileDashboard'),
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
      title: t('people.tableHeaders.selfServePortal'),
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
      dataIndex: "roles",
      key: "roles",
      title: t('people.tableHeaders.dashboardRoles'),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        const roles = record.roles || [];
        const isAdmin = roles.includes('admin');
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {roles.length === 0 ? (
              <span style={{ color: '#666', fontSize: '12px' }}>No roles</span>
            ) : (
              roles.map((role, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: role === 'admin' ? '#ff5722' : role === 'treelogging' ? '#2196f3' : '#4caf50',
                    color: 'white',
                    textAlign: 'center',
                    textTransform: 'capitalize'
                  }}
                >
                  {role}
                </span>
              ))
            )}
          </div>
        );
      },
      exportValue: (value: string[]) => {
        if (!value || !Array.isArray(value) || value.length === 0) return 'No roles';
        return value.join(', ');
      },
      ...getColumnSelectedItemFilter({
        dataIndex: 'roles',
        filters,
        handleSetFilters,
        options: Object.values(UserRoles)
      })
    },
    {
      dataIndex: "pin",
      key: "mobile_access",
      title: t('people.tableHeaders.mobileRoles'),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        const hasAccess = hasMobileAccess(record);
        const roles = record.roles || [];
        const mobileRoles = roles.filter(role => role === 'admin' || role === 'treelogging');
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PhoneAndroid 
                fontSize="small" 
                style={{ 
                  color: hasAccess ? '#4caf50' : '#ccc' 
                }} 
              />
              <span style={{ 
                fontSize: '12px',
                color: hasAccess ? '#4caf50' : '#666',
                fontWeight: hasAccess ? 'bold' : 'normal'
              }}>
                {hasAccess ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {hasAccess && mobileRoles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {mobileRoles.map((role, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: role === 'admin' ? '#ff5722' : '#2196f3',
                      color: 'white',
                      textAlign: 'center',
                      textTransform: 'capitalize'
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      },
      ...getColumnSelectedItemFilter({
        dataIndex: 'roles',
        filters,
        handleSetFilters,
        options: [UserRoles.Admin, UserRoles.TreeLogger]
      })
    },
    {
      key: "actions",
      title: t('common.tableHeaders.actions'),
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

  const handleGrantAdminRole = async () => {
    if (!selectedMenuUser) return;
    
    try {
      const apiClient = new ApiClient();
      const result = await apiClient.grantAdminRole(selectedMenuUser.id);
      toast.success(result.message);
      
      // Refresh the user data to show updated roles
      getUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
    
    handleMenuClose();
    setSelectedMenuUser(null);
  };

  const handleRevokeAdminRole = async () => {
    if (!selectedMenuUser) return;
    
    try {
      const apiClient = new ApiClient();
      const result = await apiClient.revokeAdminRole(selectedMenuUser.id);
      toast.success(result.message);
      
      // Refresh the user data to show updated roles
      getUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
    
    handleMenuClose();
    setSelectedMenuUser(null);
  };

  const isUserAdmin = (user: User): boolean => {
    return user.roles && user.roles.includes('admin');
  };

  const hasUserRole = (user: User): boolean => {
    return user.roles && user.roles.includes('user');
  };

  const hasTreeloggingRole = (user: User): boolean => {
    return user.roles && user.roles.includes('treelogging');
  };

  const hasNoRoles = (user: User): boolean => {
    return !user.roles || user.roles.length === 0;
  };

  const hasMobileAccess = (user: User): boolean => {
    return user.phone && user.pin && user.phone !== "0";
  };

  const handleGrantUserRole = async () => {
    if (!selectedMenuUser) return;
    
    try {
      const apiClient = new ApiClient();
      const currentRoles = selectedMenuUser.roles || [];
      const newRoles = currentRoles.includes('user') ? currentRoles : [...currentRoles, 'user'];
      
      const result = await apiClient.updateUserRoles(selectedMenuUser.id, newRoles);
      toast.success('User role granted successfully');
      
      // Refresh the user data to show updated roles
      getUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
    
    handleMenuClose();
    setSelectedMenuUser(null);
  };

  const handleGrantTreeloggingRole = async () => {
    if (!selectedMenuUser) return;
    
    try {
      const apiClient = new ApiClient();
      const currentRoles = selectedMenuUser.roles || [];
      const newRoles = currentRoles.includes('treelogging') ? currentRoles : [...currentRoles, 'treelogging'];
      
      const result = await apiClient.updateUserRoles(selectedMenuUser.id, newRoles);
      toast.success('Tree logging role granted successfully');
      
      // Refresh the user data to show updated roles
      getUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
    
    handleMenuClose();
    setSelectedMenuUser(null);
  };

  const handleMobileAccessFromMenu = () => {
    if (!selectedMenuUser) return;
    
    // Pre-fill mobile number if available
    setMobileNumber(selectedMenuUser.phone || '');
    setPin('');
    
    // Set default mobile role based on user's current roles
    const roles = selectedMenuUser.roles || [];
    if (roles.includes('admin')) {
      setSelectedMobileRole('admin');
    } else {
      setSelectedMobileRole('treelogging');
    }
    
    setMobileAccessDialogOpen(true);
    handleMenuClose();
  };

  const handleGrantMobileAccess = async () => {
    if (!selectedMenuUser) return;
    
    if (!mobileNumber || !pin) {
      toast.error('Mobile number and PIN are required');
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }
    
    try {
      const apiClient = new ApiClient();
      
      // Ensure the user has the selected mobile role
      const currentRoles = selectedMenuUser.roles || [];
      let updatedRoles = [...currentRoles];
      
      // Add the selected mobile role if not already present
      if (!updatedRoles.includes(selectedMobileRole)) {
        updatedRoles.push(selectedMobileRole);
      }
      
      // Update user with mobile number, PIN, and roles
      const updatedUser = {
        ...selectedMenuUser,
        phone: mobileNumber,
        pin: pin,
        roles: updatedRoles
      };
      
      await apiClient.updateUser(updatedUser);
      const isUpdate = hasMobileAccess(selectedMenuUser);
      toast.success(isUpdate ? 'Mobile access updated successfully' : 'Mobile access granted successfully');
      
      // Refresh the user data
      getUserData();
      setMobileAccessDialogOpen(false);
      setSelectedMenuUser(null);
      setMobileNumber('');
      setPin('');
      setSelectedMobileRole('treelogging');
    } catch (error: any) {
      toast.error(error.message);
    }
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
        <Typography variant="h4" style={{ marginTop: '5px' }}>{t('people.title')}</Typography>
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
          tableName={t('people.title')}
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
        <MenuItem onClick={handleMobileAccessFromMenu}>
          <ListItemIcon>
            <PhoneAndroid fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {selectedMenuUser && hasMobileAccess(selectedMenuUser)
              ? "Update Mobile Access" 
              : "Grant Mobile Access"
            }
          </ListItemText>
        </MenuItem>
        {selectedMenuUser && hasNoRoles(selectedMenuUser) && (
          <>
            <MenuItem onClick={handleGrantUserRole}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Grant User Role</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleGrantAdminRole}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Grant Admin Role</ListItemText>
            </MenuItem>
          </>
        )}
        {selectedMenuUser && hasUserRole(selectedMenuUser) && !isUserAdmin(selectedMenuUser) && (
          <MenuItem onClick={handleGrantAdminRole}>
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Grant Admin Role</ListItemText>
          </MenuItem>
        )}
        {selectedMenuUser && isUserAdmin(selectedMenuUser) && (
          <MenuItem onClick={handleRevokeAdminRole}>
            <ListItemIcon>
              <PersonRemove fontSize="small" />
            </ListItemIcon>
            <ListItemText>Revoke Admin Role</ListItemText>
          </MenuItem>
        )}
        {selectedMenuUser && isUserAdmin(selectedMenuUser) && !hasUserRole(selectedMenuUser) && (
          <MenuItem onClick={handleGrantUserRole}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Grant User Role</ListItemText>
          </MenuItem>
        )}
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

      {/* Mobile Access Dialog */}
      <Dialog 
        open={mobileAccessDialogOpen} 
        onClose={() => {
          setMobileAccessDialogOpen(false);
          setSelectedMenuUser(null);
          setMobileNumber('');
          setPin('');
          setSelectedMobileRole('treelogging');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMenuUser && hasMobileAccess(selectedMenuUser)
            ? "Update Mobile Access" 
            : "Grant Mobile Access"
          }
          {selectedMenuUser && (
            <Typography variant="subtitle2" color="textSecondary">
              User: {selectedMenuUser.name} ({selectedMenuUser.email})
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the mobile number, 4-digit PIN, and select the mobile role to grant mobile application access to this user.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Mobile Number:</Typography>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                marginBottom: '16px'
              }}
            />
            <Typography variant="body2" sx={{ mb: 1 }}>4-Digit PIN:</Typography>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
              }}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                letterSpacing: '2px',
                marginBottom: '16px'
              }}
            />
            <Typography variant="body2" sx={{ mb: 1 }}>Mobile Role:</Typography>
            <select
              value={selectedMobileRole}
              onChange={(e) => setSelectedMobileRole(e.target.value as 'admin' | 'treelogging')}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="treelogging">Tree Logging</option>
              <option value="admin">Admin</option>
            </select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setMobileAccessDialogOpen(false);
              setSelectedMenuUser(null);
              setMobileNumber('');
              setPin('');
              setSelectedMobileRole('treelogging');
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGrantMobileAccess}
            variant="contained"
            disabled={!mobileNumber || pin.length !== 4}
          >
            {selectedMenuUser && hasMobileAccess(selectedMenuUser) ? "Update Access" : "Grant Access"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
