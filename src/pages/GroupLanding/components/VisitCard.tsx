import { Box, Typography, Chip } from '@mui/material';
import { GroupLandingEvent } from '../../../types/GroupLanding';

type Props = {
	event: GroupLandingEvent;
	onClick: (event: GroupLandingEvent) => void;
};

const VisitCard: React.FC<Props> = ({ event, onClick }) => {
	const coverImage =
		event.landing_image_s3_path ?? event.event_images[0] ?? null;

	const handleClick = () => {
		if (event.link) {
			window.open(`/events/${event.link}`, '_blank', 'noopener,noreferrer');
		} else {
			onClick(event);
		}
	};

	const formattedDate = event.event_date
		? new Date(event.event_date).toLocaleDateString('en-IN', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
		  })
		: '';

	return (
		<Box
			onClick={handleClick}
			sx={{
				width: '100%',
				maxWidth: { xs: '100%', md: 372 },
				mx: 'auto',
				borderRadius: '14px',
				overflow: 'hidden',
				bgcolor: '#fff',
				border: '1px solid #dfe4df',
				boxShadow: '0px 4px 17px 0px #1F36251A',
				cursor: 'pointer',
				transition: 'box-shadow 0.2s, transform 0.2s',
				'&:hover': {
					boxShadow: '0 10px 26px rgba(31,54,37,0.18)',
					transform: 'translateY(-2px)',
				},
			}}
		>
			{/* Cover image */}
			<Box
				sx={{
					height: { xs: 200, md: 250 },
					bgcolor: '#e8f0e9',
					overflow: 'hidden',
				}}
			>
				{coverImage ? (
					<Box
						component="img"
						src={coverImage}
						alt={event.name}
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				) : (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							component="img"
							src="/dark_logo.png"
							alt="placeholder"
							sx={{ width: 48, opacity: 0.25 }}
						/>
					</Box>
				)}
			</Box>

			{/* Card body */}
			<Box
				sx={{
					p: 2.25,
					minHeight: 108,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
			>
				<Typography
					sx={{
						fontFamily: '"Instrument Sans", "HelveticaNowDisplay", sans-serif',
						color: '#1f3625',
						fontWeight: 500,
						fontSize: '16px',
						lineHeight: '24px',
						mb: 0.25,
						overflow: 'hidden',
						display: '-webkit-box',
						WebkitLineClamp: 1,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{event.name}
				</Typography>

				<Typography
					sx={{
						fontFamily: '"Instrument Sans", "HelveticaNowDisplay", sans-serif',
						fontSize: '15px',
						lineHeight: '22px',
						color: '#8a938d',
						display: 'block',
						mb: 1.5,
						minHeight: 22,
						visibility: event.site_name ? 'visible' : 'hidden',
					}}
				>
					{event.site_name ?? 'placeholder'}
				</Typography>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						flexWrap: 'wrap',
					}}
				>
					<Chip
						label={
							event.name.toLowerCase().includes('visit')
								? 'Site visit'
								: event.name.toLowerCase().includes('gift')
								? 'Gifts'
								: 'Event'
						}
						size="small"
						sx={{
							bgcolor: '#dbe4d6',
							color: '#38513f',
							fontWeight: 500,
							fontSize: '11px',
							height: 26,
							borderRadius: '6px',
							'& .MuiChip-label': { px: 1.25 },
						}}
					/>
					{formattedDate && (
						<Chip
							label={formattedDate}
							size="small"
							sx={{
								bgcolor: '#dbe4d6',
								color: '#38513f',
								fontWeight: 500,
								fontSize: '11px',
								height: 26,
								borderRadius: '6px',
								'& .MuiChip-label': { px: 1.25 },
							}}
						/>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default VisitCard;
