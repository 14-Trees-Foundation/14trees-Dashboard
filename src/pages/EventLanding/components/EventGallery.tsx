import { useState } from 'react';
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
};

const EventGallery: React.FC<Props> = ({ images, description }) => {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	if (images.length === 0) return null;

	const openLightbox = (i: number) => setLightboxIndex(i);
	const closeLightbox = () => setLightboxIndex(null);
	const prev = () =>
		setLightboxIndex((i) =>
			i === null ? 0 : (i - 1 + images.length) % images.length,
		);
	const next = () =>
		setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));

	const prevMain = () =>
		setActiveIndex((i) => (i - 1 + images.length) % images.length);
	const nextMain = () => setActiveIndex((i) => (i + 1) % images.length);

	return (
		<Box
			sx={{
				px: { xs: 2, md: 5 },
				pb: { xs: 6, md: 8 },
				pt: { xs: 4, md: 7 },
				minHeight: { md: '80vh' },
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				bgcolor: '#1f3625',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: '1320px',
					mx: 'auto',
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
					gap: { xs: 3, md: 4 },
					alignItems: 'start',
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
							sx={{
								width: '100%',
								height: { xs: 360, md: 600 },
								objectFit: 'cover',
								display: 'block',
								cursor: 'pointer',
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
							{images.slice(0, 4).map((_, idx) => (
								<Box
									key={idx}
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										bgcolor:
											idx === activeIndex
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

				<Box sx={{ color: '#fff', pt: { xs: 0, md: 0 } }}>
					<Typography
						sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 500, mb: 1.5 }}
					>
						About the event
					</Typography>
					<Typography
						sx={{
							fontSize: { xs: 15, md: 17 },
							lineHeight: 1.75,
							color: 'rgba(240,247,239,0.92)',
							whiteSpace: 'pre-line',
						}}
					>
						{description || 'More details for this event will be shared soon.'}
					</Typography>
				</Box>
			</Box>

			{/* Lightbox */}
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
							sx={{
								maxHeight: '90vh',
								maxWidth: '90vw',
								borderRadius: '8px',
								objectFit: 'contain',
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
