import React, { FC, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  Typography,
  Box 
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CloudSync } from '@mui/icons-material';

interface WebScrapingModalProps {
  open: boolean;
  onClose: () => void;
  onScrape: (url: string) => Promise<void>;
  loading: boolean;
}

const WebScrapingModal: FC<WebScrapingModalProps> = ({ 
  open, 
  onClose, 
  onScrape, 
  loading 
}) => {
  const [pageUrl, setPageUrl] = useState<string>('');

  const handleScrape = () => {
    onScrape(pageUrl);
    setPageUrl('');
  };

  const handleClose = () => {
    setPageUrl('');
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>Fetch user images from website</DialogTitle>
      <DialogContent dividers>
        <Grid item xs={12}>
          <Typography variant="body1">
            Enter the link of the web page containing user images. You can refer these images 
            during user addition. Webpage URL must start with 'https://' prefix and it should 
            be publicly accessible.
          </Typography>
          <Box style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 30, 
            marginTop: 5 
          }}>
            <TextField
              value={pageUrl}
              onChange={(event) => setPageUrl(event.target.value.trim())}
              margin="normal"
              size="small"
              label="Web page url"
              style={{ 
                display: 'flex', 
                flexGrow: 1, 
                marginRight: 5, 
                marginTop: 0, 
                marginBottom: 0 
              }}
            />
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<CloudSync />}
          variant="contained"
          color="success"
          onClick={handleScrape}
        >
          Fetch Images
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WebScrapingModal;