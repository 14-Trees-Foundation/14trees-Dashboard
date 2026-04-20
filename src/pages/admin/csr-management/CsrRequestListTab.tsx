import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { getCsrRequests } from '../../../redux/actions/csrActions';
import { CsrRequest } from '../../../types/csrRequest';
import { ANALYTICS_COLORS } from '../shared/adminTheme';
import CsrStatusChip from './components/CsrStatusChip';
import PaymentStatusChip from './components/PaymentStatusChip';

interface Props {
	isDark: boolean;
}

const PAGE_SIZE = 20;

const CsrRequestListTab: React.FC<Props> = ({ isDark }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const { requests, paginationMapping, totalRequests, loading } =
		useAppSelector((s) => s.csrRequestsData);

	const currentPage = React.useRef(1);

	const loadPage = useCallback(
		(page: number) => {
			currentPage.current = page;
			dispatch(getCsrRequests((page - 1) * PAGE_SIZE, PAGE_SIZE));
		},
		[dispatch],
	);

	useEffect(() => {
		loadPage(1);
	}, [loadPage]);

	const rows: CsrRequest[] = Object.keys(paginationMapping)
		.map((k) => requests[paginationMapping[parseInt(k)]])
		.filter(Boolean);

	const columns: ColumnsType<CsrRequest> = [
		{
			title: 'Corporate',
			key: 'corporate',
			render: (_, r) => (
				<Typography
					variant="body2"
					sx={{
						fontWeight: 600,
						color: isDark ? ANALYTICS_COLORS.accent : '#2d5a2d',
					}}
				>
					{r.group_name}
				</Typography>
			),
		},
		{
			title: 'FY',
			dataIndex: 'financial_year',
			key: 'financial_year',
			render: (v: string) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Date',
			dataIndex: 'donation_date',
			key: 'donation_date',
			render: (v: string | null) => (
				<Typography
					variant="caption"
					sx={{ color: theme.palette.text.secondary }}
				>
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
		},
		{
			title: 'Committed',
			dataIndex: 'no_of_trees',
			key: 'no_of_trees',
			render: (v: number) => (
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					{v.toLocaleString()}
				</Typography>
			),
			sorter: (a, b) => a.no_of_trees - b.no_of_trees,
		},
		{
			title: 'Planted',
			dataIndex: 'trees_assigned',
			key: 'trees_assigned',
			render: (v: number, r) => (
				<Box>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{v.toLocaleString()}
					</Typography>
					{r.no_of_trees - v > 0 && (
						<Typography
							variant="caption"
							sx={{ color: isDark ? ANALYTICS_COLORS.warning : '#d97706' }}
						>
							-{(r.no_of_trees - v).toLocaleString()} remaining
						</Typography>
					)}
				</Box>
			),
		},
		{
			title: 'Amount',
			dataIndex: 'amount_received',
			key: 'amount_received',
			render: (v: number | null) => (
				<Typography variant="body2">
					{v != null ? `₹${Number(v).toLocaleString()}` : '—'}
				</Typography>
			),
		},
		{
			title: 'Payment',
			key: 'payment',
			render: (_, r) => (
				<PaymentStatusChip
					paymentStatus={r.payment_status}
					treesAssigned={r.trees_assigned}
				/>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (v: any) => <CsrStatusChip status={v} />,
		},
	];

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
				<Button
					variant="contained"
					size="small"
					startIcon={<AddIcon />}
					onClick={() => navigate('/admin/csr-management/new')}
					sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
				>
					New CSR Request
				</Button>
			</Box>

			<Table
				columns={columns}
				dataSource={rows.map((r) => ({ ...r, key: r.id }))}
				loading={loading}
				pagination={{
					current: currentPage.current,
					pageSize: PAGE_SIZE,
					total: totalRequests,
					onChange: loadPage,
					showTotal: (t) => `${t} requests`,
				}}
				onRow={(row) => ({
					onClick: () => navigate(`/admin/csr-management/requests/${row.id}`),
				})}
				size="small"
				style={{ borderRadius: 8 }}
			/>
		</Box>
	);
};

export default CsrRequestListTab;
