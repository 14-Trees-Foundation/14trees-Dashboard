import { Box, Typography, Link } from '@mui/material';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import { EventLandingEvent } from '../../../types/EventLanding';
import logo from '../../../assets/dark_logo.png';

type Props = {
	event: EventLandingEvent;
	fallbackImage?: string | null;
	isBirthday?: boolean;
};

const EventHero: React.FC<Props> = ({
	event,
	fallbackImage,
	isBirthday = false,
}) => {
	const heroImage =
		event.landing_image_s3_path || event.event_poster || fallbackImage || null;

	const eventDate = new Date(event.event_date);
	const day = eventDate.getDate();
	const ordinal =
		day % 10 === 1 && day !== 11
			? 'st'
			: day % 10 === 2 && day !== 12
			? 'nd'
			: day % 10 === 3 && day !== 13
			? 'rd'
			: 'th';
	const monthYear = eventDate.toLocaleDateString('en-IN', {
		month: 'long',
		year: 'numeric',
	});
	const formattedDate = `${monthYear.split(' ')[0]} ${day}${ordinal}, ${
		monthYear.split(' ')[1]
	}`;

	return (
		<Box sx={{ bgcolor: '#fff' }}>
			{!isBirthday && (
				<Box
					sx={{
						px: { xs: 2, md: 4 },
						height: 72,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderBottom: '1px solid #eef1ee',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1.5,
							minWidth: 0,
						}}
					>
						{/* Crop box: show only the tree icon portion of the portrait wordmark */}
						<Box
							sx={{ width: 35, height: 48, overflow: 'hidden', flexShrink: 0 }}
						>
							<Box
								component="img"
								src={logo}
								alt="14 Trees"
								sx={{ height: 48, display: 'block' }}
							/>
						</Box>
						{event.group_logo_url && (
							<>
								<Box
									sx={{
										width: '1px',
										height: 28,
										bgcolor: '#d0d9d0',
										flexShrink: 0,
									}}
								/>
								<Box
									component="img"
									src={event.group_logo_url}
									alt={event.group_name ?? 'Group'}
									sx={{
										height: 28,
										maxWidth: 120,
										objectFit: 'contain',
										flexShrink: 0,
									}}
								/>
							</>
						)}
						<Typography
							sx={{
								fontSize: 16,
								fontWeight: 500,
								color: '#1f3625',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{event.name}
						</Typography>
					</Box>
					<Link
						href="https://www.14trees.org"
						target="_blank"
						rel="noopener noreferrer"
						underline="none"
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.75,
							bgcolor: '#1f3a28',
							color: '#8fc45a',
							fontSize: { xs: 15, md: 17 },
							fontWeight: 600,
							px: { xs: 2, md: 2.5 },
							py: { xs: 1.25, md: 1.5 },
							borderRadius: '14px',
							flexShrink: 0,
							letterSpacing: 0.1,
						}}
					>
						<SpaOutlinedIcon sx={{ fontSize: 20, color: '#8fc45a' }} />
						Plant a tree
					</Link>
				</Box>
			)}

			{/* {event.group_name_key && (
                <Box
                    sx={{
                        px: { xs: 2, md: 4 },
                        py: 1,
                        borderBottom: '1px solid #eef1ee',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                    }}
                >
                    <Typography
                        component="span"
                        sx={{ color: '#4a7c59', fontSize: 13, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => window.history.back()}
                    >
                        ‹ Go back
                    </Typography>
                    <Typography component="span" sx={{ color: '#b0bdb0', fontSize: 13 }}>|</Typography>
                    <Typography component="span" sx={{ color: '#678262', fontSize: 13 }}>
                        {event.group_name ?? 'Group dashboard'}
                    </Typography>
                    <Typography component="span" sx={{ color: '#b0bdb0', fontSize: 13 }}>›</Typography>
                    <Typography component="span" sx={{ color: '#678262', fontSize: 13 }}>
                        {event.name}
                    </Typography>
                </Box>
            )} */}

			<Box
				sx={{
					position: 'relative',
					width: '100%',
					height: isBirthday
						? '100dvh'
						: { xs: 'calc(100dvh - 60px)', md: 'calc(100dvh - 60px)' },
					minHeight: { xs: 420, md: 540 },
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				{heroImage ? (
					<Box
						component="img"
						src={heroImage}
						alt={event.name}
						sx={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : (
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							bgcolor: '#1f452d',
						}}
					/>
				)}

				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(0deg, #1F3625 8.21%, rgba(31, 54, 37, 0) 68.61%)',
					}}
				/>

				<Box
					sx={{
						position: 'relative',
						width: '100%',
						px: { xs: 3, md: 8 },
						pb: { xs: 5, md: 8 },
						color: '#fff',
						textAlign: 'center',
					}}
				>
					<Typography
						sx={{
							fontWeight: 500,
							fontSize: { xs: '36px', md: '42px' },
							lineHeight: 1.2,
							mb: 1.5,
						}}
					>
						{event.name}
					</Typography>
					{isBirthday ? (
						<>
							<Typography
								sx={{
									fontSize: { xs: 16, md: 18 },
									color: 'rgba(255,255,255,0.82)',
									mb: 2.5,
									letterSpacing: 0.3,
								}}
							>
								Thank You For Your Contribution To Nature Restoration
							</Typography>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 1,
									border: '1px solid rgba(255,255,255,0.4)',
									borderRadius: '20px',
									px: 2.5,
									py: 0.75,
									cursor: 'pointer',
									'&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
								}}
								onClick={() => {
									const el = document.getElementById('event-trees-section');
									if (el) el.scrollIntoView({ behavior: 'smooth' });
								}}
							>
								<Typography
									sx={{
										fontSize: 13,
										color: 'rgba(255,255,255,0.85)',
										letterSpacing: 1.5,
										textTransform: 'uppercase',
									}}
								>
									Scroll to explore
								</Typography>
								<Typography
									sx={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }}
								>
									∨
								</Typography>
							</Box>
						</>
					) : (
						<Box
							sx={{
								display: 'flex',
								gap: 1.5,
								flexWrap: 'wrap',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'rgba(255,255,255,0.92)',
							}}
						>
							{event.site_name && (
								<Typography sx={{ fontSize: 28 }}>{event.site_name}</Typography>
							)}
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor: '#9cc06f',
								}}
							/>
							<Typography sx={{ fontSize: 28 }}>{formattedDate}</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default EventHero;
