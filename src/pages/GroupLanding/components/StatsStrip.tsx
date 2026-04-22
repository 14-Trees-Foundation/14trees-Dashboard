import { Box, Typography } from '@mui/material';
import { Park, Spa, TrendingUp } from '@mui/icons-material';
import {
	GroupLandingStats,
	GroupLandingGroup,
	GroupLandingGiftCard,
} from '../../../types/GroupLanding';

type Props = {
	group: GroupLandingGroup;
	stats: GroupLandingStats;
	giftCards: GroupLandingGiftCard[];
};

const STATS = [
	{
		icon: Park,
		label: 'Trees Planted',
		getValue: (
			_g: GroupLandingGroup,
			s: GroupLandingStats,
			_gc: GroupLandingGiftCard[],
		) => `${s.trees_sponsored.toLocaleString('en-IN')}+`,
	},
	{
		icon: Spa,
		label: 'Acres restored',
		getValue: (
			g: GroupLandingGroup,
			_s: GroupLandingStats,
			_gc: GroupLandingGiftCard[],
		) => (g.acres_of_land != null ? `${g.acres_of_land} Acres` : '—'),
	},
	{
		icon: Spa,
		label: 'Total events',
		getValue: (
			_g: GroupLandingGroup,
			s: GroupLandingStats,
			_gc: GroupLandingGiftCard[],
		) => String(s.event_count),
	},
	{
		icon: TrendingUp,
		label: 'No of Gift Cards',
		getValue: (
			_g: GroupLandingGroup,
			_s: GroupLandingStats,
			giftCards: GroupLandingGiftCard[],
		) =>
			String(
				giftCards.reduce(
					(sum, giftCard) => sum + (giftCard.no_of_cards ?? 0),
					0,
				),
			),
	},
	{
		icon: TrendingUp,
		label: 'Years of partnership',
		getValue: (
			g: GroupLandingGroup,
			_s: GroupLandingStats,
			_gc: GroupLandingGiftCard[],
		) =>
			g.years_of_partnership != null ? String(g.years_of_partnership) : '—',
	},
];

const StatsStrip: React.FC<Props> = ({ group, stats, giftCards }) => {
	return (
		<Box
			sx={{
				bgcolor: '#dfe4e0',
				pt: { xs: 3, md: 4 },
				pb: { xs: 2, md: 1 },
				px: { xs: 2, md: 2 },
			}}
		>
			<Box
				sx={{
					pt: { xs: 1.5, md: 3 },
					width: {
						xs: 'calc(100% - 16px)',
						sm: 'calc(100% - 24px)',
						md: '100%',
					},
					maxWidth: { xs: '600px', md: '1208.666748046875px' },
					mx: 'auto',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: { xs: 2.5, md: 4.5 },
				}}
			>
				<Box sx={{ textAlign: 'center', maxWidth: { xs: 360, md: 'none' } }}>
					<Typography
						sx={{
							fontFamily:
								'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
							fontWeight: 500,
							fontSize: { xs: '22px', sm: '26px', md: '24px' },
							lineHeight: { xs: '32px', sm: '34px', md: '32px' },
							color: '#1f3625',
							mb: { xs: 1.5, md: 1 },
							whiteSpace: 'normal',
						}}
					>
						Thank you for your partnership in restoring our ecosystems!
					</Typography>
					<Typography
						sx={{
							fontFamily:
								'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
							fontWeight: 400,
							fontSize: { xs: '16px', sm: '18px', md: '16px' },
							lineHeight: { xs: '28px', sm: '30px', md: '26px' },
							color: '#1f3625',
							whiteSpace: 'normal',
						}}
					>
						Your support helps us plant native trees, conserve biodiversity, and
						build a greener future for generations to come.
					</Typography>
				</Box>

				<Box
					sx={{
						// width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 24px)', md: '100%' },
						maxWidth: { xs: '600px', md: '1208.666748046875px' },
						mx: 'auto',
						display: 'grid',
						gridTemplateColumns: {
							xs: 'repeat(2, minmax(0, 1fr))',
							md: 'repeat(5, minmax(0, 1fr))',
						},
						bgcolor: '#fff',
						borderRadius: { xs: '18px', md: '20px' },
						border: '0.67px solid #e0e0e0',
						boxShadow: '0px 4px 17px 0px #1F36251A',
						px: { xs: 2.5, md: 2 },
						py: { xs: 2.25, md: 2 },
						columnGap: { xs: 1.5, md: 0.5 },
						rowGap: { xs: 1.75, md: 0.5 },
					}}
				>
					{STATS.map(({ icon: Icon, label, getValue }, index) => (
						<Box
							key={label}
							sx={{
								display: 'flex',
								alignItems: 'center',
								minWidth: 0,
								gridColumn: {
									xs: index === STATS.length - 1 ? '1 / span 1' : 'auto',
									md: 'auto',
								},
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1.4,
									px: { xs: 0.25, md: 1 },
									py: 0.25,
									minWidth: 0,
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: { xs: 48, md: 40 },
										height: { xs: 48, md: 40 },
										borderRadius: '999px',
										bgcolor: '#eff2ee',
										border: '1px solid #e2e6e2',
										flexShrink: 0,
									}}
								>
									<Icon
										sx={{ fontSize: { xs: 23, md: 30 }, color: '#2f4a38' }}
									/>
								</Box>
								<Box sx={{ textAlign: 'left', minWidth: 0 }}>
									<Typography
										sx={{
											fontFamily:
												'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
											fontWeight: 400,
											fontSize: { xs: '15px', md: '16px' },
											lineHeight: { xs: '24px', md: '24px' },
											color: '#6a746d',
											whiteSpace: { xs: 'normal', md: 'nowrap' },
										}}
									>
										{label}
									</Typography>
									<Typography
										sx={{
											fontFamily:
												'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
											fontWeight: 500,
											fontSize: { xs: '18px', md: '20px' },
											lineHeight: { xs: '28px', md: '32px' },
											color: '#1f3625',
											whiteSpace: 'nowrap',
										}}
									>
										{getValue(group, stats, giftCards)}
									</Typography>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default StatsStrip;
