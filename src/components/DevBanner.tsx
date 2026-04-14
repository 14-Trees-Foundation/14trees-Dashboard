import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** Height of the banner in pixels — consumed by the app layout offset. */
export const DEV_BANNER_HEIGHT = 28;

/**
 * Sticky top banner shown only in development mode.
 * Rendered at position:fixed so it sits above all other UI (sidebar, modals, etc.).
 * The app root adds a matching paddingTop so no content is hidden underneath.
 */
const DevBanner: React.FC = () => {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: `${DEV_BANNER_HEIGHT}px`,
				zIndex: 99999,
				backgroundColor: '#f59e0b',
				backgroundImage:
					'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 16px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 1,
			}}
		>
			<Box
				sx={{
					width: 6,
					height: 6,
					borderRadius: '50%',
					backgroundColor: '#92400e',
				}}
			/>
			<Typography
				sx={{
					fontSize: '0.7rem',
					fontWeight: 700,
					letterSpacing: '0.1em',
					textTransform: 'uppercase',
					color: '#92400e',
					fontFamily: 'Helvetica, Arial, sans-serif',
				}}
			>
				Development Mode — changes here are not reflected in production
			</Typography>
			<Box
				sx={{
					width: 6,
					height: 6,
					borderRadius: '50%',
					backgroundColor: '#92400e',
				}}
			/>
		</Box>
	);
};

export default DevBanner;
