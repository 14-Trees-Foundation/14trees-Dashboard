import React from 'react';
import { GoogleMap, LoadScript, KmlLayer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
};

interface KmlLayerProps {
    url: string;
}

const MapWithKmlLayer: React.FC<KmlLayerProps> = ({ url }) => {
    const googleMapsApiKey = process.env.REACT_APP_API_MAP_KEY ?? '';
    const center = { lat: 51.5074, lng: -0.1278 };

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                mapTypeId='satellite'
            >
                {/* KML Layer */}
                <KmlLayer url={url} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapWithKmlLayer;
