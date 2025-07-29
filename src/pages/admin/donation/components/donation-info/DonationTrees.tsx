import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import { NatureOutlined } from '@mui/icons-material';
import { DonationTree } from '../../../../../types/donation';
import ApiClient from '../../../../../api/apiClient/apiClient';
import GeneralTable from '../../../../../components/GenTable';
import { GridFilterItem } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import getColumnSearchProps from '../../../../../components/Filter';

interface DonationTreesProps {
  donationId: number
}

const DonationTrees: React.FC<DonationTreesProps> = ({ donationId }) => {
  const theme = useTheme();
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
      ),
      exportValue: (saplingId: string, record: any) => {
        return record.assignee_name ? `${import.meta.env.VITE_DASHBOARD_BASE_URL}/profile/${saplingId}` : '';
      }
    }
  ]

  return (
    <Paper 
      elevation={1} 
      sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NatureOutlined sx={{ color: '#2e7d32' }} /> Trees Reserved/Assigned
      </Typography>
      {totalRecords === 0 && Object.values(filters).length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No trees have been reserved or assigned for this donation yet.
        </Typography>
      ) : (
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
      )}
    </Paper>
  );
}

export default DonationTrees;