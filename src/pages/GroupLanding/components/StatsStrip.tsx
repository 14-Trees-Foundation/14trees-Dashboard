import { Box, Divider, Typography } from '@mui/material';
import { Park, Spa, TrendingUp } from '@mui/icons-material';
import {
	GroupLandingStats,
	GroupLandingGroup,
} from '../../../types/GroupLanding';

type Props = {
	group: GroupLandingGroup;
	stats: GroupLandingStats;
};

const STATS = [
	{
		icon: Park,
		label: 'Trees Planted',
		getValue: (_g: GroupLandingGroup, s: GroupLandingStats) =>
			`${s.trees_sponsored.toLocaleString('en-IN')}+`,
	},
	{
		icon: Spa,
		label: 'Acres restored',
		getValue: (g: GroupLandingGroup) =>
			g.acres_of_land != null ? `${g.acres_of_land} Acres` : '—',
	},
	{
		icon: Spa,
		label: 'Total events',
		getValue: (_g: GroupLandingGroup, s: GroupLandingStats) =>
			String(s.event_count),
	},
	{
		icon: TrendingUp,
		label: 'Cards gifted',
		getValue: (_g: GroupLandingGroup, s: GroupLandingStats) =>
			String(s.gift_card_count ?? 0),
	},
	{
		icon: TrendingUp,
		label: 'Years of partnership',
		getValue: (g: GroupLandingGroup) =>
			g.years_of_partnership != null ? String(g.years_of_partnership) : '—',
	},
];

const StatsStrip: React.FC<Props> = ({ group, stats }) => {
	return (
		<Box
			sx={{
				bgcolor: '#f5f5f0',
				pt: 3,
				pb: 0,
				px: 2,
			}}
		>
			<Box
				sx={{
					pt: 4,
					width: '100%',
					maxWidth: '1208.666748046875px',
					mx: 'auto',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '40px',
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Typography
						sx={{
							fontFamily:
								'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
							fontWeight: 500,
							fontSize: '24px',
							lineHeight: '32px',
							color: '#1f3625',
							mb: 1,
							whiteSpace: { xs: 'normal', md: 'nowrap' },
						}}
					>
						Thank you for your partnership in restoring our ecosystems!
					</Typography>
					<Typography
						sx={{
							fontFamily:
								'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
							fontWeight: 400,
							fontSize: '16px',
							lineHeight: '26px',
							color: '#1f3625',
							whiteSpace: { xs: 'normal', md: 'nowrap' },
						}}
					>
						Your support helps us plant native trees, conserve biodiversity, and
						build a greener future for generations to come.
					</Typography>
				</Box>

				<Box
					sx={{
						width: '100%',
						maxWidth: '1208.666748046875px',
						minHeight: 109,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: { xs: 'wrap', md: 'nowrap' },
						bgcolor: '#fff',
						borderRadius: '20px',
						border: '0.67px solid #e0e0e0',
						boxShadow: '0px 4px 17px 0px #1F36251A',
						p: 2,
						columnGap: 1,
						rowGap: 1.5,
					}}
				>
					{STATS.map(({ icon: Icon, label, getValue }, index) => (
						<Box
							key={label}
							sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1.75,
									px: { xs: 0.5, md: 1.25 },
									py: 0.25,
									minWidth: { xs: '46%', md: 'auto' },
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 40,
										height: 40,
										borderRadius: '20px',
										bgcolor: '#eff2ee',
										border: '1px solid #e2e6e2',
										flexShrink: 0,
									}}
								>
									<Icon sx={{ fontSize: 30, color: '#2f4a38' }} />
								</Box>
								<Box sx={{ textAlign: 'left', minWidth: 0 }}>
									<Typography
										sx={{
											fontFamily:
												'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
											fontWeight: 400,
											fontSize: '16px',
											lineHeight: '24px',
											color: '#6a746d',
											whiteSpace: 'nowrap',
										}}
									>
										{label}
									</Typography>
									<Typography
										sx={{
											fontFamily:
												'"Instrument Sans", "HelveticaNowDisplay", sans-serif',
											fontWeight: 400,
											fontSize: '20px',
											lineHeight: '32px',
											color: '#1f3625',
											whiteSpace: 'nowrap',
										}}
									>
										{getValue(group, stats)}
									</Typography>
								</Box>
							</Box>

							{index < STATS.length - 1 && (
								<Divider
									orientation="vertical"
									flexItem
									sx={{
										display: { xs: 'none', md: 'block' },
										borderColor: '#d9ddd9',
										mx: { md: 1.5 },
										height: 64,
									}}
								/>
							)}
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default StatsStrip;
