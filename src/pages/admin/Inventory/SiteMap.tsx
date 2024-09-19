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
    const mapRef = React.useRef<google.maps.Map | null>(null);

    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [selectedPlots, setSelectedPlots] = React.useState<Plot[]>([]);

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

    const handleMarkerClick = (plot: Plot) => {
        setSelectedPlots(prevSelectedPlots => [...prevSelectedPlots, plot]);
    };

    const handleInfoWindowClose = (plotId: number) => {
        setSelectedPlots(prevSelectedPlots => prevSelectedPlots.filter(plot => plot.id !== plotId));
    }

    return (
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
                            options={{ label: { text: plot.label, color: 'white', fontWeight: 'bold' } }}
                            onClick={() => handleMarkerClick(plot)}
                        />
                     </React.Fragment>
                ))}

                {selectedPlots.map((plot) => (
                    <InfoWindow
                        key={plot.id}
                        position={calculatePlotCenter(plot)}
                        onCloseClick={() => handleInfoWindowClose(plot.id)}
                    >
                        <div>
                            <strong>{plot.label}</strong>
                            <p>Available: {plot.available_trees_count}</p>
                        </div>
                    </InfoWindow>
                ))}

            </GoogleMap>
        </LoadScript>
    );
};

export default SitesMap;
