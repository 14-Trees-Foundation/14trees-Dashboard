import React, { useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	Skeleton,
	IconButton,
} from '@mui/material';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Cell,
	LineChart,
	Line,
} from 'recharts';
import { GiftCardOccasionMonthlyEntry } from '../../../../types/analytics';
import { alpha, lighten } from '@mui/material/styles';
import {
	ANALYTICS_COLORS,
	CHART_TOOLTIP,
	LIGHT_ANALYTICS_COLORS,
	LIGHT_CHART_TOOLTIP,
} from '../../analytics/analyticsTheme';

interface GiftOccasionBreakdownProps {
	data?: {
		occasions: Record<string, number>;
		monthly_by_occasion: Record<string, GiftCardOccasionMonthlyEntry[]>;
	};
	loading: boolean;
	type: 'all' | 'corporate' | 'personal';
	onTypeChange: (type: 'all' | 'corporate' | 'personal') => void;
	themeMode?: 'dark' | 'light';
}

// Event type mapping from database values to display names
const EVENT_TYPE_MAP: Record<string, string> = {
	'1': 'Birthday',
	'2': 'Memorial',
	'3': 'General gift',
	'4': 'Wedding',
	'5': 'Anniversary',
	'6': 'Festival Celebration',
	'7': 'Retirement',
	undefined: 'Not Specified',
	'Not Specified': 'Not Specified',
};

// Helper function to get event type display name
const getEventTypeName = (eventType: string): string => {
	return EVENT_TYPE_MAP[eventType] || eventType;
};

const GiftOccasionBreakdown: React.FC<GiftOccasionBreakdownProps> = ({
	data,
	loading,
	type,
	onTypeChange,
	themeMode = 'dark',
}) => {
	const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
	const colors =
		themeMode === 'light' ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const tooltipConfig =
		themeMode === 'light' ? LIGHT_CHART_TOOLTIP : CHART_TOOLTIP;
	const occasionPalette = useMemo(
		() => [
			colors.corporate,
			colors.personal,
			colors.warning,
			colors.treeBrown,
			lighten(colors.corporate, 0.15),
			lighten(colors.personal, 0.2),
			lighten(colors.warning, 0.12),
			lighten(colors.treeBrown, 0.18),
			alpha(colors.corporate, 0.85),
			alpha(colors.personal, 0.85),
		],
		[colors],
	);

	// Transform data for bar chart - showing totals by occasion
	const chartData = useMemo(() => {
		if (!data || !data.occasions) return [];

		return Object.entries(data.occasions).map(([eventType, count], index) => ({
			occasion: getEventTypeName(eventType),
			rawEventType: eventType,
			value: count,
			color: occasionPalette[index % occasionPalette.length],
		}));
	}, [data, occasionPalette]);

	const selectedOccasionEntry = useMemo(
		() => chartData.find((entry) => entry.rawEventType === selectedOccasion),
		[chartData, selectedOccasion],
	);

	const selectedMonthlyData = useMemo(() => {
		if (!selectedOccasion || !data?.monthly_by_occasion) {
			return [];
		}
		return data.monthly_by_occasion[selectedOccasion] ?? [];
	}, [data, selectedOccasion]);

	const hasSelectedMonthlyData = selectedMonthlyData.some(
		(entry) => entry.count > 0,
	);

	if (loading) {
		return (
			<Card sx={{ height: '100%' }}>
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

	if (!data || !data.occasions || Object.keys(data.occasions).length === 0) {
		return (
			<Card sx={{ height: '100%' }}>
				<CardContent>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							letterSpacing: '-0.01em',
							color: 'text.primary',
						}}
						gutterBottom
					>
						By Occasion Type
					</Typography>
					<Box sx={{ textAlign: 'center', py: 8 }}>
						<Typography color="text.secondary">
							No occasion data available
						</Typography>
					</Box>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card sx={{ height: '100%' }}>
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
						By Occasion Type
					</Typography>
					<ToggleButtonGroup
						value={type}
						exclusive
						onChange={(e, value) => value && onTypeChange(value)}
						size="small"
						aria-label="occasion type"
					>
						<ToggleButton value="all" aria-label="all types">
							All
						</ToggleButton>
						<ToggleButton value="corporate" aria-label="corporate types">
							Corporate
						</ToggleButton>
						<ToggleButton value="personal" aria-label="personal types">
							Personal
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>

				<ResponsiveContainer width="100%" height={350}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
						layout="horizontal"
					>
						<CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
						<XAxis
							dataKey="occasion"
							angle={-45}
							textAnchor="end"
							height={100}
							interval={0}
							tick={{ fontSize: 11, fill: colors.textMuted }}
							axisLine={{ stroke: colors.chartAxis }}
							tickLine={false}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: colors.textMuted }}
							axisLine={{ stroke: colors.chartAxis }}
							tickLine={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipConfig.backgroundColor,
								border: tooltipConfig.border,
								borderRadius: tooltipConfig.borderRadius ?? 8,
								color: tooltipConfig.bodyColor,
								padding: tooltipConfig.padding,
							}}
							formatter={(value: number) => [
								value.toLocaleString(),
								'Requests',
							]}
							labelStyle={{ color: tooltipConfig.titleColor, fontWeight: 600 }}
							cursor={{ fill: alpha(colors.accent, 0.08) }}
						/>
						<Bar dataKey="value" name="Requests" radius={[8, 8, 0, 0]}>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				<Box
					sx={{
						mt: 3,
						display: 'grid',
						gap: 1.5,
						gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
					}}
				>
					{chartData.map((occasion) => {
						const isSelected = selectedOccasion === occasion.rawEventType;
						return (
							<Box
								key={occasion.rawEventType}
								onClick={() =>
									setSelectedOccasion((current) =>
										current === occasion.rawEventType
											? null
											: occasion.rawEventType,
									)
								}
								sx={{
									p: 1.5,
									borderRadius: '8px',
									cursor: 'pointer',
									border: '1px solid',
									borderColor: alpha(colors.accent, 0.25),
									backgroundColor: alpha(colors.textOnDark, 0.04),
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: alpha(colors.accent, 0.12),
										borderColor: alpha(colors.accent, 0.5),
									},
									...(isSelected && {
										backgroundColor: alpha(colors.accent, 0.16),
										border: `2px solid ${colors.accent}`,
									}),
								}}
							>
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ color: colors.accent }}
								>
									{occasion.occasion}
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: alpha(colors.textOnDark, 0.7) }}
								>
									{occasion.value.toLocaleString()} requests
								</Typography>
							</Box>
						);
					})}
				</Box>

				{selectedOccasion && (
					<Box
						sx={{
							mt: 2,
							background: alpha(
								colors.accentDark,
								themeMode === 'light' ? 0.08 : 0.85,
							),
							border: `1px solid ${alpha(colors.accent, 0.25)}`,
							borderRadius: '8px',
							p: 2,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 1.5,
							}}
						>
							<Typography
								variant="body2"
								fontWeight={500}
								sx={{ color: colors.textOnDark }}
							>
								{`${
									selectedOccasionEntry?.occasion ??
									getEventTypeName(selectedOccasion)
								} — month by month`}
							</Typography>
							<IconButton
								size="small"
								onClick={() => setSelectedOccasion(null)}
								sx={{ color: colors.textMuted }}
							>
								<Typography component="span" sx={{ fontSize: '1.1rem' }}>
									×
								</Typography>
							</IconButton>
						</Box>

						{hasSelectedMonthlyData ? (
							<ResponsiveContainer width="100%" height={180}>
								<LineChart data={selectedMonthlyData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={colors.chartGrid}
									/>
									<XAxis
										dataKey="month_name"
										tick={{ fontSize: 12, fill: colors.textMuted }}
										axisLine={{ stroke: colors.chartAxis }}
										tickLine={false}
									/>
									<YAxis
										tick={{ fontSize: 12, fill: colors.textMuted }}
										axisLine={{ stroke: colors.chartAxis }}
										tickLine={false}
									/>
									<Tooltip
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
										cursor={{
											stroke: alpha(colors.accent, 0.4),
											strokeWidth: 1,
										}}
									/>
									<Line
										type="monotone"
										dataKey="count"
										stroke={colors.accent}
										strokeWidth={2.5}
										dot={{ r: 3 }}
										animationDuration={800}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<Typography sx={{ color: colors.textMuted }}>
								No monthly data available
							</Typography>
						)}
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default GiftOccasionBreakdown;
