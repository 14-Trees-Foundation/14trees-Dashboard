import { Box, Typography, Grid, Link } from '@mui/material';
import logo from '../../../assets/logo_white_small.png';

const QUICK_LINKS = [
	{
		label: 'Activity reports',
		href: 'https://www.14trees.org/activity-reports',
	},
	{ label: 'Blogs', href: 'https://www.14trees.org/blogs' },
	{ label: 'Team', href: 'https://www.14trees.org/teams' },
	{ label: 'Volunteer', href: 'https://14trees.org/volunteer' },
];

const LEGAL_LINKS = [
	{ label: '80G Certificate', href: 'https://14trees.org/80g' },
	{ label: 'Contact', href: 'https://14trees.org/contact' },
	{ label: 'Privacy policy', href: 'https://14trees.org/policies' },
];

const CorpFooter: React.FC = () => {
	const year = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				bgcolor: '#2f4a38',
				color: '#fff',
				py: 8,
				px: { xs: 2, sm: 4, md: 8 },
			}}
		>
			<Box
				sx={{
					maxWidth: '840px',
					mx: 'auto',
				}}
			>
				<Grid container spacing={{ xs: 4, md: 6 }}>
					{/* Logo */}
					<Grid item xs={12} sm={3} md={2}>
						<Box
							component="img"
							src={logo}
							alt="14 Trees Foundation"
							sx={{ height: 60 }}
						/>
					</Grid>

					{/* Quick links */}
					<Grid item xs={6} sm={3} md={3}>
						<Typography
							sx={{
								fontSize: '18px',
								fontWeight: 500,
								color: '#fff',
								mb: 2,
								fontFamily: '"Instrument Sans", sans-serif',
							}}
						>
							Quick links
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
							{QUICK_LINKS.map(({ label, href }) => (
								<Link
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									underline="none"
									sx={{
										color: '#bcc4ba',
										fontSize: '14px',
										fontWeight: 500,
										'&:hover': { color: '#fff' },
										transition: 'color 0.2s',
									}}
								>
									{label}
								</Link>
							))}
						</Box>
					</Grid>

					{/* Legal links */}
					<Grid item xs={6} sm={3} md={3}>
						<Typography
							sx={{
								fontSize: '18px',
								fontWeight: 500,
								color: '#fff',
								mb: 2,
								fontFamily: '"Instrument Sans", sans-serif',
							}}
						>
							Legal
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
							{LEGAL_LINKS.map(({ label, href }) => (
								<Link
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									underline="none"
									sx={{
										color: '#bcc4ba',
										fontSize: '14px',
										fontWeight: 400,
										'&:hover': { color: '#fff' },
										transition: 'color 0.2s',
									}}
								>
									{label}
								</Link>
							))}
						</Box>
					</Grid>

					{/* Copyright */}
					<Grid
						item
						xs={12}
						sm={3}
						md={4}
						sx={{ textAlign: { xs: 'left', md: 'right' } }}
					>
						<Typography
							sx={{
								fontSize: '14px',
								color: '#bcc4ba',
								lineHeight: 1.6,
							}}
						>
							© {year} 14 Trees Foundation
							<br />
							All rights reserved
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default CorpFooter;
