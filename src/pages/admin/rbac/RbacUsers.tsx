import React, { useEffect, useState, useCallback, useRef } from 'react';
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
	Pagination,
	CircularProgress,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Divider,
	Alert,
	Autocomplete,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlaceIcon from '@mui/icons-material/Place';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../../api/apiClient/apiClient';
import { useRbacPermissions } from '../../../hooks/useRbacPermissions';
import { AssignedSitesPanel } from './AssignedSitesPanel';

// ── Types ────────────────────────────────────────────────────────────────────

interface Role {
	id: string;
	name: string;
	description: string;
}

interface RoleInfo {
	role_id: string;
	role_name: string;
	role_assigned_by: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export const RbacUsers: React.FC = () => {
	const { can } = useRbacPermissions();
	const navigate = useNavigate();
	const api = new ApiClient();

	// ── User list (getUsers — paginated, searchable) ──────────────────────────
	const [users, setUsers] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0); // 0-based; offset = page * PAGE_SIZE
	const [loading, setLoading] = useState(false);

	// ── Role data (prefetched once, keyed by userId) ──────────────────────────
	const [roleMap, setRoleMap] = useState<Record<string, RoleInfo>>({});
	const [roleMapLoading, setRoleMapLoading] = useState(false);
	const [roles, setRoles] = useState<Role[]>([]);

	// ── Search ────────────────────────────────────────────────────────────────
	const [searchName, setSearchName] = useState('');
	const [searchPhone, setSearchPhone] = useState('');
	const [activeFilters, setActiveFilters] = useState<any[]>([]);
	const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ── Row action menu ───────────────────────────────────────────────────────
	const [menuAnchor, setMenuAnchor] = useState<{
		el: HTMLElement;
		user: any;
	} | null>(null);

	// ── Change Role dialog state ──────────────────────────────────────────────
	const [assignDialog, setAssignDialog] = useState<{
		open: boolean;
		user: any | null;
	}>({ open: false, user: null });
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [reason, setReason] = useState('');
	const [diff, setDiff] = useState<{ gained: any[]; lost: any[] } | null>(null);
	const [saving, setSaving] = useState(false);
	const [roleHasViewAll, setRoleHasViewAll] = useState<boolean | null>(null);

	// ── Remove Role dialog state ──────────────────────────────────────────────
	const [removeDialog, setRemoveDialog] = useState<{
		open: boolean;
		user: any | null;
	}>({ open: false, user: null });
	const [removeReason, setRemoveReason] = useState('');
	const [removing, setRemoving] = useState(false);

	// ── Assign Sites dialog state ─────────────────────────────────────────────
	const [sitesDialog, setSitesDialog] = useState<{
		open: boolean;
		user: any | null;
	}>({ open: false, user: null });
	const [sitesHasViewAll, setSitesHasViewAll] = useState<boolean | null>(null);

	// ── View Permissions dialog state ─────────────────────────────────────────
	const [permsDialog, setPermsDialog] = useState<{
		open: boolean;
		user: any | null;
		permissions: any[];
	}>({ open: false, user: null, permissions: [] });
	const [permsLoading, setPermsLoading] = useState(false);

	// ── Permission gate ───────────────────────────────────────────────────────
	useEffect(() => {
		if (!can('access_control', 'manage')) {
			navigate('/admin');
		}
	}, []);

	// ── Data loaders ──────────────────────────────────────────────────────────

	const loadRoles = useCallback(async () => {
		try {
			const data = await api.getRbacRoles();
			setRoles(data.roles || []);
		} catch {
			/* ignore */
		}
	}, []);

	const loadRoleMap = useCallback(async () => {
		setRoleMapLoading(true);
		try {
			const data = await api.getRbacUsers({ page: 1, limit: 9999 });
			console.log('[RbacUsers] getRbacUsers raw response:', data);
			const map: Record<string, RoleInfo> = {};
			for (const u of data.users || []) {
				if (u.role_id) {
					map[String(u.id)] = {
						role_id: u.role_id,
						role_name: u.role_name,
						role_assigned_by: u.role_assigned_by ?? null,
					};
				}
			}
			console.log('[RbacUsers] built roleMap:', map);
			setRoleMap(map);
		} catch {
			/* ignore */
		} finally {
			setRoleMapLoading(false);
		}
	}, []);

	const ROLE_NOT_EMPTY_FILTER = {
		columnField: 'role_id',
		operatorValue: 'isNotEmpty',
		value: null,
	};

	const loadUsers = useCallback(async () => {
		setLoading(true);
		try {
			const hasSearchTerm = activeFilters.some(
				(f) => f.columnField === 'name' || f.columnField === 'phone',
			);
			const filters = hasSearchTerm
				? activeFilters
				: [...activeFilters, ROLE_NOT_EMPTY_FILTER];
			const data = await api.getUsers(page * PAGE_SIZE, PAGE_SIZE, filters);
			setUsers(data.results || []);
			setTotal(data.total || 0);
		} catch {
			toast.error('Failed to load users');
		} finally {
			setLoading(false);
		}
	}, [page, activeFilters]);

	useEffect(() => {
		loadRoles();
		loadRoleMap();
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	// ── Search handlers ───────────────────────────────────────────────────────

	const handleNameChange = (value: string) => {
		setSearchName(value);
		if (nameTimer.current) clearTimeout(nameTimer.current);
		nameTimer.current = setTimeout(() => {
			setPage(0);
			setActiveFilters((prev) => {
				const next = prev.filter((f) => f.columnField !== 'name');
				if (value.trim())
					next.push({
						columnField: 'name',
						operatorValue: 'contains',
						value: value.trim(),
					});
				return next;
			});
		}, 500);
	};

	const handlePhoneChange = (value: string) => {
		setSearchPhone(value);
		if (phoneTimer.current) clearTimeout(phoneTimer.current);
		phoneTimer.current = setTimeout(() => {
			setPage(0);
			setActiveFilters((prev) => {
				const next = prev.filter((f) => f.columnField !== 'phone');
				if (value.trim())
					next.push({
						columnField: 'phone',
						operatorValue: 'contains',
						value: value.trim(),
					});
				return next;
			});
		}, 500);
	};

	// ── Open handlers ─────────────────────────────────────────────────────────

	const resolveViewAll = async (
		role_id: string | null | undefined,
	): Promise<boolean> => {
		if (!role_id) return false;
		try {
			const data = await api.getRolePermissions(role_id);
			return (data.permissions || []).some(
				(p: any) => p.resource === 'sites' && p.action === 'view_all',
			);
		} catch (err: any) {
			// Role not yet seeded or no permissions endpoint — not an error worth surfacing
			if (err?.response?.status === 404) return false;
			return false;
		}
	};

	const openAssign = async (user: any) => {
		setMenuAnchor(null);
		const roleInfo = roleMap[String(user.id)];
		setAssignDialog({
			open: true,
			user: {
				...user,
				role_id: roleInfo?.role_id ?? null,
				role_name: roleInfo?.role_name ?? null,
				role_assigned_by: roleInfo?.role_assigned_by ?? null,
			},
		});
		setSelectedRole(
			roleInfo ? roles.find((r) => r.id === roleInfo.role_id) ?? null : null,
		);
		setReason('');
		setDiff(null);
		setRoleHasViewAll(null);
		const viewAll = await resolveViewAll(roleInfo?.role_id);
		setRoleHasViewAll(viewAll);
	};

	const openRemove = (user: any) => {
		setMenuAnchor(null);
		const roleInfo = roleMap[String(user.id)];
		setRemoveDialog({
			open: true,
			user: {
				...user,
				role_id: roleInfo?.role_id ?? null,
				role_name: roleInfo?.role_name ?? null,
			},
		});
		setRemoveReason('');
	};

	const openSites = async (user: any) => {
		setMenuAnchor(null);
		const roleInfo = roleMap[String(user.id)];
		setSitesDialog({
			open: true,
			user: { ...user, role_id: roleInfo?.role_id ?? null },
		});
		setSitesHasViewAll(null);
		const viewAll = await resolveViewAll(roleInfo?.role_id);
		setSitesHasViewAll(viewAll);
	};

	const openPerms = async (user: any) => {
		setMenuAnchor(null);
		const roleInfo = roleMap[String(user.id)];
		setPermsDialog({
			open: true,
			user: { ...user, ...roleInfo },
			permissions: [],
		});
		setPermsLoading(true);
		try {
			const data = await api.getRolePermissions(roleInfo!.role_id);
			setPermsDialog((prev) => ({
				...prev,
				permissions: data.permissions || [],
			}));
		} catch (err: any) {
			if (err?.response?.status !== 404) {
				toast.error('Failed to load permissions');
			}
		} finally {
			setPermsLoading(false);
		}
	};

	// ── Action handlers ───────────────────────────────────────────────────────

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
			loadRoleMap();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to assign role');
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveRoleFromAssignDialog = async () => {
		if (!assignDialog.user || !reason.trim()) return;
		setSaving(true);
		try {
			await api.removeUserRole(assignDialog.user.id, reason.trim());
			toast.success('Role removed');
			setAssignDialog({ open: false, user: null });
			loadRoleMap();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to remove role');
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveRole = async () => {
		if (!removeDialog.user || !removeReason.trim()) return;
		setRemoving(true);
		try {
			await api.removeUserRole(removeDialog.user.id, removeReason.trim());
			toast.success('Role removed');
			setRemoveDialog({ open: false, user: null });
			loadRoleMap();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to remove role');
		} finally {
			setRemoving(false);
		}
	};

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<Box p={3}>
			{/* Search bar */}
			<Box display="flex" gap={2} mb={2} alignItems="center">
				<TextField
					label="Search by name"
					size="small"
					value={searchName}
					onChange={(e) => handleNameChange(e.target.value)}
					sx={{ minWidth: 200 }}
				/>
				<TextField
					label="Search by phone"
					size="small"
					value={searchPhone}
					onChange={(e) => handlePhoneChange(e.target.value)}
					sx={{ minWidth: 180 }}
				/>
				{roleMapLoading && (
					<CircularProgress size={18} sx={{ color: 'text.secondary' }} />
				)}
			</Box>

			{/* Table */}
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead sx={{ bgcolor: '#1f3625' }}>
						<TableRow>
							{['Name', 'Email', 'Phone', 'Role', 'Actions'].map((h) => (
								<TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<CircularProgress size={28} />
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									No users found
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => {
								const roleInfo = roleMap[String(user.id)];
								return (
									<TableRow key={user.id} hover>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email || '—'}</TableCell>
										<TableCell>{user.phone || '—'}</TableCell>
										<TableCell>
											{roleInfo ? (
												<Chip
													label={roleInfo.role_name}
													size="small"
													color="primary"
												/>
											) : (
												<Chip label="No role" size="small" variant="outlined" />
											)}
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
								);
							})
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Box display="flex" justifyContent="center" mt={2}>
				<Pagination
					count={Math.ceil(total / PAGE_SIZE)}
					page={page + 1}
					onChange={(_, p) => setPage(p - 1)}
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
					<ManageAccountsIcon fontSize="small" sx={{ mr: 1 }} />
					Assign / Change Role
				</MenuItem>
				<MenuItem
					onClick={() => menuAnchor && openRemove(menuAnchor.user)}
					disabled={!menuAnchor?.user || !roleMap[String(menuAnchor.user.id)]}
				>
					<DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
					Remove Role
				</MenuItem>
				<MenuItem onClick={() => menuAnchor && openSites(menuAnchor.user)}>
					<PlaceIcon fontSize="small" sx={{ mr: 1 }} />
					Assign Sites
				</MenuItem>
				<MenuItem
					onClick={() => menuAnchor && openPerms(menuAnchor.user)}
					disabled={!menuAnchor?.user || !roleMap[String(menuAnchor.user.id)]}
				>
					<LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
					View Permissions
				</MenuItem>
			</Menu>

			{/* ── Change Role dialog ── */}
			<Dialog
				open={assignDialog.open}
				onClose={() => setAssignDialog({ open: false, user: null })}
				maxWidth="md"
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

						<Divider />

						{assignDialog.user &&
							(roleHasViewAll === null ? (
								<CircularProgress size={20} />
							) : (
								<AssignedSitesPanel
									userId={assignDialog.user.id}
									hasViewAll={roleHasViewAll}
								/>
							))}

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
							onClick={handleRemoveRoleFromAssignDialog}
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

			{/* ── Remove Role dialog ── */}
			<Dialog
				open={removeDialog.open}
				onClose={() => setRemoveDialog({ open: false, user: null })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Remove Role — {removeDialog.user?.name}</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} pt={1}>
						<Typography variant="body2" color="text.secondary">
							This will remove the{' '}
							<strong>{removeDialog.user?.role_name}</strong> role from this
							user.
						</Typography>
						<TextField
							label="Reason (required)"
							multiline
							rows={2}
							size="small"
							value={removeReason}
							onChange={(e) => setRemoveReason(e.target.value)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setRemoveDialog({ open: false, user: null })}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleRemoveRole}
						disabled={!removeReason.trim() || removing}
					>
						{removing ? <CircularProgress size={18} /> : 'Remove Role'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* ── Assign Sites dialog ── */}
			<Dialog
				open={sitesDialog.open}
				onClose={() => setSitesDialog({ open: false, user: null })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Assign Sites — {sitesDialog.user?.name}</DialogTitle>
				<DialogContent>
					<Box pt={1}>
						{sitesDialog.user &&
							(sitesHasViewAll === null ? (
								<CircularProgress size={20} />
							) : (
								<AssignedSitesPanel
									userId={sitesDialog.user.id}
									hasViewAll={sitesHasViewAll}
								/>
							))}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSitesDialog({ open: false, user: null })}>
						Done
					</Button>
				</DialogActions>
			</Dialog>

			{/* ── View Permissions dialog ── */}
			<Dialog
				open={permsDialog.open}
				onClose={() => setPermsDialog((s) => ({ ...s, open: false }))}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					Permissions — {permsDialog.user?.name}
					{permsDialog.user?.role_name && (
						<Typography variant="body2" color="text.secondary" mt={0.5}>
							Role: <strong>{permsDialog.user.role_name}</strong>
						</Typography>
					)}
				</DialogTitle>
				<DialogContent dividers>
					{permsLoading ? (
						<Box display="flex" justifyContent="center" py={3}>
							<CircularProgress size={28} />
						</Box>
					) : permsDialog.permissions.length === 0 ? (
						<Typography color="text.secondary">
							No permissions assigned to this role.
						</Typography>
					) : (
						<Box display="flex" flexDirection="column" gap={2}>
							{Object.entries(
								permsDialog.permissions.reduce<Record<string, string[]>>(
									(acc, p) => {
										(acc[p.resource] = acc[p.resource] || []).push(p.action);
										return acc;
									},
									{},
								),
							).map(([resource, actions]) => (
								<Box key={resource}>
									<Typography
										variant="caption"
										sx={{
											display: 'block',
											mb: 0.75,
											fontSize: '0.68rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											fontWeight: 500,
											color: 'text.secondary',
										}}
									>
										{resource}
									</Typography>
									<Box display="flex" flexWrap="wrap" gap={0.75}>
										{actions.map((action) => (
											<Chip
												key={action}
												label={action}
												size="small"
												variant="outlined"
												color="primary"
											/>
										))}
									</Box>
								</Box>
							))}
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setPermsDialog((s) => ({ ...s, open: false }))}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RbacUsers;
