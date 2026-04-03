import React, { useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from '@mui/material';
import { TreeAuditPhoto } from '../types';

interface RejectDialogProps {
	open: boolean;
	photo?: TreeAuditPhoto | null;
	onClose: () => void;
	onConfirm: (reason: string) => Promise<void> | void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
	open,
	photo,
	onClose,
	onConfirm,
}) => {
	const [reason, setReason] = useState('');

	useEffect(() => {
		if (open) {
			setReason('');
		}
	}, [open, photo?.id]);

	const handleConfirm = async () => {
		if (!reason.trim()) return;
		await onConfirm(reason.trim());
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Reject Photo</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Add a reason for rejecting this audit photo.
				</Typography>
				<TextField
					fullWidth
					autoFocus
					multiline
					minRows={4}
					label="Rejection reason"
					value={reason}
					onChange={(event) => setReason(event.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					color="error"
					variant="contained"
					onClick={handleConfirm}
					disabled={!reason.trim()}
				>
					Reject Photo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RejectDialog;
