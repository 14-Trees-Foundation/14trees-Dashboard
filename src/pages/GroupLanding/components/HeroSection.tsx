import { Box, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { GroupLandingGroup } from '../../../types/GroupLanding';

type Props = {
	group: GroupLandingGroup;
};

const HeroSection: React.FC<Props> = ({ group }) => {
	const handleScrollDown = () => {
		window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				minHeight: { xs: '82vh', md: '100vh' },
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				bgcolor: '#0d2016',
				backgroundImage: group.hero_image_url
					? `url(${group.hero_image_url})`
					: undefined,
				backgroundSize: 'cover',
				backgroundPosition: 'center top',
				backgroundRepeat: 'no-repeat',
			}}
		>
			{group.hero_image_url && (
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(0deg, rgba(5, 8, 6, 0.8) 8.21%, rgba(31, 54, 37, 0) 68.61%)',
						zIndex: 1,
					}}
				/>
			)}

			{/* Dark overlay for readability when no hero image covers text areas */}
			{!group.hero_image_url && (
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						bgcolor: 'rgba(10, 30, 15, 0.55)',
						zIndex: 1,
					}}
				/>
			)}

			{/* Scroll to Explore cue at the bottom */}
			<Box
				onClick={handleScrollDown}
				sx={{
					position: 'absolute',
					bottom: { xs: 22, md: 32 },
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					cursor: 'pointer',
					gap: 0.5,
					opacity: 0.85,
					'&:hover': { opacity: 1 },
					animation: 'bounce 2s infinite',
					'@keyframes bounce': {
						'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
						'50%': { transform: 'translateX(-50%) translateY(6px)' },
					},
				}}
			>
				<Typography
					variant="body2"
					sx={{
						color: '#fff',
						letterSpacing: { xs: 2.4, md: 3 },
						textTransform: 'uppercase',
						fontSize: { xs: 11.5, md: 13 },
						fontWeight: 500,
						whiteSpace: 'nowrap',
					}}
				>
					Scroll to Explore
				</Typography>
				<KeyboardArrowDown sx={{ color: '#fff', fontSize: 28 }} />
			</Box>
		</Box>
	);
};

export default HeroSection;
