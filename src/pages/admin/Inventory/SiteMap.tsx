import React from 'react';
import { GoogleMap, LoadScript, KmlLayer, Polygon } from '@react-google-maps/api';
import { Plot } from '../../../types/plot';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const lightGreen = "#00ff00";
const lightRed = "#ff0000";
const lightOrange = "#ffa500";

const defaultPolygonOptions = {
    fillColor: lightGreen,
    fillOpacity: 0.1,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    visible: true,
    geodesic: false,
    zIndex: 1,
}

interface SitesMapProps {
    plots: Plot[]
}


const SitesMap: React.FC<SitesMapProps> = ({ plots }) => {
    const googleMapsApiKey = process.env.REACT_APP_API_MAP_KEY ?? '';

    const getPlotPolygon = (plot: Plot) => {
        const polygonPath = plot.boundaries?.coordinates[0]?.map(
            ([lat, lng]) => ({ lat, lng })
        );
        return polygonPath;
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={10}
                mapTypeId='satellite'
            >
                {plots.map((plot) => (
                    <Polygon key={plot.id} path={getPlotPolygon(plot)} options={defaultPolygonOptions} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default SitesMap;
