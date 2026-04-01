import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	Paper,
	Chip,
	Button,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Pagination,
	CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../../api/apiClient/apiClient';
import { useRbacPermissions } from '../../../hooks/useRbacPermissions';

const ACTION_TYPES = ['role_assigned', 'role_changed', 'role_removed'];
const PAGE_SIZE = 25;

interface AuditLog {
	id: number;
	user_name: string;
	user_email: string;
	action_type: string;
	old_role_name: string | null;
	new_role_name: string | null;
	changed_by: string;
	changed_at: string;
	reason: string;
	ip_address: string;
}

export const RbacAuditLog: React.FC = () => {
	const { can } = useRbacPermissions();
	const navigate = useNavigate();
	const api = new ApiClient();

	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const [filters, setFilters] = useState({
		changed_by: '',
		action_type: '',
		start_date: '',
		end_date: '',
	});

	useEffect(() => {
		if (!can('access_control', 'manage')) navigate('/admin');
	}, []);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const params: any = { page, limit: PAGE_SIZE };
			if (filters.changed_by) params.changed_by = filters.changed_by;
			if (filters.action_type) params.action_type = filters.action_type;
			if (filters.start_date) params.start_date = filters.start_date;
			if (filters.end_date) params.end_date = filters.end_date;

			const data = await api.getAuditLogs(params);
			setLogs(data.logs || []);
			setTotal(data.total || 0);
		} catch {
			toast.error('Failed to load audit log');
		} finally {
			setLoading(false);
		}
	}, [page, filters]);

	useEffect(() => {
		load();
	}, [load]);

	const handleExport = () => {
		const params: any = {};
		if (filters.changed_by) params.changed_by = filters.changed_by;
		if (filters.action_type) params.action_type = filters.action_type;
		if (filters.start_date) params.start_date = filters.start_date;
		if (filters.end_date) params.end_date = filters.end_date;

		const token = localStorage.getItem('token');
		const parsedToken = token ? JSON.parse(token) : '';
		const url = api.getAuditLogExportUrl(params);
		// Add token as query param for CSV download (since we can't set headers for anchor tags)
		window.open(`${url}&_token=${parsedToken}`, '_blank');
	};

	const actionColor = (type: string) => {
		if (type === 'role_assigned') return 'success';
		if (type === 'role_removed') return 'error';
		return 'warning';
	};

	return (
		<Box p={3}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Typography variant="h5" fontWeight={600}>
					Audit Log
				</Typography>
				<Button
					variant="outlined"
					startIcon={<DownloadIcon />}
					onClick={handleExport}
				>
					Export CSV
				</Button>
			</Box>

			{/* Filters */}
			<Box display="flex" gap={2} mb={2} flexWrap="wrap">
				<TextField
					label="Changed by (email)"
					size="small"
					value={filters.changed_by}
					onChange={(e) =>
						setFilters((f) => ({ ...f, changed_by: e.target.value }))
					}
					sx={{ minWidth: 220 }}
				/>
				<FormControl size="small" sx={{ minWidth: 180 }}>
					<InputLabel>Action type</InputLabel>
					<Select
						value={filters.action_type}
						label="Action type"
						onChange={(e) =>
							setFilters((f) => ({ ...f, action_type: e.target.value }))
						}
					>
						<MenuItem value="">All</MenuItem>
						{ACTION_TYPES.map((t) => (
							<MenuItem key={t} value={t}>
								{t}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="From date"
					type="date"
					size="small"
					InputLabelProps={{ shrink: true }}
					value={filters.start_date}
					onChange={(e) =>
						setFilters((f) => ({ ...f, start_date: e.target.value }))
					}
				/>
				<TextField
					label="To date"
					type="date"
					size="small"
					InputLabelProps={{ shrink: true }}
					value={filters.end_date}
					onChange={(e) =>
						setFilters((f) => ({ ...f, end_date: e.target.value }))
					}
				/>
				<Button
					variant="outlined"
					size="small"
					onClick={() => {
						setPage(1);
						load();
					}}
				>
					Apply
				</Button>
				<Button
					size="small"
					onClick={() => {
						setFilters({
							changed_by: '',
							action_type: '',
							start_date: '',
							end_date: '',
						});
						setPage(1);
					}}
				>
					Clear
				</Button>
			</Box>

			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead sx={{ bgcolor: '#1f3625' }}>
						<TableRow>
							{[
								'Timestamp',
								'User',
								'Action',
								'From',
								'To',
								'Changed By',
								'Reason',
							].map((h) => (
								<TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<CircularProgress size={28} />
								</TableCell>
							</TableRow>
						) : logs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No audit records found
								</TableCell>
							</TableRow>
						) : (
							logs.map((log) => (
								<TableRow key={log.id} hover>
									<TableCell sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
										{new Date(log.changed_at).toLocaleString()}
									</TableCell>
									<TableCell>
										<Typography variant="body2" fontWeight={500}>
											{log.user_name}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{log.user_email}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={log.action_type}
											size="small"
											color={actionColor(log.action_type) as any}
										/>
									</TableCell>
									<TableCell sx={{ fontSize: 12 }}>
										{log.old_role_name || '—'}
									</TableCell>
									<TableCell sx={{ fontSize: 12 }}>
										{log.new_role_name || '—'}
									</TableCell>
									<TableCell sx={{ fontSize: 12 }}>{log.changed_by}</TableCell>
									<TableCell
										sx={{
											fontSize: 12,
											maxWidth: 200,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
										}}
									>
										{log.reason}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mt={2}
			>
				<Typography variant="caption" color="text.secondary">
					{total} total records
				</Typography>
				<Pagination
					count={Math.ceil(total / PAGE_SIZE)}
					page={page}
					onChange={(_, p) => setPage(p)}
					color="primary"
				/>
			</Box>
		</Box>
	);
};

export default RbacAuditLog;
