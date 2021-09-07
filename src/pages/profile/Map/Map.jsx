import {useState, useCallback} from 'react';
import { 
    GoogleMap,
    useJsApiLoader,
    Polygon,
    Marker,
    InfoBox
    } from '@react-google-maps/api';

import marker from "../../../assets/marker.png";
import tree from "../../../assets/neem.png";
import './maps.scss';

require('dotenv').config();

const containerStyle = {
    width: '100%',
    height: '101%',
    borderRadius: '6px',
    // boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
};

const paths = [
    {lat: 18.92388548178382, lng: 73.77198156977873},
    {lat: 18.92394548251714, lng: 73.772254066293},
    {lat: 18.92456612907523, lng: 73.77250940896293},
    {lat: 18.92451636243068, lng: 73.77310734998903},
    {lat: 18.92410103480095, lng: 73.77351102467631},
    {lat: 18.92438629234444, lng: 73.77423369992533},
    {lat: 18.92570084213888, lng: 73.77352011507531},
    {lat: 18.92600029548707, lng: 73.77345136906712},
    {lat: 18.92642050830927, lng: 73.77176739452904},
    {lat: 18.92600029548707, lng: 73.77345136906712},
    {lat: 18.92609001880532, lng: 73.77465867426133},
    {lat: 18.92921738105332, lng: 73.77494262525147},
    {lat: 18.92983007114656, lng: 73.77419310992801},
    {lat: 18.92938220171607, lng: 73.77355060621593},
    {lat: 18.92648810034929, lng: 73.77088393666078},
    {lat: 18.92642050830927, lng: 73.77176739452904},
    {lat: 18.92388548178382, lng: 73.77198156977873}
];

const markers = [{lat: 18.92701129548707, lng: 73.77245238906712},]

const options = {
    fillColor: "lightblue",
    fillOpacity: 0.2,
    strokeColor: "lightgreen",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
}

const mapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'satellite',
    zoom: 16,
    minZoom:10,
    maxZoom: 17,
    panControl: true,
    rotateControl: true,
    keyboardShortcuts: false,
}

const boxOptions = { closeBoxURL: '', enableEventPropagation: true };

export const Map = ({location}) => {
    let loc = [];
    for (const l of location){
        loc.push(l.location);
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY
    })

    const [map, setMap] = useState(null);
    const onUnmount = useCallback(function callback(map) {
    setMap(null)
    }, []);

    const polyLoad = polygon => {};

    return isLoaded ? (
        <div className="map">
            <h2>Site Map</h2>
            <GoogleMap
            mapContainerStyle={containerStyle}
            mapTypeId={'satellite'}
            center={{
                lat: 18.9270007032460,
                lng: 73.7733311321322
            }}
            zoom={17}
            onUnmount={onUnmount}
            options={mapOptions}
            >
                <Polygon
                    onLoad={polyLoad}
                    paths={paths}
                    options={options}
                />
                <Marker
                    icon={marker}
                    position={markers[0]}
                    animation={1}>
                </Marker>
                <InfoBox
                    options={boxOptions}
                    position={markers[0]}
                >
                    <div style={{
                        backgroundColor: '#ffffff',
                        width: '150px',
                        height: '100px',
                        borderRadius: '20px',
                        display: "flex"}}>
                        <img alt="tree" src={tree} style={{
                            width:"80px",
                            height:"80px",
                            padding:"10px",
                            borderRadius:"25%"}}/>
                        <div style={{color: "e9e9e9", paddingTop: "20px", textAlign:"center"}}>
                            <h5>Neem</h5>
                            <h5>Sapling</h5>
                        </div>
                    </div>
                    </InfoBox>
            </GoogleMap>
        </div>
) : <></>
}
