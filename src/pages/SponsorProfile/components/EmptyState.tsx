import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Park, Business } from '@mui/icons-material';

interface EmptyStateProps {
  isGroupView: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isGroupView }) => {
  const theme = useTheme();
  if (isGroupView) {
    // Corporate empty state
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        textAlign="center"
        p={4}
      >
        <Business sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight={600}>
          No CSR Tree Sponsorships Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3} maxWidth={500}>
          Begin your corporate sustainability program by sponsoring trees.
          Track your environmental impact and generate reports for stakeholders.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button variant="contained" color="primary" href="/contact">
            Contact Us
          </Button>
          <Button variant="outlined" color="primary" href="/programs">
            View Programs
          </Button>
        </Box>
      </Box>
    );
  }

  // Individual sponsor empty state
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      textAlign="center"
      p={4}
    >
      <Park sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
      <Typography variant="h5" gutterBottom fontWeight={600}>
        No Sponsorships Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3} maxWidth={500}>
        Start your environmental impact journey by sponsoring your first tree today.
        Every tree helps restore degraded ecosystems and supports local communities.
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <Button variant="contained" color="success" href="/sponsor-trees">
          Sponsor Trees
        </Button>
        <Button variant="outlined" color="success" href="/learn-more">
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyState;
