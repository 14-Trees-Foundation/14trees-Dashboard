import React, { useEffect, useState, useRef } from "react";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
  Tabs,
  Tab,
  Paper,
  Fab
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Donation, DonationUser } from "../../../../types/donation";
import ApiClient from "../../../../api/apiClient/apiClient";
import DonationRecipients from "./DonationRecipients";
import AddRecipientDialog from "./AddRecipientDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`donation-edit-tabpanel-${index}`}
      aria-labelledby={`donation-edit-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface DirectEditDonationFormProps {
  donation: Donation | null;
  open: boolean;
  handleClose: () => void;
  onSubmit: (updatedDonation: Donation) => void;
}

export const DirectEditDonationForm: React.FC<DirectEditDonationFormProps> = ({
  donation,
  open,
  handleClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [isAddRecipientModalOpen, setIsAddRecipientModalOpen] = useState(false);
  const [recipientsRefreshCounter, setRecipientsRefreshCounter] = useState(0);
  const refreshRecipientsRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (open && donation) {
      setFormData({...donation});
    }
  }, [open, donation]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: any) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? null : Number(value)
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    
    try {
      setLoading(true);
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update donation");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientsClose = () => {
    setIsRecipientsModalOpen(false);
  };

  const handleAddRecipientOpen = () => {
    setIsAddRecipientModalOpen(true);
  };

  const handleAddRecipientClose = () => {
    setIsAddRecipientModalOpen(false);
  };

  const handleCreateRecipient = async (newRecipient: Partial<DonationUser>) => {
    if (!formData?.id) return;

    try {
      setLoading(true);

      // Prepare data to create the new recipient
      const recipientData = {
        donation_id: formData.id,
        recipient_email: newRecipient.recipient_email,
        recipient_name: newRecipient.recipient_name,
        recipient_phone: newRecipient.recipient_phone,
        assignee_email: newRecipient.assignee_email,
        assignee_name: newRecipient.assignee_name,
        assignee_phone: newRecipient.assignee_phone,
        relation: newRecipient.relation,
        gifted_trees: newRecipient.gifted_trees || 1,
        profile_image_url: newRecipient.profile_image_url || null
      };

      // Create the recipient in the backend
      const apiClient = new ApiClient();
      const createdRecipient = await apiClient.createDonationUser(recipientData);
      
      toast.success("Recipient added successfully");
      handleAddRecipientClose();
      
      // Refresh the recipients list
      if (refreshRecipientsRef.current) {
        refreshRecipientsRef.current();
      } else {
        // Fallback to forcing re-render via the key
        setRecipientsRefreshCounter(prevCounter => prevCounter + 1);
      }
      
      // Switch to the Recipients tab after adding a new recipient
      setTabValue(1);
    } catch (error) {
      console.error("Error creating recipient:", error);
      toast.error("Failed to add recipient");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xl"
      PaperProps={{ 
        style: { 
          overflowY: "visible",
          padding: "10px"
        } 
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center">Edit Donation #{formData.id}</Typography>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3}}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="donation edit tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: 'success.main'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'success.main'
            }
          }}
        >
          <Tab label="Donation Details" id="donation-edit-tab-0" />
          <Tab label="Recipients" id="donation-edit-tab-1" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        <TabPanel value={tabValue} index={0}>
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom color="success">
              Donor Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Donor Name"
                  name="user_name"
                  value={formData.user_name || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  disabled
                  helperText="Cannot be changed directly"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Donor Email"
                  name="user_email"
                  value={formData.user_email || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  disabled
                  helperText="Cannot be changed directly"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Donor Phone"
                  name="user_phone"
                  value={formData.user_phone || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  disabled
                  helperText="Cannot be changed directly"
                />
              </Grid>
            </Grid>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom color="success">
              Donation Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    label="Category"
                  >
                    <MenuItem value="Foundation">Foundation</MenuItem>
                    <MenuItem value="Public">Public</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Grove"
                  name="grove"
                  value={formData.grove || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pledged Trees"
                  name="trees_count"
                  value={formData.trees_count || ""}
                  onChange={handleNumberChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pledged Area (Acres)"
                  name="pledged_area_acres"
                  value={formData.pledged_area_acres || ""}
                  onChange={handleNumberChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="contribution-options-label">Contribution Options</InputLabel>
                  <Select
                    labelId="contribution-options-label"
                    name="contribution_options"
                    value={formData.contribution_options || ""}
                    onChange={handleSelectChange}
                    label="Contribution Options"
                  >
                    <MenuItem value="Planning visit">Planning visit</MenuItem>
                    <MenuItem value="CSR">CSR</MenuItem>
                    <MenuItem value="Volunteer">Volunteer</MenuItem>
                    <MenuItem value="Share">Share</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom color="success">
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Event Name"
                  name="event_name"
                  value={formData.event_name || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Comments"
                  name="comments"
                  value={formData.comments || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom color="success">
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment ID"
                  name="payment_id"
                  value={formData.payment_id || ""}
                  onChange={handleNumberChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="number"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Cannot be changed directly"
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Donation Recipients
            </Typography>
            <Divider />
            <Fab 
              color="success" 
              size="small" 
              onClick={handleAddRecipientOpen}
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              <AddIcon />
            </Fab>
          </Box>
          
          {formData && formData.id && (
            <DonationRecipients 
              donation={formData.id} 
              open={true}
              onClose={() => {}}
              embedded={true}
              onAddNewRecipient={handleAddRecipientOpen}
              key={`recipients-${formData.id}-${recipientsRefreshCounter}`}
              refreshData={(callback) => { refreshRecipientsRef.current = callback; }}
            />
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        {tabValue === 0 && <Button
          onClick={handleSubmit} 
          color="success" 
          variant="contained"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Donation"}
        </Button>}
      </DialogActions>

      {formData && formData.id && (
        <AddRecipientDialog
          open={isAddRecipientModalOpen}
          onClose={handleAddRecipientClose}
          donationId={formData.id}
          onSave={handleCreateRecipient}
        />
      )}
    </Dialog>
  );
};

export default DirectEditDonationForm; 