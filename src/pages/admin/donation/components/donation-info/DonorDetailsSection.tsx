import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { PersonOutlined } from '@mui/icons-material';
import { Donation } from '../../../../../types/donation';

interface DonorDetailsSectionProps {
  data: Donation;
  sectionRef: (el: HTMLElement | null) => void;
}

const DonorDetailsSection: React.FC<DonorDetailsSectionProps> = ({
  data,
  sectionRef
}) => {
  const theme = useTheme();

  return (
    <Paper 
      ref={sectionRef}
      elevation={1} 
      sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonOutlined sx={{ color: '#2e7d32' }} /> Donor Details
      </Typography>
      <Box sx={{ ml: 4 }}>
        <Typography sx={{ mb: 1 }}><strong>Name:</strong> {data.user_name || 'N/A'}</Typography>
        <Typography><strong>Email:</strong> {data.user_email || 'N/A'}</Typography>
      </Box>
    </Paper>
  );
};

export default DonorDetailsSection;