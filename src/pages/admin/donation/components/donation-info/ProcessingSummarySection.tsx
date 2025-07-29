import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import { AssessmentOutlined } from '@mui/icons-material';
import { Donation } from '../../../../../types/donation';

interface ProcessingSummarySectionProps {
  data: Donation;
  getCapturedAmount: () => number;
  sectionRef: (el: HTMLElement | null) => void;
}

const ProcessingSummarySection: React.FC<ProcessingSummarySectionProps> = ({
  data,
  getCapturedAmount,
  sectionRef
}) => {
  const theme = useTheme();

  return (
    <Paper 
      ref={sectionRef}
      elevation={1} 
      sx={{ p: 2, mb: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentOutlined sx={{ color: '#2e7d32' }} /> Processing Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        
        {/* Trees Processing Section */}
        {data.trees_count > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">Trees Reserved:</Typography>
              <Chip 
                size="small" 
                label={`${data.booked}/${data.trees_count}`} 
                sx={{ 
                  bgcolor: data.booked >= data.trees_count ? '#2e7d32' : '#ff9800', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">Trees Assigned:</Typography>
              <Chip 
                size="small" 
                label={`${data.assigned}/${data.trees_count}`} 
                sx={{ 
                  bgcolor: data.assigned >= data.trees_count ? '#2e7d32' : '#ff9800', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
          </>
        )}

        {/* Payment Status */}
        {data.amount_donated && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">Payment Status:</Typography>
            <Chip 
              size="small" 
              label={getCapturedAmount() == data.amount_donated ? "Fully Paid" : "Pending"} 
              sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 600 }} 
            />
          </Box>
        )}

        {/* Request Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">Request Status:</Typography>
          <Chip 
            size="small" 
            label={data.status === 'Paid' ? 'Submitted' : 'Fulfilled'} 
            sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 600 }} 
          />
        </Box>

        {/* Email Processing Section */}
        <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: data.mail_error ? 1 : 0 }}>
            {['AckSent', 'DashboardsSent', 'BackOffice', 'Accounts', 'Volunteer', 'CSR'].map(status => (
              <Chip 
                key={status}
                size="small" 
                label={status} 
                sx={{ 
                  bgcolor: data.mail_status?.includes(status) ? '#2e7d32' : '#ff9800', 
                  color: 'white',
                  fontWeight: 500
                }} 
              />
            ))}
          </Box>
          {data.mail_error && (
            <Typography color='error' variant="body2" sx={{ p: 0.5, bgcolor: 'rgba(255,0,0,0.1)', borderRadius: 1, display: 'block' }}>
              {data.mail_error}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProcessingSummarySection;