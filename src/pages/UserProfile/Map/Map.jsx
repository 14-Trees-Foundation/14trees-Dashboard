import { useState, useCallback, Fragment } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    Polygon,
    Marker,
    InfoBox
} from '@react-google-maps/api';

import icon from "../../../assets/marker.png";
import tree from "../../../assets/neem.png";
import './maps.scss';

require('dotenv').config();

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    // boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
};

const markers = [{ lat: 18.92701129548707, lng: 73.77245238906712 },]

const options = {
    fillColor: "green",
    fillOpacity: 0.2,
    strokeColor: "lightgreen",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
}

const selectedOption = {
    ...options,
    fillOpacity: 0.5,
}

const mapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'satellite',
    zoom: 16,
    minZoom: 10,
    maxZoom: 18,
    panControl: true,
    rotateControl: true,
    keyboardShortcuts: false,
}

const boxOptions = { closeBoxURL: '', enableEventPropagation: true };

export const Map = ({ trees, currentInfo, handleInfoChange }) => {

    const [map, setMap] = useState(null);

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, []);

    let boundaries = [];
    for (const tree of trees) {
        let pathObj = tree.tree.plot_id.boundaries.coordinates[0].map(([lat, lng]) => ({ lat, lng }));
        boundaries.push(pathObj)
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY
    })

    const polyLoad = polygon => { };

    const onMarkerClick = (i) => {
        handleInfoChange(i)
    }
    return isLoaded ? (
        <div className="map">
            <GoogleMap
                mapContainerStyle={containerStyle}
                mapTypeId={'satellite'}
                center={boundaries[0][0]}
                zoom={18}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {boundaries.map((marker, i) => (
                    <Fragment key={i}>
                        {
                            currentInfo === i ?
                                <Polygon
                                    onLoad={polyLoad}
                                    paths={marker}
                                    options={selectedOption}
                                />
                                :
                                <Polygon
                                    onLoad={polyLoad}
                                    paths={marker}
                                    options={options}
                                />
                        }
                        <Marker
                            icon={icon}
                            position={marker[0]}
                            animation={1}
                            onClick={() => onMarkerClick(i)}>
                        </Marker>
                        {
                            currentInfo === i &&
                            <InfoBox
                                options={boxOptions}
                                position={marker[0]}
                            >
                                <div style={{
                                    backgroundColor: '#ffffff',
                                    width: '150px',
                                    height: '100px',
                                    borderRadius: '20px',
                                    display: "flex"
                                }}>
                                    <img alt="tree" src={tree} style={{
                                        width: "80px",
                                        height: "80px",
                                        padding: "10px",
                                        paddingRight: "0px",
                                        borderRadius: "25%"
                                    }} />
                                    <div style={{ color: "e9e9e9", paddingTop: "5px", textAlign: "center" }}>
                                        <h3>{trees[i].tree.tree_id.name}</h3>
                                        <h5>Sapling ID: {trees[i].tree.sapling_id}</h5>
                                    </div>
                                </div>
                            </InfoBox>
                        }
                    </Fragment>
                ))}
            </GoogleMap>
        </div>
    ) : <></>
}
