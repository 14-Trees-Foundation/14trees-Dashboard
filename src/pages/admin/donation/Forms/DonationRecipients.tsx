import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton
} from "@mui/material";
import { Edit, Search, PersonAdd, AddCircleOutline, Delete } from '@mui/icons-material';
import { DonationUser } from '../../../../types/donation';
import ApiClient from '../../../../api/apiClient/apiClient';
import { GridFilterItem } from '@mui/x-data-grid';
import GeneralTable from '../../../../components/GenTable';
import { TableColumnsType } from 'antd';
import { User } from '../../../../types/user';
import { AWSUtils } from '../../../../helpers/aws';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as userActionCreators from '../../../../redux/actions/userActions';
import AddRecipientDialog from './AddRecipientDialog';
import getColumnSearchProps from '../../../../components/Filter';

interface EditRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  user: DonationUser;
  donationId: number;
  onSave: (updatedUser: DonationUser, image?: File) => void;
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignedTreesCount: number;
  recipientName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  assignedTreesCount,
  recipientName
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete recipient <strong>{recipientName}</strong>?
        </Typography>
        {assignedTreesCount > 0 && (
          <Typography variant="body1" color="error" gutterBottom>
            Note: This will unassign <strong>{assignedTreesCount} trees</strong> assigned to this recipient.
          </Typography>
        )}
        <Typography variant="body2">
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditRecipientDialog: React.FC<EditRecipientDialogProps> = ({
  open,
  onClose,
  user,
  donationId,
  onSave
}) => {
  const dispatch = useAppDispatch();
  const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

  const [formData, setFormData] = useState<DonationUser>(user);
  const [showAssignedFields, setShowAssignedFields] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData(user);
    setShowAssignedFields(user.assignee !== user.recipient);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle trees count, whether it's stored as gifted_trees or trees_count
    if (name === 'gifted_trees' || name === 'trees_count') {
      const numValue = parseInt(value, 10);
      // Ensure at least 1 tree
      const treeCount = isNaN(numValue) || numValue < 1 ? 1 : numValue;
      // Update both fields to ensure consistency
      setFormData({
        ...formData,
        gifted_trees: treeCount,
        trees_count: treeCount
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const usersData = useAppSelector((state) => state.searchUsersData);
  let usersList: any[] = [];

  if (usersData) {
    usersList = Object.values(usersData.users);
  }

  const handleEmailChange = (event: React.SyntheticEvent, value: string, field: 'recipient_email' | 'assignee_email') => {
    // Skip if empty or just whitespace/parentheses
    if (!value || value.trim() === '' || /^\s*\(.*\)\s*$/.test(value)) {
      return;
    }

    // Extract email from "Name (Email)" format if present
    const emailMatch = value.match(/\(([^)]+)\)/);
    const extractedEmail = emailMatch ? emailMatch[1] : value;
    const cleanValue = extractedEmail.trim();


    setFormData(prev => ({
      ...prev,
      [field]: cleanValue,
    }));

    if (emailMatch) {
      const matchingUser = usersList.find(user =>
        `${user.name} (${user.email})` === value
      );

      if (matchingUser) {
        const idField = field === 'recipient_email' ? 'recipient' : 'assignee';
        const phoneField = field === 'recipient_email' ? 'recipient_phone' : 'assignee_phone';


        setFormData(prev => ({
          ...prev,
          [idField]: matchingUser.id,
          [phoneField]: prev[phoneField] || matchingUser.phone || '',
        }));
      }
    }

    // Search when we have at least 3 meaningful characters
    if (cleanValue.length >= 3) {
      searchUsers(cleanValue);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSave = () => {
    // If not assigned, set assignee to be the same as recipient
    const finalFormData = { ...formData };
    if (!showAssignedFields) {
      finalFormData.assignee = finalFormData.recipient;
      finalFormData.assignee_name = finalFormData.recipient_name;
      finalFormData.assignee_email = finalFormData.recipient_email;
      finalFormData.assignee_phone = finalFormData.recipient_phone;
    }

    onSave(finalFormData, profileImage ?? undefined);
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6">Edit Recipient Details</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom color="success">
                Recipient Information
              </Typography>
              <Divider />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              fullWidth
              options={usersList.map((user) => `${user.name} (${user.email})`)}
              onInputChange={(e, value) => handleEmailChange(e, value, 'recipient_email')}
              inputValue={formData.recipient_email || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recipient Email"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="recipient_name"
              label="Recipient Name"
              value={formData.recipient_name || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="recipient_phone"
              label="Recipient Phone (Optional)"
              value={formData.recipient_phone || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="trees_count"
              label="Trees Count"
              value={formData.trees_count || formData.gifted_trees || 1}
              onChange={handleInputChange}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAssignedFields}
                    onChange={(e) => { setShowAssignedFields(e.target.checked) }}
                    name="show_all"
                  />
                }
                label="Do you want to assign trees to someone else (related to recipient)?"
              />
            </FormControl>
          </Grid>

          {showAssignedFields && (
            <>
              <Grid item xs={12}>
                <Box mt={2} mb={2}>
                  <Typography variant="subtitle1" gutterBottom color="success">
                    Assignee Information
                  </Typography>
                  <Divider />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  options={usersList.map((user) => `${user.name} (${user.email})`)}
                  onInputChange={(e, value) => handleEmailChange(e, value, 'assignee_email')}
                  inputValue={formData.assignee_email || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assignee Email"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="assignee_name"
                  label="Assignee Name"
                  value={formData.assignee_name || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="assignee_phone"
                  label="Assignee Phone (Optional)"
                  value={formData.assignee_phone || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="relation"
                  label="Relation to Recipient"
                  value={formData.relation || ''}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="e.g., Father, Mother, Son, Daughter"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" gutterBottom color="success">
                Profile Image
              </Typography>
              <Divider />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={profileImage ? URL.createObjectURL(profileImage) : formData.profile_image_url || ''}
                alt={showAssignedFields ? formData.assignee_name : formData.recipient_name}
                sx={{ width: 80, height: 80 }}
              />
              <Button
                variant="outlined"
                component="label"
                color="success"
                sx={{ marginRight: 2, textTransform: 'none' }}
              >
                Upload {showAssignedFields ? "Assignee" : "Recipient"} Image
                <input
                  value={''}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {(formData.profile_image_url || profileImage) &&
                <Button
                  variant="outlined"
                  component="label"
                  color="error"
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    setProfileImage(null);
                    setFormData(prev => ({ ...prev, profile_image_url: null }))
                  }}
                >
                  Remove Image
                </Button>
              }
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="success" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface DonationRecipientsProps {
  donation: number;
  open: boolean;
  onClose: () => void;
  embedded?: boolean;
  onAddNewRecipient?: () => void;
  refreshData?: (callback: () => void) => void;
}

const DonationRecipients: React.FC<DonationRecipientsProps> = ({
  donation,
  open,
  onClose,
  embedded = false,
  onAddNewRecipient,
  refreshData
}) => {
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<DonationUser[]>([]);
  const [filteredRecipients, setFilteredRecipients] = useState<DonationUser[]>([]);
  const [currentPageRecipients, setCurrentPageRecipients] = useState<DonationUser[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<DonationUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [totalRecipients, setTotalRecipients] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<DonationUser | null>(null);
  const [assignedTreesCount, setAssignedTreesCount] = useState(0);

  // Load donation recipients when component mounts
  useEffect(() => {
    if ((open || embedded) && donation) {
      fetchRecipients();
    }
  }, [open, embedded, donation]);

  // Make fetchRecipients available as a prop method
  useEffect(() => {
    if (typeof refreshData === 'function') {
      refreshData(() => fetchRecipients());
    }
  }, [refreshData]);

  // Apply filters and slice data for current page
  useEffect(() => {
    if (recipients.length > 0) {
      applyFilters();
    }
  }, [filters, recipients, page, pageSize]);

  const applyFilters = () => {
    let filtered = [...recipients];

    // Apply each filter
    Object.values(filters).forEach(filter => {
      if (filter.value) {
        const fieldName = filter.columnField.toString();
        const searchValue = filter.value.toString().toLowerCase();

        filtered = filtered.filter(user => {
          const fieldValue = user[fieldName as keyof DonationUser];
          return fieldValue && String(fieldValue).toLowerCase().includes(searchValue);
        });
      }
    });

    setFilteredRecipients(filtered);
    setTotalRecipients(filtered.length);

    // Slice the data for the current page
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = filtered.slice(startIndex, endIndex);
    setCurrentPageRecipients(slicedData);
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0); // Reset to first page when applying filters
    setFilters(filters);
  };

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      const apiClient = new ApiClient();
      const users = await apiClient.getDonationUsers(0, -1, [
        { columnField: 'donation_id', operatorValue: 'equals', value: donation }
      ]);

      console.log('Donation users response:', users);

      // Format data with keys for the table
      const formattedUsers = users.results.map(user => ({
        ...user,
        key: user.id
      }));

      setRecipients(formattedUsers);
      // Don't call setFilteredRecipients and setCurrentPageRecipients here
      // Let the useEffect handle it to avoid duplicate code
    } catch (error) {
      console.error("Error fetching donation recipients:", error);
      toast.error("Failed to load donation recipients");
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);  // Convert from 1-indexed to 0-indexed
    setPageSize(pageSize);
    // No need to call applyFilters here, the useEffect will handle it
  };

  const handleEditRecipient = (recipient: DonationUser) => {
    setSelectedRecipient(recipient);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedRecipient(null);
    setIsEditModalOpen(false);
  };

  const handleAddModalOpen = () => {
    if (onAddNewRecipient) {
      onAddNewRecipient();
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateRecipient = async (updatedUser: DonationUser, image?: File) => {
    try {
      setLoading(true);

      // Prepare data to send to the API
      const dataToUpdate: Partial<DonationUser> = {
        id: updatedUser.id,
        donation_id: donation,
        recipient_email: updatedUser.recipient_email,
        recipient_name: updatedUser.recipient_name,
        recipient_phone: updatedUser.recipient_phone,
        assignee_email: updatedUser.assignee_email,
        assignee_name: updatedUser.assignee_name,
        assignee_phone: updatedUser.assignee_phone,
        relation: updatedUser.relation,
        // Use trees_count instead of gifted_trees for consistency with backend
        trees_count: updatedUser.trees_count || updatedUser.gifted_trees,
      };

      // If a new image is provided, upload it
      if (image) {
        const awsUtils = new AWSUtils();
        const requestId = `donation-${donation}`;
        const location = await awsUtils.uploadFileToS3('donation-users', image, requestId);
        dataToUpdate.profile_image_url = location;
      } else if (updatedUser.profile_image_url) {
        dataToUpdate.profile_image_url = updatedUser.profile_image_url;
      }

      // Update the recipient in the backend
      const apiClient = new ApiClient();
      const updatedData = await apiClient.updateDonationUser(dataToUpdate);

      // Make sure the updated data has the key property
      const updatedDataWithKey = {
        ...updatedData,
        key: updatedData.id
      };

      // Update the main recipients array
      const updatedRecipients = recipients.map(user =>
        user.id === updatedDataWithKey.id ? updatedDataWithKey : user
      );
      setRecipients(updatedRecipients);

      // Update filtered recipients array
      const updatedFilteredRecipients = filteredRecipients.map(user =>
        user.id === updatedDataWithKey.id ? updatedDataWithKey : user
      );
      setFilteredRecipients(updatedFilteredRecipients);

      // Update the current page recipients directly
      const updatedCurrentPageRecipients = currentPageRecipients.map(user =>
        user.id === updatedDataWithKey.id ? updatedDataWithKey : user
      );
      setCurrentPageRecipients(updatedCurrentPageRecipients);

      toast.success("Recipient updated successfully");
      handleEditModalClose();
    } catch (error) {
      console.error("Error updating recipient:", error);
      toast.error("Failed to update recipient");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipient = async (newRecipient: Partial<DonationUser>) => {
    try {
      setLoading(true);

      // Prepare data to create the new recipient
      const recipientData = {
        donation_id: donation,
        recipient_email: newRecipient.recipient_email,
        recipient_name: newRecipient.recipient_name,
        recipient_phone: newRecipient.recipient_phone,
        assignee_email: newRecipient.assignee_email,
        assignee_name: newRecipient.assignee_name,
        assignee_phone: newRecipient.assignee_phone,
        relation: newRecipient.relation,
        // Use trees_count instead of gifted_trees for consistency with backend
        trees_count: newRecipient.trees_count || newRecipient.gifted_trees || 1,
        profile_image_url: newRecipient.profile_image_url || null
      };

      // Create the recipient in the backend
      const apiClient = new ApiClient();
      await apiClient.createDonationUser(recipientData);

      // Refresh the recipients list
      await fetchRecipients();

      toast.success("Recipient added successfully");
      handleAddModalClose();
    } catch (error) {
      console.error("Error creating recipient:", error);
      toast.error("Failed to add recipient");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRecipients = async () => {
    return filteredRecipients;
  };

  const handleDeleteClick = (recipient: DonationUser) => {
    setRecipientToDelete(recipient);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!recipientToDelete) return;
  
    try {
      setLoading(true);
      const apiClient = new ApiClient();
  
      // ✅ Send the correct unique ID of the DonationUser
      await apiClient.deleteDonationUser(recipientToDelete.id);
  
      // Remove from local state
      setRecipients(prev => prev.filter(r => r.id !== recipientToDelete.id));
      setFilteredRecipients(prev => prev.filter(r => r.id !== recipientToDelete.id));
      setCurrentPageRecipients(prev => prev.filter(r => r.id !== recipientToDelete.id));
      setTotalRecipients(prev => prev - 1);
  
      toast.success("Recipient deleted successfully");
    } catch (error) {
      console.error("Error deleting recipient:", error);
      toast.error("Failed to delete recipient");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setRecipientToDelete(null);
    }
  };
  


  const columns: TableColumnsType<DonationUser> = [
    {
      dataIndex: "recipient_name",
      key: "recipient_name",
      title: "Recipient Name",
      width: 150,
      ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
    },
    {
      dataIndex: "recipient_email",
      key: "recipient_email",
      title: "Recipient Email",
      width: 200,
      ...getColumnSearchProps('recipient_email', filters, handleSetFilters)
    },
    {
      dataIndex: "recipient_phone",
      key: "recipient_phone",
      title: "Recipient Phone",
      width: 120,
      render: (value: string) => value || '-',
      ...getColumnSearchProps('recipient_phone', filters, handleSetFilters)
    },
    {
      dataIndex: "assignee_name",
      key: "assignee_name",
      title: "Assignee Name",
      width: 150,
      ...getColumnSearchProps('assignee_name', filters, handleSetFilters)
    },
    {
      dataIndex: "assignee_email",
      key: "assignee_email",
      title: "Assignee Email",
      width: 200,
      ...getColumnSearchProps('assignee_email', filters, handleSetFilters)
    },
    {
      dataIndex: "trees_count",
      key: "trees_count",
      title: "Trees",
      width: 80,
      align: "right",
      sorter: (a: DonationUser, b: DonationUser) => {
        // Use trees_count first, fall back to gifted_trees, default to 0 if neither exists
        const aCount = a.trees_count !== undefined ? a.trees_count : (a.gifted_trees || 0);
        const bCount = b.trees_count !== undefined ? b.trees_count : (b.gifted_trees || 0);
        return aCount - bCount;
      },
      render: (value: number, record: DonationUser) => {
        // Use trees_count first, fall back to gifted_trees, display as integer
        return (record.trees_count !== undefined ? record.trees_count : record.gifted_trees) || 0;
      }
    },
    {
      dataIndex: "profile_image_url",
      key: "profile_image_url",
      title: "Profile Image",
      width: 100,
      align: "center",
      render: (url: string | null) => url ? (
        <Avatar
          src={url}
          alt="Profile"
          sx={{ width: 40, height: 40, margin: '0 auto' }}
        />
      ) : '-'
    },
    {
      dataIndex: "action",
      key: "actions",
      title: "Actions",
      width: 120,  // Reduced width
      align: "center",
      render: (_, record: DonationUser) => (
        <Box display="flex" gap={1} justifyContent="center">
          <IconButton
            color="success"
            onClick={() => handleEditRecipient(record)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(record)}
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  // If embedded in another component, render just the table without dialog wrapper
  if (embedded) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {!onAddNewRecipient && (
            <Button
              variant="contained"
              color="success"
              startIcon={<AddCircleOutline />}
              onClick={handleAddModalOpen}
            >
              Add Recipient
            </Button>
          )}
        </Box>

        <Paper elevation={0}>
          <GeneralTable
            loading={loading}
            rows={currentPageRecipients}
            columns={columns}
            totalRecords={totalRecipients}
            page={page}  // Don't add 1, GenTable already increments internally
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            onDownload={handleDownloadRecipients}
            footer
            tableName="Donation Recipients"
          />
        </Paper>

        {selectedRecipient && (
          <EditRecipientDialog
            open={isEditModalOpen}
            onClose={handleEditModalClose}
            user={selectedRecipient}
            donationId={donation}
            onSave={handleUpdateRecipient}
          />
        )}

        <AddRecipientDialog
          open={isAddModalOpen}
          onClose={handleAddModalClose}
          donationId={donation}
          onSave={handleCreateRecipient}
        />

        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          assignedTreesCount={assignedTreesCount}
          recipientName={recipientToDelete?.recipient_name || ''}
        />
      </Box>
    );
  }

  // Otherwise, render the full dialog version
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Donation Recipients</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleOutline />}
            onClick={handleAddModalOpen}
          >
            Add Recipient
          </Button>
        </Box>

        <Paper elevation={0} sx={{ mb: 2 }}>
          <GeneralTable
            loading={loading}
            rows={currentPageRecipients}
            columns={columns}
            totalRecords={totalRecipients}
            page={page}  // Don't add 1, GenTable already increments internally
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            onDownload={handleDownloadRecipients}
            footer
            tableName="Donation Recipients"
          />
        </Paper>

        {selectedRecipient && (
          <EditRecipientDialog
            open={isEditModalOpen}
            onClose={handleEditModalClose}
            user={selectedRecipient}
            donationId={donation}
            onSave={handleUpdateRecipient}
          />
        )}

        <AddRecipientDialog
          open={isAddModalOpen}
          onClose={handleAddModalClose}
          donationId={donation}
          onSave={handleCreateRecipient}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="success" variant="outlined">
          Close
        </Button>
        <Button
          onClick={fetchRecipients}
          color="success"
          variant="contained"
        >
          Refresh Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationRecipients; 