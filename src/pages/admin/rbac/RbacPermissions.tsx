import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../../api/apiClient/apiClient';
import { useRbacPermissions } from '../../../hooks/useRbacPermissions';

interface PermAction {
	id: number;
	action: string;
	description: string;
	role_count: number;
}

interface PermGroup {
	resource: string;
	actions: PermAction[];
}

export const RbacPermissions: React.FC = () => {
	const { can } = useRbacPermissions();
	const navigate = useNavigate();
	const api = new ApiClient();

	const [groups, setGroups] = useState<PermGroup[]>([]);
	const [loading, setLoading] = useState(false);

	// Create dialog
	const [createDialog, setCreateDialog] = useState(false);
	const [newResource, setNewResource] = useState('');
	const [newAction, setNewAction] = useState('');
	const [newDesc, setNewDesc] = useState('');
	const [saving, setSaving] = useState(false);

	// Edit dialog
	const [editDialog, setEditDialog] = useState<{
		open: boolean;
		perm: (PermAction & { resource: string }) | null;
	}>({
		open: false,
		perm: null,
	});
	const [editDesc, setEditDesc] = useState('');

	useEffect(() => {
		if (!can('access_control', 'manage')) navigate('/admin');
	}, []);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const data = await api.getRbacPermissions();
			setGroups(data.permissions || []);
		} catch {
			toast.error('Failed to load permissions');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, []);

	const handleCreate = async () => {
		if (!newResource.trim() || !newAction.trim()) return;
		setSaving(true);
		try {
			await api.createRbacPermission({
				resource: newResource.trim(),
				action: newAction.trim(),
				description: newDesc.trim(),
			});
			toast.success('Permission created');
			setCreateDialog(false);
			setNewResource('');
			setNewAction('');
			setNewDesc('');
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to create permission');
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = async () => {
		if (!editDialog.perm) return;
		setSaving(true);
		try {
			await api.updateRbacPermission(editDialog.perm.id, editDesc);
			toast.success('Permission updated');
			setEditDialog({ open: false, perm: null });
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to update');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id: number, resource: string, action: string) => {
		if (!window.confirm(`Delete permission ${resource}:${action}?`)) return;
		try {
			await api.deleteRbacPermission(id, true);
			toast.success('Permission deleted');
			load();
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to delete');
		}
	};

	return (
		<Box p={3}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
				<Typography variant="h5" fontWeight={600}>
					Permissions
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setCreateDialog(true)}
				>
					New Permission
				</Button>
			</Box>

			{loading ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<CircularProgress />
				</Box>
			) : groups.length === 0 ? (
				<Typography color="text.secondary">
					No permissions defined yet.
				</Typography>
			) : (
				groups.map((group) => (
					<Accordion key={group.resource} defaultExpanded>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography fontWeight={600}>{group.resource}</Typography>
							<Chip
								label={`${group.actions.length} actions`}
								size="small"
								sx={{ ml: 2 }}
							/>
						</AccordionSummary>
						<AccordionDetails sx={{ p: 0 }}>
							<Table size="small">
								<TableHead>
									<TableRow sx={{ bgcolor: 'grey.50' }}>
										<TableCell>
											<strong>Action</strong>
										</TableCell>
										<TableCell>
											<strong>Description</strong>
										</TableCell>
										<TableCell>
											<strong>Used By</strong>
										</TableCell>
										<TableCell />
									</TableRow>
								</TableHead>
								<TableBody>
									{group.actions.map((action) => (
										<TableRow key={action.id} hover>
											<TableCell>
												<code>{action.action}</code>
											</TableCell>
											<TableCell>{action.description || '—'}</TableCell>
											<TableCell>
												<Chip
													label={`${action.role_count} role${
														action.role_count !== 1 ? 's' : ''
													}`}
													size="small"
													variant="outlined"
												/>
											</TableCell>
											<TableCell align="right">
												<IconButton
													size="small"
													onClick={() => {
														setEditDialog({
															open: true,
															perm: { ...action, resource: group.resource },
														});
														setEditDesc(action.description || '');
													}}
												>
													<EditIcon fontSize="small" />
												</IconButton>
												<IconButton
													size="small"
													color="error"
													onClick={() =>
														handleDelete(
															action.id,
															group.resource,
															action.action,
														)
													}
												>
													<DeleteIcon fontSize="small" />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</AccordionDetails>
					</Accordion>
				))
			)}

			{/* Create Dialog */}
			<Dialog
				open={createDialog}
				onClose={() => setCreateDialog(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>New Permission</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} pt={1}>
						<TextField
							label="Resource"
							size="small"
							value={newResource}
							onChange={(e) => setNewResource(e.target.value)}
							helperText="e.g. trees, donations, reports"
							required
						/>
						<TextField
							label="Action"
							size="small"
							value={newAction}
							onChange={(e) => setNewAction(e.target.value)}
							helperText="e.g. view, add, edit, delete, export"
							required
						/>
						<TextField
							label="Description"
							size="small"
							value={newDesc}
							onChange={(e) => setNewDesc(e.target.value)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCreateDialog(false)}>Cancel</Button>
					<Button
						variant="contained"
						onClick={handleCreate}
						disabled={!newResource || !newAction || saving}
					>
						{saving ? <CircularProgress size={18} /> : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog
				open={editDialog.open}
				onClose={() => setEditDialog({ open: false, perm: null })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					Edit Permission — {editDialog.perm?.resource}:
					{editDialog.perm?.action}
				</DialogTitle>
				<DialogContent>
					<Box pt={1}>
						<TextField
							label="Description"
							size="small"
							fullWidth
							value={editDesc}
							onChange={(e) => setEditDesc(e.target.value)}
							helperText="Only the description can be edited."
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialog({ open: false, perm: null })}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleEdit} disabled={saving}>
						{saving ? <CircularProgress size={18} /> : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RbacPermissions;
