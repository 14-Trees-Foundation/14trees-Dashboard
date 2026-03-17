import React, { useMemo } from 'react';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	IconButton,
	LinearProgress,
	Skeleton,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { GiftCardLeaderboardEntry } from '../../../../types/analytics';
import { ANALYTICS_COLORS, LIGHT_ANALYTICS_COLORS } from '../analyticsTheme';

interface RequesterLeaderboardProps {
	data: GiftCardLeaderboardEntry[] | null;
	loading: boolean;
	sortBy: 'trees' | 'cards';
	onSortChange: (sort: 'trees' | 'cards') => void;
	onRowClick: (userId: number) => void;
	onExport: () => void;
	sectionLabel?: string;
	typeFilter: 'all' | 'corporate' | 'personal';
	year: number;
	filterContext?: string;
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
	requestType: 'Corporate' | 'Personal',
	isLightMode: boolean,
) => {
	if (isLightMode) {
		return requestType === 'Corporate'
			? {
					bgcolor: '#f0fdf4',
					color: '#15803d',
					border: '1px solid #bbf7d0',
			  }
			: {
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
	return {
		bgcolor: ANALYTICS_COLORS.accentDark,
		color: ANALYTICS_COLORS.accent,
		border: `1px solid ${ANALYTICS_COLORS.accent}`,
	};
};

const getDisplayName = (entry: GiftCardLeaderboardEntry): string =>
	entry.request_type === 'Corporate'
		? entry.group_name ?? 'Unknown Group'
		: entry.requester_name;

const RequesterLeaderboard: React.FC<RequesterLeaderboardProps> = ({
	data,
	loading,
	sortBy,
	onSortChange,
	onRowClick,
	onExport,
	sectionLabel,
	typeFilter,
	year,
	filterContext,
}) => {
	const hasData = !!data && data.length > 0;
	const theme = useTheme();
	const isLightMode = theme.palette.mode === 'light';
	const palette = isLightMode ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;

	const maxValue = useMemo(() => {
		if (!data || data.length === 0) {
			return 0;
		}
		return Math.max(
			...data.map((entry) =>
				sortBy === 'trees' ? entry.total_trees : entry.total_cards,
			),
		);
	}, [data, sortBy]);

	const handleSortToggle = (
		_: React.MouseEvent<HTMLElement>,
		value: 'trees' | 'cards' | null,
	) => {
		if (value) {
			onSortChange(value);
		}
	};

	const yearLabel = year === 0 ? 'All time' : `${year}`;
	const typeLabel =
		typeFilter !== 'all'
			? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)
			: null;
	const contextLabel =
		filterContext || [yearLabel, typeLabel].filter(Boolean).join(' · ');

	return (
		<Card>
			<CardContent>
				{sectionLabel && (
					<Typography
						variant="overline"
						sx={{
							display: 'block',
							fontSize: '0.65rem',
							letterSpacing: '0.1em',
							fontWeight: 600,
							textTransform: 'uppercase',
							color: isLightMode ? '#6b7280' : 'rgba(255,255,255,0.45)',
							mb: 1,
						}}
					>
						{sectionLabel}
					</Typography>
				)}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 3,
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Box>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								letterSpacing: '-0.01em',
								color: 'text.primary',
							}}
						>
							Top requesters
						</Typography>
						{contextLabel && (
							<Typography
								variant="body2"
								sx={{
									color: isLightMode ? '#6b7280' : 'rgba(255,255,255,0.6)',
								}}
							>
								{contextLabel}
							</Typography>
						)}
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<IconButton
							size="small"
							aria-label="export leaderboard"
							onClick={onExport}
							disabled={!hasData}
						>
							<FileDownloadOutlinedIcon fontSize="small" />
						</IconButton>
						<ToggleButtonGroup
							value={sortBy}
							exclusive
							size="small"
							onChange={handleSortToggle}
							aria-label="leaderboard sort"
						>
							<ToggleButton value="trees" aria-label="sort by trees">
								Trees
							</ToggleButton>
							<ToggleButton value="cards" aria-label="sort by cards">
								Cards
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>
				</Box>

				{loading && (
					<Box>
						{[1, 2, 3, 4, 5].map((item) => (
							<Box
								key={item}
								sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}
							>
								<Skeleton variant="text" width={20} />
								<Skeleton variant="circular" width={36} height={36} />
								<Box sx={{ flex: 1 }}>
									<Skeleton variant="text" width="60%" />
									<Skeleton variant="text" width="40%" />
								</Box>
								<Skeleton variant="rectangular" width={80} height={20} />
							</Box>
						))}
					</Box>
				)}

				{!loading && (!data || data.length === 0) && (
					<Typography align="center" sx={{ py: 4 }} color="text.secondary">
						No data available
					</Typography>
				)}

				{!loading && data && data.length > 0 && (
					<Box>
						{data.map((entry, index) => {
							const statValue =
								sortBy === 'trees' ? entry.total_trees : entry.total_cards;
							const progressValue =
								maxValue > 0 ? (statValue / maxValue) * 100 : 0;
							const displayName = getDisplayName(entry);
							const progressSx =
								entry.request_type === 'Corporate'
									? {
											bgcolor: isLightMode
												? '#f0ede6'
												: alpha(palette.corporate, 0.15),
											'& .MuiLinearProgress-bar': {
												bgcolor: isLightMode ? '#2d5a2d' : palette.corporate,
											},
									  }
									: {
											bgcolor: isLightMode
												? '#f5f3ee'
												: alpha(palette.personal, 0.15),
											'& .MuiLinearProgress-bar': {
												bgcolor: isLightMode ? '#8bc34a' : palette.personal,
											},
									  };
							return (
								<Box
									key={entry.user_id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										py: 1.5,
										px: 1,
										borderBottom: `1px solid ${
											isLightMode ? '#f0ede6' : alpha(palette.accent, 0.1)
										}`,
										cursor: 'pointer',
										borderRadius: '8px',
										transition: 'background-color 0.2s ease',
										'&:hover': {
											bgcolor: isLightMode
												? '#faf9f6'
												: alpha(palette.accent, 0.08),
										},
										'&:last-of-type': { borderBottom: 'none' },
									}}
									onClick={() => onRowClick(entry.user_id)}
								>
									<Typography
										variant="caption"
										sx={{
											minWidth: 20,
											color: isLightMode ? '#c5bfb3' : 'text.secondary',
										}}
									>
										{index + 1}
									</Typography>
									<Avatar
										sx={{
											width: 36,
											height: 36,
											fontSize: 13,
											...getAvatarStyles(entry.request_type, isLightMode),
										}}
									>
										{getInitials(displayName)}
									</Avatar>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											variant="body2"
											fontWeight={500}
											noWrap
											sx={{ color: isLightMode ? '#1a1a1a' : 'text.primary' }}
										>
											{displayName}
										</Typography>
										<Typography
											variant="caption"
											noWrap
											sx={{ color: isLightMode ? '#9ca3af' : 'text.secondary' }}
										>
											{entry.request_type === 'Corporate'
												? 'Corporate'
												: 'Personal'}
										</Typography>
									</Box>
									<Chip
										size="small"
										label={entry.request_type}
										variant="outlined"
										sx={{
											borderColor: alpha(
												entry.request_type === 'Corporate'
													? palette.corporate
													: palette.personal,
												isLightMode ? 0.4 : 0.5,
											),
											color:
												entry.request_type === 'Corporate'
													? palette.corporate
													: palette.personal,
											background: 'transparent',
										}}
									/>
									<Box
										sx={{
											flex: 2,
											display: 'flex',
											alignItems: 'center',
											gap: 1,
										}}
									>
										<LinearProgress
											variant="determinate"
											value={progressValue}
											sx={{
												flex: 1,
												height: 6,
												borderRadius: 3,
												...progressSx,
											}}
										/>
										<Typography
											variant="caption"
											fontWeight={600}
											sx={{
												minWidth: 60,
												textAlign: 'right',
												color: isLightMode ? '#2d5a2d' : palette.accent,
											}}
										>
											{statValue.toLocaleString()}
										</Typography>
									</Box>
								</Box>
							);
						})}
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default RequesterLeaderboard;
