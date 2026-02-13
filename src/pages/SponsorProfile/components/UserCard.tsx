import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha, Avatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserItem } from '../types/userItem';

interface UserCardProps {
  user: UserItem;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sponsorship/${user.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      data-testid="user-card"
      data-user-id={user.id}
      data-user-name={user.name}
      data-tree-count={user.treeCount}
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        cursor: 'pointer',
        height: '100%',
        minHeight: 180,
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        '@media (max-width: 768px)': {
          minHeight: 160,
        }
      }}
      aria-label={`${user.name} - ${user.treeCount} trees`}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Profile Photo */}
        <Box mb={2}>
          {user.profilePhoto ? (
            <Avatar
              src={user.profilePhoto}
              alt={user.name}
              sx={{
                width: 80,
                height: 80,
                '@media (max-width: 768px)': {
                  width: 60,
                  height: 60,
                }
              }}
              onError={(e: any) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                '@media (max-width: 768px)': {
                  width: 60,
                  height: 60,
                }
              }}
            >
              <PersonIcon sx={{ fontSize: 48 }} />
            </Avatar>
          )}
        </Box>

        {/* User Name */}
        <Typography
          variant="h6"
          data-testid="user-name"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mb: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}
        >
          {user.name}
        </Typography>

        {/* Email (optional) */}
        {user.email && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              fontSize: '0.875rem',
            }}
          >
            {user.email}
          </Typography>
        )}

        {/* Tree Count - Hidden as per user request */}
        {/* <Typography
          variant="h5"
          data-testid="user-tree-count"
          sx={{
            fontWeight: 600,
            color: theme.palette.success.main,
            mt: 1,
            '@media (max-width: 768px)': {
              fontSize: '1.25rem',
            }
          }}
        >
          {user.treeCount} {user.treeCount === 1 ? 'Tree' : 'Trees'}
        </Typography> */}
      </CardContent>
    </Card>
  );
};

export default UserCard;
