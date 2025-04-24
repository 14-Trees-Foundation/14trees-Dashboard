import React from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { Plot } from '../../../types/plot';
import './map.css'
import { Box, Checkbox, FormControlLabel } from '@mui/material';

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
    const googleMapsApiKey = import.meta.env.VITE_APP_API_MAP_KEY ?? '';
    const mapRef = React.useRef<google.maps.Map | null>(null);

    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [info, setInfo] = React.useState({
        available: true,
        booked: false,
        assigned: false,
        total: false,
        capacity: false,
        label: true,
        all: true,
    })

    const getPlotPolygon = (plot: Plot) => {
        const polygonPath = plot.boundaries?.coordinates[0]?.map(
            ([lat, lng]) => ({ lat, lng })
        );
        return polygonPath;
    };

    React.useEffect(() => {
        let latSum = 0, lngSum = 0;
        plots.forEach((plot) => {

            const center = calculatePlotCenter(plot);
            latSum += center.lat;
            lngSum += center.lng;
        })

        setCenter({ lat: latSum / plots.length, lng: lngSum / plots.length });
    }, [plots]);

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
        <Box>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    zoom={17}
                    mapTypeId='satellite'
                    center={center}
                    onLoad={(map) => { mapRef.current = map }}
                >
                    {plots.map((plot) => (
                        <React.Fragment key={plot.id}>
                            <Polygon path={getPlotPolygon(plot)} options={getPolygonOptions(plot)} />
                            <Marker
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/micons/blue.png' }}
                                position={calculatePlotCenter(plot)}
                            />
                            {info.all && <InfoWindow
                                key={plot.id}
                                position={calculatePlotCenter(plot)}
                                options={{
                                    disableAutoPan: true,
                                    pixelOffset: new window.google.maps.Size(0, -10),
                                }}
                            >
                                <div style={{
                                    color: 'white', // White text
                                    padding: '5px',
                                    borderRadius: '5px',
                                    width: 'auto',
                                    border: 'none',
                                    overflow: 'hidden',
                                    lineHeight: '0.5',
                                }}>
                                    {info.label && <strong style={{ color: '#ff5e6b' }}>{plot.label}</strong>}
                                    {info.available && <p><strong>Available: {plot.available}</strong></p>}
                                    {info.assigned && <p><strong>Assigned: {plot.assigned}</strong></p>}
                                    {info.booked && <p><strong>Booked: {plot.booked}</strong></p>}
                                    {info.capacity && <p><strong>Capacity: {Math.floor((plot.acres_area ?? 0) * 300)}</strong></p>}
                                    {info.total && <p><strong>Total: {plot.total}</strong></p>}
                                </div>
                            </InfoWindow>}
                        </React.Fragment>
                    ))}

                </GoogleMap>
            </LoadScript>
            <Box style={{ padding: 5, display: 'flex', alignItems: 'center',  }}>
                <FormControlLabel
                    label="Show Plot Label"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.label} onChange={() => { setInfo(prev => ({ ...prev, label: !prev.label })) }} />
                    }
                />
                <FormControlLabel
                    label="Available"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.available} onChange={() => { setInfo(prev => ({ ...prev, available: !prev.available })) }} />
                    }
                />
                <FormControlLabel
                    label="Assigned"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.assigned} onChange={() => { setInfo(prev => ({ ...prev, assigned: !prev.assigned })) }} />
                    }
                />
                <FormControlLabel
                    label="Booked"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.booked} onChange={() => { setInfo(prev => ({ ...prev, booked: !prev.booked })) }} />
                    }
                />
                <FormControlLabel
                    label="Capacity"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.capacity} onChange={() => { setInfo(prev => ({ ...prev, capacity: !prev.capacity })) }} />
                    }
                />
                <FormControlLabel
                    label="Total"
                    disabled={!info.all}
                    control={
                        <Checkbox checked={info.total} onChange={() => { setInfo(prev => ({ ...prev, total: !prev.total })) }} />
                    }
                />
                <FormControlLabel
                    label="Show Labels"
                    control={
                        <Checkbox checked={info.all} onChange={() => { setInfo(prev => ({ ...prev, all: !prev.all })) }} />
                    }
                />
            </Box>
        </Box>
    );
};

export default SitesMap;
