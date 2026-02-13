import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import {
  CardGiftcard as GiftIcon,
  Park as TreeIcon,
  LocationOn as VisitIcon,
  Favorite as DonationIcon,
  History as MiscIcon
} from '@mui/icons-material';
import { RequestItem, RequestType } from '../types/requestItem';

interface RequestCardProps {
  request: RequestItem;
  onClick: (request: RequestItem) => void;
}

const getIconForType = (type: RequestType, theme: any) => {
  switch (type) {
    case 'Tree Gifts':
      return <GiftIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />;
    case 'Direct Sponsorship':
      return <TreeIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />;
    case 'Event Participation':
      return <VisitIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />;
    case 'Donation':
      return <DonationIcon sx={{ fontSize: 40, color: theme.palette.error?.main || '#FF5722' }} />;
    case 'Origin Trees':
      return <MiscIcon sx={{ fontSize: 40, color: theme.palette.text.secondary }} />;
    default:
      return <TreeIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />;
  }
};

const getColorForType = (type: RequestType, theme: any) => {
  switch (type) {
    case 'Tree Gifts':
      return '#E0E0E0'; // Gift cards - darker greyish background (not highlighted)
    case 'Direct Sponsorship':
      return alpha(theme.palette.success.main, 0.15); // Direct Sponsorship - highlighted with green tinted background
    case 'Event Participation':
      return alpha(theme.palette.secondary.main, 0.15); // Event Participation - highlighted with secondary color tinted background
    case 'Donation':
      return alpha(theme.palette.error?.main || '#FF5722', 0.15); // Donation - highlighted with red/orange tinted background
    case 'Origin Trees':
      return alpha(theme.palette.primary.main, 0.25); // Historical - highlighted with brighter blue tinted background
    default:
      return alpha(theme.palette.primary.main, 0.15);
  }
};

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const theme = useTheme();
  const backgroundColor = getColorForType(request.type, theme);
  const icon = getIconForType(request.type, theme);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card
      onClick={() => onClick(request)}
      data-testid="request-card"
      data-type={request.type}
      data-event-name={request.eventName}
      data-tree-count={request.treeCount}
      sx={{
        backgroundColor,
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
        // Mobile responsive
        '@media (max-width: 768px)': {
          minHeight: 160,
        }
      }}
      aria-label={`${request.type} - ${request.eventName} - ${request.treeCount} trees - ${formatDate(request.date)}`}
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
            // Mobile: smaller height
            '@media (max-width: 768px)': {
              minHeight: 60,
            }
          }}
        >
          {/* Left: Icon + Event Name */}
          <Box display="flex" alignItems="flex-start" flex={1} minWidth={0}>
            <Box sx={{ flexShrink: 0, mt: 0.5 }}>
              {icon}
            </Box>
            <Typography
              variant="h6"
              data-testid="card-event-name"
              sx={{
                ml: 1,
                fontWeight: 600,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                // Mobile: smaller font
                '@media (max-width: 768px)': {
                  fontSize: '1rem',
                }
              }}
            >
              {request.eventName || 'N/A'}
            </Typography>
          </Box>

          {/* Right: Photo Thumbnail - Always reserve space */}
          <Box
            sx={{
              width: 60,
              height: 60,
              ml: 2,
              flexShrink: 0,
              // Mobile: slightly smaller
              '@media (max-width: 768px)': {
                width: 50,
                height: 50,
              }
            }}
          >
            {request.thumbnailPhoto && (
              <Box
                component="img"
                src={request.thumbnailPhoto}
                alt="Tree preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: theme.shape.borderRadius / 1.5,
                  objectFit: 'cover',
                }}
                onError={(e: any) => {
                  // Hide image on error instead of showing broken image
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </Box>
        </Box>

        {/* Details Section */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            data-testid="card-type"
          >
            Type: {request.type}
          </Typography>

          {request.type !== 'Origin Trees' && (
            <Typography variant="body2" color="text.secondary" gutterBottom data-testid="card-date">
              Date: {formatDate(request.date)}
            </Typography>
          )}

          <Typography
            variant="body1"
            data-testid="card-tree-count"
            sx={{
              fontWeight: 500,
              mt: 1,
            }}
          >
            Trees: {request.treeCount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
