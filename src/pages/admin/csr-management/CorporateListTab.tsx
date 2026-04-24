import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Avatar,
	LinearProgress,
	Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ApiClient from '../../../api/apiClient/apiClient';
import { CsrCorporate } from '../../../types/csrRequest';
import {
	analyticsCardSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
} from '../shared/adminTheme';

interface Props {
	isDark: boolean;
}

const CorporateListTab: React.FC<Props> = ({ isDark }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = isDark ? ANALYTICS_COLORS : LIGHT_ANALYTICS_COLORS;
	const [data, setData] = useState<CsrCorporate[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 20;

	const fetchData = async (p: number) => {
		setLoading(true);
		try {
			const api = new ApiClient();
			const result = await api.getCsrCorporateList(
				(p - 1) * PAGE_SIZE,
				PAGE_SIZE,
			);
			setData(result.results);
			setTotal(result.total);
		} catch {
			// error handled by apiClient toast
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(page);
	}, [page]);

	const columns: ColumnsType<CsrCorporate> = [
		{
			title: 'Corporate',
			key: 'corporate',
			render: (_, row) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Avatar
						src={row.logo_url ?? undefined}
						sx={{ width: 32, height: 32, bgcolor: colors.accent }}
					>
						{row.group_name[0]}
					</Avatar>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							cursor: 'pointer',
							color: colors.accent,
							'&:hover': { textDecoration: 'underline' },
						}}
						onClick={() =>
							navigate(`/admin/csr-management/corporate/${row.group_id}`)
						}
					>
						{row.group_name}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Committed',
			dataIndex: 'total_committed',
			key: 'total_committed',
			render: (v: number) => (
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					{Number(v).toLocaleString()}
				</Typography>
			),
			sorter: (a, b) => Number(a.total_committed) - Number(b.total_committed),
		},
		{
			title: 'Planted (All-time)',
			key: 'progress',
			render: (_, row) => {
				const pct =
					row.total_committed > 0
						? Math.round(
								(Number(row.total_planted) / Number(row.total_committed)) * 100,
						  )
						: 0;
				return (
					<Box sx={{ minWidth: 140 }}>
						<Box
							sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
						>
							<Typography variant="caption" sx={{ fontWeight: 600 }}>
								{Number(row.total_planted).toLocaleString()}
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: pct === 100 ? '#22c55e' : colors.warning }}
							>
								{pct}%
							</Typography>
						</Box>
						<Tooltip
							title={`${Number(row.total_planted).toLocaleString()} / ${Number(
								row.total_committed,
							).toLocaleString()}`}
						>
							<LinearProgress
								variant="determinate"
								value={Math.min(pct, 100)}
								sx={{
									height: 5,
									borderRadius: 2,
									backgroundColor: isDark ? '#2a3832' : '#f0ede6',
									'& .MuiLinearProgress-bar': {
										backgroundColor: pct === 100 ? '#22c55e' : colors.accent,
										borderRadius: 2,
									},
								}}
							/>
						</Tooltip>
					</Box>
				);
			},
			sorter: (a, b) => Number(a.total_planted) - Number(b.total_planted),
		},
		{
			title: 'Current FY Planted',
			dataIndex: 'current_fy_planted',
			key: 'current_fy_planted',
			render: (v: number) => (
				<Typography variant="body2">{Number(v).toLocaleString()}</Typography>
			),
			sorter: (a, b) =>
				Number(a.current_fy_planted) - Number(b.current_fy_planted),
		},
		{
			title: 'Requests',
			dataIndex: 'total_requests',
			key: 'total_requests',
			render: (v: number) => <Typography variant="body2">{v}</Typography>,
			sorter: (a, b) => Number(a.total_requests) - Number(b.total_requests),
		},
		{
			title: 'Last Donation',
			dataIndex: 'last_donation_date',
			key: 'last_donation_date',
			render: (v: string | null) => (
				<Typography
					variant="caption"
					sx={{ color: theme.palette.text.secondary }}
				>
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
			sorter: (a, b) =>
				(a.last_donation_date ?? '').localeCompare(b.last_donation_date ?? ''),
		},
	];

	return (
		<Box>
			<Table
				columns={columns}
				dataSource={data.map((r) => ({ ...r, key: r.group_id }))}
				loading={loading}
				pagination={{
					current: page,
					pageSize: PAGE_SIZE,
					total,
					onChange: setPage,
					showTotal: (t) => `${t} corporates`,
				}}
				onRow={(row) => ({
					onClick: () =>
						navigate(`/admin/csr-management/corporate/${row.group_id}`),
				})}
				rowClassName="cursor-pointer"
				size="small"
				style={{
					backgroundColor: isDark ? ANALYTICS_COLORS.cardBg : '#ffffff',
					borderRadius: 8,
				}}
			/>
		</Box>
	);
};

export default CorporateListTab;
