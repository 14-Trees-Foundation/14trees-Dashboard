import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import {
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	Stack,
	Tab,
	Tabs,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import type { TableColumnsType } from 'antd';
import GeneralTable from '../../../components/GenTable';
import { analyticsPageSx } from '../shared/adminTheme';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import { fetchTreeAuditSessions } from './treeAuditVerificationService';
import { TreeAuditSessionRow } from './types';

const THEME_STORAGE_KEY = 'tree-audit-verification-theme-preference';

const getStoredThemePreference = (): 'dark' | 'light' => {
	if (typeof window === 'undefined') {
		return 'dark';
	}
	const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
	return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

const SessionsContent = ({
	themeMode,
	onToggleTheme,
}: {
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isLightMode = themeMode === 'light';
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'pending' | 'in_progress' | 'completed'
	>('all');
	const [rows, setRows] = useState<TreeAuditSessionRow[]>([]);
	const [totalRecords, setTotalRecords] = useState(0);

	const loadSessions = async () => {
		setLoading(true);
		try {
			const response = await fetchTreeAuditSessions(
				page * pageSize,
				pageSize,
				search,
				statusFilter,
			);
			setRows(response.results);
			setTotalRecords(response.total);
		} catch (error: any) {
			console.error('Failed to fetch tree audit sessions:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSessions();
	}, [page, pageSize, statusFilter]);

	const filteredRows = useMemo(() => {
		if (!search.trim()) return rows;
		const query = search.trim().toLowerCase();
		return rows.filter((row) =>
			[
				row.upload_session_id,
				row.worker_name || `User ${row.uploaded_by}`,
				row.plot_name || '',
				row.site_name || '',
			]
				.join(' ')
				.toLowerCase()
				.includes(query),
		);
	}, [rows, search]);

	const handlePaginationChange = (nextPage: number, nextPageSize: number) => {
		setPage(nextPage - 1);
		setPageSize(nextPageSize);
	};

	const getAllRows = async () => {
		const response = await fetchTreeAuditSessions(
			0,
			totalRecords || pageSize,
			search,
			statusFilter,
		);
		return response.results;
	};

	const columns: TableColumnsType<TreeAuditSessionRow> = [
		{
			dataIndex: 'upload_session_id',
			key: 'upload_session_id',
			title: 'Session ID',
			width: 220,
			render: (value: string) => (
				<Typography
					variant="body2"
					sx={{ fontFamily: 'monospace', fontWeight: 600 }}
				>
					{value}
				</Typography>
			),
		},
		{
			dataIndex: 'worker_name',
			key: 'worker_name',
			title: 'Worker',
			width: 180,
			render: (value: string | null, record) =>
				value || `User #${record.uploaded_by}`,
		},
		{
			dataIndex: 'plot_name',
			key: 'plot_name',
			title: 'Plot',
			width: 150,
			render: (value: string | null) => value || '—',
		},
		{
			dataIndex: 'site_name',
			key: 'site_name',
			title: 'Site',
			width: 160,
			render: (value: string | null) => value || '—',
		},
		{
			dataIndex: 'total_photos',
			key: 'total_photos',
			title: 'Photos',
			align: 'center',
			width: 90,
		},
		{
			dataIndex: 'verified_photos',
			key: 'verified_photos',
			title: 'Progress',
			width: 120,
			align: 'center',
			render: (_: number, record) =>
				`${record.verified_photos}/${record.total_photos}`,
		},
		{
			dataIndex: 'pending_photos',
			key: 'pending_photos',
			title: 'Pending',
			align: 'center',
			width: 90,
		},
		{
			dataIndex: 'rejected_photos',
			key: 'rejected_photos',
			title: 'Rejected',
			align: 'center',
			width: 90,
		},
		{
			dataIndex: 'uploaded_at',
			key: 'uploaded_at',
			title: 'Uploaded',
			width: 160,
			render: (value: string) =>
				value ? new Date(value).toLocaleString() : '—',
		},
		{
			dataIndex: 'status',
			key: 'status',
			title: 'Status',
			width: 120,
			align: 'center',
			render: (value: TreeAuditSessionRow['status']) => {
				const label =
					value === 'completed'
						? 'Completed'
						: value === 'in_progress'
						? 'In Progress'
						: 'Pending';
				return (
					<Typography
						variant="caption"
						sx={{
							color:
								value === 'completed'
									? theme.palette.success.main
									: value === 'in_progress'
									? theme.palette.warning.main
									: theme.palette.text.secondary,
							fontWeight: 700,
						}}
					>
						{label}
					</Typography>
				);
			},
		},
		{
			dataIndex: 'action',
			key: 'action',
			title: '',
			width: 90,
			align: 'center',
			render: (_: any, record) => (
				<Tooltip title="Open session">
					<IconButton
						size="small"
						onClick={(event) => {
							event.stopPropagation();
							navigate(
								`/admin/tree-audit-verification/${record.upload_session_id}`,
							);
						}}
					>
						<OpenInNewIcon fontSize="small" />
					</IconButton>
				</Tooltip>
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
				transition: 'background-color 0.2s ease',
			}}
		>
			<Card
				elevation={0}
				sx={{
					backgroundColor: isLightMode
						? 'transparent'
						: theme.palette.background.default,
					border: isLightMode ? 'none' : `1px solid ${theme.palette.divider}`,
					borderBottom: isLightMode ? 'none' : undefined,
					borderRadius: isLightMode ? 0 : 2,
					boxShadow: 'none',
					px: 3,
					py: 2,
					mb: 3,
				}}
			>
				<CardContent sx={{ px: 0, py: 0 }}>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
						flexWrap="wrap"
						gap={2}
					>
						<Box>
							<Typography
								variant="h4"
								sx={{
									mt: 1,
									mb: 1,
									fontWeight: 600,
									color: isLightMode ? '#1a1a1a' : 'text.primary',
								}}
							>
								Tree Audit Verification
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								Review audit sessions, verify sapling IDs in batches, and keep
								the verifier focused on one image at a time.
							</Typography>
						</Box>
						<Tooltip
							title={
								themeMode === 'dark'
									? 'Switch to light mode'
									: 'Switch to dark mode'
							}
						>
							<IconButton
								onClick={onToggleTheme}
								size="small"
								sx={{
									width: 34,
									height: 34,
									borderRadius: '8px',
									border:
										themeMode === 'dark'
											? '1px solid rgba(255,255,255,0.15)'
											: '1px solid #dde1e7',
									color:
										themeMode === 'dark' ? 'rgba(255,255,255,0.6)' : '#64748b',
									backgroundColor:
										themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
								}}
							>
								{themeMode === 'dark' ? (
									<Brightness7Icon fontSize="small" />
								) : (
									<Brightness4Icon fontSize="small" />
								)}
							</IconButton>
						</Tooltip>
					</Stack>

					<Tabs
						value={0}
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							borderBottom: isLightMode ? '1px solid #eeebe4' : 'none',
							mb: 2,
							'& .MuiTabs-flexContainer': {
								backgroundColor: isLightMode
									? 'transparent'
									: theme.palette.background.paper,
								borderRadius: isLightMode ? 0 : '10px',
							},
							'& .MuiTab-root': {
								color: isLightMode ? '#9ca3af' : 'rgba(255,255,255,0.4)',
								fontSize: '0.72rem',
								letterSpacing: '0.08em',
								fontWeight: 500,
							},
							'& .MuiTab-root.Mui-selected': {
								color: isLightMode ? '#1a1a1a' : theme.palette.text.primary,
							},
						}}
					>
						<Tab label="SESSIONS" />
					</Tabs>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
						<TextField
							fullWidth
							size="small"
							placeholder="Search by session, worker, plot, site"
							value={search}
							onChange={(event) => {
								setPage(0);
								setSearch(event.target.value);
							}}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							select
							size="small"
							label="Status"
							value={statusFilter}
							onChange={(event) => {
								setPage(0);
								setStatusFilter(event.target.value as any);
							}}
							sx={{ minWidth: 180 }}
						>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="in_progress">In Progress</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
						</TextField>
						<Button variant="outlined" onClick={loadSessions}>
							Refresh
						</Button>
					</Stack>

					<Divider sx={{ mb: 2 }} />

					<Box sx={{ width: '100%' }}>
						<GeneralTable
							loading={loading}
							rows={filteredRows}
							columns={columns}
							totalRecords={search.trim() ? filteredRows.length : totalRecords}
							page={page}
							pageSize={pageSize}
							onPaginationChange={handlePaginationChange}
							onDownload={getAllRows}
							footer
							tableName="Tree Audit Verification Sessions"
							scroll={{ x: 1300, y: 620 }}
							rowClassName={(record: TreeAuditSessionRow) =>
								record.status === 'completed' ? 'sequence-ordering-column' : ''
							}
						/>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

const TreeAuditVerification = () => {
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() =>
		getStoredThemePreference(),
	);

	const toggleTheme = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
	};

	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<SessionsContent themeMode={themeMode} onToggleTheme={toggleTheme} />
		</ThemeProvider>
	);
};

export default TreeAuditVerification;
