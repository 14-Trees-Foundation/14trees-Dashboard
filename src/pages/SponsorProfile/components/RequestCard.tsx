import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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

const getIconForType = (type: RequestType) => {
  switch (type) {
    case 'Gift Cards':
      return <GiftIcon sx={{ fontSize: 40 }} />;
    case 'Normal Assignment':
      return <TreeIcon sx={{ fontSize: 40 }} />;
    case 'Visit':
      return <VisitIcon sx={{ fontSize: 40 }} />;
    case 'Donation':
      return <DonationIcon sx={{ fontSize: 40 }} />;
    case 'Miscellaneous':
      return <MiscIcon sx={{ fontSize: 40 }} />;
    default:
      return <TreeIcon sx={{ fontSize: 40 }} />;
  }
};

const getColorForType = (type: RequestType) => {
  switch (type) {
    case 'Gift Cards':
      return '#E3F2FD'; // Light blue
    case 'Normal Assignment':
      return '#E8F5E9'; // Light green
    case 'Visit':
      return '#F3E5F5'; // Light purple
    case 'Donation':
      return '#FFF3E0'; // Light orange
    case 'Miscellaneous':
      return '#F5F5F5'; // Light grey
    default:
      return '#F5F5F5';
  }
};

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const backgroundColor = getColorForType(request.type);
  const icon = getIconForType(request.type);

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
      sx={{
        backgroundColor,
        cursor: 'pointer',
        minHeight: 120,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        // Mobile responsive
        '@media (max-width: 768px)': {
          minHeight: 100,
        }
      }}
      aria-label={`${request.type} - ${request.eventName} - ${request.treeCount} trees - ${formatDate(request.date)}`}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              fontWeight: 600,
              // Mobile: smaller font
              '@media (max-width: 768px)': {
                fontSize: '1rem',
              }
            }}
          >
            {request.eventName || 'N/A'}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          Type: {request.type}
        </Typography>

        {request.type !== 'Miscellaneous' && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date: {formatDate(request.date)}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            mt: 1,
          }}
        >
          Trees: {request.treeCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
