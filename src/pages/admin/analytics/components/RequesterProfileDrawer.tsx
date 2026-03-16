import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Drawer,
	Grid,
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useRequesterProfile } from '../hooks/useGiftCardAnalyticsV2';
import { GiftCardLeaderboardEntry } from '../../../../types/analytics';
import { ANALYTICS_COLORS, analyticsLabelSx } from '../analyticsTheme';
import { alpha } from '@mui/material/styles';

interface RequesterProfileDrawerProps {
	userId: number | null;
	onClose: () => void;
}

const getInitials = (name: string): string => {
	return name
		.split(' ')
		.filter(Boolean)
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
};

const getAvatarStyles = (
	requestType: GiftCardLeaderboardEntry['request_type'] | undefined,
) => {
	if (requestType === 'Corporate') {
		return {
			bgcolor: ANALYTICS_COLORS.corporate,
			color: ANALYTICS_COLORS.textOnDark,
		};
	}
	if (requestType === 'Personal') {
		return {
			bgcolor: ANALYTICS_COLORS.accentDark,
			color: ANALYTICS_COLORS.accent,
			border: `1px solid ${ANALYTICS_COLORS.accent}`,
		};
	}
	return {
		bgcolor: alpha(ANALYTICS_COLORS.textOnDark, 0.2),
		color: ANALYTICS_COLORS.textOnDark,
	};
};

const formatDate = (dateStr: string | null): string => {
	if (!dateStr) return '—';
	return new Date(dateStr).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const formatStatus = (status: string): string => {
	if (!status) return 'Unknown';
	return status.replace(/_/g, ' ');
};

const RequesterProfileDrawer: React.FC<RequesterProfileDrawerProps> = ({
	userId,
	onClose,
}) => {
	const { data: profile, loading } = useRequesterProfile(userId);
	const requester = profile?.stats;
	const recentHistory = profile?.recent_history ?? [];
	const requesterDisplayName = requester
		? requester.request_type === 'Corporate'
			? requester.group_name ?? 'Unknown Group'
			: requester.requester_name
		: '';

	const avgCardsPerRequest =
		requester && requester.total_requests > 0
			? (requester.total_cards / requester.total_requests).toFixed(1)
			: '0.0';

	const formatNumber = (value?: number): string => {
		if (value === undefined) return '—';
		return value.toLocaleString();
	};

	const stats: Array<{ label: string; value: string }> = [
		{ label: 'Total trees', value: formatNumber(requester?.total_trees) },
		{ label: 'Total cards', value: formatNumber(requester?.total_cards) },
		{ label: 'Fulfilled', value: formatNumber(requester?.fulfilled_cards) },
		{ label: 'Pending', value: formatNumber(requester?.pending_cards) },
		{ label: 'Requests', value: formatNumber(requester?.total_requests) },
		{ label: 'Avg cards/req', value: avgCardsPerRequest },
	];

	return (
		<Drawer
			anchor="right"
			open={userId !== null}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: 400 },
					background: ANALYTICS_COLORS.pageBg,
					borderLeft: `1px solid ${alpha(ANALYTICS_COLORS.accent, 0.3)}`,
				},
			}}
		>
			<Box
				sx={{
					p: 3,
					height: '100%',
					overflowY: 'auto',
					color: ANALYTICS_COLORS.textOnDark,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						mb: 3,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{loading ? (
							<Skeleton variant="circular" width={48} height={48} />
						) : (
							<Avatar
								sx={{
									width: 48,
									height: 48,
									...getAvatarStyles(requester?.request_type),
								}}
							>
								{requester ? getInitials(requesterDisplayName) : ''}
							</Avatar>
						)}
						<Box>
							{loading ? (
								<>
									<Skeleton variant="text" width={160} />
									<Skeleton variant="text" width={80} />
								</>
							) : (
								<>
									<Typography
										variant="h6"
										sx={{ mb: 0.5, color: ANALYTICS_COLORS.textOnDark }}
									>
										{requesterDisplayName}
									</Typography>
									{requester && (
										<Chip
											size="small"
											label={requester.request_type}
											variant="outlined"
											sx={{
												borderColor:
													requester.request_type === 'Corporate'
														? 'rgba(60, 121, 188, 0.5)'
														: 'rgba(155, 197, 61, 0.5)',
												color:
													requester.request_type === 'Corporate'
														? ANALYTICS_COLORS.corporate
														: ANALYTICS_COLORS.personal,
											}}
										/>
									)}
								</>
							)}
						</Box>
					</Box>
					<IconButton
						onClick={onClose}
						size="small"
						aria-label="close profile"
						sx={{
							color: alpha(ANALYTICS_COLORS.textOnDark, 0.6),
							'&:hover': { color: ANALYTICS_COLORS.accent },
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				<Divider
					sx={{ mb: 3, borderColor: alpha(ANALYTICS_COLORS.accent, 0.2) }}
				/>

				<Typography
					variant="h6"
					sx={{ mb: 1.5, color: ANALYTICS_COLORS.textOnDark }}
				>
					Overview
				</Typography>
				<Grid container spacing={1.5} sx={{ mb: 3 }}>
					{stats.map((stat) => (
						<Grid item xs={6} key={stat.label}>
							<Card
								sx={{
									background: alpha(ANALYTICS_COLORS.accent, 0.08),
									border: `1px solid ${alpha(ANALYTICS_COLORS.accent, 0.2)}`,
									borderRadius: '8px',
								}}
							>
								<CardContent sx={{ p: '12px !important' }}>
									<Typography
										variant="caption"
										display="block"
										sx={{
											...analyticsLabelSx,
											fontSize: '0.7rem',
											color: alpha(ANALYTICS_COLORS.textOnDark, 0.5),
										}}
									>
										{stat.label}
									</Typography>
									{loading ? (
										<Skeleton variant="text" width={80} />
									) : (
										<Typography
											variant="h6"
											fontWeight={600}
											sx={{ color: ANALYTICS_COLORS.accent }}
										>
											{stat.value ?? '—'}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>

				<Typography
					variant="h6"
					sx={{ mb: 1.5, color: ANALYTICS_COLORS.textOnDark }}
				>
					Occasions
				</Typography>
				<Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{loading && (
						<>
							{[1, 2, 3].map((i) => (
								<Skeleton
									key={i}
									variant="rectangular"
									width={80}
									height={24}
									sx={{ borderRadius: 1 }}
								/>
							))}
						</>
					)}
					{!loading &&
						requester &&
						requester.occasion_types &&
						requester.occasion_types.length > 0 &&
						requester.occasion_types.map((occasion) => (
							<Chip
								key={occasion}
								label={occasion}
								size="small"
								variant="outlined"
								sx={{
									borderColor: alpha(ANALYTICS_COLORS.accent, 0.4),
									color: ANALYTICS_COLORS.accent,
								}}
							/>
						))}
					{!loading &&
						requester &&
						(!requester.occasion_types ||
							requester.occasion_types.length === 0) && (
							<Typography
								variant="body2"
								sx={{ color: ANALYTICS_COLORS.textMuted }}
							>
								No occasions recorded
							</Typography>
						)}
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 1.5,
					}}
				>
					<Typography variant="h6" sx={{ color: ANALYTICS_COLORS.textOnDark }}>
						Recent requests
					</Typography>
					<Button
						size="small"
						variant="outlined"
						startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
						onClick={() => console.log('export profile', userId)}
						disabled={userId === null}
						sx={{
							color: ANALYTICS_COLORS.accent,
							borderColor: alpha(ANALYTICS_COLORS.accent, 0.4),
							'&:hover': {
								borderColor: ANALYTICS_COLORS.accent,
								background: alpha(ANALYTICS_COLORS.accent, 0.08),
							},
						}}
					>
						Export
					</Button>
				</Box>

				{loading && (
					<Box>
						{[1, 2, 3].map((row) => (
							<Skeleton
								key={row}
								variant="rectangular"
								height={40}
								sx={{ mb: 1, borderRadius: 1 }}
							/>
						))}
					</Box>
				)}

				{!loading && recentHistory.length > 0 && (
					<Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
						<Table size="small" stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell
										sx={{
											color: alpha(ANALYTICS_COLORS.textOnDark, 0.5),
											borderBottom: `1px solid ${alpha(
												ANALYTICS_COLORS.accent,
												0.2,
											)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Occasion
									</TableCell>
									<TableCell
										sx={{
											color: alpha(ANALYTICS_COLORS.textOnDark, 0.5),
											borderBottom: `1px solid ${alpha(
												ANALYTICS_COLORS.accent,
												0.2,
											)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Cards
									</TableCell>
									<TableCell
										sx={{
											color: alpha(ANALYTICS_COLORS.textOnDark, 0.5),
											borderBottom: `1px solid ${alpha(
												ANALYTICS_COLORS.accent,
												0.2,
											)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Status
									</TableCell>
									<TableCell
										sx={{
											color: alpha(ANALYTICS_COLORS.textOnDark, 0.5),
											borderBottom: `1px solid ${alpha(
												ANALYTICS_COLORS.accent,
												0.2,
											)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Date
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{recentHistory.map((row) => (
									<TableRow
										key={row.id}
										hover
										sx={{
											'&:hover': {
												bgcolor: alpha(ANALYTICS_COLORS.accent, 0.06),
											},
										}}
									>
										<TableCell
											sx={{
												borderBottom: `1px solid ${alpha(
													ANALYTICS_COLORS.accent,
													0.08,
												)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{ color: ANALYTICS_COLORS.textOnDark }}
											>
												{row.occasion ?? 'Unassigned'}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												borderBottom: `1px solid ${alpha(
													ANALYTICS_COLORS.accent,
													0.08,
												)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{ color: ANALYTICS_COLORS.textOnDark }}
											>
												{row.no_of_cards.toLocaleString()}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												borderBottom: `1px solid ${alpha(
													ANALYTICS_COLORS.accent,
													0.08,
												)}`,
											}}
										>
											<Chip
												size="small"
												label={formatStatus(row.status)}
												variant="outlined"
												sx={{
													color:
														row.status === 'completed'
															? ANALYTICS_COLORS.accent
															: ANALYTICS_COLORS.warning,
													borderColor:
														row.status === 'completed'
															? alpha(ANALYTICS_COLORS.accent, 0.5)
															: alpha(ANALYTICS_COLORS.warning, 0.5),
												}}
											/>
										</TableCell>
										<TableCell
											sx={{
												borderBottom: `1px solid ${alpha(
													ANALYTICS_COLORS.accent,
													0.08,
												)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{ color: ANALYTICS_COLORS.textMuted }}
											>
												{formatDate(row.created_at)}
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				)}

				{!loading && recentHistory.length === 0 && (
					<Typography sx={{ color: ANALYTICS_COLORS.textMuted }}>
						No history found
					</Typography>
				)}
			</Box>
		</Drawer>
	);
};

export default RequesterProfileDrawer;
