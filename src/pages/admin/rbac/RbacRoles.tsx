import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	Checkbox,
	FormControlLabel,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	Divider,
	Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../../api/apiClient/apiClient';
import { useRbacPermissions } from '../../../hooks/useRbacPermissions';

interface Role {
	id: string;
	name: string;
	description: string;
	is_active: boolean;
	user_count: number;
	permission_count: number;
}

interface Permission {
	id: number;
	resource: string;
	action: string;
	description: string;
}

export const RbacRoles: React.FC = () => {
	const { can } = useRbacPermissions();
	const navigate = useNavigate();
	const api = new ApiClient();

	const [roles, setRoles] = useState<Role[]>([]);
	const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
	const [loading, setLoading] = useState(false);

	// Create/edit dialog
	const [dialog, setDialog] = useState<{ open: boolean; role: Role | null }>({
		open: false,
		role: null,
	});
	const [formId, setFormId] = useState('');
	const [formName, setFormName] = useState('');
	const [formDesc, setFormDesc] = useState('');
	const [saving, setSaving] = useState(false);

	// Permission edit dialog
	const [permDialog, setPermDialog] = useState<{
		open: boolean;
		role: Role | null;
		checked: Set<number>;
	}>({
		open: false,
		role: null,
		checked: new Set(),
	});
	const [permSaving, setPermSaving] = useState(false);

	useEffect(() => {
		if (!can('access_control', 'manage')) navigate('/admin');
	}, []);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const [rolesData, permsData] = await Promise.all([
				api.getRbacRoles(),
				api.getRbacPermissions(),
			]);
			setRoles(rolesData.roles || []);
			const flat: Permission[] = [];
			(permsData.permissions || []).forEach((group: any) =>
				group.actions.forEach((a: any) =>
					flat.push({
						id: a.id,
						resource: group.resource,
						action: a.action,
						description: a.description,
					}),
				),
			);
			setAllPermissions(flat);
		} catch {
			toast.error('Failed to load roles');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, []);

	const openCreate = () => {
		setDialog({ open: true, role: null });
		setFormId('');
		setFormName('');
		setFormDesc('');
	};

	const openEdit = (role: Role) => {
		setDialog({ open: true, role });
		setFormId(role.id);
		setFormName(role.name);
		setFormDesc(role.description || '');
	};

	const handleSave = async () => {
		if (!formName.trim()) return;
		setSaving(true);
		try {
			if (dialog.role) {
				await api.updateRbacRole(dialog.role.id, {
					name: formName.trim(),
					description: formDesc.trim(),
				});
				toast.success('Role updated');
			} else {
				if (!formId.trim()) {
					toast.error('Role ID is required');
					setSaving(false);
					return;
				}
				await api.createRbacRole({
					id: formId.trim(),
					name: formName.trim(),
					description: formDesc.trim(),
				});
				toast.success('Role created');
			}
			setDialog({ open: false, role: null });
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to save role');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (role: Role) => {
		if (role.user_count > 0) {
			toast.error(
				`Cannot delete role with ${role.user_count} assigned user(s)`,
			);
			return;
		}
		if (!window.confirm(`Delete role "${role.name}"?`)) return;
		try {
			await api.deleteRbacRole(role.id);
			toast.success('Role deleted');
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to delete role');
		}
	};

	const openPermDialog = async (role: Role) => {
		try {
			const data = await api.getRolePermissions(role.id);
			const checked = new Set<number>();
			Object.values(data.permissions || {}).forEach((actions: any) =>
				actions.forEach((a: any) => checked.add(a.id)),
			);
			setPermDialog({ open: true, role, checked });
		} catch {
			toast.error('Failed to load permissions');
		}
	};

	const togglePerm = (id: number) => {
		setPermDialog((prev) => {
			const next = new Set(prev.checked);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return { ...prev, checked: next };
		});
	};

	const savePermissions = async () => {
		if (!permDialog.role) return;
		setPermSaving(true);
		try {
			await api.setRolePermissions(
				permDialog.role.id,
				Array.from(permDialog.checked),
			);
			toast.success('Permissions updated');
			setPermDialog((s) => ({ ...s, open: false }));
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to update permissions');
		} finally {
			setPermSaving(false);
		}
	};

	// Group permissions by resource for the checkbox UI
	const byResource = allPermissions.reduce<Record<string, Permission[]>>(
		(acc, p) => {
			if (!acc[p.resource]) acc[p.resource] = [];
			acc[p.resource].push(p);
			return acc;
		},
		{},
	);

	return (
		<Box p={3}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
				<Typography variant="h5" fontWeight={600}>
					Roles
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={openCreate}
				>
					New Role
				</Button>
			</Box>

			{loading ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<CircularProgress />
				</Box>
			) : (
				<Grid container spacing={2}>
					{roles.map((role) => (
						<Grid item xs={12} sm={6} md={4} key={role.id}>
							<Card variant="outlined">
								<CardContent>
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="flex-start"
									>
										<Typography variant="h6" fontWeight={600}>
											{role.name}
										</Typography>
										<Chip
											label={role.is_active ? 'Active' : 'Inactive'}
											size="small"
											color={role.is_active ? 'success' : 'default'}
										/>
									</Box>
									<Typography
										variant="caption"
										color="text.secondary"
										display="block"
										mb={1}
									>
										ID: {role.id}
									</Typography>
									<Typography variant="body2" color="text.secondary" mb={1}>
										{role.description || 'No description'}
									</Typography>
									<Box display="flex" gap={1}>
										<Chip
											label={`${role.user_count} user${
												role.user_count !== 1 ? 's' : ''
											}`}
											size="small"
											variant="outlined"
										/>
										<Chip
											label={`${role.permission_count} perms`}
											size="small"
											variant="outlined"
										/>
									</Box>
								</CardContent>
								<CardActions>
									<Button size="small" onClick={() => openPermDialog(role)}>
										Permissions
									</Button>
									<IconButton size="small" onClick={() => openEdit(role)}>
										<EditIcon fontSize="small" />
									</IconButton>
									<IconButton
										size="small"
										color="error"
										onClick={() => handleDelete(role)}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* Create/Edit Dialog */}
			<Dialog
				open={dialog.open}
				onClose={() => setDialog({ open: false, role: null })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>{dialog.role ? 'Edit Role' : 'Create Role'}</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} pt={1}>
						<TextField
							label="Role ID"
							size="small"
							value={formId}
							onChange={(e) => setFormId(e.target.value)}
							disabled={Boolean(dialog.role)}
							helperText="Lowercase, underscores only (e.g. tree_worker). Cannot be changed after creation."
						/>
						<TextField
							label="Name"
							size="small"
							value={formName}
							onChange={(e) => setFormName(e.target.value)}
							required
						/>
						<TextField
							label="Description"
							size="small"
							multiline
							rows={2}
							value={formDesc}
							onChange={(e) => setFormDesc(e.target.value)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialog({ open: false, role: null })}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleSave}
						disabled={!formName.trim() || saving}
					>
						{saving ? <CircularProgress size={18} /> : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Permissions Dialog */}
			<Dialog
				open={permDialog.open}
				onClose={() => setPermDialog((s) => ({ ...s, open: false }))}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Permissions — {permDialog.role?.name}</DialogTitle>
				<DialogContent dividers>
					{Object.entries(byResource).map(([resource, perms]) => {
						const allChecked = perms.every((p) => permDialog.checked.has(p.id));
						const someChecked = perms.some((p) => permDialog.checked.has(p.id));
						return (
							<Accordion key={resource} defaultExpanded>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									<FormControlLabel
										label={<Typography fontWeight={600}>{resource}</Typography>}
										control={
											<Checkbox
												checked={allChecked}
												indeterminate={someChecked && !allChecked}
												onClick={(e) => {
													e.stopPropagation();
													setPermDialog((prev) => {
														const next = new Set(prev.checked);
														if (allChecked)
															perms.forEach((p) => next.delete(p.id));
														else perms.forEach((p) => next.add(p.id));
														return { ...prev, checked: next };
													});
												}}
											/>
										}
										onClick={(e) => e.stopPropagation()}
									/>
								</AccordionSummary>
								<AccordionDetails>
									<Box display="flex" flexWrap="wrap" gap={1}>
										{perms.map((p) => (
											<FormControlLabel
												key={p.id}
												label={`${p.action}${
													p.description ? ` (${p.description})` : ''
												}`}
												control={
													<Checkbox
														checked={permDialog.checked.has(p.id)}
														onChange={() => togglePerm(p.id)}
														size="small"
													/>
												}
											/>
										))}
									</Box>
								</AccordionDetails>
							</Accordion>
						);
					})}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPermDialog((s) => ({ ...s, open: false }))}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={savePermissions}
						disabled={permSaving}
					>
						{permSaving ? (
							<CircularProgress size={18} />
						) : (
							`Save (${permDialog.checked.size} selected)`
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RbacRoles;
