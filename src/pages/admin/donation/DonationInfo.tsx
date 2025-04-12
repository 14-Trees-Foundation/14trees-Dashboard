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
import getColumnSearchProps from '../../../components/Filter';
import { GridFilterItem } from '@mui/x-data-grid';
import { Order } from '../../../types/common';
interface DonationInfoProps {
  open: boolean;
  onClose: () => void;
  data: Donation | null;
}

interface DonationTree {
  recipient_name: string;
  sapling_id: string;
  plant_type: string;
  scientific_name: string;
  trees_count: number;
  assignee_name: string;
}

const DonationInfo: React.FC<DonationInfoProps> = ({ open, onClose, data }) => {
  const [donationUsers, setDonationUsers] = useState<any[]>([]);
  const [donationTrees, setDonationTrees] = useState<DonationTree[]>([]);
  const [reservationStats, setReservationStats] = useState<{ already_reserved: number;  assigned_trees: number; }>({already_reserved: 0, assigned_trees: 0});
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const theme = useTheme();

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  const handleSortingChange = (sorter: any) => {
    let newOrder = [...orderBy];
    const updateOrder = () => {
        const index = newOrder.findIndex((item) => item.column === sorter.field);
        if (index > -1) {
            if (sorter.order) newOrder[index].order = sorter.order;
            else newOrder = newOrder.filter((item) => item.column !== sorter.field);
        } else if (sorter.order) {
            newOrder.push({ column: sorter.field, order: sorter.order });
        }
    }

    if (sorter.field) {
        setPage(0);
        updateOrder();
        setOrderBy(newOrder);
    }
}

useEffect(() => {
  const loadReservationStats = async () => {
    const apiClient = new ApiClient();
    if (open && data) {
      try {
        const stats = await apiClient.getDonationReservationStats(data.id);
        setReservationStats(stats);
      } catch (error) {
        console.error("Error loading reservation stats:", error);
      }
    }
  };
  loadReservationStats();
}, [open, data]);


  

  useEffect(() => {
    const getDonationUsers = async () => {
      if (data) {
        try {
          const apiClient = new ApiClient();
          const users = await apiClient.getDonationUsers(0, -1, [
            { columnField: 'donation_id', operatorValue: 'equals', value: data.id }
          ]);
          setDonationUsers(users.results);
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

  useEffect(() => {
    const getDonationTrees = async () => {
      if (data) {
        try {
          const apiClient = new ApiClient();
          const apiFilters = [
            { columnField: 'donation_id', operatorValue: 'equals', value: data.id },
            ...Object.values(filters) // Include dynamic filters
          ];
          const trees = await apiClient.getDonationTrees(
            page * pageSize, // Use pagination
            pageSize,
            apiFilters
          );
          setDonationTrees(trees.results as unknown as DonationTree[]);
        } catch (error) {
          console.error("Error fetching donation trees:", error);
          setDonationTrees([]);
        }
      }
    };
  
    if (open && data) {
      getDonationTrees();
    }
  }, [open, data, page, pageSize, filters, orderBy]);
  

  const columns: any[] = [
    {
      dataIndex: "sapling_id",
      key: "sapling_id",
      title: "Sapling ID",
      align: "center",
      width: 150,
          ...getColumnSearchProps('sapling_id', filters, handleSetFilters),

    },
    {
      dataIndex: "plant_type",
      key: "plant_type",
      title: "Plant Type",
      align: "center",
      width: 150,
          ...getColumnSearchProps('plant_type', filters, handleSetFilters),
    },
    {
      dataIndex: "scientific_name",
      key: "scientific_name",
      title: "Scientific Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('scientific_name', filters, handleSetFilters),
    },
    {
      dataIndex: "recipient_name",
      key: "recipient",
      title: "Recipient",
      align: "center",
      width: 200,
      ...getColumnSearchProps('recipient_name', filters, handleSetFilters),
    },
    {
      dataIndex: "assignee_name",
      key: "assignee",
      title: "Assigned to",
      align: "center",
      width: 200,
      ...getColumnSearchProps('assignee_name', filters, handleSetFilters),
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
        {(donationTrees.length > 0) && (
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined sx={{ color: '#2e7d32' }} /> Donation Trees
            </Typography>
           
           <Box mb={2} sx={{ 
              display: 'flex', 
              gap: 4, 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              alignItems: 'center'
            }}>
            <Typography>
              <strong>Reserved Trees:</strong> {reservationStats.already_reserved}
            </Typography>
            <Typography>
              <strong>Assigned Trees:</strong> {reservationStats.assigned_trees}
            </Typography>
           </Box>

            <GeneralTable
              loading={false}
              columns={columns}
              rows={donationTrees}
              totalRecords={donationTrees.length}
              page={page}
              pageSize={pageSize}
              onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
              onDownload={async () => donationTrees}
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