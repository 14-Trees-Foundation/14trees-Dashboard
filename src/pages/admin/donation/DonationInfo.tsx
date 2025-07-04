import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Donation, DonationTree } from '../../../types/donation';
import ApiClient from '../../../api/apiClient/apiClient';
import GeneralTable from '../../../components/GenTable';
import { InfoOutlined, EventOutlined, ParkOutlined, VisibilityOutlined } from '@mui/icons-material';
import { GridFilterItem } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import getColumnSearchProps from '../../../components/Filter';
import { Payment, PaymentHistory } from '../../../types/payment';
import { getHumanReadableDate } from '../../../helpers/utils';

interface DonationTreesProps {
  donationId: number
}

const DonationTrees: React.FC<DonationTreesProps> = ({ donationId }) => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [tableRows, setTableRows] = useState<DonationTree[]>([]);
  const [trees, setTrees] = useState<Record<number, DonationTree>>({});
  const [totalRecords, setTotalRecords] = useState(10);

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    setPage(0);
    setTrees({});
  }, [donationId, filters])

  const getDonationTrees = async (offset: number, limit: number) => {
    try {
      setLoading(true);
      const apiClient = new ApiClient();
      const filtersData = Object.values(filters);
      filtersData.push({
        columnField: 'donation_id',
        operatorValue: 'equals',
        value: donationId,
      })

      const resp = await apiClient.getDonationTrees(offset, limit, filtersData);

      setTrees(prev => {
        const newTrees = { ...prev }
        resp.results.forEach((tree, index) => {
          newTrees[resp.offset + index] = tree;
        })

        return newTrees;
      });
      setTotalRecords(resp.total);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {

    const handler = setTimeout(() => {

      if (loading) return;

      const records: DonationTree[] = [];
      const maxLength = Math.min((page + 1) * pageSize, totalRecords);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(trees, i)) {
          const record = trees[i];
          if (record) {
            records.push(record);
          }
        } else {
          getDonationTrees(page * pageSize, pageSize);
          return;
        }
      }

      setTableRows(records);
      setLoading(false);
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [page, pageSize, trees, loading])

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  }

  const handleDownload = async () => {
    try {
      const apiClient = new ApiClient();
      const filtersData = Object.values(filters);
      filtersData.push({
        columnField: 'donation_id',
        operatorValue: 'equals',
        value: donationId,
      })

      const resp = await apiClient.getDonationTrees(0, -1, filtersData);

      return resp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  }

  const columns: any[] = [
    {
      dataIndex: "sapling_id",
      key: "sapling_id",
      title: "Sapling ID",
      align: "center",
      width: 150,
      ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
    },
    {
      dataIndex: "plant_type",
      key: "plant_type",
      title: "Plant Type",
      align: "center",
      width: 250,
      ...getColumnSearchProps('plant_type', filters, handleSetFilters)
    },
    {
      dataIndex: "scientific_name",
      key: "Scientific Name",
      title: "Scientific Name",
      align: "center",
      width: 250,
      ...getColumnSearchProps('scientific_name', filters, handleSetFilters)
    },
    // {
    //   dataIndex: "recipient_name",
    //   key: "Recipient",
    //   title: "Recipient",
    //   align: "center",
    //   width: 200,
    //   ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
    // },
    {
      dataIndex: "assignee_name",
      key: "Assignee",
      title: "Assignee",
      align: "center",
      width: 200,
      ...getColumnSearchProps('assignee_name', filters, handleSetFilters)
    },
    {
      dataIndex: "sapling_id",
      key: "dashboard_link",
      title: "Dashboard Link",
      align: "center",
      width: 200,
      render: (saplingId: string, record: any) => (
        <a 
          href={`/profile/${saplingId}`} 
          target="_blank"  
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none', pointerEvents: !record.assignee_name ? 'none' : undefined }}
        >
          <Button 
            variant="outlined"
            color="success"
            size="small"
            disabled={!record.assignee_name}
            sx={{
              textTransform: 'none',
            }}
          >
            Dashboard
          </Button>
        </a>
      )
    }
  ]

  return totalRecords === 0 && Object.values(filters).length === 0 ? (
    null
  ) : (
    <Box sx={{ mb: 3 }}>
      <GeneralTable
        loading={loading}
        columns={columns}
        totalRecords={totalRecords}
        rows={tableRows}
        page={page}
        pageSize={pageSize}
        onPaginationChange={handlePaginationChange}
        onDownload={handleDownload}
        tableName='Donation Trees'
        footer
      />
    </Box>
  );
}

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

  useEffect(() => {
    const getDonationUsers = async () => {
      if (data) {
        try {
          const apiClient = new ApiClient();
          const users = await apiClient.getDonationUsers(0, -1, [
            { columnField: 'donation_id', operatorValue: 'equals', value: data.id }
          ]);
          setDonationUsers(users.results);
        } catch (error) {
          console.error("Error fetching donation users:", error);
          setDonationUsers([]);
        }
      }
    };

    const getPaymentDetails = async () => {
      if (data?.payment_id) {
        try {
          const apiClient = new ApiClient();
          const paymentData = await apiClient.getPayment(data.payment_id);
          setPayment(paymentData);
          
          if (paymentData.order_id) {
            const rpData = await apiClient.getPaymentsForOrder(paymentData.order_id);
            setRPPayments(rpData);
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
  }, [open, data]);

  const handleOpenPreview = (record: PaymentHistory) => {
    setFilePreview(true);
    setSelectedHistory(record);
  }

  const handleClosePreview = () => {
    setFilePreview(false);
    setSelectedHistory(null);
  }

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

  console.log('Additional Info Debug:', {
    names_for_plantation: data.names_for_plantation,
    comments: data.comments,
    hasAdditionalInfo,
    fullData: data // Log full data to see structure
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlined /> Donation Summary: {data.id}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>

        {/* Donation Status */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
           <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <EventOutlined sx={{ color: '#2e7d32' }} /> Donation Status
           </Typography>
          <Box sx={{ ml: 4 }}>
             {data.trees_count > 0 ? (
          <>
             <Typography sx={{ mb: 1 }}><strong>Trees Reserved:</strong> {`${data.booked}/${data.trees_count}`}</Typography>
             <Typography sx={{ mb: 1 }}><strong>Trees Assigned:</strong> {`${data.assigned}/${data.trees_count}`}</Typography>
            </>
           ) : null}
           {data.amount_donated && (
             <Typography sx={{ mb: 1 }}>
               <strong>Payment Status:</strong> <Chip size="small" label={getCapturedAmount() == data.amount_donated ? "Fully Paid" : "Pending"} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} />
             </Typography>
           )}
          <Typography sx={{ mb: 1 }}>
             <strong>Sponsor Email Status:</strong>
              {data.mail_status?.map(item => <Chip size="small" label={item} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} />)}
              {data.mail_error && <Typography color='red'>{data.mail_error}</Typography>}
          </Typography>
          <Typography sx={{ mb: 1 }}>
              <strong>Request Status:</strong>
               <Chip size="small" label={data.status === 'Paid' ? 'Submitted' : 'Fulfilled'} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} />
          </Typography>
            </Box>
          </Paper>

        <DonationTrees donationId={data.id} />

           {/* Donation Details */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <EventOutlined sx={{ color: '#2e7d32' }} /> Donation Details
                </Typography>
              <Box sx={{ ml: 4 }}>
                 <Typography sx={{ mb: 1 }}><strong>Donation ID:</strong> {data.id}</Typography>
    
                  {data.trees_count > 0 ? (
                 <>
                  <Typography sx={{ mb: 1 }}>
                       <strong>Land Category:</strong> <Chip size="small" label={data.category} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} />
                   </Typography>
                  {data.grove_type_other && (
                    <Typography sx={{ mb: 1 }}><strong>Grove Type (Other):</strong> {data.grove_type_other}</Typography>
                  )}
                   <Typography sx={{ mb: 1 }}><strong>Trees Count:</strong> <Chip size="small" label={data.trees_count} sx={{ ml: 1, bgcolor: '#2e7d32', color: 'white' }} /></Typography>
                     <Typography sx={{ mb: 1 }}>
                        <strong>Visit Date:</strong> {data.visit_date 
                            ? format(new Date(data.visit_date), 'PPP')
                            : 'Not scheduled'}
                     </Typography>
                 </>
                ) : (
              <Typography sx={{ mb: 1 }}><strong>Amount Donated:</strong> ₹{data.amount_donated || 'N/A'}</Typography>
              )}
    
            <Typography>
               <strong>Additional Contribution:</strong> {data.contribution_options ? (Array.isArray(data.contribution_options) ? data.contribution_options.join(', ') : String(data.contribution_options).replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+|(?=[A-Z])/).filter(Boolean).join(', ')) : 'N/A'}
            </Typography>
           </Box>
          </Paper>

        {/* Donor Details */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ParkOutlined sx={{ color: '#2e7d32' }} /> Donor Details
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography sx={{ mb: 1 }}><strong>Name:</strong> {data.user_name || 'N/A'}</Typography>
            <Typography><strong>Email:</strong> {data.user_email || 'N/A'}</Typography>
          </Box>
        </Paper>

        {/* Additional Information - only shown if there's content */}
        {(data.names_for_plantation || data.comments) && (
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
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
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
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
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
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
        <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            <strong>Created At:</strong> {format(new Date(data.created_at), 'yyyy-MM-dd HH:mm:ss')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Updated At:</strong> {format(new Date(data.updated_at), 'yyyy-MM-dd HH:mm:ss')}
          </Typography>
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