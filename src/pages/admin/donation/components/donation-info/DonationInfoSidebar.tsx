import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme
} from '@mui/material';
import {
  AssessmentOutlined,
  NatureOutlined,
  ReceiptOutlined,
  PersonOutlined,
  ChatOutlined,
  PeopleOutlined,
  PaymentOutlined,
  ScheduleOutlined
} from '@mui/icons-material';
import { Donation } from '../../../../../types/donation';
import { Payment } from '../../../../../types/payment';

interface DonationInfoSidebarProps {
  data: Donation;
  donationUsers: any[];
  rpPayments: any[];
  payment: Payment | null;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const DonationInfoSidebar: React.FC<DonationInfoSidebarProps> = ({
  data,
  donationUsers,
  rpPayments,
  payment,
  activeSection,
  scrollToSection
}) => {
  const theme = useTheme();

  // Define sections for navigation
  const sections = [
    { id: 'processing-summary', label: 'Processing Summary', icon: <AssessmentOutlined /> },
    { id: 'donation-trees', label: 'Donation Trees', icon: <NatureOutlined /> },
    { id: 'donation-details', label: 'Donation Details', icon: <ReceiptOutlined /> },
    { id: 'donor-details', label: 'Donor Details', icon: <PersonOutlined /> },
    ...(data?.names_for_plantation || data?.comments ? [{ id: 'comments-feedback', label: 'Comments/Feedback', icon: <ChatOutlined /> }] : []),
    ...(donationUsers.length > 0 ? [{ id: 'recipients', label: 'Recipients', icon: <PeopleOutlined /> }] : []),
    ...((rpPayments.length > 0 || (payment?.payment_history && payment?.payment_history.length > 0)) ? [{ id: 'payment-history', label: 'Payment History', icon: <PaymentOutlined /> }] : []),
    { id: 'dates', label: 'Dates', icon: <ScheduleOutlined /> }
  ];

  return (
    <Box sx={{ 
      width: 280, 
      bgcolor: 'rgba(0,0,0,0.02)', 
      borderRight: `1px solid ${theme.palette.divider}`,
      overflow: 'auto'
    }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: '#2e7d32', color: 'white' }}>
        
      </Typography>
      <List sx={{ p: 0 }}>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              onClick={() => scrollToSection(section.id)}
              selected={activeSection === section.id}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(46, 125, 50, 0.12)',
                  borderRight: `3px solid #2e7d32`,
                  '& .MuiListItemText-primary': {
                    color: '#2e7d32',
                    fontWeight: 600
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(46, 125, 50, 0.06)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: activeSection === section.id ? '#2e7d32' : 'inherit' 
              }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText 
                primary={section.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DonationInfoSidebar;