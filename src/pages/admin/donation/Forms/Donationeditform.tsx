import React, { useEffect, useState } from "react";
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
  Box
} from "@mui/material";
import { toast } from "react-toastify";
import { Donation } from "../../../../types/donation";


interface DirectEditDonationFormProps {
  donation: Donation | null;
  open: boolean;
  handleClose: () => void;
  onSubmit: (updatedDonation: Donation) => void;
}

const DirectEditDonationForm: React.FC<DirectEditDonationFormProps> = ({
  donation,
  open,
  handleClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (open && donation) {
      setFormData({...donation});
    }
  }, [open, donation]);

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

  if (!formData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
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

      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom color="primary">
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
          <Typography variant="subtitle1" gutterBottom color="primary">
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
                label="Trees Count"
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
                label="Pledged Trees"
                name="pledged"
                value={formData.pledged || ""}
                onChange={handleNumberChange}
                fullWidth
                variant="outlined"
                margin="normal"
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pledged Area"
                name="pledged_area"
                value={formData.pledged_area || ""}
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
          <Typography variant="subtitle1" gutterBottom color="primary">
            Additional Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Names for Plantation"
                name="names_for_plantation"
                value={formData.names_for_plantation || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Preference"
                name="preference"
                value={formData.preference || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
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
            <Grid item xs={12} md={6}>
              <TextField
                label="Alternate Email"
                name="alternate_email"
                value={formData.alternate_email || ""}
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
          <Typography variant="subtitle1" gutterBottom color="primary">
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
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="success" 
          variant="contained"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Donation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DirectEditDonationForm; 