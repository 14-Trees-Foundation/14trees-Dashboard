import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import GiftAnalyticsMetrics from '../gift/Components/GiftAnalyticsMetrics';
import GiftAnalyticsCharts from '../gift/Components/GiftAnalyticsCharts';
import GiftOccasionBreakdown from '../gift/Components/GiftOccasionBreakdown';
import {
	useGiftCardSummary,
	useGiftCardMonthly,
	useGiftCardOccasions,
	useGiftCardTreeDistribution,
	useGiftCardSources,
	useGiftCardLeaderboard,
} from './hooks/useGiftCardAnalyticsV2';
import { GiftCardMonthlyEntry } from '../../../types/analytics';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RequesterLeaderboard from './components/RequesterLeaderboard';
import RequesterProfileDrawer from './components/RequesterProfileDrawer';
import TreeDistributionChart from './components/TreeDistributionChart';
import RequestSourceChart from './components/RequestSourceChart';
import { ANALYTICS_COLORS, analyticsSectionTitleSx } from './analyticsTheme';

interface GiftCardAnalysisTabProps {
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}

const GiftCardAnalysisTab: React.FC<GiftCardAnalysisTabProps> = ({
	themeMode,
	onToggleTheme,
}) => {
	const [selectedYear, setSelectedYear] = useState<number>(2025);
	const [occasionType, setOccasionType] = useState<
		'all' | 'corporate' | 'personal'
	>('all');
	const [leaderboardSort, setLeaderboardSort] = useState<'trees' | 'cards'>(
		'trees',
	);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	const { data: summary, loading: summaryLoading } = useGiftCardSummary();
	const { data: monthly, loading: monthlyLoading } =
		useGiftCardMonthly(selectedYear);
	const { data: occasions, loading: occasionsLoading } =
		useGiftCardOccasions(occasionType);
	const { data: treeDistribution, loading: treeDistLoading } =
		useGiftCardTreeDistribution();
	const { data: sources, loading: sourcesLoading } = useGiftCardSources();
	const { data: leaderboard, loading: leaderboardLoading } =
		useGiftCardLeaderboard(leaderboardSort);

	return (
		<Box
			id="gift-card-analysis"
			sx={{ mt: 2, color: ANALYTICS_COLORS.textOnDark }}
		>
			<Typography
				variant="h5"
				sx={{
					...analyticsSectionTitleSx,
					color: 'rgba(255,255,255,0.85)',
					mb: 1,
				}}
			>
				Gift Card Analysis
			</Typography>
			<Typography
				variant="body2"
				sx={{ mb: 3, color: 'rgba(255,255,255,0.25)' }}
			>
				Existing gift card request analytics, month-on-month trends, and
				occasion type breakdown.
			</Typography>

			<GiftAnalyticsMetrics
				data={summary ?? undefined}
				loading={summaryLoading}
			/>

			<Box sx={{ mt: 4 }}>
				<GiftAnalyticsCharts
					data={monthly ? { monthly: monthly as GiftCardMonthlyEntry[] } : null}
					selectedYear={selectedYear}
					onYearChange={setSelectedYear}
					onExport={() => console.log('export monthly', selectedYear)}
					loading={monthlyLoading}
					themeMode={themeMode}
					onToggleTheme={onToggleTheme}
				/>
			</Box>

			<Box sx={{ mt: 4 }}>
				<TreeDistributionChart
					data={treeDistribution}
					loading={treeDistLoading}
					themeMode={themeMode}
				/>
			</Box>

			<Box sx={{ mt: 4 }}>
				<RequestSourceChart
					data={sources}
					loading={sourcesLoading}
					themeMode={themeMode}
				/>
			</Box>

			<Box sx={{ mt: 4 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
					}}
				>
					<Typography variant="h6" sx={analyticsSectionTitleSx}>
						By Occasion Type
					</Typography>
					<IconButton
						size="small"
						aria-label="export occasions"
						onClick={() => console.log('export occasions', occasionType)}
						disabled={!occasions}
					>
						<FileDownloadOutlinedIcon fontSize="small" />
					</IconButton>
				</Box>
				<GiftOccasionBreakdown
					data={occasions ?? undefined}
					loading={occasionsLoading}
					type={occasionType}
					onTypeChange={setOccasionType}
					themeMode={themeMode}
				/>
			</Box>

			<Box sx={{ mt: 4 }}>
				<RequesterLeaderboard
					data={leaderboard ?? null}
					loading={leaderboardLoading}
					sortBy={leaderboardSort}
					onSortChange={setLeaderboardSort}
					onRowClick={(userId) => setSelectedUserId(userId)}
					onExport={() => console.log('export leaderboard', leaderboardSort)}
				/>
			</Box>

			<RequesterProfileDrawer
				userId={selectedUserId}
				onClose={() => setSelectedUserId(null)}
			/>
		</Box>
	);
};

export default GiftCardAnalysisTab;
