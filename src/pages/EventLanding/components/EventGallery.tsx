import { useMemo, useState } from 'react';
import {
	Box,
	Typography,
	IconButton,
	Dialog,
	DialogContent,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';
import { EventLandingImage } from '../../../types/EventLanding';

type Props = {
	images: EventLandingImage[];
	description?: string | null;
	isBirthday?: boolean;
};

// Deterministic angle per image index so angles are stable across renders
const seededAngle = (idx: number): number => {
	const seed = Math.sin(idx * 127.1 + 311.7) * 43758.5453;
	const frac = seed - Math.floor(seed);
	return Math.round(frac * 30 - 20);
};

const EventGallery: React.FC<Props> = ({
	images,
	description,
	isBirthday = false,
}) => {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

	const angles = useMemo(
		() => (isBirthday ? images.map((_, i) => seededAngle(i)) : []),
		[isBirthday, images.length],
	);

	if (images.length === 0) return null;

	const openLightbox = (index: number) => setLightboxIndex(index);
	const closeLightbox = () => setLightboxIndex(null);

	const prev = () =>
		setLightboxIndex((index) =>
			index === null ? 0 : (index - 1 + images.length) % images.length,
		);

	const next = () =>
		setLightboxIndex((index) =>
			index === null ? 0 : (index + 1) % images.length,
		);

	const prevMain = () =>
		setActiveIndex((index) => (index - 1 + images.length) % images.length);

	const nextMain = () => setActiveIndex((index) => (index + 1) % images.length);

	const onSwipeStart = (clientX: number) => {
		setTouchStartX(clientX);
		setTouchCurrentX(clientX);
	};

	const onSwipeMove = (clientX: number) => {
		if (touchStartX === null) return;
		setTouchCurrentX(clientX);
	};

	const onMainSwipeEnd = () => {
		if (touchStartX === null || touchCurrentX === null) return;

		const delta = touchStartX - touchCurrentX;
		if (Math.abs(delta) > 40) {
			if (delta > 0) nextMain();
			else prevMain();
		}

		setTouchStartX(null);
		setTouchCurrentX(null);
	};

	const onLightboxSwipeEnd = () => {
		if (touchStartX === null || touchCurrentX === null) return;

		const delta = touchStartX - touchCurrentX;
		if (Math.abs(delta) > 40) {
			if (delta > 0) next();
			else prev();
		}

		setTouchStartX(null);
		setTouchCurrentX(null);
	};

	return (
		<Box
			id="event-gallery-section"
			sx={{
				px: { xs: 2, md: 5 },
				pb: { xs: 6, md: 8 },
				pt: { xs: 4, md: 7 },
				minHeight: { md: '80vh' },
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				bgcolor: isBirthday ? '#5D2E1A' : '#1f3625',
				alignItems: 'center',
				width: '100%',
				mx: 'auto',
			}}
		>
			{isBirthday ? (
				<Box
					sx={{
						maxWidth: '1100px',
						mx: 'auto',
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
						gap: { xs: 4, md: 6 },
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
							py: { xs: 2, md: 4 },
						}}
					>
						<Box
							sx={{
								width: '100%',
								maxWidth: { xs: 340, md: 440 },
								borderRadius: '28px',
								overflow: 'hidden',
								px: { xs: 1, md: 2 },
								py: { xs: 2, md: 3 },
							}}
						>
							<Box
								sx={{
									position: 'relative',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									minHeight: { xs: 340, md: 470 },
									p: '32px 48px',
								}}
								onTouchStart={(e) => onSwipeStart(e.touches[0].clientX)}
								onTouchMove={(e) => onSwipeMove(e.touches[0].clientX)}
								onTouchEnd={onMainSwipeEnd}
							>
								{[2, 1].map((offset) => {
									const imageIndex = (activeIndex + offset) % images.length;
									if (images.length <= offset) return null;

									const angle = angles[(activeIndex + offset) % angles.length];

									return (
										<Box
											key={`back-${offset}`}
											sx={{
												position: 'absolute',
												bgcolor: '#fff',
												p: '10px 10px 40px',
												transform: `rotate(${angle}deg)`,
												boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
												maxWidth: { xs: 220, md: 300 },
											}}
										>
											<Box
												component="img"
												src={images[imageIndex].image_url}
												alt=""
												sx={{
													width: '100%',
													height: 'auto',
													display: 'block',
												}}
											/>
										</Box>
									);
								})}

								<Box
									sx={{
										position: 'relative',
										bgcolor: '#fff',
										p: '12px 12px 48px',
										transform: `rotate(${angles[activeIndex]}deg)`,
										boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
										maxWidth: { xs: 240, md: 320 },
										cursor: 'pointer',
										transition: 'transform 0.25s',
										'&:hover': {
											transform: `rotate(${
												angles[activeIndex] * 0.5
											}deg) scale(1.03)`,
										},
									}}
									onClick={() => openLightbox(activeIndex)}
								>
									<Box
										component="img"
										src={images[activeIndex].image_url}
										alt={`Photo ${activeIndex + 1}`}
										sx={{ width: '100%', height: 'auto', display: 'block' }}
									/>
								</Box>
							</Box>
						</Box>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
								color: 'rgba(255,255,255,0.8)',
							}}
						>
							<Typography
								onClick={prevMain}
								sx={{
									fontSize: 15,
									cursor: 'pointer',
									'&:hover': { color: '#fff' },
								}}
							>
								Previous
							</Typography>
							<Box sx={{ display: 'flex', gap: 0.75 }}>
								{images.slice(0, 4).map((_, index) => (
									<Box
										key={index}
										onClick={() => setActiveIndex(index)}
										sx={{
											width: index === activeIndex ? 10 : 8,
											height: index === activeIndex ? 10 : 8,
											borderRadius: '50%',
											bgcolor:
												index === activeIndex
													? '#fff'
													: 'rgba(255,255,255,0.35)',
											cursor: 'pointer',
											transition: 'all 0.2s',
										}}
									/>
								))}
							</Box>
							<Typography
								onClick={nextMain}
								sx={{
									fontSize: 15,
									cursor: 'pointer',
									'&:hover': { color: '#fff' },
								}}
							>
								Next
							</Typography>
						</Box>
					</Box>

					<Box sx={{ color: '#fff', pl: { xs: 0, md: 2 } }}>
						<Typography
							sx={{
								fontSize: { xs: 22, md: 26 },
								fontWeight: 500,
								mb: 2,
								color: '#f5c84a',
							}}
						>
							About the celebration
						</Typography>
						<Typography
							sx={{
								fontSize: { xs: 14, md: 16 },
								lineHeight: 1.7,
								color: 'rgba(240,247,239,0.92)',
								whiteSpace: 'pre-line',
							}}
						>
							{description ||
								'More details for this event will be shared soon.'}
						</Typography>
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						maxWidth: '1320px',
						mx: 'auto',
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
						gap: { xs: 3, md: 4 },
						alignItems: 'start',
						m: 1,
					}}
				>
					<Box>
						<Box
							sx={{
								borderRadius: '24px',
								overflow: 'hidden',
								bgcolor: '#0f2f1c',
								boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
							}}
						>
							<Box
								component="img"
								src={images[activeIndex].image_url}
								alt={`Photo ${activeIndex + 1}`}
								onClick={() => openLightbox(activeIndex)}
								onTouchStart={(e) => onSwipeStart(e.touches[0].clientX)}
								onTouchMove={(e) => onSwipeMove(e.touches[0].clientX)}
								onTouchEnd={onMainSwipeEnd}
								sx={{
									width: '100%',
									height: { xs: 360, md: 600 },
									objectFit: 'cover',
									display: 'block',
									cursor: 'pointer',
									touchAction: 'pan-y',
								}}
							/>
						</Box>

						<Box
							sx={{
								mt: 2,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 1.5,
								color: '#d8e6d5',
							}}
						>
							<Typography
								onClick={prevMain}
								sx={{ fontSize: 14, cursor: 'pointer' }}
							>
								Previous
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
								{images.slice(0, 4).map((_, index) => (
									<Box
										key={index}
										sx={{
											width: 10,
											height: 10,
											borderRadius: '50%',
											bgcolor:
												index === activeIndex
													? '#ffffff'
													: 'rgba(255,255,255,0.35)',
										}}
									/>
								))}
							</Box>
							<Typography
								onClick={nextMain}
								sx={{ fontSize: 14, cursor: 'pointer' }}
							>
								Next
							</Typography>
						</Box>
					</Box>

					<Box
						sx={{ color: '#fff', pt: { xs: 0, md: 0 }, pl: { xs: 0, md: 3 } }}
					>
						<Typography
							sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 500, mb: 1.5 }}
						>
							About the event
						</Typography>
						<Typography
							sx={{
								fontSize: { xs: 14, md: 17 },
								lineHeight: 1.5,
								color: 'rgba(240,247,239,0.92)',
								whiteSpace: 'pre-line',
							}}
						>
							{description ||
								'More details for this event will be shared soon.'}
						</Typography>
					</Box>
				</Box>
			)}

			<Dialog
				open={lightboxIndex !== null}
				onClose={closeLightbox}
				maxWidth={false}
				PaperProps={{
					sx: {
						bgcolor: 'transparent',
						boxShadow: 'none',
						m: 1,
					},
				}}
			>
				<DialogContent
					sx={{
						p: 0,
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<IconButton
						onClick={closeLightbox}
						sx={{
							position: 'fixed',
							top: 16,
							right: 16,
							bgcolor: 'rgba(0,0,0,0.5)',
							color: '#fff',
							'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
						}}
					>
						<Close />
					</IconButton>

					<IconButton
						onClick={prev}
						sx={{
							position: 'fixed',
							left: { xs: 4, md: 24 },
							bgcolor: 'rgba(0,0,0,0.5)',
							color: '#fff',
							'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
						}}
					>
						<ArrowBackIos />
					</IconButton>

					{lightboxIndex !== null && (
						<Box
							component="img"
							src={images[lightboxIndex].image_url}
							alt={`Photo ${lightboxIndex + 1}`}
							onTouchStart={(e) => onSwipeStart(e.touches[0].clientX)}
							onTouchMove={(e) => onSwipeMove(e.touches[0].clientX)}
							onTouchEnd={onLightboxSwipeEnd}
							sx={{
								maxHeight: '90vh',
								maxWidth: '90vw',
								borderRadius: '8px',
								objectFit: 'contain',
								touchAction: 'pan-y',
							}}
						/>
					)}

					<IconButton
						onClick={next}
						sx={{
							position: 'fixed',
							right: { xs: 4, md: 24 },
							bgcolor: 'rgba(0,0,0,0.5)',
							color: '#fff',
							'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
						}}
					>
						<ArrowForwardIos />
					</IconButton>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default EventGallery;
