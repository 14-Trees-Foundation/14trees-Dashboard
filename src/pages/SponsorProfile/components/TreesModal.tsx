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
  Menu,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { Close as CloseIcon, Search, FilterList } from '@mui/icons-material';
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
  inline?: boolean; // When true, renders content inline instead of as modal
}

type ImageType = 'illustration' | 'user' | 'tree' | 'giftcard';

const TreesModal: React.FC<TreesModalProps> = ({ open, onClose, request, userId, groupId, inline = false }) => {
  const [trees, setTrees] = useState<any[]>([]);
  const [filteredTrees, setFilteredTrees] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [filter, setFilter] = useState<'default' | 'memorial' | 'all'>('default');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [imageType, setImageType] = useState<ImageType>('illustration');

  const isGroupView = !!groupId;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getImageForType = (tree: any, type: ImageType): string => {
    switch (type) {
      case 'illustration':
        return tree.illustration_s3_path || tree.image || '';
      case 'user':
        // User uploaded image for this specific tree
        return tree.user_tree_image || tree.illustration_s3_path || tree.image || '';
      case 'tree':
        // Actual tree photo (image field is the primary tree photo)
        return tree.image || tree.illustration_s3_path || '';
      case 'giftcard':
        // Gift card image from gift_cards table (joined via tree_id)
        return tree.gift_card_image || tree.illustration_s3_path || tree.image || '';
      default:
        return tree.illustration_s3_path || tree.image || '';
    }
  };

  const getTrees = async (offset: number = 0) => {
    if (!request) return;

    try {
      setLoading(true);
      const apiClient = new ApiClient();

      // Build filters based on request type
      const filters: any[] = [];

      if (request.type === 'Origin Trees') {
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

  // Fetch trees when modal opens or request changes (or immediately if inline)
  useEffect(() => {
    if ((open || inline) && request) {
      setTrees([]);
      setSearchStr('');
      setFilter('default');
      setImageType('illustration');
      getTrees(0);
    }
  }, [open, inline, request]);

  if (!request) return null;

  // Render content (used both in modal and inline)
  const renderContent = () => (
    <Box sx={{
      borderRadius: inline ? 0 : 3,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      mt: inline ? 0 : 3,
      '@media (max-width: 768px)': {
        mt: 0,
      }
    }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: 'rgba(156, 197, 61, 0.25)' // Darker, more vibrant green
          }}
        >
        <Box>
          {request.type !== 'Origin Trees' ? (
            <>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {request.eventName}
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={0.3}>
                {request.type} • {formatDate(request.date)}
              </Typography>
            </>
          ) : (
            <Typography variant="h5" fontWeight={600} color="text.primary">
              {request.type}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Total Trees: {request.treeCount}
          </Typography>
        </Box>
        {!inline && (
          <IconButton onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: 'rgba(156, 197, 61, 0.25)' }}>
        {/* Filter Controls Section */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={isGroupView ? "flex-end" : "space-between"}
            sx={{
              flexDirection: 'row',
              gap: 2,
              // Mobile: horizontal layout with compact spacing
              '@media (max-width: 768px)': {
                gap: 1,
              }
            }}
          >
            {/* Desktop: Show filters inline - Hide for group view */}
            {!isGroupView && (
              <FormControl
                component="fieldset"
                sx={{
                  '@media (max-width: 768px)': {
                    display: 'none',
                  }
                }}
              >
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="default"
                    control={
                      <Checkbox
                        checked={filter === 'default' || filter === 'all'}
                        onChange={() => { setFilter('default') }}
                        sx={{ py: 0.5 }}
                      />
                    }
                    label="F&F Trees"
                    labelPlacement="end"
                    sx={{ mr: 1 }}
                  />
                  <FormControlLabel
                    value="memorial"
                    control={
                      <Checkbox
                        checked={filter === 'memorial' || filter === 'all'}
                        onChange={() => { setFilter('memorial') }}
                        sx={{ py: 0.5 }}
                      />
                    }
                    label="Memorial Trees"
                    labelPlacement="end"
                    sx={{ mr: 1 }}
                  />
                  <FormControlLabel
                    value="all"
                    control={
                      <Checkbox
                        checked={filter === 'all'}
                        onChange={() => { setFilter(prev => prev === 'all' ? 'default' : 'all') }}
                        sx={{ py: 0.5 }}
                      />
                    }
                    label="Show All"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            )}

            <Paper
              component="div"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                maxWidth: '100%',
                backgroundColor: 'rgba(156, 197, 61, 0.12)', // Lighter green for search bar
                // Mobile: take remaining space
                '@media (max-width: 768px)': {
                  flex: 1,
                }
              }}
            >
              <IconButton sx={{ p: '8px' }} aria-label="search">
                <Search />
              </IconButton>
              <InputBase
                value={searchStr}
                onChange={(e) => { setSearchStr(e.target.value) }}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search name"
                inputProps={{ 'aria-label': 'search friends & family members' }}
              />
              {/* Mobile: Filter Menu Icon - Hide for group view */}
              {!isGroupView && (
                <IconButton
                  sx={{
                    p: '8px',
                    display: 'none',
                    '@media (max-width: 768px)': {
                      display: 'block',
                    }
                  }}
                  aria-label="filter options"
                  onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                >
                  <FilterList />
                </IconButton>
              )}
            </Paper>
          </Box>

          {/* Image Type Toggle */}
          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ToggleButtonGroup
              value={imageType}
              exclusive
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setImageType(newValue);
                }
              }}
              aria-label="image type"
              size="small"
              sx={{
                backgroundColor: '#FFFFFF',
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  border: '1px solid rgba(156, 197, 61, 0.5)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(156, 197, 61, 0.3)',
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(156, 197, 61, 0.4)',
                    }
                  }
                },
                // Mobile: stack buttons or make smaller
                '@media (max-width: 768px)': {
                  flexWrap: 'wrap',
                  '& .MuiToggleButton-root': {
                    fontSize: '0.75rem',
                    px: 1.5,
                  }
                }
              }}
            >
              <ToggleButton value="illustration" aria-label="tree illustration">
                Illustration
              </ToggleButton>
              <ToggleButton value="user" aria-label="user image">
                User Image
              </ToggleButton>
              <ToggleButton value="tree" aria-label="tree image">
                Tree Photo
              </ToggleButton>
              <ToggleButton value="giftcard" aria-label="gift card image">
                Gift Card
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Filter Menu for Mobile - Hide for group view */}
        {!isGroupView && (
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => setFilterMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setFilter('default');
                setFilterMenuAnchor(null);
              }}
              selected={filter === 'default'}
            >
              F&F Trees
            </MenuItem>
            <MenuItem
              onClick={() => {
                setFilter('memorial');
                setFilterMenuAnchor(null);
              }}
              selected={filter === 'memorial'}
            >
              Memorial Trees
            </MenuItem>
            <MenuItem
              onClick={() => {
                setFilter('all');
                setFilterMenuAnchor(null);
              }}
              selected={filter === 'all'}
            >
              Show All
            </MenuItem>
          </Menu>
        )}

        {/* Trees Grid */}
        <Box
          className="no-scrollbar"
          sx={{
            height: 'calc(100vh - 280px)',
            overflowY: 'scroll',
            backgroundColor: '#F5F5F5', // Light grey background for trees grid (original color)
            p: 2,
            m: 2,
            borderRadius: 1,
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
                image: getImageForType(tree, imageType),
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
    </Box>
  );

  // Return either inline content or wrapped in Dialog
  if (inline) {
    return renderContent();
  }

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
          backgroundColor: 'rgba(63, 83, 68, 0.95)',
          '@media (min-width: 768px)': {
            paddingLeft: '10%',
            paddingRight: '10%',
          }
        }
      }}
    >
      {renderContent()}
    </Dialog>
  );
};

export default TreesModal;
