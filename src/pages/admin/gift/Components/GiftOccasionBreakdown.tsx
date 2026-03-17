import React, { useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
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
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
	arrayToCSV,
	downloadCSV,
	formatFilename,
} from '../../../../utils/csvExport';

interface GiftOccasionBreakdownProps {
	data?: {
		occasions: Record<string, number>;
		monthly_by_occasion: Record<string, GiftCardOccasionMonthlyEntry[]>;
	};
	loading: boolean;
	type: 'all' | 'corporate' | 'personal';
	themeMode?: 'dark' | 'light';
	filterContext?: string;
	onExport?: () => void;
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

const normalizeOccasionLabel = (occasion: string): string => {
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
	{ bg: string; border: string; pip: string }
> = {
	Birthday: { bg: '#fff7ed', border: '#fed7aa', pip: '#c2410c' },
	Memorial: { bg: '#f3f4f6', border: '#e5e7eb', pip: '#374151' },
	General: { bg: '#f5f3ee', border: '#eeebe4', pip: '#6b7280' },
	Festive: { bg: '#fff7ed', border: '#fed7aa', pip: '#d97706' },
	Wedding: { bg: '#fdf2f8', border: '#fbcfe8', pip: '#be185d' },
	Anniversary: { bg: '#f0fdf4', border: '#bbf7d0', pip: '#15803d' },
	Unassigned: { bg: '#f9fafb', border: '#f3f4f6', pip: '#9ca3af' },
};

const getOccasionColors = (occasion: string, isLight: boolean) => {
	if (!isLight) {
		return {
			bg: alpha(ANALYTICS_COLORS.accent, 0.08),
			border: alpha(ANALYTICS_COLORS.accent, 0.25),
			pip: ANALYTICS_COLORS.accent,
		};
	}
	const normalized = normalizeOccasionLabel(occasion);
	return (
		LIGHT_BADGE_MAP[normalized] ?? {
			bg: '#f5f3ee',
			border: '#eeebe4',
			pip: '#6b7280',
		}
	);
};

const GiftOccasionBreakdown: React.FC<GiftOccasionBreakdownProps> = ({
	data,
	loading,
	type,
	themeMode = 'dark',
	filterContext,
	onExport,
}) => {
	const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
	const isLightMode = themeMode === 'light';
	const colors =
		themeMode === 'light' ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const tooltipConfig =
		themeMode === 'light' ? LIGHT_CHART_TOOLTIP : CHART_TOOLTIP;
	const subtitleColor = isLightMode ? '#6b7280' : 'rgba(255,255,255,0.55)';
	const typeLabel =
		type !== 'all' ? type.charAt(0).toUpperCase() + type.slice(1) : null;
	const contextLabel = filterContext || typeLabel;
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
	const monthLabels = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const handleExport = () => {
		if (!data || !data.occasions) {
			return;
		}
		const headers = ['Occasion', 'Total Requests', ...monthLabels];
		const rows = Object.entries(data.occasions).map(([occasionKey, count]) => {
			const monthlyEntries = data.monthly_by_occasion?.[occasionKey] ?? [];
			const monthlyCounts = monthLabels.map((_, index) => {
				const entry = monthlyEntries.find((item) => item.month === index + 1);
				return entry?.count ?? 0;
			});
			return [getEventTypeName(occasionKey), count, ...monthlyCounts];
		});
		const filename = formatFilename('occasions', { type });
		const csv = arrayToCSV(headers, rows);
		downloadCSV(csv, filename);
		onExport?.();
	};

	if (loading) {
		return (
			<Card sx={{ alignSelf: 'flex-start' }}>
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
			<Card>
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
							sx={{
								fontWeight: 600,
								letterSpacing: '-0.01em',
								color: 'text.primary',
							}}
						>
							By Occasion Type
						</Typography>
						{contextLabel && (
							<Typography variant="body2" sx={{ color: subtitleColor }}>
								{contextLabel}
							</Typography>
						)}
					</Box>
					<IconButton
						size="small"
						aria-label="export occasions"
						onClick={handleExport}
						disabled={!data || !data.occasions}
					>
						<FileDownloadOutlinedIcon fontSize="small" />
					</IconButton>
				</Box>

				<ResponsiveContainer width="100%" height={260}>
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
						const badgeColors = getOccasionColors(
							occasion.occasion,
							isLightMode,
						);
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
									borderRadius: '12px',
									cursor: 'pointer',
									border: isLightMode
										? `1px solid ${badgeColors.border}`
										: '1px solid',
									borderColor: isLightMode
										? badgeColors.border
										: alpha(colors.accent, 0.25),
									backgroundColor: isLightMode
										? badgeColors.bg
										: alpha(colors.textOnDark, 0.04),
									transition: 'all 0.2s ease',
									'&:hover': isLightMode
										? {
												boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
										  }
										: {
												backgroundColor: alpha(colors.accent, 0.12),
												borderColor: alpha(colors.accent, 0.5),
										  },
									...(isSelected &&
										(isLightMode
											? {
													border: '2px solid #1c3a1c',
													boxShadow: '0 0 0 2px rgba(28,58,28,0.1)',
											  }
											: {
													backgroundColor: alpha(colors.accent, 0.16),
													border: `2px solid ${colors.accent}`,
											  })),
								}}
							>
								<Box
									sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
								>
									<Box
										sx={{
											width: 6,
											height: 6,
											borderRadius: '50%',
											backgroundColor: badgeColors.pip,
										}}
									/>
									<Typography
										variant="caption"
										sx={{
											fontWeight: 600,
											letterSpacing: '0.02em',
											color: isLightMode ? '#9ca3af' : colors.accent,
											textTransform: 'uppercase',
										}}
									>
										{occasion.occasion}
									</Typography>
								</Box>
								<Typography
									variant="body1"
									sx={{
										fontWeight: 600,
										color: isLightMode
											? '#1a1a1a'
											: alpha(colors.textOnDark, 0.85),
									}}
								>
									{occasion.value.toLocaleString()}
								</Typography>
								<Typography
									variant="caption"
									sx={{
										color: isLightMode
											? '#9ca3af'
											: alpha(colors.textOnDark, 0.7),
									}}
								>
									requests
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
