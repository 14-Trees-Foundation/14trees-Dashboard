import React, { useEffect, useState, useCallback } from 'react';
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
	Tooltip,
	Autocomplete,
	IconButton,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditIcon from '@mui/icons-material/Edit';
import ForestIcon from '@mui/icons-material/Forest';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import TourIcon from '@mui/icons-material/TourOutlined';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LayersIcon from '@mui/icons-material/Layers';
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
			await onBook(count, assignedTo ? Number(assignedTo) : undefined);
			onClose();
		} finally {
			setLoading(false);
		}
	};
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>Book Trees</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
					<TextField
						label="Number of trees"
						type="number"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						inputProps={{ min: 1, max: remaining }}
						size="small"
						helperText={`${remaining} remaining`}
					/>
					<TextField
						label="Assign to user ID (optional)"
						value={assignedTo}
						onChange={(e) => setAssignedTo(e.target.value)}
						placeholder="Leave blank to skip"
						size="small"
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

// ── Activity helpers ──────────────────────────────────────────────────────────

const MUTATION_LABELS: Record<string, { label: string; color: string }> = {
	plantation_book: { label: 'Trees Booked', color: '#4caf50' },
	migration: { label: 'Migrated from GCR', color: '#2196f3' },
	event_complete: { label: 'Event Completed', color: '#9c27b0' },
	rollback_adjustment: { label: 'Rollback', color: '#f44336' },
	admin_adjustment: { label: 'Admin Adjustment', color: '#ff9800' },
};

// ── Main content ──────────────────────────────────────────────────────────────

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

	const [plots, setPlots] = useState<any[]>([]);
	const [loadingPlots, setLoadingPlots] = useState(false);
	const [plotSearch, setPlotSearch] = useState('');
	const [plotOptions, setPlotOptions] = useState<any[]>([]);
	const [searchingPlots, setSearchingPlots] = useState(false);
	const [selectedPlot, setSelectedPlot] = useState<any | null>(null);
	const [addingPlot, setAddingPlot] = useState(false);

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

	const loadPlots = useCallback(async () => {
		setLoadingPlots(true);
		try {
			const api = new ApiClient();
			const result = await api.getCsrRequestPlots(requestId);
			setPlots(result.plots ?? []);
		} finally {
			setLoadingPlots(false);
		}
	}, [requestId]);

	const handlePlotSearch = useCallback(async (q: string) => {
		if (!q || q.length < 2) {
			setPlotOptions([]);
			return;
		}
		setSearchingPlots(true);
		try {
			const api = new ApiClient();
			const result = await api.getPlots(0, 20, [
				{ columnField: 'name', operatorValue: 'contains', value: q },
			]);
			setPlotOptions(result.results ?? []);
		} finally {
			setSearchingPlots(false);
		}
	}, []);

	const handleAddPlot = async () => {
		if (!selectedPlot) return;
		setAddingPlot(true);
		try {
			const api = new ApiClient();
			await api.addCsrRequestPlot(requestId, selectedPlot.id);
			setSelectedPlot(null);
			setPlotSearch('');
			setPlotOptions([]);
			await loadPlots();
		} finally {
			setAddingPlot(false);
		}
	};

	const handleRemovePlot = async (plotId: number) => {
		const api = new ApiClient();
		await api.removeCsrRequestPlot(requestId, plotId);
		await loadPlots();
	};

	useEffect(() => {
		loadRequest();
	}, [requestId]);
	useEffect(() => {
		if (activeTab === 1) loadTrees(treesPage);
	}, [activeTab, treesPage]);
	useEffect(() => {
		if (activeTab === 2) loadPlots();
	}, [activeTab, loadPlots]);

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

	// ── Columns ────────────────────────────────────────────────────────────────

	const treeColumns: ColumnsType<any> = [
		{
			title: 'Sapling ID',
			dataIndex: 'sapling_id',
			render: (v) => (
				<Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
					{v}
				</Typography>
			),
		},
		{
			title: 'Plant Type',
			dataIndex: 'plant_type',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Plot',
			dataIndex: 'plot',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Site',
			dataIndex: 'site_name',
			render: (v) => <Typography variant="caption">{v}</Typography>,
		},
		{
			title: 'Assigned To',
			dataIndex: 'assigned_to_name',
			render: (v) => <Typography variant="caption">{v ?? '—'}</Typography>,
		},
		{
			title: 'Mapped At',
			dataIndex: 'mapped_at',
			render: (v) => (
				<Typography variant="caption">
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
		},
	];

	const gcrColumns: ColumnsType<any> = [
		{
			title: 'Request',
			key: 'req',
			render: (_, row) => (
				<Box>
					<Typography
						variant="caption"
						sx={{ fontFamily: 'monospace', display: 'block' }}
					>
						{row.request_id}
					</Typography>
					<Typography variant="caption" sx={{ color: colors.textMuted }}>
						{row.event_name ?? '—'}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Type',
			dataIndex: 'event_type',
			render: (v, row) => (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					<Typography variant="caption">{v ?? '—'}</Typography>
					{row.visit_id && (
						<Chip
							label="Visit"
							size="small"
							sx={{ height: 16, fontSize: '0.65rem', width: 'fit-content' }}
						/>
					)}
					{row.migrated_to_csr && (
						<Chip
							label="Migrated"
							size="small"
							sx={{
								height: 16,
								fontSize: '0.65rem',
								bgcolor: '#e3f2fd',
								color: '#1565c0',
								width: 'fit-content',
							}}
						/>
					)}
				</Box>
			),
		},
		{
			title: 'Trees',
			dataIndex: 'no_of_cards',
			align: 'right' as const,
			render: (v) => (
				<Typography variant="caption">{Number(v).toLocaleString()}</Typography>
			),
		},
		{
			title: 'Date',
			dataIndex: 'gifted_on',
			render: (v) => (
				<Typography variant="caption">
					{v ? new Date(v).toLocaleDateString() : '—'}
				</Typography>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (v) => (
				<Chip label={v} size="small" sx={{ height: 18, fontSize: '0.68rem' }} />
			),
		},
		{
			title: '',
			key: 'action',
			render: (_, row) => (
				<Tooltip title="Open gift card request">
					<OpenInNewIcon
						sx={{ fontSize: 16, color: colors.primary, cursor: 'pointer' }}
						onClick={() => navigate(`/admin/tree-cards?request_id=${row.id}`)}
					/>
				</Tooltip>
			),
		},
	];

	const visitColumns: ColumnsType<any> = [
		{
			title: 'Visit',
			key: 'visit',
			render: (_, row) => (
				<Box>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{row.visit_name}
					</Typography>
					<Typography variant="caption" sx={{ color: colors.textMuted }}>
						{row.visit_date
							? new Date(row.visit_date).toLocaleDateString()
							: '—'}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Trees',
			dataIndex: 'trees_allocated',
			align: 'right' as const,
			render: (v) => (
				<Typography variant="caption">{Number(v).toLocaleString()}</Typography>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (v) => (
				<Chip
					label={v ?? '—'}
					size="small"
					sx={{ height: 18, fontSize: '0.68rem' }}
				/>
			),
		},
		{
			title: '',
			key: 'action',
			render: (_, row) =>
				row.gcr_id && (
					<Tooltip title="Open visit request">
						<OpenInNewIcon
							sx={{ fontSize: 16, color: colors.primary, cursor: 'pointer' }}
							onClick={() => navigate(`/admin/visits`)}
						/>
					</Tooltip>
				),
		},
	];

	const activityColumns: ColumnsType<any> = [
		{
			title: 'Action',
			dataIndex: 'mutation_type',
			render: (v) => {
				const meta = MUTATION_LABELS[v] ?? { label: v, color: '#888' };
				return (
					<Chip
						label={meta.label}
						size="small"
						sx={{
							bgcolor: `${meta.color}22`,
							color: meta.color,
							fontWeight: 600,
							fontSize: '0.72rem',
							height: 20,
						}}
					/>
				);
			},
		},
		{
			title: 'Source',
			key: 'source',
			render: (_, row) => (
				<Box>
					<Typography variant="caption" sx={{ color: colors.textMuted }}>
						{row.source_type}
					</Typography>
					<Typography
						variant="caption"
						sx={{
							display: 'block',
							fontFamily: 'monospace',
							fontSize: '0.7rem',
						}}
					>
						{row.source_id}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Trees',
			dataIndex: 'delta',
			align: 'right' as const,
			render: (v) => (
				<Typography
					variant="caption"
					sx={{
						color: Number(v) >= 0 ? '#4caf50' : '#f44336',
						fontWeight: 600,
					}}
				>
					{Number(v) >= 0 ? `+${v}` : v}
				</Typography>
			),
		},
		{
			title: 'By',
			dataIndex: 'created_by_name',
			render: (v) => <Typography variant="caption">{v ?? 'System'}</Typography>,
		},
		{
			title: 'When',
			dataIndex: 'created_at',
			render: (v) => (
				<Typography variant="caption">
					{v ? new Date(v).toLocaleString() : '—'}
				</Typography>
			),
		},
	];

	// ── Render ─────────────────────────────────────────────────────────────────

	if (!data)
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<CircularProgress />
			</Box>
		);

	const remaining = data.no_of_trees - data.trees_assigned;
	const gcrs: any[] = (data as any).gift_card_requests ?? [];
	const visits: any[] = (data as any).visits ?? [];
	const activity: any[] = (data as any).activity ?? [];

	const gcrCount = gcrs.length;
	const visitCount = visits.length;
	const plotCount = plots.length;

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

			{/* KPI cards */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '2fr 1fr 1fr' },
					gap: 2,
					mb: 3,
				}}
			>
				{/* Metadata */}
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

				{/* Payment */}
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
					plantationTrees={Number((data as any).plantation_trees ?? 0)}
					giftCardTrees={Number((data as any).gift_card_trees ?? 0)}
					visitTrees={Number((data as any).visit_trees ?? 0)}
					isDark={!isLight}
				/>
			</Box>

			{/* Tabs */}
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
					<Tab
						icon={<LayersIcon sx={{ fontSize: 16 }} />}
						iconPosition="start"
						label={`Plots${plotCount > 0 ? ` (${plotCount})` : ''}`}
						sx={tabSx}
					/>
					<Tab
						icon={<CardGiftcardIcon sx={{ fontSize: 16 }} />}
						iconPosition="start"
						label={`Gift Cards${gcrCount > 0 ? ` (${gcrCount})` : ''}`}
						sx={tabSx}
					/>
					<Tab
						icon={<TourIcon sx={{ fontSize: 16 }} />}
						iconPosition="start"
						label={`Visits${visitCount > 0 ? ` (${visitCount})` : ''}`}
						sx={tabSx}
					/>
					<Tab
						icon={<HistoryIcon sx={{ fontSize: 16 }} />}
						iconPosition="start"
						label={`Activity${
							activity.length > 0 ? ` (${activity.length})` : ''
						}`}
						sx={tabSx}
					/>
				</Tabs>
			</Box>

			{/* Tab content */}
			{activeTab === 0 && (
				<Box sx={{ color: theme.palette.text.secondary }}>
					<Typography variant="body2">
						Use the tabs above to explore trees, gift card allocations, visit
						allocations, and activity log for this CSR request.
					</Typography>
				</Box>
			)}

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

			{activeTab === 2 && (
				<Box>
					{/* Add plot row */}
					<Box
						sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'center' }}
					>
						<Autocomplete
							sx={{ flex: 1, maxWidth: 400 }}
							size="small"
							options={plotOptions}
							getOptionLabel={(o: any) => `${o.name} (${o.plot_id ?? o.id})`}
							value={selectedPlot}
							onChange={(_, v) => setSelectedPlot(v)}
							inputValue={plotSearch}
							onInputChange={(_, v) => {
								setPlotSearch(v);
								handlePlotSearch(v);
							}}
							loading={searchingPlots}
							noOptionsText={
								plotSearch.length < 2
									? 'Type to search plots…'
									: 'No plots found'
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Search plots"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{searchingPlots ? <CircularProgress size={16} /> : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							)}
						/>
						<Button
							variant="contained"
							size="small"
							disabled={!selectedPlot || addingPlot}
							onClick={handleAddPlot}
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								whiteSpace: 'nowrap',
							}}
						>
							{addingPlot ? <CircularProgress size={16} /> : 'Add Plot'}
						</Button>
					</Box>

					{/* Linked plots */}
					{loadingPlots ? (
						<Box sx={{ textAlign: 'center', py: 4 }}>
							<CircularProgress size={24} />
						</Box>
					) : plots.length === 0 ? (
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.secondary,
								py: 4,
								textAlign: 'center',
							}}
						>
							No plots linked yet. Add a plot above to enable tree booking.
						</Typography>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							{plots.map((p: any) => (
								<Box
									key={p.id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										p: 1.5,
										borderRadius: 1.5,
										border: `1px solid ${theme.palette.divider}`,
										backgroundColor: theme.palette.background.paper,
									}}
								>
									<Box>
										<Typography variant="body2" sx={{ fontWeight: 600 }}>
											{p.name}
										</Typography>
										<Typography
											variant="caption"
											sx={{ color: colors.textMuted }}
										>
											{[
												p.plot_id && `ID: ${p.plot_id}`,
												p.total_trees != null &&
													`${Number(p.total_trees).toLocaleString()} total`,
												p.available_trees != null &&
													`${Number(
														p.available_trees,
													).toLocaleString()} available`,
											]
												.filter(Boolean)
												.join(' · ')}
										</Typography>
									</Box>
									<Tooltip title="Remove plot">
										<IconButton
											size="small"
											onClick={() => handleRemovePlot(p.id)}
											sx={{ color: theme.palette.error.main }}
										>
											<DeleteOutlineIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</Box>
							))}
						</Box>
					)}
				</Box>
			)}

			{activeTab === 3 && (
				<Box>
					{gcrs.length === 0 ? (
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.secondary,
								py: 4,
								textAlign: 'center',
							}}
						>
							No gift card allocations linked to this CSR request yet.
						</Typography>
					) : (
						<Table
							columns={gcrColumns}
							dataSource={gcrs.map((g) => ({ ...g, key: g.id }))}
							pagination={false}
							size="small"
							style={{ borderRadius: 8 }}
						/>
					)}
				</Box>
			)}

			{activeTab === 4 && (
				<Box>
					{visits.length === 0 ? (
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.secondary,
								py: 4,
								textAlign: 'center',
							}}
						>
							No visits linked to this CSR request yet.
						</Typography>
					) : (
						<Table
							columns={visitColumns}
							dataSource={visits.map((v) => ({ ...v, key: v.id }))}
							pagination={false}
							size="small"
							style={{ borderRadius: 8 }}
						/>
					)}
				</Box>
			)}

			{activeTab === 5 && (
				<Box>
					{activity.length === 0 ? (
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.secondary,
								py: 4,
								textAlign: 'center',
							}}
						>
							No activity recorded yet.
						</Typography>
					) : (
						<Table
							columns={activityColumns}
							dataSource={activity.map((a) => ({ ...a, key: a.id }))}
							pagination={false}
							size="small"
							style={{ borderRadius: 8 }}
						/>
					)}
				</Box>
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
