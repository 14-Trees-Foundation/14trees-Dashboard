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
import {
	GiftCardLeaderboardEntry,
	GiftCardRecentHistoryEntry,
} from '../../../../types/analytics';
import {
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
	analyticsLabelSx,
} from '../analyticsTheme';
import { alpha, useTheme } from '@mui/material/styles';
import { mapEventType } from '../../../../utils/eventTypes';
import {
	arrayToCSV,
	downloadCSV,
	formatFilename,
} from '../../../../utils/csvExport';

interface RequesterProfileDrawerProps {
	userId: number | null;
	onClose: () => void;
	profileType?: 'user' | 'group';
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
	isLightMode: boolean,
) => {
	if (isLightMode) {
		if (requestType === 'Corporate') {
			return {
				bgcolor: '#f0fdf4',
				color: '#15803d',
				border: '1px solid #bbf7d0',
			};
		}
		if (requestType === 'Personal') {
			return {
				bgcolor: '#f5f3ee',
				color: '#6b7280',
				border: '1px solid #eeebe4',
			};
		}
		return {
			bgcolor: '#f5f3ee',
			color: '#6b7280',
			border: '1px solid #eeebe4',
		};
	}
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

const normalizeOccasion = (occasion: string): string => {
	if (!occasion) return 'Unassigned';
	const lower = occasion.toLowerCase();
	if (lower.includes('birthday')) return 'Birthday';
	if (lower.includes('memorial')) return 'Memorial';
	if (lower.includes('wedding')) return 'Wedding';
	if (lower.includes('anniversary')) return 'Anniversary';
	if (lower.includes('festival') || lower.includes('festive')) return 'Festive';
	if (lower.includes('general')) return 'General';
	if (lower.includes('unassigned') || lower.includes('not specified'))
		return 'Unassigned';
	return occasion;
};

const LIGHT_BADGE_MAP: Record<
	string,
	{ bg: string; border: string; text: string }
> = {
	Birthday: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
	Memorial: { bg: '#f3f4f6', border: '#e5e7eb', text: '#374151' },
	General: { bg: '#f5f3ee', border: '#eeebe4', text: '#6b7280' },
	Festive: { bg: '#fff7ed', border: '#fed7aa', text: '#d97706' },
	Wedding: { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
	Anniversary: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
	Unassigned: { bg: '#f9fafb', border: '#f3f4f6', text: '#9ca3af' },
};

const getOccasionBadge = (occasion: string, isLight: boolean) => {
	if (!isLight) {
		return {
			bg: alpha(ANALYTICS_COLORS.accent, 0.1),
			border: alpha(ANALYTICS_COLORS.accent, 0.3),
			text: ANALYTICS_COLORS.accent,
		};
	}
	const normalized = normalizeOccasion(occasion);
	return (
		LIGHT_BADGE_MAP[normalized] ?? {
			bg: '#f5f3ee',
			border: '#eeebe4',
			text: '#6b7280',
		}
	);
};

const getStatusPill = (status: string, isLight: boolean) => {
	if (!isLight) {
		const isCompleted = status === 'completed';
		return {
			bg: 'transparent',
			color: isCompleted ? ANALYTICS_COLORS.accent : ANALYTICS_COLORS.warning,
			border: isCompleted
				? alpha(ANALYTICS_COLORS.accent, 0.5)
				: alpha(ANALYTICS_COLORS.warning, 0.5),
		};
	}
	const normalized = status?.toLowerCase();
	if (
		normalized === 'completed' ||
		normalized === 'fulfilled' ||
		normalized === 'planted'
	) {
		return { bg: '#f0fdf4', color: '#15803d' };
	}
	if (normalized === 'pending') {
		return { bg: '#fffbeb', color: '#b45309' };
	}
	if (normalized === 'growing') {
		return { bg: '#f9fafb', color: '#374151' };
	}
	if (normalized === 'dispatched') {
		return { bg: '#eff6ff', color: '#1d4ed8' };
	}
	return { bg: '#f9fafb', color: '#374151' };
};

const RequesterProfileDrawer: React.FC<RequesterProfileDrawerProps> = ({
	userId,
	onClose,
	profileType = 'user',
}) => {
	const { data: profile, loading } = useRequesterProfile(userId, profileType);
	const requester = profile?.stats;
	const recentHistory = profile?.recent_history ?? [];
	const requesterDisplayName = requester
		? requester.request_type === 'Corporate'
			? requester.group_name ?? 'Unknown Group'
			: requester.requester_name
		: '';
	const requesterWithMeta = requester as
		| (GiftCardLeaderboardEntry & { group_type?: string | null })
		| undefined;
	const drawerDisplayName =
		profileType === 'group'
			? requesterWithMeta?.group_name ?? requesterWithMeta?.requester_name ?? ''
			: requesterDisplayName;
	const drawerSubtitle =
		profileType === 'group' && requesterWithMeta
			? ['Corporate', requesterWithMeta.group_type].filter(Boolean).join(' · ')
			: null;

	const avgCardsPerRequest =
		requester && requester.total_requests > 0
			? (requester.total_cards / requester.total_requests).toFixed(1)
			: '0.0';
	const historyRows = recentHistory as Array<
		GiftCardRecentHistoryEntry & { requester_name?: string | null }
	>;
	const showRequesterColumn = profileType === 'group';

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
	const theme = useTheme();
	const isLightMode = theme.palette.mode === 'light';
	const palette = isLightMode ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const headerName = drawerDisplayName || requesterDisplayName;

	const handleExportHistory = () => {
		if (!profile || historyRows.length === 0) {
			return;
		}
		const baseHeaders = [
			'Request ID',
			'Occasion',
			'No of Cards',
			'Status',
			'Gifted On',
			'Created At',
		];
		const headers = showRequesterColumn
			? [baseHeaders[0], 'Requester', ...baseHeaders.slice(1)]
			: baseHeaders;
		const rows = historyRows.map((history) => {
			const baseRow = [
				history.request_id ?? history.id,
				mapEventType(history.occasion ?? ''),
				history.no_of_cards,
				formatStatus(history.status ?? ''),
				history.gifted_on
					? new Date(history.gifted_on).toLocaleDateString('en-GB')
					: '',
				history.created_at
					? new Date(history.created_at).toLocaleDateString('en-GB')
					: '',
			];
			return showRequesterColumn
				? [baseRow[0], history.requester_name ?? '', ...baseRow.slice(1)]
				: baseRow;
		});
		const exportName = drawerDisplayName || requesterDisplayName || 'requester';
		const filename = formatFilename(`${exportName}_request_history`, {});
		downloadCSV(arrayToCSV(headers, rows), filename);
	};

	return (
		<Drawer
			anchor="right"
			open={userId !== null}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: 480 },
					background: isLightMode ? '#ffffff' : palette.pageBg,
					borderLeft: isLightMode
						? '1px solid #eeebe4'
						: `1px solid ${alpha(palette.accent, 0.3)}`,
				},
			}}
		>
			<Box
				sx={{
					p: 3,
					height: '100%',
					overflowY: 'auto',
					color: palette.textOnDark,
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
									...getAvatarStyles(requester?.request_type, isLightMode),
								}}
							>
								{headerName ? getInitials(headerName) : ''}
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
										sx={{
											mb: 0.5,
											color: isLightMode ? '#1a1a1a' : palette.textOnDark,
										}}
									>
										{headerName}
									</Typography>
									{profileType === 'group' && drawerSubtitle ? (
										<Typography
											variant="body2"
											sx={{
												color: isLightMode ? '#6b7280' : palette.textMuted,
											}}
										>
											{drawerSubtitle}
										</Typography>
									) : (
										requester && (
											<Chip
												size="small"
												label={requester.request_type}
												variant="outlined"
												sx={{
													borderColor:
														requester.request_type === 'Corporate'
															? isLightMode
																? '#bbf7d0'
																: alpha(palette.corporate, 0.5)
															: isLightMode
															? '#eeebe4'
															: alpha(palette.personal, 0.5),
													color:
														requester.request_type === 'Corporate'
															? isLightMode
																? '#2d5a2d'
																: palette.corporate
															: isLightMode
															? '#8bc34a'
															: palette.personal,
													backgroundColor: isLightMode
														? '#ffffff'
														: 'transparent',
												}}
											/>
										)
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
							color: isLightMode ? '#9ca3af' : '#6b7a6e',
							'&:hover': {
								color: isLightMode ? '#1a1a1a' : '#e8ebe9',
							},
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				<Divider
					sx={{
						mb: 3,
						borderColor: isLightMode ? '#eeebe4' : '#2a3832',
					}}
				/>

				<Typography
					variant="h6"
					sx={{ mb: 1.5, color: isLightMode ? '#1a1a1a' : palette.textOnDark }}
				>
					Overview
				</Typography>
				<Grid container spacing={1.5} sx={{ mb: 3 }}>
					{stats.map((stat) => (
						<Grid item xs={6} key={stat.label}>
							<Card
								sx={{
									background: isLightMode ? '#faf9f6' : '#1f2f24',
									border: isLightMode
										? '1px solid #eeebe4'
										: '1px solid #2a3832',
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
											color: isLightMode
												? '#9ca3af'
												: alpha(palette.textOnDark, 0.5),
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
											sx={{ color: isLightMode ? '#1a1a1a' : palette.accent }}
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
					sx={{ mb: 1.5, color: isLightMode ? '#1a1a1a' : palette.textOnDark }}
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
						requester.occasion_types.map((occasion) => {
							const mappedOccasion = mapEventType(occasion);
							const badge = getOccasionBadge(mappedOccasion, isLightMode);
							return (
								<Chip
									key={occasion}
									label={mappedOccasion}
									size="small"
									variant="outlined"
									sx={{
										borderColor: badge.border,
										color: badge.text,
										backgroundColor: badge.bg,
									}}
								/>
							);
						})}
					{!loading &&
						requester &&
						(!requester.occasion_types ||
							requester.occasion_types.length === 0) && (
							<Typography
								variant="body2"
								sx={{ color: isLightMode ? '#9ca3af' : palette.textMuted }}
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
					<Typography
						variant="h6"
						sx={{ color: isLightMode ? '#1a1a1a' : palette.textOnDark }}
					>
						Recent requests
					</Typography>
					<Button
						size="small"
						variant="outlined"
						startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
						onClick={handleExportHistory}
						disabled={!profile || historyRows.length === 0}
						sx={{
							color: isLightMode ? '#6b7280' : palette.accent,
							borderColor: isLightMode ? '#eeebe4' : alpha(palette.accent, 0.4),
							backgroundColor: isLightMode ? '#ffffff' : 'transparent',
							'&:hover': {
								borderColor: isLightMode ? '#d4d0c8' : palette.accent,
								background: isLightMode
									? '#faf9f6'
									: alpha(palette.accent, 0.08),
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

				{!loading && historyRows.length > 0 && (
					<Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
						<Table size="small" stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell
										sx={{
											color: isLightMode
												? '#9ca3af'
												: alpha(palette.textOnDark, 0.5),
											borderBottom: isLightMode
												? '1px solid #eeebe4'
												: `1px solid ${alpha(palette.accent, 0.2)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Occasion
									</TableCell>
									{showRequesterColumn && (
										<TableCell
											sx={{
												color: isLightMode
													? '#9ca3af'
													: alpha(palette.textOnDark, 0.5),
												borderBottom: isLightMode
													? '1px solid #eeebe4'
													: `1px solid ${alpha(palette.accent, 0.2)}`,
												fontSize: '0.7rem',
												textTransform: 'uppercase',
												letterSpacing: '0.08em',
											}}
										>
											Requester
										</TableCell>
									)}
									<TableCell
										sx={{
											color: isLightMode
												? '#9ca3af'
												: alpha(palette.textOnDark, 0.5),
											borderBottom: isLightMode
												? '1px solid #eeebe4'
												: `1px solid ${alpha(palette.accent, 0.2)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Cards
									</TableCell>
									<TableCell
										sx={{
											color: isLightMode
												? '#9ca3af'
												: alpha(palette.textOnDark, 0.5),
											borderBottom: isLightMode
												? '1px solid #eeebe4'
												: `1px solid ${alpha(palette.accent, 0.2)}`,
											fontSize: '0.7rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
										}}
									>
										Status
									</TableCell>
									<TableCell
										sx={{
											color: isLightMode
												? '#9ca3af'
												: alpha(palette.textOnDark, 0.5),
											borderBottom: isLightMode
												? '1px solid #eeebe4'
												: `1px solid ${alpha(palette.accent, 0.2)}`,
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
								{historyRows.map((row) => (
									<TableRow
										key={row.id ?? row.request_id}
										hover
										sx={{
											'&:hover': {
												bgcolor: isLightMode
													? '#faf9f6'
													: alpha(palette.accent, 0.06),
											},
										}}
									>
										<TableCell
											sx={{
												borderBottom: isLightMode
													? '1px solid #f0ede6'
													: `1px solid ${alpha(palette.accent, 0.08)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{
													color: isLightMode ? '#1a1a1a' : palette.textOnDark,
												}}
											>
												{mapEventType(row.occasion)}
											</Typography>
										</TableCell>
										{showRequesterColumn && (
											<TableCell
												sx={{
													borderBottom: isLightMode
														? '1px solid #f0ede6'
														: `1px solid ${alpha(palette.accent, 0.08)}`,
												}}
											>
												<Typography
													variant="body2"
													sx={{
														color: isLightMode ? '#1a1a1a' : palette.textOnDark,
													}}
												>
													{row.requester_name ?? '—'}
												</Typography>
											</TableCell>
										)}
										<TableCell
											sx={{
												borderBottom: isLightMode
													? '1px solid #f0ede6'
													: `1px solid ${alpha(palette.accent, 0.08)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{
													color: isLightMode ? '#1a1a1a' : palette.textOnDark,
												}}
											>
												{row.no_of_cards.toLocaleString()}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												borderBottom: isLightMode
													? '1px solid #f0ede6'
													: `1px solid ${alpha(palette.accent, 0.08)}`,
											}}
										>
											{(() => {
												const pill = getStatusPill(
													row.status ?? '',
													isLightMode,
												);
												return (
													<Chip
														size="small"
														label={formatStatus(row.status ?? '')}
														variant="outlined"
														sx={{
															color: pill.color,
															backgroundColor: isLightMode
																? pill.bg
																: 'transparent',
															borderColor: isLightMode
																? 'transparent'
																: pill.border,
														}}
													/>
												);
											})()}
										</TableCell>
										<TableCell
											sx={{
												borderBottom: isLightMode
													? '1px solid #f0ede6'
													: `1px solid ${alpha(palette.accent, 0.08)}`,
											}}
										>
											<Typography
												variant="body2"
												sx={{
													color: isLightMode ? '#9ca3af' : palette.textMuted,
												}}
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

				{!loading && historyRows.length === 0 && (
					<Typography
						sx={{ color: isLightMode ? '#9ca3af' : palette.textMuted }}
					>
						No history found
					</Typography>
				)}
			</Box>
		</Drawer>
	);
};

export default RequesterProfileDrawer;
