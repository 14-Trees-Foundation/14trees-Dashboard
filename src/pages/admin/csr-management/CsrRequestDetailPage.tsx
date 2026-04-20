import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Button,
	Tabs,
	Tab,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditIcon from '@mui/icons-material/Edit';
import ForestIcon from '@mui/icons-material/Forest';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	analyticsPageSx,
	analyticsCardSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
	analyticsSectionTitleSx,
	formLabelSx,
} from '../shared/adminTheme';
import ApiClient from '../../../api/apiClient/apiClient';
import { CsrRequest } from '../../../types/csrRequest';
import CsrStatusChip from './components/CsrStatusChip';
import PaymentStatusChip from './components/PaymentStatusChip';
import AllocationBreakdownCard from './components/AllocationBreakdownCard';

const THEME_KEY = 'csr_management_theme';

interface BookDialogProps {
	open: boolean;
	onClose: () => void;
	onBook: (count: number, assignedTo?: number) => Promise<void>;
	remaining: number;
}
const BookDialog: React.FC<BookDialogProps> = ({
	open,
	onClose,
	onBook,
	remaining,
}) => {
	const [count, setCount] = useState(remaining);
	const [assignedTo, setAssignedTo] = useState('');
	const [loading, setLoading] = useState(false);

	const handle = async () => {
		setLoading(true);
		try {
			await onBook(count, assignedTo ? parseInt(assignedTo) : undefined);
			onClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>Book Trees</DialogTitle>
			<DialogContent
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
			>
				<Box>
					<Typography component="label" sx={formLabelSx}>
						Number of trees to book (max {remaining})
					</Typography>
					<TextField
						fullWidth
						size="small"
						type="number"
						value={count}
						onChange={(e) =>
							setCount(
								Math.min(remaining, Math.max(1, parseInt(e.target.value) || 1)),
							)
						}
						inputProps={{ min: 1, max: remaining }}
					/>
				</Box>
				<Box>
					<Typography component="label" sx={formLabelSx}>
						Assign to user ID (optional — synthetic CSR user)
					</Typography>
					<TextField
						fullWidth
						size="small"
						type="number"
						value={assignedTo}
						onChange={(e) => setAssignedTo(e.target.value)}
						placeholder="Leave blank to skip"
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ textTransform: 'none' }}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handle}
					disabled={loading || count <= 0}
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					{loading ? <CircularProgress size={18} /> : 'Book Trees'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const CsrRequestDetailContent: React.FC<{
	requestId: number;
	themeMode: 'dark' | 'light';
	onToggle: () => void;
}> = ({ requestId, themeMode, onToggle }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isLight = themeMode === 'light';
	const colors = isLight ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const cardSx = isLight
		? { backgroundColor: '#fff', border: '1px solid #eeebe4' }
		: analyticsCardSx;

	const [data, setData] = useState<CsrRequest | null>(null);
	const [trees, setTrees] = useState<any[]>([]);
	const [treesTotal, setTreesTotal] = useState(0);
	const [treesPage, setTreesPage] = useState(1);
	const [loadingTrees, setLoadingTrees] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [bookOpen, setBookOpen] = useState(false);
	const PAGE_SIZE = 20;

	const loadRequest = async () => {
		const api = new ApiClient();
		const result = await api.getCsrRequestById(requestId);
		setData(result);
	};

	const loadTrees = async (page: number) => {
		setLoadingTrees(true);
		const api = new ApiClient();
		const result = await api.getCsrRequestTrees(
			requestId,
			(page - 1) * PAGE_SIZE,
			PAGE_SIZE,
		);
		setTrees(result.results);
		setTreesTotal(result.total);
		setLoadingTrees(false);
	};

	useEffect(() => {
		loadRequest();
	}, [requestId]);
	useEffect(() => {
		if (activeTab === 1) loadTrees(treesPage);
	}, [activeTab, treesPage]);

	const handleBook = async (count: number, assignedTo?: number) => {
		const api = new ApiClient();
		await api.bookCsrTrees(requestId, count, assignedTo);
		await loadRequest();
	};

	const tabSx = {
		textTransform: 'none' as const,
		fontWeight: 500,
		fontSize: '0.85rem',
		minHeight: 40,
		'&.Mui-selected': { color: theme.palette.primary.main, fontWeight: 700 },
	};

	const treeColumns: ColumnsType<any> = [
		{
			title: 'Sapling ID',
			dataIndex: 'sapling_id',
			key: 'sapling_id',
			render: (v) => (
				<Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
					{v}
				</Typography>
			),
		},
		{
			title: 'Plant Type',
			dataIndex: 'plant_type',
			key: 'plant_type',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Plot',
			dataIndex: 'plot',
			key: 'plot',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Site',
			dataIndex: 'site_name',
			key: 'site_name',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Assigned To',
			dataIndex: 'assigned_to_name',
			key: 'assigned_to_name',
			render: (v) => <Typography variant="caption">{v ?? '—'}</Typography>,
		},
		{
			title: 'Mapped At',
			dataIndex: 'mapped_at',
			key: 'mapped_at',
			render: (v) => (
				<Typography variant="caption">
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
		},
	];

	if (!data)
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<CircularProgress />
			</Box>
		);

	const remaining = data.no_of_trees - data.trees_assigned;

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					mb: 3,
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<Box>
					<Button
						startIcon={<ArrowBackIcon />}
						size="small"
						sx={{
							textTransform: 'none',
							color: theme.palette.text.secondary,
							mb: 1,
						}}
						onClick={() =>
							navigate(`/admin/csr-management/corporate/${data.group_id}`)
						}
					>
						{data.group_name}
					</Button>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Typography
							variant="h5"
							sx={{
								...analyticsSectionTitleSx,
								fontWeight: 700,
								color: theme.palette.text.primary,
							}}
						>
							{data.financial_year} CSR Request
						</Typography>
						<CsrStatusChip status={data.status} />
					</Box>
				</Box>
				<Box sx={{ display: 'flex', gap: 1 }}>
					{remaining > 0 && (
						<Button
							variant="contained"
							size="small"
							startIcon={<ForestIcon />}
							onClick={() => setBookOpen(true)}
							sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
						>
							Book Trees
						</Button>
					)}
					<Button
						size="small"
						startIcon={<EditIcon />}
						sx={{ textTransform: 'none', borderRadius: 2 }}
					>
						Edit
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

			{/* Main grid */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '2fr 1fr 1fr' },
					gap: 2,
					mb: 3,
				}}
			>
				{/* Metadata card */}
				<Box sx={{ ...cardSx, borderRadius: 2, p: 2.5 }}>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 600, mb: 2, color: colors.textOnDark }}
					>
						Commitment Details
					</Typography>
					{[
						{ label: 'Corporate', value: data.group_name },
						{ label: 'Financial Year', value: data.financial_year },
						{
							label: 'Donation Date',
							value: data.donation_date
								? new Date(data.donation_date).toLocaleDateString()
								: '—',
						},
						{ label: 'Contact', value: data.contact_person ?? '—' },
						{ label: 'Contact Email', value: data.contact_email ?? '—' },
					].map((f) => (
						<Box
							key={f.label}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								py: 0.75,
								borderBottom: `1px solid ${isLight ? '#f0ede6' : '#2a3832'}`,
							}}
						>
							<Typography variant="caption" sx={{ color: colors.textMuted }}>
								{f.label}
							</Typography>
							<Typography
								variant="caption"
								sx={{ fontWeight: 500, color: colors.textOnDark }}
							>
								{f.value}
							</Typography>
						</Box>
					))}
					{data.notes && (
						<Typography
							variant="caption"
							sx={{ mt: 1.5, display: 'block', color: colors.textMuted }}
						>
							{data.notes}
						</Typography>
					)}
				</Box>

				{/* Payment card */}
				<Box sx={{ ...cardSx, borderRadius: 2, p: 2.5 }}>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 600, mb: 2, color: colors.textOnDark }}
					>
						Payment & Donation
					</Typography>
					<Box sx={{ mb: 1.5 }}>
						<PaymentStatusChip
							paymentStatus={data.payment_status}
							treesAssigned={data.trees_assigned}
						/>
					</Box>
					{[
						{
							label: 'Amount Received',
							value:
								data.amount_received != null
									? `₹${Number(data.amount_received).toLocaleString()}`
									: '—',
						},
						{
							label: 'Amount/Tree',
							value:
								data.amount_per_tree != null
									? `₹${Number(data.amount_per_tree).toFixed(2)}`
									: '—',
						},
						{ label: 'Payment ID', value: data.payment_id ?? '—' },
						{ label: 'Donation ID', value: data.donation_id ?? '—' },
					].map((f) => (
						<Box
							key={f.label}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								py: 0.75,
								borderBottom: `1px solid ${isLight ? '#f0ede6' : '#2a3832'}`,
							}}
						>
							<Typography variant="caption" sx={{ color: colors.textMuted }}>
								{f.label}
							</Typography>
							<Typography
								variant="caption"
								sx={{ fontWeight: 500, color: colors.textOnDark }}
							>
								{String(f.value)}
							</Typography>
						</Box>
					))}
				</Box>

				{/* Allocation breakdown */}
				<AllocationBreakdownCard
					noOfTrees={data.no_of_trees}
					treesAssigned={data.trees_assigned}
					plantationTrees={Number(data.plantation_trees ?? 0)}
					giftCardTrees={Number(data.gift_card_trees ?? 0)}
					visitTrees={Number(data.visit_trees ?? 0)}
					isDark={!isLight}
				/>
			</Box>

			{/* Visits section */}
			{data.visits && data.visits.length > 0 && (
				<Box sx={{ ...cardSx, borderRadius: 2, p: 2.5, mb: 3 }}>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 600, mb: 2, color: colors.textOnDark }}
					>
						Visit Sub-allocations ({data.visits.length})
					</Typography>
					{data.visits.map((v) => (
						<Box
							key={v.id}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								py: 1,
								borderBottom: `1px solid ${isLight ? '#f0ede6' : '#2a3832'}`,
							}}
						>
							<Box>
								<Typography
									variant="body2"
									sx={{ fontWeight: 600, color: colors.textOnDark }}
								>
									{v.visit_name}
								</Typography>
								<Typography variant="caption" sx={{ color: colors.textMuted }}>
									{new Date(v.visit_date).toLocaleDateString()}
								</Typography>
							</Box>
							<Box sx={{ textAlign: 'right' }}>
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{Number(v.trees_allocated).toLocaleString()} trees
								</Typography>
								<Chip
									label={v.status}
									size="small"
									sx={{ height: 18, fontSize: '0.65rem' }}
								/>
							</Box>
						</Box>
					))}
				</Box>
			)}

			{/* Trees tab */}
			<Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}>
				<Tabs
					value={activeTab}
					onChange={(_, v) => setActiveTab(v)}
					sx={{ minHeight: 40 }}
				>
					<Tab label="Overview" sx={tabSx} />
					<Tab
						label={`Trees (${data.trees_assigned.toLocaleString()})`}
						sx={tabSx}
					/>
				</Tabs>
			</Box>

			{activeTab === 1 && (
				<Table
					columns={treeColumns}
					dataSource={trees.map((t) => ({ ...t, key: t.id }))}
					loading={loadingTrees}
					pagination={{
						current: treesPage,
						pageSize: PAGE_SIZE,
						total: treesTotal,
						onChange: setTreesPage,
						showTotal: (t) => `${t} trees`,
					}}
					size="small"
					style={{ borderRadius: 8 }}
				/>
			)}

			<BookDialog
				open={bookOpen}
				onClose={() => setBookOpen(false)}
				onBook={handleBook}
				remaining={remaining}
			/>
		</Box>
	);
};

const CsrRequestDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(
		() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'light',
	);
	const toggle = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		localStorage.setItem(THEME_KEY, next);
	};
	if (!id) return null;
	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<CsrRequestDetailContent
				requestId={parseInt(id)}
				themeMode={themeMode}
				onToggle={toggle}
			/>
		</ThemeProvider>
	);
};

export default CsrRequestDetailPage;
