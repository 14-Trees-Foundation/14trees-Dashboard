import React from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { Plot } from '../../../types/plot';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const lightGreen = "#00ff00";
const lightRed = "#ff0000";
const lightOrange = "#ffa500";
const lightBlue = "#0000ff";

const defaultPolygonOptions = {
    fillColor: lightBlue,
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

    const calculatePlotCenter = (plot: Plot) => {
        let latSum = 0, lngSum = 0;
        const path = getPlotPolygon(plot);
        path.forEach(point => {
            latSum += point.lat;
            lngSum += point.lng;
        });
        return {
            lat: latSum / path.length,
            lng: lngSum / path.length,
        };
    };

    const getPolygonOptions = (plot: Plot) => {
        switch (plot.accessibility_status) {
            case 'accessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightGreen
                }
            case 'inaccessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightRed
                }
            case 'moderately_accessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightOrange
                }
            default:
                return defaultPolygonOptions
        }
    }

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={10}
                mapTypeId='satellite'
                center={{ lat: 0, lng: 0 }}
            >
                {plots.map((plot) => (
                     <React.Fragment key={plot.id}>
                        <Polygon path={getPlotPolygon(plot)} options={getPolygonOptions(plot)} />
                        <Marker icon={{ url: 'https://maps.google.com/mapfiles/ms/micons/blue.png' }} position={calculatePlotCenter(plot)} options={{ label: { text: plot.label, color: 'white', fontWeight: 'bold' } }}/>
                     </React.Fragment>
                ))}

                {plots.map((plot) => (
                    <InfoWindow
                        position={calculatePlotCenter(plot)}
                    >
                        <div>
                            <h4>{plot.label}</h4>
                            <p>Name: {plot.name}</p>
                            <p>Area: {plot.acres_area} acres</p>
                            <p>Total: {plot.trees_count || 'NA'}</p>
                            <p>Booked: {plot.mapped_trees_count || 'NA'}</p>
                            <p>Assigned: {plot.assigned_trees_count || 'NA'}</p>
                            <p>Available: {plot.available_trees_count || 'NA'}</p>
                        </div>
                    </InfoWindow>
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default SitesMap;
