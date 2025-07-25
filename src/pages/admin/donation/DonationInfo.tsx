import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Donation } from '../../../types/donation';
import ApiClient from '../../../api/apiClient/apiClient';
import GeneralTable from '../../../components/GenTable';
import { 
  InfoOutlined, 
  EventOutlined, 
  VisibilityOutlined
} from '@mui/icons-material';

import { Payment, PaymentHistory } from '../../../types/payment';
import { getHumanReadableDate } from '../../../helpers/utils';
import DonationInfoSidebar from './components/donation-info/DonationInfoSidebar';
import ProcessingSummarySection from './components/donation-info/ProcessingSummarySection';
import DonationDetailsSection from './components/donation-info/DonationDetailsSection';
import DonorDetailsSection from './components/donation-info/DonorDetailsSection';
import DonationTrees from './components/donation-info/DonationTrees';



interface DonationInfoProps {
  open: boolean;
  onClose: () => void;
  data: Donation | null;
}

const DonationInfo: React.FC<DonationInfoProps> = ({ open, onClose, data }) => {
  const [donationUsers, setDonationUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const theme = useTheme();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [rpPayments, setRPPayments] = useState<any[]>([]);
  const [filePreview, setFilePreview] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<PaymentHistory | null>(null);
  const [activeSection, setActiveSection] = useState('processing-summary');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = contentRef.current.scrollTop;
      const containerTop = contentRef.current.offsetTop;
      
      const sections = [
        'processing-summary', 'donation-trees', 'donation-details', 'donor-details',
        'comments-feedback', 'recipients', 'payment-history', 'dates'
      ];
      
      let currentSection = sections[0];
      
      for (const sectionId of sections) {
        const element = sectionRefs.current[sectionId];
        if (element) {
          const elementTop = element.offsetTop - containerTop;
          if (scrollTop >= elementTop - 100) {
            currentSection = sectionId;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    const container = contentRef.current;
    if (container && open) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [donationUsers, rpPayments, payment, data, open]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      const containerTop = contentRef.current.offsetTop;
      const elementTop = element.offsetTop - containerTop;
      contentRef.current.scrollTo({
        top: elementTop - 20,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const getDonationUsers = async () => {
      if (data) {
        try {
          const apiClient = new ApiClient();
          const users = await apiClient.getDonationUsers(0, -1, [
            { columnField: 'donation_id', operatorValue: 'equals', value: data.id }
          ]);
          if (isMounted) {
            setDonationUsers(users.results);
          }
        } catch (error) {
          console.error("Error fetching donation users:", error);
          if (isMounted) {
            setDonationUsers([]);
          }
        }
      }
    };

    const getPaymentDetails = async () => {
      if (data?.payment_id) {
        try {
          const apiClient = new ApiClient();
          const paymentData = await apiClient.getPayment(data.payment_id);
          if (isMounted) {
            setPayment(paymentData);
          }
          
          if (paymentData.order_id) {
            const rpData = await apiClient.getPaymentsForOrder(paymentData.order_id);
            if (isMounted) {
              setRPPayments(rpData);
            }
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
      }
    };

    if (open && data) {
      getDonationUsers();
      getPaymentDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [open, data]);

  const handleOpenPreview = (record: PaymentHistory) => {
    setFilePreview(true);
    setSelectedHistory(record);
  }

  const handleClosePreview = () => {
    setFilePreview(false);
    setSelectedHistory(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setDonationUsers([]);
      setPayment(null);
      setRPPayments([]);
      setActiveSection('processing-summary');
    };
  }, []);

  const columns: any[] = [
    {
      dataIndex: "recipient_name",
      key: "recipient",
      title: "Assignee",
      align: "center",
      width: 200,
    },
    {
      dataIndex: "recipient_email",
      key: "recipient_email",
      title: "Assignee Email",
      align: "center",
      width: 250,
    },
    {
      dataIndex: "trees_count",
      key: "trees_count",
      title: "Trees Count",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "mail_sent",
      key: "mail_sent",
      title: "Email Status",
      align: "center",
      width: 200,
      render: (value: boolean | null) => {
        if (value === true) return 'Sent';
        if (value === false) return 'Failed';
        return 'Not Sent';
      }
    }
  ];

  const paymentColumns: any[] = [
    {
      dataIndex: "amount",
      key: "amount",
      title: "Amount paid",
      align: "center",
      width: 100,
      render: (value: number, record: any) => record.payment_method ? value : value / 100
    },
    {
      dataIndex: "method",
      key: "method",
      title: "Payment Method",
      align: "center",
      width: 200,
      render: (value: any, record: any) => value ? value : record.payment_method
    },
    {
      dataIndex: "payment_proof",
      key: "payment_proof",
      title: "Payment Proof",
      align: "center",
      width: 150,
      render: (value: any, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant='outlined'
            color='success'
            disabled={!value}
            style={{ margin: "0 5px" }}
            onClick={() => { handleOpenPreview(record) }}
          >
            <VisibilityOutlined />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "reference_number",
      key: "reference_number",
      title: "Transaction Id",
      align: "center",
      width: 150,
      render: (value: number, record: any) => {
        if (record.acquirer_data) {
          const keys = Object.keys(record.acquirer_data);
          for (const key of keys) {
            if (key.endsWith("transaction_id")) return record.acquirer_data[key];
          }
        }
        return '';
      }
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: "Payment Date",
      align: "center",
      width: 150,
      render: (value: number, record: any) => record.payment_date ? getHumanReadableDate(record.payment_date) : getHumanReadableDate(value * 1000),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "center",
      width: 150,
      render: (value: string) => value === "captured" ? "Success" : value === "failed" ? "Failed" : value,
    },
  ];

  const getCapturedAmount = () => {
    const capturedAmount = rpPayments
      .filter(payment => payment.status === "captured")
      .reduce((sum, payment) => sum + payment.amount, 0) / 100; // Convert from paise to rupees
    return capturedAmount;
  };

  if (!data) return null;

  // Check if additional information section should be displayed
  const hasAdditionalInfo = Boolean(data.names_for_plantation || data.comments);

  // console.log('Additional Info Debug:', {
  //   names_for_plantation: data.names_for_plantation,
  //   comments: data.comments,
  //   hasAdditionalInfo,
  //   fullData: data // Log full data to see structure
  // });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlined /> Donation Summary: {data.id}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, display: 'flex', height: '80vh' }}>
        {/* Left Sidebar Navigation */}
        <DonationInfoSidebar
          data={data}
          donationUsers={donationUsers}
          rpPayments={rpPayments}
          payment={payment}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />

        {/* Main Content Area */}
        <Box 
          ref={contentRef}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a1a1a1',
            },
          }}
        >
          {/* Donation Processing Summary */}
          <ProcessingSummarySection
            data={data}
            getCapturedAmount={getCapturedAmount}
            sectionRef={(el) => { sectionRefs.current['processing-summary'] = el; }}
          />

          {/* Donation Trees Section */}
          <Box ref={(el) => { sectionRefs.current['donation-trees'] = el; }} sx={{ mb: 3 }}>
            <DonationTrees donationId={data.id} />
          </Box>

          {/* Donation Details */}
          <DonationDetailsSection
            data={data}
            sectionRef={(el) => { sectionRefs.current['donation-details'] = el; }}
          />

          {/* Donor Details */}
          <DonorDetailsSection
            data={data}
            sectionRef={(el) => { sectionRefs.current['donor-details'] = el; }}
          />

          {/* Additional Information - only shown if there's content */}
          {(data.names_for_plantation || data.comments) && (
            <Paper 
              ref={(el) => { sectionRefs.current['comments-feedback'] = el; }}
              elevation={1} 
              sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlined sx={{ color: '#2e7d32' }} /> Comments/Feedback
              </Typography>
            <Box sx={{ ml: 4 }}>
              {data.names_for_plantation && (
                <Typography sx={{ mb: 1 }}><strong>Names for Plantation:</strong> {data.names_for_plantation}</Typography>
              )}
              {data.comments && (
                <Typography><strong>Comments:</strong> {data.comments}</Typography>
              )}
              </Box>
            </Paper>
          )}

          {/* Recipients */}
          {donationUsers.length > 0 && (
            <Paper 
              ref={(el) => { sectionRefs.current['recipients'] = el; }}
              elevation={1} 
              sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlined sx={{ color: '#2e7d32' }} /> Recipients
              </Typography>
            <GeneralTable
              loading={false}
              columns={columns}
              rows={donationUsers}
              totalRecords={donationUsers.length}
              page={page}
              pageSize={pageSize}
              onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
              onDownload={async () => donationUsers}
              footer
              tableName='Donation Recipients'
              />
            </Paper>
          )}

          {/* Payment History Section */}
          {(rpPayments.length > 0 || (payment?.payment_history && payment?.payment_history.length > 0)) && (
            <Paper 
              ref={(el) => { sectionRefs.current['payment-history'] = el; }}
              elevation={1} 
              sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlined sx={{ color: '#2e7d32' }} /> Payment History
              </Typography>
            <GeneralTable
              loading={false}
              rows={[...rpPayments, ...(payment?.payment_history ? payment.payment_history : [])].slice(page * pageSize, page * pageSize + pageSize)}
              columns={paymentColumns}
              totalRecords={rpPayments.length + (payment?.payment_history ? payment.payment_history.length : 0)}
              page={page}
              pageSize={pageSize}
              onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
              onDownload={async () => { return payment?.payment_history || [] }}
              tableName="Payment History"
              rowClassName={(record, index) => record.status === 'failed' ? 'pending-item' : ''}
              />
            </Paper>
          )}

          {/* Dates */}
          <Box 
            ref={(el) => { sectionRefs.current['dates'] = el; }}
            sx={{ mt: 2, p: 3, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventOutlined sx={{ color: '#2e7d32' }} /> Dates
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                <strong>Created At:</strong> {format(new Date(data.created_at), 'yyyy-MM-dd HH:mm:ss')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Updated At:</strong> {format(new Date(data.updated_at), 'yyyy-MM-dd HH:mm:ss')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            bgcolor: '#2e7d32',
            '&:hover': {
              bgcolor: '#1b5e20'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>

      {/* Payment Proof Preview Dialog */}
      <Dialog open={filePreview} fullWidth maxWidth="lg">
        <DialogTitle>Payment Proof</DialogTitle>
        <DialogContent dividers>
          {selectedHistory && selectedHistory.payment_proof &&
            <Box
              width="100%"
              maxHeight="65vh"
              display="flex"
              alignItems="center"
              p={2}
            >
              {selectedHistory.payment_proof.endsWith('.pdf') ? (
                <iframe
                  src={selectedHistory.payment_proof}
                  title="PDF Preview"
                  style={{ border: 'none', width: '100%', height: '65vh', display: 'block' }}
                ></iframe>
              ) : (
                <img
                  src={selectedHistory.payment_proof}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              )}
            </Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default DonationInfo; 