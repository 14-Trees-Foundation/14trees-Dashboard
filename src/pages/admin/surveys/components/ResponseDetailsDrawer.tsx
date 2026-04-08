import React from 'react';
import {
	Drawer,
	Box,
	IconButton,
	Typography,
	Divider,
	CircularProgress,
	Alert,
	Chip,
	Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import { useSurveyResponse } from '../hooks/useSurveyResponses';

interface ResponseDetailsDrawerProps {
	open: boolean;
	onClose: () => void;
	responseId: string | null;
}

const ResponseDetailsDrawer: React.FC<ResponseDetailsDrawerProps> = ({
	open,
	onClose,
	responseId,
}) => {
	const theme = useTheme();
	const { response, loading, error } = useSurveyResponse(
		open ? responseId : null,
	);

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100%', sm: 600 },
					bgcolor: theme.palette.background.paper,
					color: theme.palette.text.primary,
				},
			}}
		>
			{/* Header */}
			<Box
				sx={{
					p: 2,
					display: 'flex',
					alignItems: 'center',
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Typography sx={{ flex: 1, fontSize: '1.1rem', fontWeight: 600 }}>
					Response Details
				</Typography>
				<IconButton
					onClick={onClose}
					sx={{ color: theme.palette.text.secondary }}
				>
					<CloseIcon />
				</IconButton>
			</Box>

			{/* Content */}
			<Box sx={{ p: 3, overflowY: 'auto' }}>
				{loading && (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress sx={{ color: '#9bc53d' }} />
					</Box>
				)}

				{error && <Alert severity="error">{error}</Alert>}

				{response && (
					<>
						{/* Metadata */}
						<Box sx={{ mb: 3 }}>
							<Typography
								sx={{
									fontSize: '0.75rem',
									color: theme.palette.text.secondary,
									mb: 2,
									textTransform: 'uppercase',
									letterSpacing: '0.08em',
								}}
							>
								Metadata
							</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<CalendarTodayIcon
										sx={{ fontSize: 18, color: theme.palette.text.secondary }}
									/>
									<Typography sx={{ fontSize: '0.85rem' }}>
										{new Date(response.createdAt).toLocaleString()}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<PersonIcon
										sx={{ fontSize: 18, color: theme.palette.text.secondary }}
									/>
									<Typography sx={{ fontSize: '0.85rem' }}>
										{response.userId || 'Anonymous'}
									</Typography>
								</Box>
								{response.location && (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<LocationOnIcon
											sx={{ fontSize: 18, color: theme.palette.text.secondary }}
										/>
										<Typography sx={{ fontSize: '0.85rem' }}>
											{response.location.latitude.toFixed(6)},{' '}
											{response.location.longitude.toFixed(6)}
										</Typography>
									</Box>
								)}
								<Box>
									<Chip
										label={response.surveyId}
										size="small"
										sx={{
											bgcolor: theme.palette.action?.selected,
											color: '#9bc53d',
											fontSize: '0.75rem',
										}}
									/>
								</Box>
							</Box>
						</Box>

						<Divider sx={{ borderColor: theme.palette.divider, my: 3 }} />

						{/* Response Fields */}
						<Box sx={{ mb: 3 }}>
							<Typography
								sx={{
									fontSize: '0.75rem',
									color: theme.palette.text.secondary,
									mb: 2,
									textTransform: 'uppercase',
									letterSpacing: '0.08em',
								}}
							>
								Form Responses
							</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
								{Object.entries(response.responses || {}).map(
									([fieldName, value]) => (
										<Box
											key={fieldName}
											sx={{
												p: 2,
												bgcolor: theme.palette.background.default,
												borderRadius: 1,
												border: `1px solid ${theme.palette.divider}`,
											}}
										>
											<Typography
												sx={{
													fontSize: '0.72rem',
													color: theme.palette.text.secondary,
													mb: 0.5,
													textTransform: 'uppercase',
													letterSpacing: '0.06em',
												}}
											>
												{fieldName.replace(/_/g, ' ')}
											</Typography>
											<Typography sx={{ fontSize: '0.9rem' }}>
												{typeof value === 'object'
													? JSON.stringify(value, null, 2)
													: String(value ?? '—')}
											</Typography>
										</Box>
									),
								)}
								{Object.keys(response.responses || {}).length === 0 && (
									<Typography
										sx={{
											color: theme.palette.text.secondary,
											fontSize: '0.85rem',
										}}
									>
										No response data
									</Typography>
								)}
							</Box>
						</Box>

						{/* Images */}
						{response.images && response.images.length > 0 && (
							<>
								<Divider sx={{ borderColor: theme.palette.divider, my: 3 }} />
								<Box>
									<Typography
										sx={{
											fontSize: '0.75rem',
											color: theme.palette.text.secondary,
											mb: 2,
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Images ({response.images.length})
									</Typography>
									<Grid container spacing={2}>
										{response.images.map((img, idx) => (
											<Grid item xs={6} key={idx}>
												<Box
													sx={{
														position: 'relative',
														paddingTop: '100%',
														borderRadius: 1,
														overflow: 'hidden',
														border: `1px solid ${theme.palette.divider}`,
													}}
												>
													<img
														src={img.url}
														alt={img.fieldName}
														style={{
															position: 'absolute',
															top: 0,
															left: 0,
															width: '100%',
															height: '100%',
															objectFit: 'cover',
														}}
													/>
												</Box>
												<Typography
													sx={{
														fontSize: '0.75rem',
														color: theme.palette.text.secondary,
														mt: 0.5,
														textAlign: 'center',
													}}
												>
													{img.fieldName}
												</Typography>
											</Grid>
										))}
									</Grid>
								</Box>
							</>
						)}
					</>
				)}
			</Box>
		</Drawer>
	);
};

export default ResponseDetailsDrawer;
