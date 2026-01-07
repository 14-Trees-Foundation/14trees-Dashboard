import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  InputBase,
  Button,
  Divider
} from '@mui/material';
import { Close as CloseIcon, Search } from '@mui/icons-material';
import { RequestItem } from '../types/requestItem';
import ApiClient from '../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';
import CardGrid from '../../../components/CardGrid';

interface TreesModalProps {
  open: boolean;
  onClose: () => void;
  request: RequestItem | null;
  userId?: number;
  groupId?: number;
}

const TreesModal: React.FC<TreesModalProps> = ({ open, onClose, request, userId, groupId }) => {
  const [trees, setTrees] = useState<any[]>([]);
  const [filteredTrees, setFilteredTrees] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [filter, setFilter] = useState<'default' | 'memorial' | 'all'>('default');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getTrees = async (offset: number = 0) => {
    if (!request) return;

    try {
      setLoading(true);
      const apiClient = new ApiClient();

      // Build filters based on request type
      const filters: any[] = [];

      if (request.type === 'Historical Sponsorships') {
        // Historical sponsorships: donation_id IS NULL AND gift_card_request_id IS NULL
        filters.push(
          { columnField: 'donation_id', operatorValue: 'isNull' },
          { columnField: 'gift_card_request_id', operatorValue: 'isNull' }
        );
      } else if (request.type === 'Donation') {
        // Filter by donation_id
        filters.push({
          columnField: 'donation_id',
          operatorValue: 'equals',
          value: request.id
        });
      } else {
        // Tree Gifts, Direct Sponsorship, Event Participation - filter by gift_card_request_id
        filters.push({
          columnField: 'gift_card_request_id',
          operatorValue: 'equals',
          value: request.id
        });
      }

      let response;
      if (groupId) {
        response = await apiClient.getMappedTreesForGroup(groupId, offset, 50, filters);
      } else if (userId) {
        response = await apiClient.getMappedTreesForTheUser(userId, offset, 50, filters);
      } else {
        throw new Error('Either userId or groupId must be provided');
      }

      setTotal(Number(response.total));
      setTrees(prev => offset === 0 ? response.results : [...prev, ...response.results]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch trees');
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters (F&F, Memorial, Search)
  useEffect(() => {
    const handler = setTimeout(() => {
      let filteredData: any[] = [];
      if (filter === 'all') filteredData = trees;
      else if (filter === 'memorial') filteredData = trees.filter(tree => tree.event_type === '2');
      else filteredData = trees.filter(tree => tree.event_type !== '2');

      if (searchStr.trim() !== '') {
        filteredData = filteredData.filter(item =>
          item.assigned_to_name?.toLowerCase()?.includes(searchStr.toLowerCase())
        );
      }

      setFilteredTrees(filteredData);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchStr, filter, trees]);

  // Fetch trees when modal opens or request changes
  useEffect(() => {
    if (open && request) {
      setTrees([]);
      setSearchStr('');
      setFilter('default');
      getTrees(0);
    }
  }, [open, request]);

  if (!request) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          width: '100vw',
          height: '100vh',
          margin: 0,
          maxWidth: '100vw',
          maxHeight: '100vh',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {request.type}
          </Typography>
          {request.type !== 'Historical Sponsorships' && (
            <Typography variant="body2" color="text.secondary">
              {request.eventName} • {formatDate(request.date)}
            </Typography>
          )}
          <Typography variant="body1" color="text.primary" mt={0.5}>
            Total Trees: {request.treeCount}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close modal">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2 }}>
        {/* Filter Controls */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          sx={{
            flexDirection: 'row',
            gap: 2,
            // Mobile: stack vertically
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              alignItems: 'stretch',
            }
          }}
        >
          <FormControl component="fieldset">
            <FormGroup
              aria-label="position"
              row
              sx={{
                // Mobile: stack checkboxes vertically
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                }
              }}
            >
              <FormControlLabel
                value="default"
                control={
                  <Checkbox
                    checked={filter === 'default' || filter === 'all'}
                    onChange={() => { setFilter('default') }}
                  />
                }
                label="F&F Trees"
                labelPlacement="end"
              />
              <FormControlLabel
                value="memorial"
                control={
                  <Checkbox
                    checked={filter === 'memorial' || filter === 'all'}
                    onChange={() => { setFilter('memorial') }}
                  />
                }
                label="Memorial Trees"
                labelPlacement="end"
              />
              <FormControlLabel
                value="all"
                control={
                  <Checkbox
                    checked={filter === 'all'}
                    onChange={() => { setFilter(prev => prev === 'all' ? 'default' : 'all') }}
                  />
                }
                label="Show All"
                labelPlacement="end"
              />
            </FormGroup>
          </FormControl>

          <Paper
            component="div"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              maxWidth: '100%',
              backgroundColor: '#e3e3e3bf',
              // Mobile: full width
              '@media (max-width: 768px)': {
                width: '100%',
              }
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
            <InputBase
              value={searchStr}
              onChange={(e) => { setSearchStr(e.target.value) }}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search name"
              inputProps={{ 'aria-label': 'search friends & family members' }}
            />
          </Paper>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Trees Grid */}
        <Box
          className="no-scrollbar"
          sx={{
            height: 'calc(100vh - 280px)',
            overflowY: 'scroll',
          }}
        >
          <CardGrid
            loading={loading}
            cards={filteredTrees.map(tree => {
              let location: string = '';
              const { hostname, host } = window.location;
              if (hostname === "localhost" || hostname === "127.0.0.1") {
                location = "http://" + host + "/profile/" + tree.sapling_id;
              } else {
                location = "https://" + hostname + "/profile/" + tree.sapling_id;
              }

              return {
                id: tree.id,
                name: tree.assigned_to_name,
                type: tree.plant_type,
                dashboardLink: location,
                image: tree.illustration_s3_path
                  ? tree.illustration_s3_path
                  : tree.image,
              };
            })}
          />

          {/* Load More Button */}
          {total > trees.length && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <Button
                variant="contained"
                color="success"
                disabled={loading}
                onClick={() => { getTrees(trees.length) }}
              >
                Load More
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TreesModal;
