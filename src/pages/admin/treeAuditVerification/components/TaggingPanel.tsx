import React, { useEffect, useRef } from 'react';
import {
	Box,
	Button,
	Chip,
	Divider,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TreeAuditPhoto } from '../types';

interface TaggingPanelProps {
	photo?: TreeAuditPhoto | null;
	currentIndex: number;
	total: number;
	saplingId: string;
	onSaplingIdChange: (value: string) => void;
	onReject: () => void;
	hasUnsavedChanges: boolean;
	isSaving?: boolean;
	sessionMeta?: {
		workerName?: string;
		plotName?: string;
		siteName?: string;
	};
}

const TaggingPanel: React.FC<TaggingPanelProps> = ({
	photo,
	currentIndex,
	total,
	saplingId,
	onSaplingIdChange,
	onReject,
	hasUnsavedChanges,
	isSaving = false,
	sessionMeta,
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const theme = useTheme();

	useEffect(() => {
		inputRef.current?.focus();
		inputRef.current?.select();
	}, [photo?.id]);

	return (
		<Stack spacing={3} sx={{ height: '100%' }}>
			<Box>
				<Typography variant="overline" sx={{ color: 'text.secondary' }}>
					Photo
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
					{total === 0 ? '0 / 0' : `${currentIndex + 1} / ${total}`}
				</Typography>
			</Box>

			<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
				<Chip
					size="small"
					label={
						photo?.verification_status === 'verified'
							? 'Verified'
							: photo?.verification_status === 'rejected'
							? 'Rejected'
							: 'Pending'
					}
					color={
						photo?.verification_status === 'verified'
							? 'success'
							: photo?.verification_status === 'rejected'
							? 'error'
							: 'default'
					}
				/>
				{hasUnsavedChanges && (
					<Chip
						size="small"
						label="Unsaved"
						color="warning"
						variant="outlined"
					/>
				)}
			</Stack>

			<Divider />

			<Stack spacing={1.25}>
				<Typography variant="overline" sx={{ color: 'text.secondary' }}>
					Session Details
				</Typography>
				<Typography variant="body2">
					<strong>Worker:</strong>{' '}
					{sessionMeta?.workerName || 'User #' + (photo?.verified_by ?? '—')}
				</Typography>
				<Typography variant="body2">
					<strong>Plot:</strong> {sessionMeta?.plotName || '—'}
				</Typography>
				<Typography variant="body2">
					<strong>Site:</strong> {sessionMeta?.siteName || '—'}
				</Typography>
				<Typography variant="body2">
					<strong>Uploaded:</strong>{' '}
					{photo?.created_at
						? new Date(photo.created_at).toLocaleString()
						: '—'}
				</Typography>
				<Typography variant="body2">
					<strong>Location:</strong>{' '}
					{photo?.lat != null && photo?.lng != null
						? `${Number(photo.lat).toFixed(6)}, ${Number(photo.lng).toFixed(6)}`
						: '—'}
				</Typography>
			</Stack>

			<Divider />

			<Box>
				<Typography variant="overline" sx={{ color: 'text.secondary' }}>
					Sapling ID
				</Typography>
				<TextField
					fullWidth
					inputRef={inputRef}
					value={saplingId}
					onChange={(event) => onSaplingIdChange(event.target.value)}
					placeholder="Enter sapling ID"
					autoComplete="off"
					size="medium"
					inputProps={{
						style: {
							fontFamily: 'monospace',
							fontSize: '1rem',
							fontWeight: 600,
							letterSpacing: '0.04em',
						},
					}}
					sx={{
						mt: 1,
						'& .MuiOutlinedInput-root': {
							borderRadius: 2,
							backgroundColor:
								theme.palette.mode === 'dark'
									? 'rgba(255,255,255,0.03)'
									: '#ffffff',
						},
					}}
				/>
				<Typography
					variant="caption"
					sx={{ mt: 1, display: 'block', color: 'text.secondary' }}
				>
					Press Enter to move to the next pending photo. Ctrl+Enter saves the
					current page.
				</Typography>
			</Box>

			<Box sx={{ mt: 'auto' }}>
				<Button
					fullWidth
					color="error"
					variant="outlined"
					onClick={onReject}
					disabled={!photo || isSaving}
				>
					Reject Photo
				</Button>
				{photo?.rejection_reason && (
					<Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
						<strong>Reason:</strong> {photo.rejection_reason}
					</Typography>
				)}
			</Box>
		</Stack>
	);
};

export default TaggingPanel;
