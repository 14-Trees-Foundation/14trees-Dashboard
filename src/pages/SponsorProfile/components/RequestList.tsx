import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { RequestItem } from '../types/requestItem';
import RequestCard from './RequestCard';

interface RequestListProps {
  requests: RequestItem[];
  onRequestClick: (request: RequestItem) => void;
  loading?: boolean;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onRequestClick, loading }) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          Loading requests...
        </Typography>
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          No requests found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{
        // Desktop: 3 columns (≥1200px)
        '@media (min-width: 1200px)': {
          '& > .MuiGrid-item': {
            flexBasis: 'calc(33.333% - 16px)',
            maxWidth: 'calc(33.333% - 16px)',
          }
        },
        // Tablet: 2 columns (768px - 1199px)
        '@media (min-width: 768px) and (max-width: 1199px)': {
          '& > .MuiGrid-item': {
            flexBasis: 'calc(50% - 16px)',
            maxWidth: 'calc(50% - 16px)',
          }
        },
        // Mobile: 1 column (<768px)
        '@media (max-width: 767px)': {
          '& > .MuiGrid-item': {
            flexBasis: '100%',
            maxWidth: '100%',
          }
        }
      }}
    >
      {requests.map((request) => (
        <Grid item key={`${request.type}-${request.id}`}>
          <RequestCard request={request} onClick={onRequestClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestList;
