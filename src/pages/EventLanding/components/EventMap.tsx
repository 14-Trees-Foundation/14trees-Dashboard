import { Box, Typography } from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type Props = {
	location: { lat: number; lng: number };
	siteName: string | null;
};

const MAP_CONTAINER_STYLE = {
	width: '100%',
	height: '400px',
	borderRadius: '12px',
};

const EventMap: React.FC<Props> = ({ location, siteName }) => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_APP_API_MAP_KEY ?? '',
	});

	return (
		<Box sx={{ py: { xs: 5, md: 8 }, px: { xs: 3, md: 8 }, bgcolor: '#fff' }}>
			<Typography
				sx={{
					fontFamily: '"Instrument Sans", sans-serif',
					fontWeight: 700,
					fontSize: { xs: '22px', md: '32px' },
					color: '#1a2b1e',
					mb: 1,
				}}
			>
				Location
			</Typography>
			{siteName && (
				<Typography sx={{ color: '#6f7b73', fontSize: 15, mb: 3 }}>
					{siteName}
				</Typography>
			)}

			<Box
				sx={{ borderRadius: '12px', overflow: 'hidden', mt: siteName ? 0 : 3 }}
			>
				{isLoaded ? (
					<GoogleMap
						mapContainerStyle={MAP_CONTAINER_STYLE}
						center={location}
						zoom={14}
						options={{
							disableDefaultUI: false,
							mapTypeId: 'hybrid',
							zoomControl: true,
							streetViewControl: false,
							mapTypeControl: false,
							fullscreenControl: true,
						}}
					>
						<Marker position={location} />
					</GoogleMap>
				) : (
					<Box
						sx={{
							height: 400,
							bgcolor: '#e8ede8',
							borderRadius: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography color="text.secondary">Loading map…</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default EventMap;
