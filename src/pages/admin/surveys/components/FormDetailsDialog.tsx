import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Box,
	CircularProgress,
	Alert,
	Typography,
	Chip,
	Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useSurveyForm } from '../hooks/useSurveyForms';

interface FormDetailsDialogProps {
	open: boolean;
	onClose: () => void;
	surveyId: string | null;
}

const FormDetailsDialog: React.FC<FormDetailsDialogProps> = ({
	open,
	onClose,
	surveyId,
}) => {
	const theme = useTheme();
	const { form, loading, error } = useSurveyForm(open ? surveyId : null);

	const statusColor = (status: string) => {
		if (status === 'active') return '#059669';
		if (status === 'draft') return '#6b7280';
		if (status === 'archived') return '#dc2626';
		return '#6b7280';
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
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
					display: 'flex',
					alignItems: 'center',
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Box sx={{ flex: 1, fontSize: '1.1rem', fontWeight: 600 }}>
					{form?.formTitle || 'Survey Form Details'}
				</Box>
				<IconButton
					onClick={onClose}
					sx={{ color: theme.palette.text.secondary }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ py: 3 }}>
				{loading && (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress sx={{ color: '#9bc53d' }} />
					</Box>
				)}

				{error && <Alert severity="error">{error}</Alert>}

				{form && (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: '0.68rem',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										fontWeight: 500,
										color: theme.palette.text.secondary,
									}}
								>
									Survey ID
								</Typography>
								<Typography
									sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
								>
									{form.surveyId}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: '0.68rem',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										fontWeight: 500,
										color: theme.palette.text.secondary,
									}}
								>
									Status
								</Typography>
								<Box>
									<Chip
										label={form.status}
										size="small"
										sx={{
											bgcolor: statusColor(form.status),
											color: '#fff',
											fontWeight: 500,
											fontSize: '0.75rem',
										}}
									/>
								</Box>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: '0.68rem',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										fontWeight: 500,
										color: theme.palette.text.secondary,
									}}
								>
									Version
								</Typography>
								<Typography>v{form.version}</Typography>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: '0.68rem',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										fontWeight: 500,
										color: theme.palette.text.secondary,
									}}
								>
									Fields
								</Typography>
								<Typography>{form.formStructure.fields.length}</Typography>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: '0.68rem',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										fontWeight: 500,
										color: theme.palette.text.secondary,
									}}
								>
									Responses
								</Typography>
								<Typography>{form.metadata?.responseCount ?? 0}</Typography>
							</Box>
						</Box>

						<Divider sx={{ borderColor: theme.palette.divider }} />

						<Typography
							variant="caption"
							sx={{
								fontSize: '0.68rem',
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								fontWeight: 500,
								color: theme.palette.text.secondary,
							}}
						>
							Form Structure (JSON)
						</Typography>
						<Box
							component="pre"
							sx={{
								bgcolor: theme.palette.background.default,
								p: 2,
								borderRadius: 1,
								border: `1px solid ${theme.palette.divider}`,
								overflow: 'auto',
								maxHeight: 400,
								fontSize: '0.8rem',
								color: theme.palette.text.primary,
								m: 0,
							}}
						>
							{JSON.stringify(form.formStructure, null, 2)}
						</Box>
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default FormDetailsDialog;
