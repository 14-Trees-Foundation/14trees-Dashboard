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
import { alpha } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { GiftCardLeaderboardEntry } from '../../../../types/analytics';
import { ANALYTICS_COLORS } from '../analyticsTheme';

interface RequesterLeaderboardProps {
	data: GiftCardLeaderboardEntry[] | null;
	loading: boolean;
	sortBy: 'trees' | 'cards';
	onSortChange: (sort: 'trees' | 'cards') => void;
	onRowClick: (userId: number) => void;
	onExport: () => void;
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

const getAvatarStyles = (requestType: 'Corporate' | 'Personal') => {
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
}) => {
	const hasData = !!data && data.length > 0;

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

	return (
		<Card>
			<CardContent>
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
											bgcolor: alpha(ANALYTICS_COLORS.corporate, 0.15),
											'& .MuiLinearProgress-bar': {
												bgcolor: ANALYTICS_COLORS.corporate,
											},
									  }
									: {
											bgcolor: alpha(ANALYTICS_COLORS.personal, 0.15),
											'& .MuiLinearProgress-bar': {
												bgcolor: ANALYTICS_COLORS.personal,
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
										borderBottom: `1px solid ${alpha(
											ANALYTICS_COLORS.accent,
											0.1,
										)}`,
										cursor: 'pointer',
										borderRadius: '8px',
										transition: 'background-color 0.2s ease',
										'&:hover': {
											bgcolor: alpha(ANALYTICS_COLORS.accent, 0.08),
										},
										'&:last-of-type': { borderBottom: 'none' },
									}}
									onClick={() => onRowClick(entry.user_id)}
								>
									<Typography
										variant="caption"
										sx={{ minWidth: 20 }}
										color="text.secondary"
									>
										{index + 1}
									</Typography>
									<Avatar
										sx={{
											width: 36,
											height: 36,
											fontSize: 13,
											...getAvatarStyles(entry.request_type),
										}}
									>
										{getInitials(displayName)}
									</Avatar>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											variant="body2"
											fontWeight={500}
											noWrap
											color="text.primary"
										>
											{displayName}
										</Typography>
										<Typography variant="caption" noWrap color="text.secondary">
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
											borderColor:
												entry.request_type === 'Corporate'
													? alpha(ANALYTICS_COLORS.corporate, 0.5)
													: alpha(ANALYTICS_COLORS.personal, 0.5),
											color:
												entry.request_type === 'Corporate'
													? ANALYTICS_COLORS.corporate
													: ANALYTICS_COLORS.personal,
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
												color: ANALYTICS_COLORS.accent,
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
