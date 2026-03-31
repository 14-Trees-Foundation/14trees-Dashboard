import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	Select,
	FormControl,
	InputLabel,
	Pagination,
	CircularProgress,
	Button,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Autocomplete,
	Divider,
	Collapse,
	Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../../api/apiClient/apiClient';
import { useRbacPermissions } from '../../../hooks/useRbacPermissions';

interface RbacUser {
	id: number;
	name: string;
	email: string;
	phone: string;
	role_id: string | null;
	role_name: string | null;
	role_assigned_at: string | null;
	role_assigned_by: string | null;
}

interface Role {
	id: string;
	name: string;
	description: string;
}

const PAGE_SIZE = 20;

export const RbacUsers: React.FC = () => {
	const { can } = useRbacPermissions();
	const navigate = useNavigate();
	const api = new ApiClient();

	const [users, setUsers] = useState<RbacUser[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [roleFilter, setRoleFilter] = useState('');
	const [roles, setRoles] = useState<Role[]>([]);

	// Row menu
	const [menuAnchor, setMenuAnchor] = useState<{
		el: HTMLElement;
		user: RbacUser;
	} | null>(null);

	// Assign role dialog
	const [assignDialog, setAssignDialog] = useState<{
		open: boolean;
		user: RbacUser | null;
	}>({ open: false, user: null });
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [reason, setReason] = useState('');
	const [diff, setDiff] = useState<{ gained: any[]; lost: any[] } | null>(null);
	const [saving, setSaving] = useState(false);

	// History dialog
	const [historyDialog, setHistoryDialog] = useState<{
		open: boolean;
		user: RbacUser | null;
		logs: any[];
	}>({
		open: false,
		user: null,
		logs: [],
	});

	useEffect(() => {
		if (!can('access_control', 'manage')) {
			navigate('/admin');
		}
	}, []);

	const loadRoles = useCallback(async () => {
		try {
			const data = await api.getRbacRoles();
			setRoles(data.roles || []);
		} catch {
			/* ignore */
		}
	}, []);

	const loadUsers = useCallback(async () => {
		setLoading(true);
		try {
			const data = await api.getRbacUsers({
				page,
				limit: PAGE_SIZE,
				role_id: roleFilter || undefined,
			});
			setUsers(data.users || []);
			setTotal(data.total || 0);
		} catch (err: any) {
			toast.error('Failed to load users');
		} finally {
			setLoading(false);
		}
	}, [page, roleFilter]);

	useEffect(() => {
		loadRoles();
	}, []);
	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const openAssign = (user: RbacUser) => {
		setMenuAnchor(null);
		setAssignDialog({ open: true, user });
		setSelectedRole(
			user.role_id ? roles.find((r) => r.id === user.role_id) ?? null : null,
		);
		setReason('');
		setDiff(null);
	};

	const openHistory = async (user: RbacUser) => {
		setMenuAnchor(null);
		try {
			const data = await api.getAuditLogs({ user_id: user.id, limit: 50 });
			setHistoryDialog({ open: true, user, logs: data.logs || [] });
		} catch {
			toast.error('Failed to load history');
		}
	};

	const handleSaveRole = async () => {
		if (!assignDialog.user || !selectedRole || !reason.trim()) return;
		setSaving(true);
		try {
			const result = await api.assignUserRole(
				assignDialog.user.id,
				selectedRole.id,
				reason.trim(),
			);
			setDiff(result.diff);
			toast.success('Role assigned successfully');
			setAssignDialog({ open: false, user: null });
			loadUsers();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to assign role');
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveRole = async () => {
		if (!assignDialog.user || !reason.trim()) return;
		setSaving(true);
		try {
			await api.removeUserRole(assignDialog.user.id, reason.trim());
			toast.success('Role removed');
			setAssignDialog({ open: false, user: null });
			loadUsers();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to remove role');
		} finally {
			setSaving(false);
		}
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
					<ManageAccountsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
					Staff Roles
				</Typography>
			</Box>

			{/* Filters */}
			<Box display="flex" gap={2} mb={2}>
				<FormControl size="small" sx={{ minWidth: 200 }}>
					<InputLabel>Filter by role</InputLabel>
					<Select
						value={roleFilter}
						label="Filter by role"
						onChange={(e) => {
							setRoleFilter(e.target.value);
							setPage(1);
						}}
					>
						<MenuItem value="">All roles</MenuItem>
						{roles.map((r) => (
							<MenuItem key={r.id} value={r.id}>
								{r.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Table */}
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead sx={{ bgcolor: '#1f3625' }}>
						<TableRow>
							{['Name', 'Email', 'Phone', 'Role', 'Assigned By', 'Actions'].map(
								(h) => (
									<TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
										{h}
									</TableCell>
								),
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<CircularProgress size={28} />
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									No users with roles found
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id} hover>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.phone || '-'}</TableCell>
									<TableCell>
										{user.role_name ? (
											<Chip
												label={user.role_name}
												size="small"
												color="primary"
											/>
										) : (
											<Chip label="No role" size="small" variant="outlined" />
										)}
									</TableCell>
									<TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
										{user.role_assigned_by || '-'}
									</TableCell>
									<TableCell>
										<IconButton
											size="small"
											onClick={(e) =>
												setMenuAnchor({ el: e.currentTarget, user })
											}
										>
											<MoreVertIcon fontSize="small" />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Box display="flex" justifyContent="center" mt={2}>
				<Pagination
					count={Math.ceil(total / PAGE_SIZE)}
					page={page}
					onChange={(_, p) => setPage(p)}
					color="primary"
				/>
			</Box>

			{/* Row action menu */}
			<Menu
				anchorEl={menuAnchor?.el}
				open={Boolean(menuAnchor)}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem onClick={() => menuAnchor && openAssign(menuAnchor.user)}>
					<ManageAccountsIcon fontSize="small" sx={{ mr: 1 }} /> Change Role
				</MenuItem>
				<MenuItem onClick={() => menuAnchor && openHistory(menuAnchor.user)}>
					<HistoryIcon fontSize="small" sx={{ mr: 1 }} /> View History
				</MenuItem>
			</Menu>

			{/* Assign Role Dialog */}
			<Dialog
				open={assignDialog.open}
				onClose={() => setAssignDialog({ open: false, user: null })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Change Role — {assignDialog.user?.name}</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} pt={1}>
						<Typography variant="body2" color="text.secondary">
							Current role:{' '}
							<strong>{assignDialog.user?.role_name || 'None'}</strong>
						</Typography>

						<Autocomplete
							options={roles}
							getOptionLabel={(r) => r.name}
							value={selectedRole}
							onChange={(_, v) => setSelectedRole(v)}
							renderInput={(params) => (
								<TextField {...params} label="New Role" size="small" />
							)}
						/>

						<TextField
							label="Reason (required)"
							multiline
							rows={2}
							size="small"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						/>

						{diff && (
							<Alert severity="info">
								{diff.gained.length > 0 && (
									<div>
										Will gain:{' '}
										{diff.gained
											.map((p) => `${p.resource}:${p.action}`)
											.join(', ')}
									</div>
								)}
								{diff.lost.length > 0 && (
									<div>
										Will lose:{' '}
										{diff.lost
											.map((p) => `${p.resource}:${p.action}`)
											.join(', ')}
									</div>
								)}
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					{assignDialog.user?.role_id && (
						<Button
							color="error"
							onClick={handleRemoveRole}
							disabled={!reason.trim() || saving}
						>
							Remove Role
						</Button>
					)}
					<Button onClick={() => setAssignDialog({ open: false, user: null })}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleSaveRole}
						disabled={!selectedRole || !reason.trim() || saving}
					>
						{saving ? <CircularProgress size={18} /> : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* History Dialog */}
			<Dialog
				open={historyDialog.open}
				onClose={() => setHistoryDialog((s) => ({ ...s, open: false }))}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Role History — {historyDialog.user?.name}</DialogTitle>
				<DialogContent>
					{historyDialog.logs.length === 0 ? (
						<Typography color="text.secondary">No history found.</Typography>
					) : (
						<Table size="small">
							<TableHead>
								<TableRow>
									{['Date', 'Action', 'From', 'To', 'By', 'Reason'].map((h) => (
										<TableCell key={h}>
											<strong>{h}</strong>
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{historyDialog.logs.map((log) => (
									<TableRow key={log.id}>
										<TableCell sx={{ fontSize: 12 }}>
											{new Date(log.changed_at).toLocaleString()}
										</TableCell>
										<TableCell>
											<Chip label={log.action_type} size="small" />
										</TableCell>
										<TableCell>
											{log.old_role_name || log.old_role_id || '—'}
										</TableCell>
										<TableCell>
											{log.new_role_name || log.new_role_id || '—'}
										</TableCell>
										<TableCell sx={{ fontSize: 12 }}>
											{log.changed_by}
										</TableCell>
										<TableCell sx={{ fontSize: 12 }}>{log.reason}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setHistoryDialog((s) => ({ ...s, open: false }))}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RbacUsers;
