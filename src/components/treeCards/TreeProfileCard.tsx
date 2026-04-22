import { AccountCircle, Park } from '@mui/icons-material';
import { Box, Button, Divider, Typography } from '@mui/material';

type Props = {
	heading: string;
	title: string;
	primaryPlantName: string;
	englishTreeType?: string;
	localPlantName?: string;
	cardImage?: string | null;
	plantIllustration?: string | null;
	onView?: () => void;
	viewLabel?: string;
	titleMuted?: boolean;
	fallbackType?: 'person' | 'tree';
	imageAlt?: string;
};

const TreeProfileCard: React.FC<Props> = ({
	heading,
	title,
	primaryPlantName,
	englishTreeType,
	localPlantName,
	cardImage,
	plantIllustration,
	onView,
	viewLabel = 'View',
	titleMuted = false,
	fallbackType = 'person',
	imageAlt,
}) => {
	const trimmedIllustration = (plantIllustration ?? '').trim();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#fff',
				borderRadius: '18px',
				overflow: 'hidden',
				border: '1px solid #e5e9e5',
				minHeight: 430,
				'& .view-profile-btn': {
					opacity: { xs: 1, md: 0 },
					pointerEvents: { xs: 'auto', md: 'none' },
					transform: { xs: 'none', md: 'translateY(4px)' },
					transition: 'opacity 180ms ease, transform 180ms ease',
				},
				'&:hover .view-profile-btn': {
					opacity: 1,
					pointerEvents: 'auto',
					transform: 'translateY(0)',
				},
				'& .tree-illustration-overlay': {
					opacity: { xs: 1, md: 0 },
					transform: {
						xs: 'translateY(0)',
						md: 'translateY(8px) scale(0.98)',
					},
					transition: 'opacity 220ms ease, transform 220ms ease',
				},
				'&:hover .tree-illustration-overlay': {
					opacity: 1,
					transform: 'translateY(0) scale(1)',
				},
			}}
		>
			<Box
				sx={{
					width: '100%',
					height: { xs: 220, md: 250 },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					overflow: 'visible',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						bgcolor: '#ecefed',
						overflow: 'hidden',
					}}
				>
					{cardImage ? (
						<Box
							component="img"
							src={cardImage}
							alt={imageAlt ?? title}
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
							{fallbackType === 'tree' ? (
								<Park sx={{ fontSize: 168, color: '#c2c8c2' }} />
							) : (
								<AccountCircle sx={{ fontSize: 168, color: '#c2c8c2' }} />
							)}
						</Box>
					)}
				</Box>

				{trimmedIllustration && (
					<Box
						className="tree-illustration-overlay"
						sx={{
							position: 'absolute',
							left: { xs: -8, md: -16 },
							bottom: { xs: -16, md: -42 },
							width: { xs: 132, md: 200 },
							height: { xs: 132, md: 200 },
							borderRadius: 0,
							background: 'transparent',
							border: 'none',
							boxShadow: 'none',
							zIndex: 2,
							pointerEvents: 'none',
							transform: { xs: 'rotate(-4deg)', md: 'rotate(-8deg)' },
						}}
					>
						<Box
							component="img"
							src={trimmedIllustration}
							alt={`${primaryPlantName} illustration`}
							sx={{
								width: '100%',
								height: '100%',
								display: 'block',
								objectFit: 'contain',
							}}
						/>
					</Box>
				)}
			</Box>

			<Box
				sx={{
					p: 2.5,
					bgcolor: '#fff',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography
					sx={{
						fontSize: 12,
						color: '#7a857d',
						letterSpacing: 0.4,
						textTransform: 'uppercase',
						lineHeight: 1.2,
						mb: 0.75,
					}}
				>
					{heading}
				</Typography>
				<Typography
					sx={{
						fontSize: 18,
						fontWeight: 500,
						color: titleMuted ? '#9aaa9e' : '#294032',
						fontStyle: titleMuted ? 'italic' : 'normal',
						lineHeight: 1.35,
						mb: 2,
						overflow: 'hidden',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{title}
				</Typography>
				<Divider sx={{ backgroundColor: '#dde2dc', mb: 2 }} />
				<Box
					sx={{
						minHeight: 52,
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						gap: 1.5,
						mt: 'auto',
					}}
				>
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography
							sx={{
								fontSize: 16,
								fontWeight: 500,
								color: '#294032',
								lineHeight: 1.3,
							}}
						>
							{primaryPlantName}
						</Typography>
						{englishTreeType && (
							<Typography
								sx={{
									fontSize: 14,
									color: '#6f7b73',
									lineHeight: 1.2,
									mt: 0.4,
								}}
							>
								{englishTreeType}
							</Typography>
						)}
						{localPlantName && (
							<Typography
								sx={{
									fontSize: 14,
									color: '#6f7b73',
									lineHeight: 1.2,
									mt: 0.25,
								}}
							>
								({localPlantName})
							</Typography>
						)}
					</Box>
					{onView && (
						<Button
							className="view-profile-btn"
							onClick={onView}
							sx={{
								bgcolor: '#9bc53d',
								color: '#1f3625',
								textTransform: 'none',
								minWidth: 90,
								height: 40,
								borderRadius: '14px',
								fontSize: 16,
								fontWeight: 500,
								'&:hover': { bgcolor: '#88b332' },
								flexShrink: 0,
								alignSelf: 'center',
							}}
						>
							{viewLabel}
						</Button>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default TreeProfileCard;
