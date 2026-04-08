import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	onClose,
	onConfirm,
	title,
	message,
}) => {
	const theme = useTheme();

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					backgroundColor: theme.palette.background.paper,
					border: `1px solid ${theme.palette.divider}`,
					color: theme.palette.text.primary,
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: '1.1rem',
					fontWeight: 600,
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}
			>
				{title}
			</DialogTitle>
			<DialogContent sx={{ pt: 3 }}>
				<Typography sx={{ color: theme.palette.text.secondary }}>
					{message}
				</Typography>
			</DialogContent>
			<DialogActions
				sx={{ borderTop: `1px solid ${theme.palette.divider}`, px: 3, py: 2 }}
			>
				<Button
					onClick={onClose}
					sx={{ color: theme.palette.text.secondary, textTransform: 'none' }}
				>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					variant="contained"
					sx={{
						bgcolor: '#9bc53d',
						color: '#0f1912',
						textTransform: 'none',
						fontWeight: 600,
						'&:hover': { bgcolor: '#8ab02d' },
					}}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
