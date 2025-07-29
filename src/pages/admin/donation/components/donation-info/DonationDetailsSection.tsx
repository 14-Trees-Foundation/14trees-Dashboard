import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import { ReceiptOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import { Donation } from '../../../../../types/donation';

interface DonationDetailsSectionProps {
  data: Donation;
  sectionRef: (el: HTMLElement | null) => void;
}

const DonationDetailsSection: React.FC<DonationDetailsSectionProps> = ({
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
        <ReceiptOutlined sx={{ color: '#2e7d32' }} /> Donation Details
      </Typography>
      <Box sx={{ ml: 4 }}>
        <Typography sx={{ mb: 1 }}><strong>Donation ID:</strong> {data.id}</Typography>

        {data.trees_count > 0 ? (
          <>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="span"><strong>Land Category:</strong></Typography>
              <Chip size="small" label={data.category} sx={{ bgcolor: '#2e7d32', color: 'white' }} />
            </Box>
            {data.grove_type_other && (
              <Typography sx={{ mb: 1 }}><strong>Grove Type (Other):</strong> {data.grove_type_other}</Typography>
            )}
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="span"><strong>Trees Count:</strong></Typography>
              <Chip size="small" label={data.trees_count} sx={{ bgcolor: '#2e7d32', color: 'white' }} />
            </Box>
            {data.preference === 'adopt_trees' && (
              <Typography sx={{ mb: 1 }}>
                <strong>Visit Date:</strong> {data.visit_date 
                  ? format(new Date(data.visit_date), 'PPP')
                  : 'Not scheduled'}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ mb: 1 }}><strong>Amount Donated:</strong> ₹{data.amount_donated || 'N/A'}</Typography>
        )}

        <Typography>
          <strong>Additional Contribution:</strong> {
            data.contribution_options && 
            (Array.isArray(data.contribution_options) ? data.contribution_options.length > 0 : String(data.contribution_options).trim() !== '') 
              ? (Array.isArray(data.contribution_options) 
                  ? data.contribution_options.join(', ') 
                  : String(data.contribution_options).replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+|(?=[A-Z])/).filter(Boolean).join(', ')
                ) 
              : 'N/A'
          }
        </Typography>
      </Box>
    </Paper>
  );
};

export default DonationDetailsSection;