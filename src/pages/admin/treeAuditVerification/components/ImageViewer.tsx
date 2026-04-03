import React from 'react';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import { useTheme } from '@mui/material/styles';
import { TreeAuditPhoto } from '../types';

interface ImageViewerProps {
	photo?: TreeAuditPhoto | null;
	isFullscreen: boolean;
	onToggleFullscreen: () => void;
}

const getStatusColor = (status?: string | null) => {
	switch (status) {
		case 'verified':
			return 'success';
		case 'rejected':
			return 'error';
		default:
			return 'default';
	}
};

const getStatusLabel = (status?: string | null) => {
	if (status === 'verified') return 'Verified';
	if (status === 'rejected') return 'Rejected';
	return 'Pending';
};

const ImageViewer: React.FC<ImageViewerProps> = ({
	photo,
	isFullscreen,
	onToggleFullscreen,
}) => {
	const theme = useTheme();
	const containerSx = isFullscreen
		? ({
				position: 'fixed',
				inset: 0,
				zIndex: 1400,
				p: 3,
				bgcolor:
					theme.palette.mode === 'dark'
						? 'rgba(10,16,12,0.98)'
						: 'rgba(248,247,243,0.98)',
		  } as const)
		: ({ height: '100%' } as const);

	return (
		<Box sx={containerSx}>
			<Box
				sx={{
					position: 'relative',
					height: '100%',
					minHeight: 0,
					borderRadius: 3,
					border: `1px solid ${theme.palette.divider}`,
					bgcolor: theme.palette.mode === 'dark' ? '#0c140f' : '#ede9e1',
					overflow: 'hidden',
				}}
			>
				<Stack
					direction="row"
					spacing={1}
					sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}
				>
					<Chip
						size="small"
						label={getStatusLabel(photo?.verification_status)}
						color={getStatusColor(photo?.verification_status) as any}
					/>
				</Stack>

				<IconButton
					onClick={onToggleFullscreen}
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						zIndex: 2,
						bgcolor:
							theme.palette.mode === 'dark'
								? 'rgba(255,255,255,0.08)'
								: 'rgba(255,255,255,0.78)',
						border: `1px solid ${theme.palette.divider}`,
						'&:hover': {
							bgcolor:
								theme.palette.mode === 'dark'
									? 'rgba(255,255,255,0.14)'
									: 'rgba(255,255,255,0.95)',
						},
					}}
				>
					{isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
				</IconButton>

				{photo?.image ? (
					<Box
						component="img"
						src={photo.image}
						alt={`Snapshot ${photo.id}`}
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'contain',
							display: 'block',
						}}
					/>
				) : (
					<Stack
						alignItems="center"
						justifyContent="center"
						spacing={2}
						sx={{ height: '100%', color: 'text.secondary' }}
					>
						<BrokenImageOutlinedIcon sx={{ fontSize: 40 }} />
						<Typography variant="body2">Image unavailable</Typography>
					</Stack>
				)}
			</Box>
		</Box>
	);
};

export default ImageViewer;
