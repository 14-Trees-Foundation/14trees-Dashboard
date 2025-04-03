import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Donation } from '../../../types/donation';
import ApiClient from '../../../api/apiClient/apiClient';
import GeneralTable from '../../../components/GenTable';
import { InfoOutlined, EventOutlined, ParkOutlined } from '@mui/icons-material';

interface DonationInfoProps {
  open: boolean;
  onClose: () => void;
  data: Donation | null;
}

const DonationInfo: React.FC<DonationInfoProps> = ({ open, onClose, data }) => {
  const [donationUsers, setDonationUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const theme = useTheme();

  useEffect(() => {
    const getDonationUsers = async () => {
      if (data) {
        try {
          const apiClient = new ApiClient();
          const users = await apiClient.getDonationUsers(data.id);
          setDonationUsers(users);
        } catch (error) {
          console.error("Error fetching donation users:", error);
          setDonationUsers([]);
        }
      }
    };

    if (open && data) {
      getDonationUsers();
    }
  }, [open, data]);

  const columns: any[] = [
    {
      dataIndex: "recipient_name",
      key: "recipient",
      title: "Recipient",
      align: "center",
      width: 200,
    },
    {
      dataIndex: "trees_count",
      key: "trees_count",
      title: "Trees Count",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "assignee_name",
      key: "assignee",
      title: "Assigned to",
      align: "center",
      width: 200,
    }
  ];

  if (!data) return null;

  // Check if additional information section should be displayed
  const hasAdditionalInfo = Boolean(data.names_for_plantation || data.comments);
  
  console.log('Additional Info Debug:', {
    names_for_plantation: data.names_for_plantation,
    comments: data.comments,
    hasAdditionalInfo,
    fullData: data // Log full data to see structure
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlined /> Donation Summary
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {/* Donor Details */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ParkOutlined sx={{ color: '#2e7d32' }} /> Donor Details
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography sx={{ mb: 1 }}><strong>Name:</strong> {data.user_name || 'N/A'}</Typography>
            <Typography><strong>Email:</strong> {data.user_email || 'N/A'}</Typography>
          </Box>
        </Paper>

        {/* Donation Details */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventOutlined sx={{ color: '#2e7d32' }} /> Donation Details
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography sx={{ mb: 1 }}><strong>Donation ID:</strong> {data.id}</Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Category:</strong> <Chip size="small" label={data.category} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} />
            </Typography>
            <Typography sx={{ mb: 1 }}><strong>Grove:</strong> {data.grove || 'N/A'}</Typography>
            {data.grove_type_other && (
              <Typography sx={{ mb: 1 }}><strong>Grove Type (Other):</strong> {data.grove_type_other}</Typography>
            )}
            <Typography sx={{ mb: 1 }}><strong>Trees Count:</strong> <Chip size="small" label={data.trees_count} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} /></Typography>
            <Typography><strong>Contribution Options:</strong> {data.contribution_options || 'N/A'}</Typography>
          </Box>
        </Paper>

        {/* Additional Information - only shown if there's content */}
        {(data.names_for_plantation || data.comments) && (
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined sx={{ color: '#2e7d32' }} /> Additional Information
            </Typography>
            <Box sx={{ ml: 4 }}>
              {data.names_for_plantation && (
                <Typography sx={{ mb: 1 }}><strong>Names for Plantation:</strong> {data.names_for_plantation}</Typography>
              )}
              {data.comments && (
                <Typography><strong>Comments:</strong> {data.comments}</Typography>
              )}
            </Box>
          </Paper>
        )}

        {/* Recipients */}
        {donationUsers.length > 0 && (
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined sx={{ color: '#2e7d32' }} /> Recipients
            </Typography>
            <GeneralTable
              loading={false}
              columns={columns}
              rows={donationUsers}
              totalRecords={donationUsers.length}
              page={page}
              pageSize={pageSize}
              onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
              onDownload={async () => donationUsers}
              footer
              tableName='Donation Recipients'
            />
          </Paper>
        )}

        {/* Dates */}
        <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            <strong>Created At:</strong> {format(new Date(data.created_at), 'yyyy-MM-dd HH:mm:ss')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Updated At:</strong> {format(new Date(data.updated_at), 'yyyy-MM-dd HH:mm:ss')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            bgcolor: '#2e7d32',
            '&:hover': {
              bgcolor: '#1b5e20'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationInfo; 