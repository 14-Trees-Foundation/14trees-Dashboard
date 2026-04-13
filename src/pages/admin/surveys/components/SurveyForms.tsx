import React, { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	CircularProgress,
	Alert,
	TextField,
	Select,
	FormControl,
	InputLabel,
	Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useSurveyForms } from '../hooks/useSurveyForms';
import type { SurveyConfig, SurveyFilters } from '../../../../types/surveys';
import FormDetailsDialog from './FormDetailsDialog';
import ConfirmDialog from './ConfirmDialog';
import FormEditorDialog from './FormEditorDialog';
import ApiClient from '../../../../api/apiClient/apiClient';

const SurveyForms: React.FC = () => {
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [filters, setFilters] = useState<SurveyFilters>({
		status: 'all',
		search: '',
		startDate: null,
		endDate: null,
	});
	const [searchInput, setSearchInput] = useState('');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedForm, setSelectedForm] = useState<SurveyConfig | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<'archive' | 'restore'>(
		'archive',
	);
	const [actionError, setActionError] = useState<string | null>(null);
	const [editorOpen, setEditorOpen] = useState(false);
	const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
	const [editingForm, setEditingForm] = useState<SurveyConfig | null>(null);

	const { data, loading, error, refetch } = useSurveyForms(
		page,
		rowsPerPage,
		filters,
	);

	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		form: SurveyConfig,
	) => {
		setAnchorEl(event.currentTarget);
		// Use fresh data from the current table row, not potentially stale state
		const freshForm = data?.configs.find((c) => c._id === form._id) ?? form;
		setSelectedForm(freshForm);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleViewDetails = () => {
		setDetailsOpen(true);
		handleMenuClose();
	};

	const handleArchiveClick = () => {
		setConfirmAction('archive');
		setConfirmDialogOpen(true);
		handleMenuClose();
	};

	const handleRestoreClick = () => {
		setConfirmAction('restore');
		setConfirmDialogOpen(true);
		handleMenuClose();
	};

	const handleConfirmAction = async () => {
		if (!selectedForm) return;
		setActionError(null);
		try {
			const apiClient = new ApiClient();
			if (confirmAction === 'archive') {
				await apiClient.archiveSurveyConfig(selectedForm.surveyId);
			} else {
				await apiClient.restoreSurveyConfig(selectedForm.surveyId);
			}
			refetch();
		} catch (err: any) {
			const errData = err.response?.data?.error;
			setActionError(
				typeof errData === 'string'
					? errData
					: err.message || `Failed to ${confirmAction} form`,
			);
		} finally {
			setConfirmDialogOpen(false);
		}
	};

	const handleCreateNew = () => {
		setEditorMode('create');
		setEditingForm(null);
		setEditorOpen(true);
	};

	const handleEdit = () => {
		setEditorMode('edit');
		setEditingForm(selectedForm);
		setEditorOpen(true);
		handleMenuClose();
	};

	const handleClone = async () => {
		if (!selectedForm) return;
		handleMenuClose();
		try {
			const apiClient = new ApiClient();
			const result = await apiClient.cloneSurveyConfig(selectedForm.surveyId);
			setActionError(null);
			refetch();
			// brief non-blocking feedback
			alert(
				`Cloned as: ${result.config.formTitle} (${result.config.surveyId})`,
			);
		} catch (err: any) {
			setActionError(err.response?.data?.error || 'Failed to clone form');
		}
	};

	const handleSaveForm = async (payload: any) => {
		const apiClient = new ApiClient();
		if (editorMode === 'create') {
			await apiClient.createSurveyConfig(payload);
		} else if (editingForm) {
			await apiClient.updateSurveyConfig(editingForm.surveyId, payload);
		}
		refetch();
	};

	const handleSearch = () => {
		setFilters((prev) => ({ ...prev, search: searchInput }));
		setPage(0);
	};

	const handleFilterReset = () => {
		setFilters({ status: 'all', search: '', startDate: null, endDate: null });
		setSearchInput('');
		setPage(0);
	};

	const getStatusColor = (status: string) => {
		if (status === 'active') return '#059669';
		if (status === 'draft') return '#6b7280';
		if (status === 'archived') return '#dc2626';
		return '#6b7280';
	};

	const inputSx = {
		'& .MuiOutlinedInput-root': {
			bgcolor: theme.palette.background.default,
			color: theme.palette.text.primary,
			'& fieldset': { borderColor: theme.palette.divider },
			'&:hover fieldset': { borderColor: '#9bc53d' },
			'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
		},
		'& .MuiInputLabel-root': { color: theme.palette.text.secondary },
		'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
	};

	return (
		<Box>
			{actionError && (
				<Alert
					severity="error"
					onClose={() => setActionError(null)}
					sx={{ mb: 2 }}
				>
					{actionError}
				</Alert>
			)}

			{/* Filters Bar */}
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					mb: 3,
					flexWrap: 'wrap',
					alignItems: 'center',
				}}
			>
				<TextField
					placeholder="Search forms..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					size="small"
					sx={{ width: 280, ...inputSx }}
					InputProps={{
						endAdornment: (
							<IconButton size="small" onClick={handleSearch}>
								<SearchIcon sx={{ color: theme.palette.text.secondary }} />
							</IconButton>
						),
					}}
				/>

				<FormControl size="small" sx={{ minWidth: 140, ...inputSx }}>
					<InputLabel>Status</InputLabel>
					<Select
						value={filters.status}
						label="Status"
						onChange={(e) => {
							setFilters((prev) => ({
								...prev,
								status: e.target.value as SurveyFilters['status'],
							}));
							setPage(0);
						}}
						sx={{
							bgcolor: theme.palette.background.default,
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: '#9bc53d',
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: '#9bc53d',
							},
							'& .MuiSvgIcon-root': { color: theme.palette.text.secondary },
						}}
					>
						<MenuItem value="all">All</MenuItem>
						<MenuItem value="active">Active</MenuItem>
						<MenuItem value="draft">Draft</MenuItem>
						<MenuItem value="archived">Archived</MenuItem>
					</Select>
				</FormControl>

				<Tooltip title="Reset Filters">
					<IconButton
						onClick={handleFilterReset}
						sx={{ color: theme.palette.text.secondary }}
					>
						<FilterListIcon />
					</IconButton>
				</Tooltip>

				<Tooltip title="Refresh">
					<IconButton
						onClick={refetch}
						sx={{ color: theme.palette.text.secondary }}
					>
						<RefreshIcon />
					</IconButton>
				</Tooltip>

				<Button
					startIcon={<AddIcon />}
					variant="contained"
					onClick={handleCreateNew}
					sx={{
						bgcolor: '#9bc53d',
						color: '#0f1912',
						textTransform: 'none',
						'&:hover': { bgcolor: '#8ab02d' },
					}}
				>
					Create New Form
				</Button>

				{(filters.status !== 'all' || !!filters.search) && (
					<Button
						size="small"
						onClick={handleFilterReset}
						sx={{ color: '#9bc53d', textTransform: 'none', ml: 1 }}
					>
						Clear Filters
					</Button>
				)}
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
					<CircularProgress sx={{ color: '#9bc53d' }} />
				</Box>
			) : (
				<>
					<TableContainer>
						<Table size="small">
							<TableHead>
								<TableRow>
									{[
										'Form Name',
										'Survey ID',
										'Version',
										'Status',
										'Fields',
										'Responses',
										'Last Updated',
										'Actions',
									].map((col) => (
										<TableCell
											key={col}
											sx={{
												color: theme.palette.text.secondary,
												fontWeight: 600,
												fontSize: '0.68rem',
												textTransform: 'uppercase',
												letterSpacing: '0.08em',
												borderColor: theme.palette.divider,
											}}
										>
											{col}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{data?.configs.map((form) => (
									<TableRow
										key={form._id}
										hover
										sx={{ '&:hover': { bgcolor: theme.palette.action?.hover } }}
									>
										<TableCell
											sx={{
												color: theme.palette.text.primary,
												borderColor: theme.palette.divider,
											}}
										>
											{form.formTitle}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.82rem',
												fontFamily: 'monospace',
												borderColor: theme.palette.divider,
											}}
										>
											{form.surveyId}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												borderColor: theme.palette.divider,
											}}
										>
											v{form.version}
										</TableCell>
										<TableCell sx={{ borderColor: theme.palette.divider }}>
											<Chip
												label={form.status}
												size="small"
												sx={{
													bgcolor: getStatusColor(form.status),
													color: '#fff',
													fontWeight: 500,
													fontSize: '0.72rem',
												}}
											/>
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												borderColor: theme.palette.divider,
											}}
										>
											{form.formStructure.fields.length}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												borderColor: theme.palette.divider,
											}}
										>
											{form.metadata?.responseCount ?? 0}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.82rem',
												borderColor: theme.palette.divider,
											}}
										>
											{new Date(form.updatedAt).toLocaleDateString()}
										</TableCell>
										<TableCell sx={{ borderColor: theme.palette.divider }}>
											<IconButton
												size="small"
												onClick={(e) => handleMenuOpen(e, form)}
												sx={{ color: theme.palette.text.secondary }}
											>
												<MoreVertIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
								{data?.configs.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={8}
											align="center"
											sx={{
												color: theme.palette.text.secondary,
												py: 6,
												borderColor: theme.palette.divider,
											}}
										>
											No forms found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						component="div"
						count={data?.total ?? 0}
						page={page}
						onPageChange={(_, newPage) => setPage(newPage)}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={(e) => {
							setRowsPerPage(parseInt(e.target.value, 10));
							setPage(0);
						}}
						rowsPerPageOptions={[10, 25, 50, 100]}
						sx={{
							color: theme.palette.text.secondary,
							borderTop: `1px solid ${theme.palette.divider}`,
							'& .MuiTablePagination-selectIcon': {
								color: theme.palette.text.secondary,
							},
							'& .MuiIconButton-root': { color: theme.palette.text.secondary },
						}}
					/>
				</>
			)}

			{/* Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				PaperProps={{
					sx: {
						bgcolor: theme.palette.background.paper,
						border: `1px solid ${theme.palette.divider}`,
						'& .MuiMenuItem-root': {
							color: theme.palette.text.primary,
							fontSize: '0.9rem',
							'&:hover': { bgcolor: theme.palette.action?.hover },
						},
					},
				}}
			>
				<MenuItem onClick={handleViewDetails}>View Details</MenuItem>
				{selectedForm?.status !== 'archived' && (
					<MenuItem onClick={handleEdit}>
						<EditIcon sx={{ mr: 1, fontSize: 18 }} />
						Edit
					</MenuItem>
				)}
				<MenuItem onClick={handleClone}>
					<ContentCopyIcon sx={{ mr: 1, fontSize: 18 }} />
					Clone
				</MenuItem>
				{selectedForm?.status !== 'archived' && (
					<MenuItem onClick={handleArchiveClick}>Archive</MenuItem>
				)}
				{selectedForm?.status === 'archived' && (
					<MenuItem onClick={handleRestoreClick}>Restore</MenuItem>
				)}
			</Menu>

			<FormDetailsDialog
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				surveyId={selectedForm?.surveyId ?? null}
			/>

			<ConfirmDialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
				onConfirm={handleConfirmAction}
				title={confirmAction === 'archive' ? 'Archive Form' : 'Restore Form'}
				message={
					confirmAction === 'archive'
						? `Are you sure you want to archive "${selectedForm?.formTitle}"? This action can be reversed.`
						: `Restore "${selectedForm?.formTitle}" to active status?`
				}
			/>

			<FormEditorDialog
				open={editorOpen}
				onClose={() => setEditorOpen(false)}
				onSave={handleSaveForm}
				editingConfig={editingForm}
				mode={editorMode}
			/>
		</Box>
	);
};

export default SurveyForms;
