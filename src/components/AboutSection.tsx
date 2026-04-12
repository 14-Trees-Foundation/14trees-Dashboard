import { Box, Typography, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import logo from '../assets/dark_logo.png';

const PLACEHOLDER_IMAGE =
	'https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory6.jpg';

type Props = {
	image?: string | null;
	description?: string | null;
};

const AboutSection: React.FC<Props> = ({ image, description }) => {
	const photo = image || PLACEHOLDER_IMAGE;

	return (
		<Box
			sx={{
				bgcolor: '#f7faf8',
				px: { xs: 2, md: 5 },
				py: { xs: 6, md: 8 },
				'&, & *': {
					fontFamily: '"Instrument Sans", "HelveticaNowDisplay", sans-serif',
				},
			}}
		>
			<Box
				sx={{
					maxWidth: '1200px',
					mx: 'auto',
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
					gap: { xs: 4, md: 6 },
					alignItems: 'center',
				}}
			>
				{/* Left: photo */}
				<Box
					component="img"
					src={photo}
					alt="14 Trees"
					sx={{
						width: '100%',
						height: { xs: 280, md: 460 },
						objectFit: 'cover',
						borderRadius: '20px',
						display: 'block',
					}}
				/>

				{/* Right: content */}
				<Box>
					{/* Logo row */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 3,
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<Box
								sx={{
									width: 44,
									height: 44,
									overflow: 'hidden',
									flexShrink: 0,
								}}
							>
								<Box
									component="img"
									src={logo}
									alt="14 Trees"
									sx={{ height: 58, display: 'block' }}
								/>
							</Box>
							<Box>
								<Typography
									sx={{
										fontSize: 15,
										fontWeight: 600,
										color: '#1e3a28',
										lineHeight: 1.2,
									}}
								>
									14 Trees
								</Typography>
								<Typography
									sx={{ fontSize: 13, color: '#4a7058', lineHeight: 1.2 }}
								>
									Foundation
								</Typography>
							</Box>
						</Box>

						<Link
							href="https://www.14trees.org"
							target="_blank"
							rel="noopener noreferrer"
							underline="none"
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
								bgcolor: '#1f3625',
								color: '#fff',
								fontSize: 14,
								fontWeight: 500,
								px: 2,
								py: 1.25,
								borderRadius: '10px',
								flexShrink: 0,
								'&:hover': { bgcolor: '#2a4a32' },
							}}
						>
							Explore 14 Trees
							<OpenInNewIcon sx={{ fontSize: 15 }} />
						</Link>
					</Box>

					{/* Heading */}
					<Typography
						sx={{
							fontSize: { xs: 24, md: 30 },
							fontWeight: 600,
							color: '#1e3a28',
							mb: 2,
						}}
					>
						A little bit about us
					</Typography>

					{/* Body */}
					<Typography
						sx={{
							fontSize: { xs: 15, md: 16 },
							lineHeight: 1.8,
							color: '#2e4a38',
						}}
					>
						{description ||
							'14 Trees Foundation is a non-profit organisation that believes in a holistic effort for reforestation. We work on three parallels– native ecological revival, employing local people and increasing money flow to rural areas, and bridging the gap between urban dwellers and forests.'}
					</Typography>

					<Typography
						sx={{
							mt: 2,
							fontSize: { xs: 15, md: 16 },
							lineHeight: 1.8,
							color: '#2e4a38',
						}}
					>
						We believe that a forest can only stand the test of time if these
						three pillars are aligned.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default AboutSection;
