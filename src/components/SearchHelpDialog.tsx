import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  Help,
  Search,
  FilterList,
  Speed,
  CheckCircle
} from '@mui/icons-material';

interface SearchHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const SearchHelpDialog: React.FC<SearchHelpDialogProps> = ({ open, onClose }) => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>('basic');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Help color="primary" />
        Search Help Guide
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Learn how to efficiently search and filter tree audit data using our three search modes.
        </Typography>

        {/* Data View Help */}
        <Accordion 
          expanded={expandedPanel === 'basic'} 
          onChange={handleAccordionChange('basic')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterList color="primary" />
              <Typography variant="h6">Data View</Typography>
              <Chip label="Default" size="small" color="primary" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Browse all audit records with built-in column filters and daily trend visualization.
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Text Search" 
                  secondary="Click on column headers to search by staff name, site, or plot"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Date Filter" 
                  secondary="Use date picker in the Audit Date column for date-based searches"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Number Range" 
                  secondary="Search trees audited/added counts using number filters"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Quick Search Help */}
        <Accordion 
          expanded={expandedPanel === 'quick'} 
          onChange={handleAccordionChange('quick')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Speed color="success" />
              <Typography variant="h6">Quick Search</Typography>
              <Chip label="Recommended" size="small" color="success" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Perfect for onsite staff! Click pre-defined search options for instant results.
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="One-Click Searches" 
                  secondary="Today's audits, last 7 days, high productivity staff"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Site-Specific" 
                  secondary="Quickly view activity for specific sites this month"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Performance Metrics" 
                  secondary="Find high-performing staff or recent activity"
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
              <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600 }}>
                💡 Best for field staff: No typing required, just click and view results!
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Search Help */}
        <Accordion 
          expanded={expandedPanel === 'advanced'} 
          onChange={handleAccordionChange('advanced')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Search color="warning" />
              <Typography variant="h6">Advanced Search</Typography>
              <Chip label="Power Users" size="small" color="warning" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Build complex queries using multiple criteria and filters.
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Date Options" 
                  secondary="Single date, date range, or quick presets (today, last week, etc.)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Location Filters" 
                  secondary="Select specific staff, sites, and plots with autocomplete"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Number Ranges" 
                  secondary="Set min/max values for trees audited and trees added"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Combined Filters" 
                  secondary="Mix multiple criteria for precise results"
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Example Advanced Searches:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip 
                label="All staff at Site A who added 5+ trees last week" 
                variant="outlined" 
                size="small" 
                sx={{ alignSelf: 'flex-start' }}
              />
              <Chip 
                label="John's activity in Plot 1 during December" 
                variant="outlined" 
                size="small" 
                sx={{ alignSelf: 'flex-start' }}
              />
              <Chip 
                label="High productivity staff (10+ trees) this month" 
                variant="outlined" 
                size="small" 
                sx={{ alignSelf: 'flex-start' }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body2" color="info.dark">
            <strong>💡 Pro Tip:</strong> Start with Quick Search for common needs, then use Advanced Search for specific queries. 
            You can always switch between modes without losing your data!
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchHelpDialog;