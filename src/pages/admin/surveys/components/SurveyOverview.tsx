import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	CircularProgress,
	Alert,
} from '@mui/material';
import {
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';
import { useResponseStats } from '../hooks/useSurveyResponses';

const CHART_COLORS = ['#9bc53d', '#4caf6e', '#7eb3f5', '#f0a050', '#e57373'];

interface KpiCardProps {
	icon: React.ReactNode;
	iconBg: string;
	label: string;
	value: string | number;
	isDark: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
	icon,
	iconBg,
	label,
	value,
	isDark,
}) => (
	<Card
		elevation={0}
		sx={{
			bgcolor: isDark ? '#1a2820' : '#ffffff',
			border: isDark ? '1px solid #2a3832' : '1px solid #dde1e7',
			borderRadius: 2,
		}}
	>
		<CardContent>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: 1,
						bgcolor: iconBg,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
					}}
				>
					{icon}
				</Box>
				<Box>
					<Typography
						sx={{ fontSize: '0.85rem', color: isDark ? '#9ba39d' : '#6b7280' }}
					>
						{label}
					</Typography>
					<Typography
						sx={{
							fontSize: '1.8rem',
							fontWeight: 700,
							color: isDark ? '#e8eaf0' : '#1a1a2e',
							lineHeight: 1.2,
						}}
					>
						{value}
					</Typography>
				</Box>
			</Box>
		</CardContent>
	</Card>
);

const SurveyOverview: React.FC = () => {
	const theme = useTheme();
	const { stats, loading, error } = useResponseStats();
	const isDark = theme.palette.mode === 'dark';

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
				<CircularProgress sx={{ color: '#9bc53d' }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ px: 3 }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	if (!stats) return null;

	const pieData = stats.responsesBySurvey.slice(0, 5).map((item) => ({
		name: item._id,
		value: item.count,
	}));

	const tooltipStyle = {
		backgroundColor: isDark ? '#1a2820' : '#ffffff',
		border: `1px solid ${isDark ? '#2a3832' : '#dde1e7'}`,
		borderRadius: 4,
		fontSize: '0.85rem',
		color: isDark ? '#e8eaf0' : '#1a1a2e',
	};

	const axisStyle = { fontSize: '0.72rem' };
	const axisColor = isDark ? '#9ba39d' : '#6b7280';
	const gridColor = isDark ? '#2a3832' : '#e5e7eb';

	return (
		<Box sx={{ px: 3 }}>
			{/* KPI Cards */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard
						isDark={isDark}
						iconBg="rgba(155, 197, 61, 0.12)"
						icon={<TrendingUpIcon sx={{ color: '#9bc53d', fontSize: 26 }} />}
						label="Total Responses"
						value={stats.totalResponses.toLocaleString()}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard
						isDark={isDark}
						iconBg="rgba(76, 175, 110, 0.12)"
						icon={<DescriptionIcon sx={{ color: '#4caf6e', fontSize: 26 }} />}
						label="Total Forms"
						value={stats.totalForms}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard
						isDark={isDark}
						iconBg="rgba(126, 179, 245, 0.12)"
						icon={<CheckCircleIcon sx={{ color: '#7eb3f5', fontSize: 26 }} />}
						label="Active Forms"
						value={stats.activeForms}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard
						isDark={isDark}
						iconBg="rgba(240, 160, 80, 0.12)"
						icon={<AccessTimeIcon sx={{ color: '#f0a050', fontSize: 26 }} />}
						label="Last 7 Days"
						value={stats.recentResponses}
					/>
				</Grid>
			</Grid>

			{/* Charts row */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				{/* Time Series */}
				<Grid item xs={12} lg={8}>
					<Card
						elevation={0}
						sx={{
							bgcolor: isDark ? '#1a2820' : '#ffffff',
							border: isDark ? '1px solid #2a3832' : '1px solid #dde1e7',
							borderRadius: 2,
						}}
					>
						<CardContent>
							<Typography
								sx={{
									fontSize: '0.95rem',
									fontWeight: 600,
									mb: 2.5,
									color: isDark ? '#e8eaf0' : '#1a1a2e',
								}}
							>
								Response Trend (Last 30 Days)
							</Typography>
							{stats.timeSeries.length > 0 ? (
								<ResponsiveContainer width="100%" height={280}>
									<LineChart
										data={stats.timeSeries}
										margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
									>
										<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
										<XAxis
											dataKey="date"
											stroke={axisColor}
											tick={{ ...axisStyle, fill: axisColor }}
											tickFormatter={(v) => v.slice(5)} // show MM-DD only
										/>
										<YAxis
											stroke={axisColor}
											tick={{ ...axisStyle, fill: axisColor }}
											allowDecimals={false}
										/>
										<Tooltip contentStyle={tooltipStyle} />
										<Line
											type="monotone"
											dataKey="count"
											stroke="#9bc53d"
											strokeWidth={2}
											dot={{ fill: '#9bc53d', r: 3 }}
											activeDot={{ r: 5 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							) : (
								<Box
									sx={{
										height: 280,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: isDark ? '#6b7a6e' : '#9ca3af',
									}}
								>
									<Typography sx={{ fontSize: '0.9rem' }}>
										No data in the last 30 days
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				{/* Pie chart */}
				<Grid item xs={12} lg={4}>
					<Card
						elevation={0}
						sx={{
							bgcolor: isDark ? '#1a2820' : '#ffffff',
							border: isDark ? '1px solid #2a3832' : '1px solid #dde1e7',
							borderRadius: 2,
							height: '100%',
						}}
					>
						<CardContent>
							<Typography
								sx={{
									fontSize: '0.95rem',
									fontWeight: 600,
									mb: 2.5,
									color: isDark ? '#e8eaf0' : '#1a1a2e',
								}}
							>
								Forms by Usage (Top 5)
							</Typography>
							{pieData.length > 0 ? (
								<ResponsiveContainer width="100%" height={280}>
									<PieChart>
										<Pie
											data={pieData}
											cx="50%"
											cy="45%"
											outerRadius={90}
											dataKey="value"
											label={({ name, value }) => `${name}: ${value}`}
											labelLine={false}
										>
											{pieData.map((_, index) => (
												<Cell
													key={`cell-${index}`}
													fill={CHART_COLORS[index % CHART_COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip contentStyle={tooltipStyle} />
									</PieChart>
								</ResponsiveContainer>
							) : (
								<Box
									sx={{
										height: 280,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: isDark ? '#6b7a6e' : '#9ca3af',
									}}
								>
									<Typography sx={{ fontSize: '0.9rem' }}>
										No data available
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Top Contributors */}
			<Card
				elevation={0}
				sx={{
					bgcolor: isDark ? '#1a2820' : '#ffffff',
					border: isDark ? '1px solid #2a3832' : '1px solid #dde1e7',
					borderRadius: 2,
				}}
			>
				<CardContent>
					<Typography
						sx={{
							fontSize: '0.95rem',
							fontWeight: 600,
							mb: 2,
							color: isDark ? '#e8eaf0' : '#1a1a2e',
						}}
					>
						Top Contributors
					</Typography>

					{stats.responsesByUser.length === 0 ? (
						<Typography
							sx={{
								fontSize: '0.875rem',
								color: isDark ? '#6b7a6e' : '#9ca3af',
							}}
						>
							No data available
						</Typography>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							{stats.responsesByUser.slice(0, 10).map((user, index) => (
								<Box
									key={user._id || index}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										p: 1.5,
										bgcolor: isDark ? '#0d1017' : '#f9fafb',
										borderRadius: 1,
										border: isDark ? '1px solid #2a3832' : '1px solid #e5e7eb',
									}}
								>
									<Box
										sx={{
											width: 30,
											height: 30,
											borderRadius: '50%',
											bgcolor: CHART_COLORS[index % CHART_COLORS.length],
											color: '#fff',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 700,
											fontSize: '0.78rem',
											flexShrink: 0,
										}}
									>
										{index + 1}
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											sx={{
												fontSize: '0.875rem',
												fontWeight: 500,
												color: isDark ? '#e8eaf0' : '#1a1a2e',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											{user._id || 'Anonymous'}
										</Typography>
										<Typography
											sx={{
												fontSize: '0.72rem',
												color: isDark ? '#6b7a6e' : '#9ca3af',
											}}
										>
											Last submitted:{' '}
											{new Date(user.lastSubmitted).toLocaleDateString()}
										</Typography>
									</Box>
									<Typography
										sx={{
											fontSize: '1.15rem',
											fontWeight: 700,
											color: CHART_COLORS[index % CHART_COLORS.length],
											flexShrink: 0,
										}}
									>
										{user.count}
									</Typography>
								</Box>
							))}
						</Box>
					)}
				</CardContent>
			</Card>
		</Box>
	);
};

export default SurveyOverview;
