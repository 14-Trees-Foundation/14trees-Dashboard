import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';

import AISummaryPanel from './components/AISummaryPanel';
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
	useGiftCardYearly,
} from './hooks/useGiftCardAnalyticsV2';
import { GiftCardMonthlyEntry } from '../../../types/analytics';
import RequesterLeaderboard from './components/RequesterLeaderboard';
import RequesterProfileDrawer from './components/RequesterProfileDrawer';
import TreeDistributionChart from './components/TreeDistributionChart';
import RequestSourceChart from './components/RequestSourceChart';
import { ANALYTICS_COLORS, analyticsSectionTitleSx } from './analyticsTheme';

interface GiftCardAnalysisTabProps {
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}

interface FilterDropdownProps {
	label: string;
	value: string;
	options: Array<{ value: string; label: string }>;
	onChange: (value: string) => void;
	themeMode: 'dark' | 'light';
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	label,
	value,
	options,
	onChange,
	themeMode,
}) => {
	const isDark = themeMode === 'dark';
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 0.5,
				minWidth: 110,
				flexShrink: 0,
			}}
		>
			<Typography
				sx={{
					fontSize: '10px',
					fontWeight: 600,
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					color: isDark ? '#9ba39d' : '#6b7280',
				}}
			>
				{label}
			</Typography>
			<Box
				component="select"
				value={value}
				onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
					onChange(event.target.value)
				}
				sx={{
					fontSize: '13px',
					fontWeight: 500,
					color: isDark ? '#e8ebe9' : '#111827',
					background: isDark ? '#152018' : '#f9f7f4',
					border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
					borderRadius: '8px',
					padding: '6px 28px 6px 10px',
					cursor: 'pointer',
					fontFamily: 'inherit',
					appearance: 'none',
					WebkitAppearance: 'none',
					backgroundImage: isDark
						? "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-opacity='0.4' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
						: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'right 8px center',
					outline: 'none',
					width: '100%',
					'&:hover': {
						borderColor: isDark ? '#3a4a3d' : '#9ca3af',
						background: isDark ? '#1f2f24' : '#f0ede6',
					},
					'& option': {
						color: '#111827',
						background: '#ffffff',
					},
				}}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Box>
		</Box>
	);
};

const FilterDivider: React.FC<{ themeMode: 'dark' | 'light' }> = ({
	themeMode,
}) => (
	<Box
		sx={{
			width: '1px',
			height: '36px',
			background: themeMode === 'dark' ? '#2a3832' : '#e5e0d8',
			flexShrink: 0,
			mx: 0.5,
		}}
	/>
);

const GiftCardAnalysisTab: React.FC<GiftCardAnalysisTabProps> = ({
	themeMode,
	onToggleTheme: _onToggleTheme,
}) => {
	const [selectedYear, setSelectedYear] = useState<number>(2026);
	const [granularity, setGranularity] = useState<
		'monthly' | 'quarterly' | 'yearly'
	>('monthly');
	const [typeFilter, setTypeFilter] = useState<
		'all' | 'corporate' | 'personal'
	>('all');
	const [sourceFilter, setSourceFilter] = useState<
		'all' | 'website' | 'manual'
	>('all');
	const [leaderboardSort, setLeaderboardSort] = useState<'trees' | 'cards'>(
		'trees',
	);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [selectedProfileType, setSelectedProfileType] = useState<
		'user' | 'group'
	>('user');
	const isDark = themeMode === 'dark';
	const sectionSpacing = { xs: 2, md: 2 } as const;
	const headingColor = isDark ? 'rgba(255,255,255,0.85)' : '#1f2937';
	const descriptionColor = isDark ? 'rgba(255,255,255,0.45)' : '#4b5563';
	const formatYearLabel = (year: number) =>
		year === 0 ? 'All time' : `${year}`;
	const toTitleCase = (value: string) =>
		value.charAt(0).toUpperCase() + value.slice(1);
	const yearLabel = formatYearLabel(selectedYear);
	const typeLabel = typeFilter !== 'all' ? toTitleCase(typeFilter) : null;
	const sourceLabel = sourceFilter !== 'all' ? toTitleCase(sourceFilter) : null;
	const globalFilterContext = [yearLabel, typeLabel, sourceLabel]
		.filter(Boolean)
		.join(' · ');
	const typeFilterContext = [yearLabel, typeLabel].filter(Boolean).join(' · ');
	const yearOnlyContext = yearLabel;
	const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
	const sectionLabelSx = {
		fontSize: '10px',
		fontWeight: 600,
		textTransform: 'uppercase' as const,
		letterSpacing: '0.08em',
		color: isDark ? '#4a5a4d' : '#6b7280',
		mb: 1.5,
		mt: 2,
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		'&::after': {
			content: '""',
			flex: 1,
			height: '1px',
			background: isDark ? '#2a3832' : '#eeebe4',
		},
	};

	const { data: summary, loading: summaryLoading } = useGiftCardSummary(
		selectedYear || undefined,
		sourceParam,
	);
	const { data: monthly, loading: monthlyLoading } = useGiftCardMonthly(
		selectedYear,
		sourceParam,
	);
	const { data: occasions, loading: occasionsLoading } = useGiftCardOccasions(
		typeFilter !== 'all' ? typeFilter : undefined,
		sourceParam,
		selectedYear || undefined,
	);
	const { data: treeDistribution, loading: treeDistLoading } =
		useGiftCardTreeDistribution(
			selectedYear || undefined,
			typeFilter !== 'all' ? typeFilter : undefined,
			sourceParam,
		);
	const { data: sources, loading: sourcesLoading } = useGiftCardSources(
		selectedYear || undefined,
		typeFilter !== 'all' ? typeFilter : undefined,
	);
	const { data: leaderboard, loading: leaderboardLoading } =
		useGiftCardLeaderboard(
			leaderboardSort,
			10,
			selectedYear || undefined,
			typeFilter !== 'all' ? typeFilter : undefined,
			sourceParam,
		);
	const { data: yearly, loading: yearlyLoading } = useGiftCardYearly(
		typeFilter !== 'all' ? typeFilter : undefined,
		sourceParam,
	);

	const handleSelectUser = (id: number, type: 'user' | 'group') => {
		setSelectedUserId(id);
		setSelectedProfileType(type);
	};

	return (
		<Box
			id="gift-card-analysis"
			sx={{ mt: 2, color: ANALYTICS_COLORS.textOnDark }}
		>
			<Typography
				variant="h5"
				sx={{
					...analyticsSectionTitleSx,
					color: headingColor,
					mb: 1,
				}}
			>
				Gift Card Analysis
			</Typography>
			<Typography variant="body2" sx={{ mb: 3, color: descriptionColor }}>
				Existing gift card request analytics, month-on-month trends, and
				occasion type breakdown.
			</Typography>
			<Typography
				variant="caption"
				sx={{
					display: 'block',
					mt: 1,
					mb: 1,
					color: descriptionColor,
				}}
			>
				{`Showing ${globalFilterContext || yearLabel}`}
			</Typography>

			<Box
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 100,
					background: isDark ? '#1a2820' : '#ffffff',
					border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
					borderRadius: '12px',
					px: 2.5,
					py: 1.5,
					mb: 2.5,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					flexWrap: { xs: 'wrap', md: 'nowrap' },
					boxShadow: isDark
						? '0 2px 12px rgba(0,0,0,0.4)'
						: '0 2px 8px rgba(0,0,0,0.07)',
				}}
			>
				<FilterDropdown
					label="Year"
					value={selectedYear === 0 ? 'all' : String(selectedYear)}
					options={[
						{ value: '2026', label: '2026' },
						{ value: '2025', label: '2025' },
						{ value: '2024', label: '2024' },
						{ value: '2023', label: '2023' },
						{ value: 'all', label: 'All time' },
					]}
					onChange={(value) =>
						setSelectedYear(value === 'all' ? 0 : parseInt(value, 10))
					}
					themeMode={themeMode}
				/>
				<FilterDivider themeMode={themeMode} />
				<FilterDropdown
					label="View by"
					value={granularity}
					options={[
						{ value: 'monthly', label: 'Monthly' },
						{ value: 'quarterly', label: 'Quarterly' },
						{ value: 'yearly', label: 'Yearly' },
					]}
					onChange={(value) =>
						setGranularity(value as 'monthly' | 'quarterly' | 'yearly')
					}
					themeMode={themeMode}
				/>
				<FilterDivider themeMode={themeMode} />
				<FilterDropdown
					label="Type"
					value={typeFilter}
					options={[
						{ value: 'all', label: 'All types' },
						{ value: 'corporate', label: 'Corporate' },
						{ value: 'personal', label: 'Personal' },
					]}
					onChange={(value) =>
						setTypeFilter(value as 'all' | 'corporate' | 'personal')
					}
					themeMode={themeMode}
				/>
				<FilterDivider themeMode={themeMode} />
				<FilterDropdown
					label="Source"
					value={sourceFilter}
					options={[
						{ value: 'all', label: 'All sources' },
						{ value: 'website', label: 'Website' },
						{ value: 'manual', label: 'Manual' },
					]}
					onChange={(value) =>
						setSourceFilter(value as 'all' | 'website' | 'manual')
					}
					themeMode={themeMode}
				/>
				{(selectedYear !== 2025 ||
					granularity !== 'monthly' ||
					typeFilter !== 'all' ||
					sourceFilter !== 'all') && (
					<Box sx={{ ml: 'auto', flexShrink: 0 }}>
						<Button
							size="small"
							variant="outlined"
							onClick={() => {
								setSelectedYear(2025);
								setGranularity('monthly');
								setTypeFilter('all');
								setSourceFilter('all');
							}}
							sx={{
								fontSize: '12px',
								borderRadius: '8px',
								textTransform: 'none',
								borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e5e0d8',
								color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af',
								'&:hover': {
									borderColor: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af',
									backgroundColor: isDark
										? 'rgba(255,255,255,0.05)'
										: '#f5f3ee',
								},
							}}
						>
							Reset
						</Button>
					</Box>
				)}
			</Box>

			<GiftAnalyticsMetrics
				data={summary ?? undefined}
				loading={summaryLoading}
			/>

			<Box
				sx={{
					mt: 2,
					'& > *': {
						minHeight: 120,
					},
				}}
			>
				<AISummaryPanel year={selectedYear} themeMode={themeMode} />
			</Box>

			<Typography sx={sectionLabelSx}>Volume & sources</Typography>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
					gap: 2,
				}}
			>
				<GiftAnalyticsCharts
					data={monthly ? { monthly: monthly as GiftCardMonthlyEntry[] } : null}
					selectedYear={selectedYear}
					onExport={() => console.log('export monthly', selectedYear)}
					loading={monthlyLoading}
					themeMode={themeMode}
					granularity={granularity}
					yearlyData={yearly ?? []}
					yearlyLoading={yearlyLoading}
				/>
				<RequestSourceChart
					data={sources}
					loading={sourcesLoading}
					themeMode={themeMode}
					year={selectedYear}
					typeFilter={typeFilter}
					filterContext={globalFilterContext}
				/>
			</Box>

			<Typography sx={sectionLabelSx}>Breakdown</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', lg: 'row' },
					gap: 2,
					alignItems: 'stretch',
				}}
			>
				<Box sx={{ flex: { xs: '1 1 auto', lg: 2 }, width: '100%' }}>
					<GiftOccasionBreakdown
						data={occasions ?? undefined}
						loading={occasionsLoading}
						type={typeFilter}
						filterContext={typeFilterContext}
						themeMode={themeMode}
						granularity={granularity}
						year={selectedYear}
						onExport={() => console.log('export occasions', typeFilter)}
					/>
				</Box>
				<Box
					sx={{
						flex: { xs: '1 1 auto', lg: 1 },
						width: '100%',
						minWidth: 0,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<TreeDistributionChart
						data={treeDistribution}
						loading={treeDistLoading}
						themeMode={themeMode}
						year={selectedYear}
						filterContext={yearOnlyContext}
					/>
				</Box>
			</Box>

			<Box sx={{ mt: 2, position: 'relative', zIndex: 0 }}>
				<RequesterLeaderboard
					sectionLabel="Who's planting"
					filterContext={typeFilterContext}
					data={leaderboard ?? null}
					loading={leaderboardLoading}
					sortBy={leaderboardSort}
					onSortChange={setLeaderboardSort}
					onSelectUser={handleSelectUser}
					onExport={() => console.log('export leaderboard', leaderboardSort)}
					typeFilter={typeFilter}
					year={selectedYear}
					granularity={granularity}
				/>
			</Box>

			<RequesterProfileDrawer
				userId={selectedUserId}
				profileType={selectedProfileType}
				onClose={() => {
					setSelectedUserId(null);
					setSelectedProfileType('user');
				}}
			/>
		</Box>
	);
};

export default GiftCardAnalysisTab;
