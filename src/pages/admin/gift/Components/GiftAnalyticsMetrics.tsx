import React from 'react';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface MetricCardProps {
	title: string;
	value: number;
	note?: string;
	decimals?: number;
	delta?: number | null;
	invertDelta?: boolean;
	indicator: {
		width: string;
		color: string;
	};
	isHero?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	note,
	decimals = 0,
	delta,
	invertDelta = false,
	indicator,
	isHero = false,
}) => {
	const formattedValue = Number.isFinite(value)
		? decimals > 0
			? value.toFixed(decimals)
			: Math.round(value).toLocaleString()
		: '0';

	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const heroCardStyles = isHero
		? {
				background: '#0f1912',
				border: 'none',
				boxShadow: '0 4px 20px rgba(15,25,18,0.4)',
		  }
		: {};

	const hoverBg = isHero
		? isDark
			? '#172218'
			: '#f0f4f0'
		: isDark
		? '#223830'
		: '#f5f7f5';

	return (
		<Card
			sx={{
				height: '100%',
				...heroCardStyles,
				transition:
					'transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease',
				'&:hover': {
					transform: 'scale(1.025)',
					background: hoverBg,
				},
			}}
		>
			<CardContent sx={{ p: '18px 20px !important' }}>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.68rem',
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
						mb: '8px',
						fontWeight: 500,
						color: isHero
							? 'rgba(255,255,255,0.6)'
							: theme.palette.text.secondary,
					}}
				>
					{title}
				</Typography>
				<Typography
					component="div"
					sx={{
						fontSize: '2.4rem',
						fontWeight: 700,
						letterSpacing: '-0.02em',
						lineHeight: 1.2,
						color: isHero ? '#ffffff' : theme.palette.text.primary,
					}}
				>
					{formattedValue}
				</Typography>
				{delta !== null && delta !== undefined && (
					<Typography
						component="span"
						sx={{
							display: 'inline-block',
							fontSize: '0.7rem',
							fontWeight: 500,
							mt: '4px',
							px: '6px',
							py: '1px',
							borderRadius: '4px',
							color:
								delta === 0
									? isHero
										? 'rgba(255,255,255,0.5)'
										: theme.palette.text.disabled
									: delta > 0 !== invertDelta
									? '#2e7d32'
									: '#c62828',
							backgroundColor:
								delta === 0
									? 'transparent'
									: delta > 0 !== invertDelta
									? 'rgba(46,125,50,0.12)'
									: 'rgba(198,40,40,0.10)',
						}}
					>
						{delta === 0 ? '–' : delta > 0 !== invertDelta ? '▲' : '▼'}{' '}
						{delta !== 0
							? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% vs last month`
							: '0% vs last month'}
					</Typography>
				)}
				{note && (
					<Typography
						sx={{
							fontSize: '0.7rem',
							mt: '3px',
						}}
						color={isHero ? 'rgba(255,255,255,0.5)' : 'text.secondary'}
					>
						{note}
					</Typography>
				)}
				<Box
					sx={{
						height: '2px',
						borderRadius: '1px',
						mt: '14px',
						backgroundColor: isHero
							? 'rgba(255,255,255,0.25)'
							: theme.palette.action.hover,
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
	themeMode?: 'light' | 'dark';
}

const GiftAnalyticsMetrics: React.FC<GiftAnalyticsMetricsProps> = ({
	data,
	loading,
	themeMode,
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
	const isLight =
		themeMode === 'light' || (!themeMode && theme.palette.mode === 'light');

	const cards: MetricCardProps[] = [
		{
			title: 'Total Requests',
			value: data.total_requests,
			note: 'All gift card requests',
			delta: data.total_requests_delta,
			indicator: {
				width: '100%',
				color: isLight ? 'rgba(139,195,74,0.6)' : theme.palette.divider,
			},
			isHero: isLight,
		},
		{
			title: 'Total Trees',
			value: data.total_trees,
			note: 'Trees gifted',
			delta: data.total_trees_delta,
			indicator: { width: '85%', color: theme.palette.divider },
		},
		{
			title: 'Fulfilled Requests',
			value: data.fulfilled_count,
			note: 'Completed cards',
			delta: data.fulfilled_delta,
			indicator: { width: '91%', color: theme.palette.success.main },
		},
		{
			title: 'Pending Requests',
			value: data.pending_count,
			note: 'Awaiting fulfillment',
			delta: data.pending_delta,
			invertDelta: true,
			indicator: { width: '9%', color: theme.palette.warning.main },
		},
		{
			title: 'Corporate Requests',
			value: data.corporate_count,
			note: `${requestCorporatePercentage.toFixed(1)}% of total`,
			delta: data.corporate_delta,
			indicator: { width: '41%', color: theme.palette.primary.main },
		},
		{
			title: 'Personal Requests',
			value: data.personal_count,
			note: `${requestPersonalPercentage.toFixed(1)}% of total`,
			delta: data.personal_delta,
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
