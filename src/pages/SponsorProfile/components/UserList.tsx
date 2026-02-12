import React from 'react';
import { Grid } from '@mui/material';
import { UserItem } from '../types/userItem';
import UserCard from './UserCard';
import SkeletonRequestCard from './SkeletonRequestCard';
import EmptyState from './EmptyState';

interface UserListProps {
  users: UserItem[];
  loading?: boolean;
  isGroupView: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, loading, isGroupView }) => {
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

  if (users.length === 0) {
    return <EmptyState isGroupView={isGroupView} />;
  }

  return (
    <Grid
      container
      spacing={2}
      data-testid="user-grid"
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
      {users.map((user) => (
        <Grid item key={user.id} data-testid="user-card-wrapper">
          <UserCard user={user} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UserList;
