import React, { useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Skeleton,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from 'recharts';
import { GiftCardTreeDistribution } from '../../../../types/analytics';
import {
	ANALYTICS_COLORS,
	CHART_TOOLTIP,
	LIGHT_ANALYTICS_COLORS,
	LIGHT_CHART_TOOLTIP,
} from '../analyticsTheme';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
	arrayToCSV,
	downloadCSV,
	formatFilename,
} from '../../../../utils/csvExport';

interface TreeDistributionChartProps {
	data: GiftCardTreeDistribution | null;
	loading: boolean;
	themeMode?: 'dark' | 'light';
	year: number;
	filterContext?: string;
	typeFilter?: 'all' | 'corporate' | 'personal';
}

const TreeDistributionChart: React.FC<TreeDistributionChartProps> = ({
	data,
	loading,
	themeMode = 'dark',
	year,
	filterContext,
	typeFilter = 'all',
}) => {
	const [metric, setMetric] = useState<'trees' | 'requests'>('trees');
	const isLightMode = themeMode === 'light';
	const colors = isLightMode ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const tooltipConfig = isLightMode ? LIGHT_CHART_TOOLTIP : CHART_TOOLTIP;
	const titleColor = isLightMode ? '#1a1a1a' : 'text.primary';
	const subtitleColor = isLightMode ? '#6b7280' : 'text.secondary';
	const cardStyles = isLightMode
		? {
				background: '#fffef8',
				border: '1px solid #f0ede6',
				boxShadow: '0px 25px 45px rgba(33, 33, 23, 0.12)',
		  }
		: {};

	const chartData = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.buckets.map((bucket, index) => ({
			bucket,
			Corporate:
				metric === 'trees'
					? data.corporate_trees[index]
					: data.corporate[index],
			Personal:
				metric === 'trees' ? data.personal_trees[index] : data.personal[index],
		}));
	}, [data, metric]);

	const corporateRequests = data
		? data.corporate.reduce((sum, value) => sum + value, 0)
		: 0;
	const personalRequests = data
		? data.personal.reduce((sum, value) => sum + value, 0)
		: 0;
	const corporateTrees = data
		? data.corporate_trees.reduce((sum, value) => sum + value, 0)
		: 0;
	const personalTrees = data
		? data.personal_trees.reduce((sum, value) => sum + value, 0)
		: 0;
	const corporateAverage =
		corporateRequests > 0
			? (corporateTrees / corporateRequests).toFixed(1)
			: '0.0';
	const personalAverage =
		personalRequests > 0
			? (personalTrees / personalRequests).toFixed(1)
			: '0.0';

	const yearLabel = year === 0 ? 'All time' : `${year}`;
	const contextLabel = filterContext || yearLabel;

	const handleExport = () => {
		if (!data) {
			return;
		}
		const headers = [
			'Bucket',
			'Corporate Requests',
			'Personal Requests',
			'Total Requests',
			'Corporate Trees',
			'Personal Trees',
			'Total Trees',
		];
		const rows = data.buckets.map((bucket, index) => {
			const corporateRequests = data.corporate[index] ?? 0;
			const personalRequests = data.personal[index] ?? 0;
			const corporateTreesBucket = data.corporate_trees[index] ?? 0;
			const personalTreesBucket = data.personal_trees[index] ?? 0;
			return [
				bucket,
				corporateRequests,
				personalRequests,
				corporateRequests + personalRequests,
				corporateTreesBucket,
				personalTreesBucket,
				corporateTreesBucket + personalTreesBucket,
			];
		});
		const filename = formatFilename('tree_distribution', {
			year,
			type: typeFilter,
		});
		downloadCSV(arrayToCSV(headers, rows), filename);
	};

	return (
		<Card sx={cardStyles}>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						mb: 2,
						gap: 2,
						flexWrap: 'wrap',
					}}
				>
					<Box>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								letterSpacing: '-0.01em',
								color: titleColor,
							}}
						>
							Trees per request
						</Typography>
						<Typography variant="body2" sx={{ color: subtitleColor }}>
							How many trees are in each request
						</Typography>
						<Typography variant="body2" sx={{ color: subtitleColor }}>
							{contextLabel}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<ToggleButtonGroup
							size="small"
							value={metric}
							exclusive
							onChange={(_, value) => value && setMetric(value)}
						>
							<ToggleButton value="trees">Trees</ToggleButton>
							<ToggleButton value="requests">Requests</ToggleButton>
						</ToggleButtonGroup>
						<IconButton
							aria-label="export tree distribution"
							size="small"
							onClick={handleExport}
							disabled={!data}
						>
							<FileDownloadOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>

				{loading ? (
					<Skeleton
						variant="rectangular"
						height={280}
						sx={{ borderRadius: 2 }}
					/>
				) : (
					<ResponsiveContainer width="100%" height={280}>
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
							<XAxis
								dataKey="bucket"
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
								cursor={{ fill: alpha(colors.accent, 0.08) }}
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
								formatter={(value: number, name: string) => [
									value.toLocaleString(),
									name,
								]}
							/>
							<Bar
								dataKey="Corporate"
								fill={colors.corporate}
								animationDuration={800}
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="Personal"
								fill={colors.personal}
								animationDuration={800}
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}

				{!loading && data && (
					<>
						<Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										bgcolor: colors.corporate,
									}}
								/>
								<Typography variant="body2" sx={{ color: subtitleColor }}>
									Corporate
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										bgcolor: colors.personal,
									}}
								/>
								<Typography variant="body2" sx={{ color: subtitleColor }}>
									Personal
								</Typography>
							</Box>
						</Box>

						<Typography variant="body2" sx={{ mt: 2, color: subtitleColor }}>
							{`Corporate avg: ${corporateAverage} trees/request · Personal avg: ${personalAverage} trees/request`}
						</Typography>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default TreeDistributionChart;
