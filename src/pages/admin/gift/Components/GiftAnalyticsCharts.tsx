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
import { GiftCardMonthlyEntry } from '../../../../types/analytics';
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
}

const GiftAnalyticsCharts: React.FC<GiftAnalyticsChartsProps> = ({
	data,
	selectedYear,
	onExport,
	loading,
	themeMode = 'dark',
	granularity = 'monthly',
}) => {
	const [metric, setMetric] = useState<'requests' | 'trees'>('trees');

	// Transform data for chart
	const chartData = useMemo(() => {
		if (!data || !data.monthly) return [];

		return data.monthly.map((item) => {
			const corporateTrees = item.corporate_trees ?? 0;
			const personalTrees = item.personal_trees ?? 0;
			const totalTrees = corporateTrees + personalTrees;
			return {
				month: item.month,
				monthLabel: item.month_name,
				'Corporate Requests': item.corporate,
				'Personal Requests': item.personal,
				'Total Requests': item.total ?? item.corporate + item.personal,
				'Corporate Trees': corporateTrees,
				'Personal Trees': personalTrees,
				'Total Trees': totalTrees,
			};
		});
	}, [data]);

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

	if (loading) {
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

	if (!data || chartData.length === 0) {
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
							{`${displayYear} · ${granularity}`}
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
							dataKey="monthLabel"
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
									dataKey="Corporate Requests"
									stroke={colors.corporate}
									strokeWidth={2.5}
									strokeDasharray="5 5"
									dot={{ r: 3 }}
									animationDuration={800}
								/>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="Personal Requests"
									stroke={colors.personal}
									strokeWidth={2.5}
									strokeDasharray="5 5"
									dot={{ r: 3 }}
									animationDuration={800}
								/>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="Total Requests"
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
									dataKey="Corporate Trees"
									name="Corporate"
									fill={colors.corporate}
									stackId="trees"
									animationDuration={800}
								/>
								<Bar
									yAxisId="right"
									dataKey="Personal Trees"
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
