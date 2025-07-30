import React from "react";
import { MenuProps, TableColumnsType } from "antd";
import { Dropdown } from "antd";
import { Badge, Button, IconButton, Chip, Box } from "@mui/material";
import { 
  AssignmentInd, 
  AutoMode, 
  Delete, 
  Edit, 
  Email, 
  Landscape, 
  LocalOffer, 
  MenuOutlined, 
  NotesOutlined, 
  Wysiwyg 
} from "@mui/icons-material";
import { Donation } from "../../../../types/donation";
import getColumnSearchProps, { 
  getColumnDateFilter, 
  getColumnSelectedItemFilter, 
  getSortableHeader 
} from "../../../../components/Filter";
import { getHumanReadableDate } from "../../../../helpers/utils";
import { GridFilterItem } from "@mui/x-data-grid";
import { Order } from "../../../../types/common";

interface DonationTableConfigProps {
  filters: Record<string, GridFilterItem>;
  handleSetFilters: (filters: Record<string, GridFilterItem>) => void;
  orderBy: Order[];
  handleSortingChange: (sorter: any) => void;
  tags: string[];
  handleViewSummary: (record: Donation) => void;
  handleEditModalOpen: (record: Donation) => void;
  handleTagModalOpen: (record: Donation) => void;
  setIsDeleteAltOpen: (open: boolean) => void;
  setSelectedDonation: (donation: Donation | null) => void;
  setPlotSelectionModalOpen: (open: boolean) => void;
  setEmailConfirmationModal: (open: boolean) => void;
  setReserveTreesModalOpen: (open: boolean) => void;
  setAssignTreesModalOpen: (open: boolean) => void;
  setMapTreesOpen: (open: boolean) => void;
  setPrsConfirm: (confirm: boolean) => void;
  handlePickDonation: (donationId: number) => void;
  handleNotesModalOpen: (record: Donation) => void;
}

export const getColumnFixed = (columnKey: string): 'left' | 'right' | undefined => {
  if (columnKey === 'Don. Id') return 'left';
  if (columnKey === 'Donor Name') return 'left';
  return undefined;
};

export const getActionsMenu = (
  record: Donation,
  handlers: DonationTableConfigProps
): MenuProps => {
  const {
    handleViewSummary,
    handleEditModalOpen,
    handleTagModalOpen,
    setIsDeleteAltOpen,
    setSelectedDonation,
    setPlotSelectionModalOpen,
    setEmailConfirmationModal,
    setReserveTreesModalOpen,
    setAssignTreesModalOpen,
    setMapTreesOpen,
    setPrsConfirm,
    handlePickDonation
  } = handlers;

  const items: MenuProps['items'] = [
    // First group
    {
      key: "00",
      label: "View Summary",
      icon: <Wysiwyg />,
      onClick: () => handleViewSummary(record)
    },
    {
      key: "01",
      label: "Edit Request",
      icon: <Edit />,
      onClick: () => handleEditModalOpen(record)
    },
    {
      key: "02",
      label: "Tag Request",
      icon: <LocalOffer />,
      onClick: () => handleTagModalOpen(record)
    },
    {
      key: "03",
      label: "Delete Request",
      icon: <Delete />,
      danger: true,
      onClick: () => { setIsDeleteAltOpen(true); setSelectedDonation(record); }
    },
    { type: 'divider' },
    
    // Second group - conditional items based on status
    ...(record.status !== 'PendingPayment' ? [
      ...(Number(record.booked) < (record.pledged || 0) ? [{
        key: "20",
        label: "Select Plots",
        icon: <Landscape />,
        onClick: () => { setSelectedDonation(record); setPlotSelectionModalOpen(true); }
      }] : []),
      {
        key: "21",
        label: "Send Emails",
        icon: <Email />,
        onClick: () => { setSelectedDonation(record); setEmailConfirmationModal(true); }
      },
      {
        key: "22",
        label: "Reserve Trees",
        icon: <Landscape />,
        onClick: () => { setSelectedDonation(record); setReserveTreesModalOpen(true); }
      },
      {
        key: "23",
        label: "Assign Trees",
        icon: <AssignmentInd />,
        onClick: () => { setSelectedDonation(record); setAssignTreesModalOpen(true); }
      },
      ...(record.visit_date ? [{
        key: "24",
        label: "Map Visit Trees",
        icon: <AssignmentInd />,
        onClick: () => { setSelectedDonation(record); setMapTreesOpen(true); }
      }] : []),
      ...(record.donation_method === 'trees' && record.trees_count > (record.assigned || 0) ? [{
        key: "25",
        label: "Auto Process",
        icon: <AutoMode />,
        onClick: () => { setSelectedDonation(record); setPrsConfirm(true); }
      }] : []),
      ...(!record.processed_by ? [{
        key: "pick",
        label: "Pick This Up",
        icon: <AssignmentInd />,
        onClick: () => handlePickDonation(record.id)
      }] : [])
    ] : [])
  ];

  return { items };
};

export const getDonationColumns = (
  config: DonationTableConfigProps
): TableColumnsType<Donation> => {
  const {
    filters,
    handleSetFilters,
    orderBy,
    handleSortingChange,
    tags,
    handleNotesModalOpen
  } = config;

  return [
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 100,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Dropdown menu={getActionsMenu(record, config)} trigger={['click']}>
            <Button
              variant='outlined'
              color='success'
              style={{ margin: "0 5px" }}
            >
              <MenuOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
    {
      dataIndex: "id",
      key: "Don. Id",
      title: "Don. Id",
      align: "center",
      width: 100,
      fixed: getColumnFixed('Don. Id'),
      filteredValue: filters['id']?.value || null,
      ...getColumnSearchProps('id', filters, handleSetFilters, true)
    },
    {
      dataIndex: "user_name",
      key: "Donor Name",
      title: "Donor Name",
      align: "center",
      width: 200,
      fixed: getColumnFixed('Donor Name'),
      filteredValue: filters['user_name']?.value || null,
      ...getColumnSearchProps('user_name', filters, handleSetFilters)
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Payment Status",
      align: "center",
      width: 125,
      render: (status) => {
        switch (status) {
          case 'PendingPayment':
            return 'Pending Payment';
          case 'Paid':
            return 'Paid';
          case 'OrderFulfilled':
            return 'Fulfilled';
          default:
            return 'Paid';
        }
      },
      filteredValue: filters['status']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'status', 
        filters, 
        handleSetFilters,  
        options: ['PendingPayment', 'Paid', 'OrderFulfilled'] 
      }),
    },
    {
      dataIndex: "prs_status",
      key: "Processing Status",
      title: "Processing Status",
      align: "center",
      width: 150,
      render: (value, record) => record.status === 'PendingPayment' ? 'Not Applicable' : value,
      filteredValue: filters['prs_status']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'prs_status', 
        filters, 
        handleSetFilters, 
        options: ['Pending Tree Reservation', 'Pending Assignment', 'Completed'] 
      })
    },
    {
      dataIndex: "mailed_count",
      key: "Email Status",
      title: "Email Status",
      align: "center",
      width: 280,
      render: (value, record: any, index) => {
        // Show "Not Applicable" for pending payment donations
        if (record.status === 'PendingPayment') {
          return 'Not Applicable';
        }

        const emailStatuses = ['AckSent', 'SponsorCompletionSent', 'RecipientCompletionSent'];
        
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {emailStatuses.map(status => {
              // For SponsorCompletionSent, check for DashboardsSent tag instead
              const isStatusActive = status === 'SponsorCompletionSent' 
                ? record.mail_status?.includes('DashboardsSent')
                : record.mail_status?.includes(status);
              
              return (
                <Chip 
                  key={status}
                  size="small" 
                  label={status} 
                  className="email-status-chip"
                  style={{
                    backgroundColor: isStatusActive ? '#2e7d32' : 'rgb(237, 129, 7)',
                    color: 'black',
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}
                  sx={{ 
                    '& .MuiChip-label': {
                      color: 'black !important'
                    }
                  }} 
                />
              );
            })}
          </Box>
        );
      },
      filteredValue: filters['email_status']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'email_status', 
        filters, 
        handleSetFilters, 
        options: [
          'AckSent',
          'SponsorCompletionSent',
          'RecipientCompletionSent'
        ] 
      })
    },
    {
      dataIndex: "trees_count",
      key: "Pledged Trees",
      title: getSortableHeader("Pledged Trees", 'trees_count', orderBy, handleSortingChange),
      align: "center",
      width: 100,
    },
    {
      dataIndex: "processed_by_name",
      key: "processed_by",
      title: "Picked up by",
      align: "center",
      width: 150,
      render: (value, record) => {
        if (!value) return 'Pending';
        return record.processed_by_name || `User ${value}`;
      },
      filteredValue: filters['processed_by_name']?.value || null,
      ...getColumnSearchProps('processed_by_name', filters, handleSetFilters)
    },
    {
      dataIndex: "category",
      key: "Land Type",
      title: "Land Type",
      align: "center",
      width: 100,
      filteredValue: filters['category']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'category', 
        filters, 
        handleSetFilters, 
        options: ['Foundation', 'Public'] 
      })
    },
    {
      dataIndex: "amount_donated",
      key: "Donation Amount",
      title: getSortableHeader("Donation Amount", 'amount_donated', orderBy, handleSortingChange),
      align: "center",
      width: 120,
    },
    {
      dataIndex: "tags",
      key: "Tags",
      title: "Tags",
      align: "center",
      width: 200,
      render: value => value?.join(", ") || '',
      filteredValue: filters['tags']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'tags', 
        filters, 
        handleSetFilters, 
        options: tags 
      })
    },
    {
      dataIndex: "donation_receipt_number",
      key: "Donation Receipt No.",
      title: "Donation Receipt No.",
      align: "center",
      width: 200,
      render: (value, record) => record.status === 'PendingPayment' ? '-' : value,
      filteredValue: filters['donation_receipt_number']?.value || null,
      ...getColumnSearchProps('donation_receipt_number', filters, handleSetFilters)
    },
    {
      dataIndex: "order_id",
      key: "Razorpay Order ID",
      title: "Razorpay Order ID",
      align: "center",
      width: 150,
      render: (value, record) => record.status === 'PendingPayment' ? '-' : (value || '-'),
      filteredValue: filters['order_id']?.value || null,
      ...getColumnSearchProps('order_id', filters, handleSetFilters)
    },
    {
      dataIndex: "created_at",
      key: "Created On",
      title: "Created On",
      align: "center",
      width: 150,
      render: getHumanReadableDate,
      filteredValue: filters['created_at']?.value || null,
      ...getColumnDateFilter({ 
        dataIndex: 'created_at', 
        filters, 
        handleSetFilters, 
        label: 'Created On' 
      }),
    },
    {
      dataIndex: "notes",
      key: "Notes",
      title: "Notes",
      align: "center",
      width: 100,
      render: (value, record) => (
        <IconButton onClick={() => handleNotesModalOpen(record)}>
          <Badge variant="dot" color="success" invisible={(!value || value.trim() === '') ? true : false}>
            <NotesOutlined />
          </Badge>
        </IconButton>
      ),
    },
    {
      dataIndex: "contribution_options",
      key: "Contribution",
      title: "Additional Contribution",
      align: "center",
      width: 155,
      render: (contributions) => {
        if (!contributions) return '';
        if (Array.isArray(contributions)) {
          return contributions.join(', ');
        }
        return contributions;
      },
      filteredValue: filters['contribution_options']?.value || null,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'contribution_options', 
        filters, 
        handleSetFilters, 
        options: ['CSR', 'Planning visit', 'Other'] 
      }),
    },
  ];
};