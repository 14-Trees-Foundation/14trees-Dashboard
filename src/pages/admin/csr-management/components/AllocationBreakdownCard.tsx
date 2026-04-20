import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
	analyticsCardSx,
} from '../../shared/adminTheme';

interface Props {
	noOfTrees: number;
	treesAssigned: number;
	plantationTrees: number;
	giftCardTrees: number;
	visitTrees: number;
	isDark?: boolean;
}

const AllocationBreakdownCard: React.FC<Props> = ({
	noOfTrees,
	treesAssigned,
	plantationTrees,
	giftCardTrees,
	visitTrees,
	isDark = true,
}) => {
	const colors = isDark ? ANALYTICS_COLORS : LIGHT_ANALYTICS_COLORS;
	const pct = noOfTrees > 0 ? Math.round((treesAssigned / noOfTrees) * 100) : 0;

	const rows = [
		{
			label: 'Plantation',
			value: plantationTrees,
			color: colors.chartColors[0],
		},
		{ label: 'Gift Cards', value: giftCardTrees, color: colors.chartColors[1] },
		{ label: 'Visits', value: visitTrees, color: colors.chartColors[2] },
	];

	return (
		<Box
			sx={{
				...(isDark
					? analyticsCardSx
					: { backgroundColor: '#ffffff', border: '1px solid #eeebe4' }),
				borderRadius: 2,
				p: 2.5,
			}}
		>
			<Typography
				variant="subtitle2"
				sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8ebe9' : '#1a1a1a' }}
			>
				Commitment vs Allocation
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
				<Typography
					variant="caption"
					sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
				>
					Committed: {noOfTrees.toLocaleString()} trees
				</Typography>
				<Typography
					variant="caption"
					sx={{
						fontWeight: 700,
						color: pct === 100 ? '#22c55e' : colors.warning,
					}}
				>
					{pct}%
				</Typography>
			</Box>

			<LinearProgress
				variant="determinate"
				value={Math.min(pct, 100)}
				sx={{
					mb: 2,
					height: 6,
					borderRadius: 3,
					backgroundColor: isDark ? '#2a3832' : '#f0ede6',
					'& .MuiLinearProgress-bar': {
						backgroundColor: pct === 100 ? '#22c55e' : colors.accent,
						borderRadius: 3,
					},
				}}
			/>

			{rows.map((row) => (
				<Box
					key={row.label}
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						py: 0.5,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								backgroundColor: row.color,
							}}
						/>
						<Typography
							variant="caption"
							sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							{row.label}
						</Typography>
					</Box>
					<Typography
						variant="caption"
						sx={{ fontWeight: 600, color: isDark ? '#e8ebe9' : '#1a1a1a' }}
					>
						{row.value.toLocaleString()}
					</Typography>
				</Box>
			))}

			{noOfTrees - treesAssigned > 0 && (
				<Box
					sx={{
						mt: 1.5,
						pt: 1.5,
						borderTop: `1px solid ${isDark ? '#2a3832' : '#eeebe4'}`,
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant="caption" sx={{ color: colors.warning }}>
						Remaining
					</Typography>
					<Typography
						variant="caption"
						sx={{ fontWeight: 700, color: colors.warning }}
					>
						{(noOfTrees - treesAssigned).toLocaleString()}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default AllocationBreakdownCard;
