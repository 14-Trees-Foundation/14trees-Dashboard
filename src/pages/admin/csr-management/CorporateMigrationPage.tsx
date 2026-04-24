import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Typography,
	Button,
	Chip,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	LinearProgress,
	Stepper,
	Step,
	StepLabel,
	Divider,
	Tooltip,
	CircularProgress,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ApiClient from '../../../api/apiClient/apiClient';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	analyticsPageSx,
	analyticsSectionTitleSx,
	analyticsCardSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
} from '../shared/adminTheme';

const THEME_KEY = 'csr_management_theme';

interface GcrPreview {
	gcr_id: number;
	request_id: string;
	event_name: string | null;
	event_type: string | null;
	no_of_cards: number;
	gifted_on: string;
	donation_date: string | null;
	amount_received: number | null;
	payment_id: number | null;
	status: string;
	synthetic_user: string;
	proposed_financial_year: string;
	gift_card_count: number;
	tree_count: number;
	parity_ok: boolean;
	already_migrated: boolean;
}

interface Verification {
	group_id: number;
	group_name: string;
	total_migrated_gcrs: number;
	parity_ok: number;
	parity_fail: number;
	sponsored_by_group_fill: number;
	sponsored_by_group_total: number;
	mapped_to_group_fill: number;
	mapped_to_group_total: number;
	all_checks_pass: boolean;
}

const STEPS = ['Preview', 'Migrate', 'Verify', 'Archive'];

interface ContentProps {
	isDark: boolean;
}

const CorporateMigrationContent: React.FC<ContentProps> = ({ isDark }) => {
	const { group_id } = useParams<{ group_id: string }>();
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = isDark ? ANALYTICS_COLORS : LIGHT_ANALYTICS_COLORS;
	const groupId = Number(group_id);

	const [activeStep, setActiveStep] = useState(0);
	const [preview, setPreview] = useState<GcrPreview[]>([]);
	const [selectedGcrIds, setSelectedGcrIds] = useState<number[]>([]);
	const [verification, setVerification] = useState<Verification | null>(null);
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [groupName, setGroupName] = useState('');
	const [confirmDialog, setConfirmDialog] = useState<
		null | 'migrate' | 'archive' | 'rollback'
	>(null);
	const [migrationResult, setMigrationResult] = useState<{
		migrated: number;
		csr_request_ids: number[];
	} | null>(null);

	const api = new ApiClient();

	const loadPreview = useCallback(() => {
		setLoading(true);
		setError(null);
		api
			.getCsrMigrationPreview(groupId)
			.then((res) => {
				const gcrs: GcrPreview[] = res.gcrs ?? [];
				setPreview(gcrs);
				// Auto-select pending GCRs with >= 100 trees (CSR-scale); admin can adjust manually
				const pendingIds = gcrs
					.filter((g) => !g.already_migrated && g.no_of_cards >= 100)
					.map((g) => g.gcr_id);
				setSelectedGcrIds(pendingIds);
				if (gcrs.length > 0 && gcrs.some((g) => g.already_migrated)) {
					setActiveStep(2);
				}
			})
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [groupId]);

	useEffect(() => {
		loadPreview();
	}, [loadPreview]);

	const handleMigrate = async () => {
		setConfirmDialog(null);
		setActionLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const result = await api.executeCsrMigration(groupId, selectedGcrIds);
			setMigrationResult(result);
			setSuccess(
				`Successfully migrated ${result.migrated} GCR(s) → ${result.csr_request_ids.length} CSR request(s) created.`,
			);
			setActiveStep(2);
			loadPreview();
		} catch (e: any) {
			setError(e.message);
		} finally {
			setActionLoading(false);
		}
	};

	const handleVerify = async () => {
		setActionLoading(true);
		setError(null);
		try {
			const result = await api.verifyCsrMigration(groupId);
			setVerification(result);
			setGroupName(result.group_name);
			if (result.all_checks_pass) {
				setActiveStep(3);
			}
		} catch (e: any) {
			setError(e.message);
		} finally {
			setActionLoading(false);
		}
	};

	const handleArchive = async () => {
		setConfirmDialog(null);
		setActionLoading(true);
		setError(null);
		try {
			await api.archiveCsrMigration(groupId);
			setSuccess(
				'Migration archived. This corporate now uses the CSR flow exclusively.',
			);
			setActiveStep(3);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setActionLoading(false);
		}
	};

	const handleRollback = async () => {
		setConfirmDialog(null);
		setActionLoading(true);
		setError(null);
		try {
			await api.rollbackCsrMigration(groupId);
			setSuccess('Rollback complete. All CSR requests removed, GCRs restored.');
			setActiveStep(0);
			setVerification(null);
			setMigrationResult(null);
			loadPreview();
		} catch (e: any) {
			setError(e.message);
		} finally {
			setActionLoading(false);
		}
	};

	const pendingGcrs = preview.filter((g) => !g.already_migrated);
	const migratedGcrs = preview.filter((g) => g.already_migrated);
	const parityIssues = preview.filter((g) => !g.parity_ok);

	const previewColumns: ColumnsType<GcrPreview> = [
		{
			title: 'GCR',
			dataIndex: 'request_id',
			render: (v, row) => (
				<Box>
					<Typography
						variant="caption"
						sx={{ color: theme.palette.text.secondary, display: 'block' }}
					>
						#{row.gcr_id}
					</Typography>
					<Typography
						variant="body2"
						sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
					>
						{v}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Event',
			key: 'event',
			render: (_, row) => (
				<Box>
					<Typography variant="body2">
						{row.event_name ?? row.event_type ?? '—'}
					</Typography>
					<Typography
						variant="caption"
						sx={{ color: theme.palette.text.secondary }}
					>
						{row.event_type} · {row.synthetic_user}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Date',
			key: 'date',
			render: (_, row) => (
				<Box>
					<Typography variant="body2">
						{row.donation_date
							? new Date(row.donation_date).toLocaleDateString()
							: new Date(row.gifted_on).toLocaleDateString()}
					</Typography>
					<Chip
						label={`FY ${row.proposed_financial_year}`}
						size="small"
						sx={{
							fontSize: '0.7rem',
							height: 18,
							bgcolor: isDark ? 'rgba(33,150,243,0.15)' : '#e3f2fd',
							color: '#2196f3',
						}}
					/>
				</Box>
			),
		},
		{
			title: 'Trees',
			key: 'trees',
			align: 'center',
			render: (_, row) => (
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{row.no_of_cards}
					</Typography>
					<Typography
						variant="caption"
						sx={{ color: theme.palette.text.secondary }}
					>
						{row.gift_card_count} cards / {row.tree_count} trees
					</Typography>
				</Box>
			),
		},
		{
			title: 'Parity',
			key: 'parity',
			align: 'center',
			render: (_, row) =>
				row.parity_ok ? (
					<CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
				) : (
					<Tooltip
						title={`Mismatch: ${row.gift_card_count} gift cards vs ${row.tree_count} trees`}
					>
						<ErrorIcon sx={{ color: '#f44336', fontSize: 18 }} />
					</Tooltip>
				),
		},
		{
			title: 'Amount',
			dataIndex: 'amount_received',
			align: 'right',
			render: (v) => (
				<Typography variant="body2" sx={{ color: colors.green }}>
					{v ? `₹${Number(v).toLocaleString()}` : '—'}
				</Typography>
			),
		},
		{
			title: 'Status',
			key: 'migstatus',
			align: 'center',
			render: (_, row) =>
				row.already_migrated ? (
					<Chip
						label="Migrated"
						size="small"
						sx={{
							bgcolor: isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9',
							color: '#4caf50',
							fontSize: '0.7rem',
						}}
					/>
				) : (
					<Chip
						label="Pending"
						size="small"
						sx={{
							bgcolor: isDark ? 'rgba(255,152,0,0.15)' : '#fff3e0',
							color: '#ff9800',
							fontSize: '0.7rem',
						}}
					/>
				),
		},
	];

	const cardSx = isDark
		? analyticsCardSx
		: { backgroundColor: '#fff', border: '1px solid #eeebe4', borderRadius: 2 };

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
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
						<Button
							startIcon={<ArrowBackIcon />}
							size="small"
							onClick={() => navigate('/admin/csr-management/migrate')}
							sx={{
								textTransform: 'none',
								color: theme.palette.text.secondary,
								minWidth: 0,
								p: 0,
							}}
						>
							Migration
						</Button>
						<Typography
							variant="body2"
							sx={{ color: theme.palette.text.disabled }}
						>
							/
						</Typography>
						<Typography
							variant="body2"
							sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
						>
							{groupName || `Group #${groupId}`}
						</Typography>
					</Box>
					<Typography
						variant="h5"
						sx={{
							...analyticsSectionTitleSx,
							fontWeight: 700,
							color: theme.palette.text.primary,
						}}
					>
						Migrate Corporate
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
					>
						Preview → Migrate → Verify → Archive
					</Typography>
				</Box>

				{activeStep >= 1 && !verification?.all_checks_pass && (
					<Button
						variant="outlined"
						size="small"
						color="error"
						onClick={() => setConfirmDialog('rollback')}
						sx={{ textTransform: 'none', fontSize: '0.8rem' }}
					>
						Rollback Migration
					</Button>
				)}
			</Box>

			{/* Stepper */}
			<Box sx={{ ...cardSx, mb: 3 }}>
				<Stepper activeStep={activeStep} sx={{ py: 1 }}>
					{STEPS.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>

			{/* Alerts */}
			{error && (
				<Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert
					severity="success"
					onClose={() => setSuccess(null)}
					sx={{ mb: 2 }}
				>
					{success}
				</Alert>
			)}

			{actionLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

			{/* Summary stats */}
			{preview.length > 0 && (
				<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
					{[
						{
							label: 'Total GCRs',
							value: preview.length,
							color: colors.primary,
						},
						{ label: 'Pending', value: pendingGcrs.length, color: '#ff9800' },
						{ label: 'Migrated', value: migratedGcrs.length, color: '#4caf50' },
						{
							label: 'Parity Issues',
							value: parityIssues.length,
							color: parityIssues.length > 0 ? '#f44336' : '#4caf50',
						},
						{
							label: 'Total Trees',
							value: preview
								.reduce((s, g) => s + g.no_of_cards, 0)
								.toLocaleString(),
							color: colors.green,
						},
					].map((stat) => (
						<Box
							key={stat.label}
							sx={{ ...cardSx, flex: '1 1 120px', textAlign: 'center' }}
						>
							<Typography
								variant="h5"
								sx={{ color: stat.color, fontWeight: 700 }}
							>
								{stat.value}
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: theme.palette.text.secondary }}
							>
								{stat.label}
							</Typography>
						</Box>
					))}
				</Box>
			)}

			{parityIssues.length > 0 && (
				<Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
					{parityIssues.length} GCR(s) have parity issues (gift card count ≠
					tree count). Review before migrating.
				</Alert>
			)}

			{/* GCR Preview Table */}
			<Box sx={{ ...cardSx, p: 0, overflow: 'hidden', mb: 3 }}>
				<Box
					sx={{
						px: 2,
						pt: 2,
						pb: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Typography
						variant="subtitle2"
						sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
					>
						Gift Card Requests
					</Typography>
					<Typography
						variant="caption"
						sx={{ color: theme.palette.text.secondary }}
					>
						{selectedGcrIds.length} of {pendingGcrs.length} pending selected for
						migration
					</Typography>
				</Box>
				<Divider sx={{ borderColor: theme.palette.divider }} />
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress size={28} />
					</Box>
				) : (
					<Table
						dataSource={preview}
						columns={previewColumns}
						rowKey="gcr_id"
						pagination={false}
						size="small"
						style={{ background: 'transparent' }}
						rowSelection={{
							selectedRowKeys: selectedGcrIds,
							onChange: (keys) => setSelectedGcrIds(keys as number[]),
							getCheckboxProps: (row: GcrPreview) => ({
								disabled: row.already_migrated,
							}),
						}}
					/>
				)}
			</Box>

			{/* Verification Panel */}
			{verification && (
				<Box sx={{ ...cardSx, mb: 3 }}>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
					>
						Verification Results
					</Typography>
					{[
						{
							label: 'Tree-ID Parity',
							ok: verification.parity_fail === 0,
							detail: `${verification.parity_ok}/${verification.total_migrated_gcrs} GCRs match`,
						},
						{
							label: 'sponsored_by_group filled',
							ok:
								verification.sponsored_by_group_fill ===
								verification.sponsored_by_group_total,
							detail: `${verification.sponsored_by_group_fill}/${verification.sponsored_by_group_total} trees`,
						},
						{
							label: 'mapped_to_group filled',
							ok:
								verification.mapped_to_group_fill ===
								verification.mapped_to_group_total,
							detail: `${verification.mapped_to_group_fill}/${verification.mapped_to_group_total} trees`,
						},
					].map((check) => (
						<Box
							key={check.label}
							sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}
						>
							{check.ok ? (
								<CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
							) : (
								<ErrorIcon sx={{ color: '#f44336', fontSize: 18 }} />
							)}
							<Typography
								variant="body2"
								sx={{ color: theme.palette.text.primary, fontWeight: 500 }}
							>
								{check.label}
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: theme.palette.text.secondary }}
							>
								— {check.detail}
							</Typography>
						</Box>
					))}
					{verification.all_checks_pass && (
						<Alert severity="success" sx={{ mt: 2 }}>
							All checks passed. You can now archive this migration.
						</Alert>
					)}
				</Box>
			)}

			{/* Action buttons */}
			<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
				{pendingGcrs.length > 0 && (
					<Button
						variant="contained"
						startIcon={<SwapHorizIcon />}
						disabled={actionLoading || selectedGcrIds.length === 0}
						onClick={() => setConfirmDialog('migrate')}
						sx={{
							textTransform: 'none',
							bgcolor: colors.primary,
							'&:hover': { bgcolor: colors.primary },
						}}
					>
						Migrate {selectedGcrIds.length} selected GCR(s)
					</Button>
				)}

				{migratedGcrs.length > 0 && (
					<Button
						variant="outlined"
						disabled={actionLoading}
						onClick={handleVerify}
						sx={{
							textTransform: 'none',
							borderColor: colors.primary,
							color: colors.primary,
						}}
					>
						Run Verification
					</Button>
				)}

				{verification?.all_checks_pass && (
					<Button
						variant="contained"
						color="success"
						disabled={actionLoading}
						onClick={() => setConfirmDialog('archive')}
						sx={{ textTransform: 'none' }}
					>
						Archive & Activate CSR Flow
					</Button>
				)}
			</Box>

			{/* Confirm dialogs */}
			<Dialog
				open={confirmDialog === 'migrate'}
				onClose={() => setConfirmDialog(null)}
			>
				<DialogTitle>Confirm Migration</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						This will migrate{' '}
						<strong>{selectedGcrIds.length} selected GCR(s)</strong> into CSR
						requests. Unselected GCRs (e.g. employee gift cards) stay in the
						gift card flow untouched. Trees will be stamped with{' '}
						<code>csr_request_id</code>. Original records remain intact until
						you archive.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
					<Button variant="contained" onClick={handleMigrate}>
						Migrate
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={confirmDialog === 'archive'}
				onClose={() => setConfirmDialog(null)}
			>
				<DialogTitle>Confirm Archive</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						This will archive all migrated GCRs and mark this corporate as{' '}
						<strong>migrated</strong>. After this, new CSR tree assignments for
						this company <strong>must go through the CSR flow</strong>. The old
						gift card path will be blocked.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
					<Button variant="contained" color="success" onClick={handleArchive}>
						Archive & Activate
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={confirmDialog === 'rollback'}
				onClose={() => setConfirmDialog(null)}
			>
				<DialogTitle>Confirm Rollback</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="error">
						This will undo the migration for all GCRs of this corporate. CSR
						requests will be soft-deleted, <code>csr_request_id</code> will be
						cleared from trees, and GCRs will be restored to their original
						state.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
					<Button variant="contained" color="error" onClick={handleRollback}>
						Rollback
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

const CorporateMigrationPage: React.FC = () => {
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(
		() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'light',
	);
	const toggle = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		localStorage.setItem(THEME_KEY, next);
	};

	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
				<Tooltip
					title={
						themeMode === 'light'
							? 'Switch to dark mode'
							: 'Switch to light mode'
					}
				>
					<span
						onClick={toggle}
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							color: '#888',
						}}
					>
						{themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
					</span>
				</Tooltip>
			</Box>
			<CorporateMigrationContent isDark={themeMode === 'dark'} />
		</ThemeProvider>
	);
};

export default CorporateMigrationPage;
