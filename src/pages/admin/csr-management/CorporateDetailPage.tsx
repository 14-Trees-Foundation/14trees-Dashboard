import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Tabs,
	Tab,
	Button,
	Avatar,
	Chip,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddIcon from '@mui/icons-material/Add';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	analyticsPageSx,
	analyticsCardSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
	analyticsSectionTitleSx,
} from '../shared/adminTheme';
import ApiClient from '../../../api/apiClient/apiClient';
import { CsrRequest } from '../../../types/csrRequest';
import CsrStatusChip from './components/CsrStatusChip';
import PaymentStatusChip from './components/PaymentStatusChip';
import AllocationBreakdownCard from './components/AllocationBreakdownCard';

const THEME_KEY = 'csr_management_theme';

const CorporateDetailContent: React.FC<{
	groupId: number;
	themeMode: 'dark' | 'light';
	onToggle: () => void;
}> = ({ groupId, themeMode, onToggle }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isLight = themeMode === 'light';
	const colors = isLight ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const [activeTab, setActiveTab] = useState(0);
	const [requests, setRequests] = useState<CsrRequest[]>([]);
	const [summary, setSummary] = useState<any[]>([]);
	const [groupName, setGroupName] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const api = new ApiClient();
		setLoading(true);
		Promise.all([
			api.getCsrRequests(0, 100, [
				{ columnField: 'group_id', operatorValue: 'equals', value: groupId },
			]),
			api.getGroupCsrSummary(groupId),
		])
			.then(([reqResult, sumResult]) => {
				setRequests(reqResult.results);
				setSummary(sumResult.summary ?? []);
				if (reqResult.results.length)
					setGroupName(reqResult.results[0].group_name ?? '');
			})
			.finally(() => setLoading(false));
	}, [groupId]);

	const totalCommitted = requests.reduce((s, r) => s + r.no_of_trees, 0);
	const totalPlanted = requests.reduce((s, r) => s + r.trees_assigned, 0);

	const tabSx = {
		textTransform: 'none' as const,
		fontWeight: 500,
		fontSize: '0.85rem',
		minHeight: 40,
		'&.Mui-selected': { color: theme.palette.primary.main, fontWeight: 700 },
	};

	const requestColumns: ColumnsType<CsrRequest> = [
		{
			title: 'FY',
			dataIndex: 'financial_year',
			key: 'fy',
			render: (v) => (
				<Typography variant="caption" sx={{ fontWeight: 600 }}>
					{v}
				</Typography>
			),
		},
		{
			title: 'Date',
			dataIndex: 'donation_date',
			key: 'date',
			render: (v) => (
				<Typography variant="caption">
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
		},
		{
			title: 'Committed',
			dataIndex: 'no_of_trees',
			key: 'committed',
			render: (v) => (
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					{Number(v).toLocaleString()}
				</Typography>
			),
		},
		{
			title: 'Planted',
			dataIndex: 'trees_assigned',
			key: 'planted',
			render: (v) => (
				<Typography variant="body2">{Number(v).toLocaleString()}</Typography>
			),
		},
		{
			title: 'Amount',
			dataIndex: 'amount_received',
			key: 'amount',
			render: (v) => (
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
			render: (v) => <CsrStatusChip status={v} />,
		},
		{
			title: '',
			key: 'action',
			render: (_, r) => (
				<Button
					size="small"
					onClick={() => navigate(`/admin/csr-management/requests/${r.id}`)}
					sx={{ textTransform: 'none' }}
				>
					View
				</Button>
			),
		},
	];

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
			}}
		>
			{/* Header row */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 3,
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Button
						startIcon={<ArrowBackIcon />}
						size="small"
						sx={{ textTransform: 'none', color: theme.palette.text.secondary }}
						onClick={() => navigate('/admin/csr-management')}
					>
						All Corporates
					</Button>
					<Typography
						variant="h5"
						sx={{
							...analyticsSectionTitleSx,
							fontWeight: 700,
							color: theme.palette.text.primary,
						}}
					>
						{groupName || 'Corporate Detail'}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						variant="contained"
						size="small"
						startIcon={<AddIcon />}
						onClick={() => navigate('/admin/csr-management/new')}
						sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
					>
						New Request
					</Button>
					<Button
						size="small"
						onClick={onToggle}
						sx={{ color: theme.palette.text.secondary, minWidth: 0, p: 1 }}
					>
						{isLight ? <Brightness4Icon /> : <Brightness7Icon />}
					</Button>
				</Box>
			</Box>

			{/* KPI strip */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
					gap: 2,
					mb: 3,
				}}
			>
				{[
					{ label: 'Total Committed', value: totalCommitted.toLocaleString() },
					{ label: 'Total Planted', value: totalPlanted.toLocaleString() },
					{ label: 'Requests', value: requests.length },
					{ label: 'FY Active', value: summary.length },
				].map((kpi) => (
					<Box
						key={kpi.label}
						sx={{
							...(isLight
								? { backgroundColor: '#fff', border: '1px solid #eeebe4' }
								: analyticsCardSx),
							borderRadius: 2,
							p: 2,
						}}
					>
						<Typography
							variant="caption"
							sx={{
								color: colors.textMuted,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								fontSize: '0.65rem',
							}}
						>
							{kpi.label}
						</Typography>
						<Typography
							variant="h5"
							sx={{ fontWeight: 700, color: colors.textOnDark, mt: 0.5 }}
						>
							{kpi.value}
						</Typography>
					</Box>
				))}
			</Box>

			{/* Tabs */}
			<Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}>
				<Tabs
					value={activeTab}
					onChange={(_, v) => setActiveTab(v)}
					sx={{
						minHeight: 40,
						'& .MuiTabs-indicator': {
							backgroundColor: theme.palette.primary.main,
						},
					}}
				>
					<Tab label="Requests" sx={tabSx} />
					<Tab label="Year-over-Year" sx={tabSx} />
				</Tabs>
			</Box>

			{activeTab === 0 && (
				<Table
					columns={requestColumns}
					dataSource={requests.map((r) => ({ ...r, key: r.id }))}
					loading={loading}
					size="small"
					pagination={{ pageSize: 20, showTotal: (t) => `${t} requests` }}
					style={{ borderRadius: 8 }}
				/>
			)}

			{activeTab === 1 && (
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
						gap: 2,
					}}
				>
					{summary.map((s: any) => (
						<Box
							key={s.financial_year}
							sx={{
								...(isLight
									? { backgroundColor: '#fff', border: '1px solid #eeebe4' }
									: analyticsCardSx),
								borderRadius: 2,
								p: 2.5,
							}}
						>
							<Typography
								variant="subtitle2"
								sx={{ fontWeight: 700, mb: 1.5, color: colors.textOnDark }}
							>
								{s.financial_year}
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Box>
									<Typography
										variant="caption"
										sx={{ color: colors.textMuted }}
									>
										Committed
									</Typography>
									<Typography
										variant="h6"
										sx={{ fontWeight: 700, color: colors.textOnDark }}
									>
										{Number(s.committed).toLocaleString()}
									</Typography>
								</Box>
								<Box sx={{ textAlign: 'right' }}>
									<Typography
										variant="caption"
										sx={{ color: colors.textMuted }}
									>
										Planted
									</Typography>
									<Typography
										variant="h6"
										sx={{ fontWeight: 700, color: colors.accent }}
									>
										{Number(s.planted).toLocaleString()}
									</Typography>
								</Box>
							</Box>
							<Typography variant="caption" sx={{ color: colors.textMuted }}>
								{s.requests} request{s.requests !== 1 ? 's' : ''}
							</Typography>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
};

const CorporateDetailPage: React.FC = () => {
	const { group_id } = useParams<{ group_id: string }>();
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(
		() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'light',
	);
	const toggle = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		localStorage.setItem(THEME_KEY, next);
	};

	if (!group_id) return null;
	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<CorporateDetailContent
				groupId={parseInt(group_id)}
				themeMode={themeMode}
				onToggle={toggle}
			/>
		</ThemeProvider>
	);
};

export default CorporateDetailPage;
