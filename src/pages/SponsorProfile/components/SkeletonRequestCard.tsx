import React from 'react';
import { Card, CardContent, Box, Skeleton, useTheme } from '@mui/material';

const SkeletonRequestCard: React.FC = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        minHeight: 180,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        '@media (max-width: 768px)': {
          minHeight: 160,
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title Section - Fixed Height */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
          sx={{
            minHeight: 72,
            '@media (max-width: 768px)': {
              minHeight: 60,
            }
          }}
        >
          <Box display="flex" alignItems="flex-start" flex={1}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1, mt: 0.5 }} />
            <Skeleton variant="text" width="70%" height={32} />
          </Box>
          {/* Thumbnail skeleton - always reserve space */}
          <Skeleton
            variant="rectangular"
            width={60}
            height={60}
            sx={{
              borderRadius: theme.shape.borderRadius / 1.5,
              ml: 2,
              '@media (max-width: 768px)': {
                width: 50,
                height: 50,
              }
            }}
          />
        </Box>

        {/* Details Section */}
        <Box>
          <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="30%" height={24} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkeletonRequestCard;
