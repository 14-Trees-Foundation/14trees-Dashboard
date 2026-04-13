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
	IconButton,
	CircularProgress,
	Alert,
	TextField,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Button,
	Tooltip,
	Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@mui/material/styles';
import { useSurveyResponses } from '../hooks/useSurveyResponses';
import { useSurveyForms } from '../hooks/useSurveyForms';
import type {
	ResponseFilters,
	SurveyResponse,
} from '../../../../types/surveys';
import ResponseDetailsDrawer from './ResponseDetailsDrawer';
import ApiClient from '../../../../api/apiClient/apiClient';

const SurveyResponses: React.FC = () => {
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [filters, setFilters] = useState<ResponseFilters>({
		surveyId: '',
		submittedBy: '',
		search: '',
		startDate: null,
		endDate: null,
	});
	const [searchInput, setSearchInput] = useState('');
	const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
		null,
	);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [exporting, setExporting] = useState(false);

	const { data, loading, error, refetch } = useSurveyResponses(
		page,
		rowsPerPage,
		filters,
	);
	const { data: formsData } = useSurveyForms(0, 100, {
		status: 'all',
		search: '',
		startDate: null,
		endDate: null,
	});

	const handleSearch = () => {
		setFilters((prev) => ({ ...prev, search: searchInput }));
		setPage(0);
	};

	const handleFilterReset = () => {
		setFilters({
			surveyId: '',
			submittedBy: '',
			search: '',
			startDate: null,
			endDate: null,
		});
		setSearchInput('');
		setPage(0);
	};

	const handleViewDetails = (response: SurveyResponse) => {
		setSelectedResponseId(response.responseId);
		setDrawerOpen(true);
	};

	const hasActiveFilters = !!(
		filters.surveyId ||
		filters.search ||
		filters.startDate ||
		filters.endDate
	);

	const handleExport = async () => {
		setExporting(true);
		try {
			const apiClient = new ApiClient();
			const blob = await apiClient.exportSurveyResponses({
				surveyId: filters.surveyId || undefined,
				submittedBy: filters.submittedBy || undefined,
				startDate: filters.startDate || undefined,
				endDate: filters.endDate || undefined,
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const timestamp = new Date().toISOString().split('T')[0];
			const surveyLabel = filters.surveyId || 'all';
			link.download = `survey_responses_${surveyLabel}_${timestamp}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err: any) {
			alert(err.response?.data?.error || 'Failed to export responses');
		} finally {
			setExporting(false);
		}
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
					placeholder="Search responses..."
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

				<FormControl size="small" sx={{ minWidth: 200, ...inputSx }}>
					<InputLabel>Survey Form</InputLabel>
					<Select
						value={filters.surveyId}
						label="Survey Form"
						onChange={(e) => {
							setFilters((prev) => ({ ...prev, surveyId: e.target.value }));
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
						<MenuItem value="">All Forms</MenuItem>
						{formsData?.configs.map((form) => (
							<MenuItem key={form._id} value={form.surveyId}>
								{form.formTitle}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					type="date"
					label="Start Date"
					value={filters.startDate || ''}
					onChange={(e) => {
						setFilters((prev) => ({
							...prev,
							startDate: e.target.value || null,
						}));
						setPage(0);
					}}
					size="small"
					InputLabelProps={{ shrink: true }}
					sx={{ width: 160, ...inputSx }}
				/>

				<TextField
					type="date"
					label="End Date"
					value={filters.endDate || ''}
					onChange={(e) => {
						setFilters((prev) => ({
							...prev,
							endDate: e.target.value || null,
						}));
						setPage(0);
					}}
					size="small"
					InputLabelProps={{ shrink: true }}
					sx={{ width: 160, ...inputSx }}
				/>

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
					startIcon={
						exporting ? (
							<CircularProgress size={16} sx={{ color: '#9bc53d' }} />
						) : (
							<DownloadIcon />
						)
					}
					onClick={handleExport}
					disabled={exporting || !data || data.total === 0}
					variant="outlined"
					size="small"
					sx={{
						color: '#9bc53d',
						borderColor: '#9bc53d',
						textTransform: 'none',
						'&:hover': {
							borderColor: '#8ab02d',
							bgcolor: 'rgba(155, 197, 61, 0.08)',
						},
						'&.Mui-disabled': {
							borderColor: theme.palette.divider,
							color: theme.palette.text.disabled,
						},
					}}
				>
					{exporting ? 'Exporting...' : 'Export CSV'}
				</Button>

				{hasActiveFilters && (
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
										'Submitted',
										'Survey Form',
										'User',
										'Location',
										'Fields Filled',
										'Images',
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
								{data?.responses.map((response) => (
									<TableRow
										key={response._id}
										hover
										sx={{ '&:hover': { bgcolor: theme.palette.action?.hover } }}
									>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.82rem',
												borderColor: theme.palette.divider,
											}}
										>
											{new Date(response.createdAt).toLocaleString()}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.primary,
												fontFamily: 'monospace',
												fontSize: '0.82rem',
												borderColor: theme.palette.divider,
											}}
										>
											{response.surveyId}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.82rem',
												borderColor: theme.palette.divider,
											}}
										>
											{response.userId || '—'}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.82rem',
												borderColor: theme.palette.divider,
											}}
										>
											{response.location
												? `${response.location.latitude.toFixed(
														4,
												  )}, ${response.location.longitude.toFixed(4)}`
												: '—'}
										</TableCell>
										<TableCell
											sx={{
												color: theme.palette.text.secondary,
												borderColor: theme.palette.divider,
											}}
										>
											{Object.keys(response.responses || {}).length}
										</TableCell>
										<TableCell sx={{ borderColor: theme.palette.divider }}>
											{response.images && response.images.length > 0 ? (
												<Chip
													icon={<ImageIcon />}
													label={response.images.length}
													size="small"
													sx={{
														bgcolor: theme.palette.action?.selected,
														color: '#9bc53d',
														'& .MuiChip-icon': { color: '#9bc53d' },
													}}
												/>
											) : (
												<span style={{ color: theme.palette.text.disabled }}>
													—
												</span>
											)}
										</TableCell>
										<TableCell sx={{ borderColor: theme.palette.divider }}>
											<Tooltip title="View Details">
												<IconButton
													size="small"
													onClick={() => handleViewDetails(response)}
													sx={{ color: theme.palette.text.secondary }}
												>
													<VisibilityIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
								{data?.responses.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											align="center"
											sx={{
												color: theme.palette.text.secondary,
												py: 6,
												borderColor: theme.palette.divider,
											}}
										>
											No responses found
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

			<ResponseDetailsDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				responseId={selectedResponseId}
			/>
		</Box>
	);
};

export default SurveyResponses;
