import React from 'react';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface MetricCardProps {
	title: string;
	value: number;
	note?: string;
	decimals?: number;
	indicator: {
		width: string;
		color: string;
	};
}

const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	note,
	decimals = 0,
	indicator,
}) => {
	const formattedValue = Number.isFinite(value)
		? decimals > 0
			? value.toFixed(decimals)
			: Math.round(value).toLocaleString()
		: '0';

	const theme = useTheme();

	return (
		<Card sx={{ height: '100%' }}>
			<CardContent sx={{ p: '18px 20px !important' }}>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.68rem',
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
						mb: '8px',
						fontWeight: 500,
						color: theme.palette.text.secondary,
					}}
				>
					{title}
				</Typography>
				<Typography
					component="div"
					sx={{
						fontSize: '1.5rem',
						fontWeight: 300,
						letterSpacing: '-0.02em',
						lineHeight: 1.2,
						color: theme.palette.text.primary,
					}}
				>
					{formattedValue}
				</Typography>
				{note && (
					<Typography
						sx={{
							fontSize: '0.7rem',
							mt: '3px',
						}}
						color="text.secondary"
					>
						{note}
					</Typography>
				)}
				<Box
					sx={{
						height: '2px',
						borderRadius: '1px',
						mt: '14px',
						backgroundColor: theme.palette.action.hover,
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							width: indicator.width,
							height: '100%',
							borderRadius: 'inherit',
							background: indicator.color,
							transition: 'width 0.3s ease',
						}}
					/>
				</Box>
			</CardContent>
		</Card>
	);
};

interface GiftAnalyticsMetricsProps {
	data?: {
		total_requests: number;
		corporate_count: number;
		personal_count: number;
		fulfilled_count: number;
		pending_count: number;
		total_trees: number;
		avg_trees_per_card: number;
	};
	loading: boolean;
}

const GiftAnalyticsMetrics: React.FC<GiftAnalyticsMetricsProps> = ({
	data,
	loading,
}) => {
	const gridSx = {
		display: 'grid',
		gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
		gap: '10px',
	} as const;

	if (loading) {
		return (
			<Box sx={gridSx}>
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Card key={i}>
						<CardContent sx={{ p: '18px 20px !important' }}>
							<Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
							<Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
							<Skeleton variant="rectangular" height={4} />
						</CardContent>
					</Card>
				))}
			</Box>
		);
	}

	if (!data) {
		return (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<Typography color="text.secondary">
					No analytics data available
				</Typography>
			</Box>
		);
	}

	const requestCorporatePercentage =
		data.total_requests > 0
			? (data.corporate_count / data.total_requests) * 100
			: 0;
	const requestPersonalPercentage =
		data.total_requests > 0
			? (data.personal_count / data.total_requests) * 100
			: 0;

	const theme = useTheme();

	const cards: MetricCardProps[] = [
		{
			title: 'Total Requests',
			value: data.total_requests,
			note: 'All gift card requests',
			indicator: { width: '100%', color: theme.palette.divider },
		},
		{
			title: 'Total Trees',
			value: data.total_trees,
			note: 'Trees gifted',
			indicator: { width: '85%', color: theme.palette.divider },
		},
		{
			title: 'Fulfilled Requests',
			value: data.fulfilled_count,
			note: 'Completed cards',
			indicator: { width: '91%', color: theme.palette.success.main },
		},
		{
			title: 'Pending Requests',
			value: data.pending_count,
			note: 'Awaiting fulfillment',
			indicator: { width: '9%', color: theme.palette.warning.main },
		},
		{
			title: 'Corporate Requests',
			value: data.corporate_count,
			note: `${requestCorporatePercentage.toFixed(1)}% of total`,
			indicator: { width: '41%', color: theme.palette.primary.main },
		},
		{
			title: 'Personal Requests',
			value: data.personal_count,
			note: `${requestPersonalPercentage.toFixed(1)}% of total`,
			indicator: { width: '59%', color: theme.palette.secondary.main },
		},
	];

	return (
		<Box sx={gridSx}>
			{cards.map((card) => (
				<MetricCard key={card.title} {...card} />
			))}
		</Box>
	);
};

export default GiftAnalyticsMetrics;
