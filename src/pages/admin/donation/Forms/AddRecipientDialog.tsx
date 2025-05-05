import React, { useState } from 'react';
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
  TextField, 
  Typography,
  Box,
  Divider
} from "@mui/material";
import { DonationUser } from '../../../../types/donation';
import { AWSUtils } from '../../../../helpers/aws';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as userActionCreators from '../../../../redux/actions/userActions';

interface AddRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  donationId: number;
  onSave: (newRecipient: Partial<DonationUser>) => void;
}

const AddRecipientDialog: React.FC<AddRecipientDialogProps> = ({
  open,
  onClose,
  donationId,
  onSave
}) => {
  const dispatch = useAppDispatch();
  const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

  const [formData, setFormData] = useState<Partial<DonationUser>>({
    recipient_email: '',
    recipient_name: '',
    recipient_phone: '',
    assignee_email: '',
    assignee_name: '',
    assignee_phone: '',
    relation: '',
    gifted_trees: 1
  });
  const [showAssignedFields, setShowAssignedFields] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert gifted_trees to a number
    if (name === 'gifted_trees') {
      const numValue = parseInt(value, 10);
      // Ensure at least 1 tree
      const treeCount = isNaN(numValue) || numValue < 1 ? 1 : numValue;
      setFormData({ ...formData, [name]: treeCount });
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
    // Don't search if value is empty, null, or contains only spaces and parentheses
    if (!value || value.trim() === '' || /^\s*\(.*\)\s*$/.test(value)) {
      return;
    }
    
    let isSet = false;
    usersList.forEach((user) => {
      if (`${user.name} (${user.email})` === value) {
        isSet = true;
        if (field === 'recipient_email') {
          setFormData(prev => ({
            ...prev,
            recipient: user.id,
            recipient_email: user.email,
            recipient_name: user.name,
            recipient_phone: user.phone ?? '',
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            assignee: user.id,
            assignee_email: user.email,
            assignee_name: user.name,
            assignee_phone: user.phone ?? '',
          }));
        }
      }
    });

    if (!isSet && value !== ` ()`) {
      // Only update the field if it contains meaningful text
      // and filter out parentheses patterns
      const cleanValue = value.replace(/\s*\([^)]*\)\s*/g, '').trim();
      
      if (cleanValue.length > 0) {
        setFormData(prev => ({
          ...prev,
          [field]: cleanValue,
        }));
        
        // Only search if we have at least 3 meaningful characters
        if (cleanValue.length >= 3) {
          searchUsers(cleanValue);
        }
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSave = async () => {
    try {
      // If not assigned, set assignee to be the same as recipient
      const finalFormData = { ...formData };
      if (!showAssignedFields) {
        finalFormData.assignee = finalFormData.recipient;
        finalFormData.assignee_name = finalFormData.recipient_name;
        finalFormData.assignee_email = finalFormData.recipient_email;
        finalFormData.assignee_phone = finalFormData.recipient_phone;
      }
      
      // If a new image is provided, upload it
      if (profileImage) {
        const awsUtils = new AWSUtils();
        const requestId = `donation-${donationId}`;
        const location = await awsUtils.uploadFileToS3('donation-users', profileImage, requestId);
        finalFormData.profile_image_url = location;
      }

      // Reset form after saving
      setFormData({
        recipient_email: '',
        recipient_name: '',
        recipient_phone: '',
        assignee_email: '',
        assignee_name: '',
        assignee_phone: '',
        relation: '',
        gifted_trees: 1
      });
      setProfileImage(null);
      setShowAssignedFields(false);

      onSave(finalFormData);
    } catch (error) {
      console.error("Error saving new recipient:", error);
      toast.error("Failed to create new recipient");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6">Add New Recipient</Typography>
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
              fullWidth
              options={usersList.map((user) => `${user.name} (${user.email})`)}
              onInputChange={(e, value) => { handleEmailChange(e, value, 'recipient_email') }}
              value={formData.recipient_email ? `${formData.recipient_name} (${formData.recipient_email})` : ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recipient Email"
                  variant="outlined"
                  name="recipient_email"
                  required
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
              required
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
              name="gifted_trees" 
              label="Trees Count" 
              value={formData.gifted_trees || 1} 
              onChange={handleInputChange} 
              fullWidth 
              type="number"
              inputProps={{ min: 1 }}
              helperText="Minimum 1 tree required"
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
                  fullWidth
                  options={usersList.map((user) => `${user.name} (${user.email})`)}
                  onInputChange={(e, value) => { handleEmailChange(e, value, 'assignee_email') }}
                  value={formData.assignee_email ? `${formData.assignee_name} (${formData.assignee_email})` : ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assignee Email"
                      variant="outlined"
                      name="assignee_email"
                      required
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
                  required
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
                src={profileImage ? URL.createObjectURL(profileImage) : ''}
                alt={showAssignedFields ? formData.assignee_name : formData.recipient_name}
                sx={{ width: 80, height: 80 }}
              />
              <Button 
                variant="outlined" 
                component="label" 
                color='success' 
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
              
              {profileImage && 
                <Button 
                  variant="outlined" 
                  component="label" 
                  color='error' 
                  sx={{ textTransform: 'none' }} 
                  onClick={() => { 
                    setProfileImage(null); 
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
          Add Recipient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecipientDialog; 