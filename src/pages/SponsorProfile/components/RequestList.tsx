import React from 'react';
import { Box, Grid } from '@mui/material';
import { RequestItem } from '../types/requestItem';
import RequestCard from './RequestCard';
import SkeletonRequestCard from './SkeletonRequestCard';
import EmptyState from './EmptyState';

interface RequestListProps {
  requests: RequestItem[];
  onRequestClick: (request: RequestItem) => void;
  loading?: boolean;
  isGroupView: boolean;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onRequestClick, loading, isGroupView }) => {
  if (loading) {
    return (
      <Grid
        container
        spacing={2}
        data-testid="loading-state"
        sx={{
          // Desktop: 3 columns
          '@media (min-width: 1200px)': {
            '& > .MuiGrid-item': {
              flexBasis: 'calc(33.333% - 16px)',
              maxWidth: 'calc(33.333% - 16px)',
            }
          },
          // Tablet: 2 columns
          '@media (min-width: 768px) and (max-width: 1199px)': {
            '& > .MuiGrid-item': {
              flexBasis: 'calc(50% - 16px)',
              maxWidth: 'calc(50% - 16px)',
            }
          },
          // Mobile: 1 column
          '@media (max-width: 767px)': {
            '& > .MuiGrid-item': {
              flexBasis: '100%',
              maxWidth: '100%',
            }
          }
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item key={item}>
            <SkeletonRequestCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (requests.length === 0) {
    return <EmptyState isGroupView={isGroupView} />;
  }

  return (
    <Grid
      container
      spacing={2}
      data-testid="request-grid"
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
        <Grid item key={`${request.type}-${request.id}`} data-testid="request-card-wrapper">
          <RequestCard request={request} onClick={onRequestClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestList;
