import React, { useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Skeleton,
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
	ResponsiveContainer,
	ComposedChart,
	Line,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
} from 'recharts';
import {
	GiftCardMonthlyEntry,
	GiftCardYearlyEntry,
} from '../../../../types/analytics';
import { alpha } from '@mui/material/styles';
import {
	ANALYTICS_COLORS,
	CHART_TOOLTIP,
	LIGHT_ANALYTICS_COLORS,
	LIGHT_CHART_TOOLTIP,
} from '../../analytics/analyticsTheme';

interface GiftAnalyticsChartsProps {
	data: {
		monthly: GiftCardMonthlyEntry[];
	} | null;
	selectedYear: number;
	onExport?: () => void;
	loading: boolean;
	themeMode?: 'dark' | 'light';
	granularity?: 'monthly' | 'quarterly' | 'yearly';
	yearlyData?: GiftCardYearlyEntry[];
	yearlyLoading?: boolean;
}

function groupToQuarterly(monthly: GiftCardMonthlyEntry[]): Array<{
	label: string;
	corporate: number;
	personal: number;
	total: number;
	corporate_trees: number;
	personal_trees: number;
	total_trees: number;
}> {
	const quarters = [
		{ label: 'Q1', months: [1, 2, 3] },
		{ label: 'Q2', months: [4, 5, 6] },
		{ label: 'Q3', months: [7, 8, 9] },
		{ label: 'Q4', months: [10, 11, 12] },
	];
	return quarters.map((quarter) => {
		const rows = monthly.filter((entry) =>
			quarter.months.includes(entry.month),
		);
		const sum = (selector: (entry: GiftCardMonthlyEntry) => number) =>
			rows.reduce((acc, entry) => acc + selector(entry), 0);
		return {
			label: quarter.label,
			corporate: sum((entry) => entry.corporate),
			personal: sum((entry) => entry.personal),
			total: sum((entry) => entry.total ?? entry.corporate + entry.personal),
			corporate_trees: sum((entry) => entry.corporate_trees ?? 0),
			personal_trees: sum((entry) => entry.personal_trees ?? 0),
			total_trees: sum((entry) => entry.total_trees ?? 0),
		};
	});
}

const GiftAnalyticsCharts: React.FC<GiftAnalyticsChartsProps> = ({
	data,
	selectedYear,
	onExport,
	loading,
	themeMode = 'dark',
	granularity = 'monthly',
	yearlyData = [],
	yearlyLoading = false,
}) => {
	const [metric, setMetric] = useState<'requests' | 'trees'>('trees');
	const monthlyData = data?.monthly ?? [];

	const chartData = useMemo(() => {
		const isTrees = metric === 'trees';
		if (granularity === 'yearly') {
			return yearlyData.map((entry) => ({
				label: String(entry.year),
				corporate: isTrees ? entry.corporate_trees ?? 0 : entry.corporate,
				personal: isTrees ? entry.personal_trees ?? 0 : entry.personal,
				total: isTrees ? entry.total_trees ?? 0 : entry.total,
			}));
		}

		if (granularity === 'quarterly') {
			const quarters = groupToQuarterly(monthlyData);
			return quarters.map((quarter) => ({
				label: quarter.label,
				corporate: isTrees ? quarter.corporate_trees ?? 0 : quarter.corporate,
				personal: isTrees ? quarter.personal_trees ?? 0 : quarter.personal,
				total: isTrees ? quarter.total_trees ?? 0 : quarter.total,
			}));
		}

		return monthlyData.map((item) => ({
			label: item.month_name,
			corporate: isTrees ? item.corporate_trees ?? 0 : item.corporate,
			personal: isTrees ? item.personal_trees ?? 0 : item.personal,
			total: isTrees
				? item.total_trees ?? 0
				: item.total ?? item.corporate + item.personal,
		}));
	}, [granularity, metric, monthlyData, yearlyData]);

	const colors =
		themeMode === 'light' ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const tooltipConfig =
		themeMode === 'light' ? LIGHT_CHART_TOOLTIP : CHART_TOOLTIP;
	const tooltipStyles = useMemo(
		() => ({
			backgroundColor: tooltipConfig.backgroundColor,
			border: tooltipConfig.border,
			borderRadius: tooltipConfig.borderRadius ?? 8,
			color: tooltipConfig.bodyColor,
			padding: tooltipConfig.padding,
		}),
		[tooltipConfig],
	);
	const displayYear = selectedYear === 0 ? 'All time' : selectedYear.toString();
	const isYearlyView = granularity === 'yearly';
	const subtitleLabel = isYearlyView ? 'All years' : displayYear;
	const showLoading = isYearlyView ? yearlyLoading : loading;

	if (showLoading) {
		return (
			<Card>
				<CardContent>
					<Skeleton
						variant="text"
						height={40}
						width="60%"
						sx={{ mb: 2, borderRadius: 2 }}
					/>
					<Skeleton
						variant="rectangular"
						height={400}
						sx={{ borderRadius: 2 }}
					/>
				</CardContent>
			</Card>
		);
	}

	if (chartData.length === 0) {
		return (
			<Card>
				<CardContent>
					<Typography
						variant="h6"
						sx={{ fontWeight: 600, letterSpacing: '-0.01em' }}
						gutterBottom
					>
						Month-on-Month Trends
					</Typography>
					<Box sx={{ textAlign: 'center', py: 8 }}>
						<Typography color="text.secondary">
							No data available for the selected period
						</Typography>
					</Box>
				</CardContent>
			</Card>
		);
	}

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
					<Box>
						<Typography
							variant="h6"
							sx={{ fontWeight: 600, letterSpacing: '-0.01em' }}
						>
							Month-on-Month Trends
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{`${subtitleLabel} · ${granularity}`}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<ToggleButtonGroup
							value={metric}
							exclusive
							onChange={(_, value) => value && setMetric(value)}
							aria-label="metric toggle"
						>
							<ToggleButton value="trees" aria-label="show trees">
								Trees
							</ToggleButton>
							<ToggleButton value="requests" aria-label="show requests">
								Requests
							</ToggleButton>
						</ToggleButtonGroup>
						{onExport && (
							<IconButton
								size="small"
								aria-label="export monthly trends"
								onClick={onExport}
								disabled={!data || !data.monthly || data.monthly.length === 0}
							>
								<FileDownloadOutlinedIcon fontSize="small" />
							</IconButton>
						)}
					</Box>
				</Box>

				<ResponsiveContainer width="100%" height={400}>
					<ComposedChart
						data={chartData}
						margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray="0" stroke={colors.chartGrid} />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 12, fill: colors.textMuted }}
							angle={-45}
							textAnchor="end"
							height={80}
							axisLine={{ stroke: colors.chartAxis }}
							tickLine={false}
						/>
						{metric === 'requests' && (
							<YAxis
								yAxisId="left"
								label={{
									value: 'Requests',
									angle: -90,
									position: 'insideLeft',
									style: { fontSize: 12 },
								}}
								tick={{ fontSize: 12, fill: colors.textMuted }}
								axisLine={{ stroke: colors.chartAxis }}
								tickLine={false}
							/>
						)}
						{metric === 'trees' && (
							<YAxis
								yAxisId="right"
								orientation="right"
								label={{
									value: 'Trees',
									angle: 90,
									position: 'insideRight',
									style: { fontSize: 12 },
								}}
								tick={{ fontSize: 12, fill: colors.textMuted }}
								axisLine={{ stroke: colors.chartAxis }}
								tickLine={false}
							/>
						)}
						<RechartsTooltip
							contentStyle={tooltipStyles}
							labelStyle={{ color: tooltipConfig.titleColor, fontWeight: 600 }}
							cursor={{ fill: alpha(colors.accent, 0.08) }}
						/>
						<Legend
							wrapperStyle={{ paddingTop: 20, color: colors.textMuted }}
						/>

						{metric === 'requests' && (
							<>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="corporate"
									name="Corporate"
									stroke={colors.corporate}
									strokeWidth={2.5}
									strokeDasharray="5 5"
									dot={{ r: 3 }}
									animationDuration={800}
								/>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="personal"
									name="Personal"
									stroke={colors.personal}
									strokeWidth={2.5}
									strokeDasharray="5 5"
									dot={{ r: 3 }}
									animationDuration={800}
								/>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="total"
									name="Total"
									stroke={alpha(colors.textOnDark, 0.85)}
									strokeWidth={3}
									dot={false}
									animationDuration={800}
								/>
							</>
						)}

						{metric === 'trees' && (
							<>
								<Bar
									yAxisId="right"
									dataKey="corporate"
									name="Corporate"
									fill={colors.corporate}
									stackId="trees"
									animationDuration={800}
								/>
								<Bar
									yAxisId="right"
									dataKey="personal"
									name="Personal"
									fill={colors.personal}
									stackId="trees"
									animationDuration={800}
								/>
							</>
						)}
					</ComposedChart>
				</ResponsiveContainer>

				<Box sx={{ mt: 2, px: 2 }}>
					<Typography variant="caption" color="text.secondary">
						{metric === 'trees'
							? 'Bars represent trees gifted by corporate and personal requests'
							: 'Lines represent gift card requests by corporate and personal requesters'}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default GiftAnalyticsCharts;
