import React, { useMemo, useState } from 'react';
import {
	Card,
	CardContent,
	Box,
	Typography,
	ToggleButtonGroup,
	ToggleButton,
	Skeleton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';
import {
	GiftCardSourcesResponse,
	GiftCardSourceSummary,
	GiftCardSourceMonthlyEntry,
} from '../../../../types/analytics';
import {
	ANALYTICS_COLORS,
	CHART_TOOLTIP,
	LIGHT_ANALYTICS_COLORS,
	LIGHT_CHART_TOOLTIP,
} from '../analyticsTheme';

interface RequestSourceChartProps {
	data: GiftCardSourcesResponse | null;
	loading: boolean;
	themeMode?: 'dark' | 'light';
}

const RequestSourceChart: React.FC<RequestSourceChartProps> = ({
	data,
	loading,
	themeMode = 'dark',
}) => {
	const [metric, setMetric] = useState<'requests' | 'trees'>('requests');
	const colors =
		themeMode === 'light' ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const tooltipConfig =
		themeMode === 'light' ? LIGHT_CHART_TOOLTIP : CHART_TOOLTIP;

	const chartData = useMemo(
		() =>
			(data?.monthly ?? []).map((month: GiftCardSourceMonthlyEntry) => ({
				label: `${month.month_name} ${String(month.year).slice(2)}`,
				Website: metric === 'requests' ? month.website : month.website_trees,
				Manual: metric === 'requests' ? month.manual : month.manual_trees,
			})),
		[data, metric],
	);

	const summary: GiftCardSourceSummary | undefined = data?.summary;
	const avgWebsite =
		summary && summary.website_requests > 0
			? (summary.website_trees / summary.website_requests).toFixed(1)
			: '0.0';
	const avgManual =
		summary && summary.manual_requests > 0
			? (summary.manual_trees / summary.manual_requests).toFixed(1)
			: '0.0';

	return (
		<Card>
			<CardContent>
				<Typography
					variant="h6"
					sx={{
						fontWeight: 600,
						letterSpacing: '-0.01em',
						color: 'text.primary',
						mb: 2,
					}}
				>
					Request sources
				</Typography>
				<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3, mt: 1 }}>
					<Box sx={{ flex: 1, minWidth: 140 }}>
						<Typography
							variant="caption"
							color="text.secondary"
							display="block"
						>
							Website requests
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
							{loading ? (
								<Skeleton width={80} height={40} sx={{ borderRadius: 1 }} />
							) : (
								<>
									<Typography
										variant="h4"
										fontWeight={600}
										sx={{ color: colors.corporate }}
									>
										{summary?.website_requests.toLocaleString()}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{summary?.website_pct}% of total
									</Typography>
								</>
							)}
						</Box>
						{loading ? (
							<Skeleton width={60} />
						) : (
							<Typography variant="caption" color="text.secondary">
								{summary?.website_trees.toLocaleString()} trees
							</Typography>
						)}
					</Box>

					<Box sx={{ flex: 1, minWidth: 140 }}>
						<Typography
							variant="caption"
							color="text.secondary"
							display="block"
						>
							Manual requests
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
							{loading ? (
								<Skeleton width={80} height={40} sx={{ borderRadius: 1 }} />
							) : (
								<>
									<Typography
										variant="h4"
										fontWeight={600}
										sx={{ color: colors.personal }}
									>
										{summary?.manual_requests.toLocaleString()}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{summary?.manual_pct}% of total
									</Typography>
								</>
							)}
						</Box>
						{loading ? (
							<Skeleton width={60} />
						) : (
							<Typography variant="caption" color="text.secondary">
								{summary?.manual_trees.toLocaleString()} trees
							</Typography>
						)}
					</Box>

					<Box sx={{ width: '100%', mt: 1 }}>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ mb: 0.5 }}
							display="block"
						>
							Request volume split
						</Typography>
						<Box
							sx={{
								display: 'flex',
								height: 8,
								borderRadius: 4,
								overflow: 'hidden',
								bgcolor: 'divider',
							}}
						>
							<Box
								sx={{
									width: `${summary?.website_pct ?? 0}%`,
									bgcolor: colors.corporate,
									transition: 'width 0.6s ease',
								}}
							/>
							<Box
								sx={{
									width: `${summary?.manual_pct ?? 0}%`,
									bgcolor: colors.personal,
								}}
							/>
						</Box>
					</Box>
				</Box>

				<Box sx={{ mt: 3 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 1,
						}}
					>
						<Typography variant="body2" fontWeight={500} color="text.primary">
							Monthly trend
						</Typography>
						<ToggleButtonGroup
							size="small"
							exclusive
							value={metric}
							onChange={(_, value) => value && setMetric(value)}
						>
							<ToggleButton value="requests">Requests</ToggleButton>
							<ToggleButton value="trees">Trees</ToggleButton>
						</ToggleButtonGroup>
					</Box>

					<Box sx={{ display: 'flex', gap: 2, mb: 1, fontSize: '11px' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									bgcolor: colors.corporate,
								}}
							/>
							<Typography variant="caption" color="text.secondary">
								Website
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									bgcolor: colors.personal,
								}}
							/>
							<Typography variant="caption" color="text.secondary">
								Manual
							</Typography>
						</Box>
					</Box>

					{loading ? (
						<Skeleton
							variant="rectangular"
							height={200}
							sx={{ borderRadius: 2 }}
						/>
					) : chartData.length === 0 ? (
						<Typography color="text.secondary" textAlign="center" py={3}>
							No monthly data available
						</Typography>
					) : (
						<ResponsiveContainer width="100%" height={200}>
							<BarChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={colors.chartGrid}
								/>
								<XAxis
									dataKey="label"
									tick={{ fontSize: 11, fill: colors.textMuted }}
									axisLine={{ stroke: colors.chartAxis }}
									tickLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11, fill: colors.textMuted }}
									axisLine={{ stroke: colors.chartAxis }}
									tickLine={false}
								/>
								<Tooltip
									labelFormatter={(label) => label}
									formatter={(value: number, name: string) => [
										value.toLocaleString(),
										name,
									]}
									contentStyle={{
										backgroundColor: tooltipConfig.backgroundColor,
										border: tooltipConfig.border,
										borderRadius: tooltipConfig.borderRadius ?? 8,
										color: tooltipConfig.bodyColor,
										padding: tooltipConfig.padding,
									}}
									labelStyle={{
										color: tooltipConfig.titleColor,
										fontWeight: 600,
									}}
									cursor={{ fill: alpha(colors.accent, 0.08) }}
								/>
								<Bar
									dataKey="Website"
									fill={colors.corporate}
									radius={[2, 2, 0, 0]}
									animationDuration={800}
								/>
								<Bar
									dataKey="Manual"
									fill={colors.personal}
									radius={[2, 2, 0, 0]}
									animationDuration={800}
								/>
							</BarChart>
						</ResponsiveContainer>
					)}
				</Box>

				{!loading && summary && (
					<Typography
						variant="caption"
						sx={{ mt: 1, display: 'block' }}
						color="text.secondary"
					>
						{`Website avg ${avgWebsite} trees/request · Manual avg ${avgManual} trees/request`}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default RequestSourceChart;
