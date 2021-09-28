import { useState, useCallback, Fragment } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import {
    GoogleMap,
    useJsApiLoader,
    Polygon,
    Marker,
    InfoBox
} from '@react-google-maps/api';

import icon from "../../../assets/marker.png";
import tree from "../../../assets/neem.png";

import { useRecoilValue, useRecoilState } from 'recoil';
import { usersData, currSelTree } from '../../../store/atoms';

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
    maxZoom: 22,
    panControl: true,
    rotateControl: true,
    keyboardShortcuts: false,
}

const boxOptions = { closeBoxURL: '', enableEventPropagation: true };

export const Map = () => {

    const classes = useStyles();
    const userinfo = useRecoilValue(usersData);
    const [currTree, setCurrTree] = useRecoilState(currSelTree);
    const trees = userinfo.trees
    console.log(trees)
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

    const onMarkerClick = (i) => {
        setCurrTree(i)
    }
    return isLoaded ? (
        <div className={classes.map}>
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
                            currTree === i ?
                                <Polygon
                                    paths={marker}
                                    options={selectedOption}
                                />
                                :
                                <Polygon
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
                            currTree === i &&
                            <InfoBox
                                options={boxOptions}
                                position={marker[0]}
                            >
                                <div style={{
                                    backgroundColor: '#ffffff',
                                    width: '140px',
                                    height: '70px',
                                    borderRadius: '20px',
                                    display: "flex"
                                }}>
                                    <img alt="tree" src={trees[i].tree.tree_id.image[0]} className={classes.treeimg} />
                                    <div style={{ color: "e9e9e9", textAlign: "center", margin: 'auto 0', marginLeft: '10px' }}>
                                        <h3>{trees[i].tree.tree_id.name}</h3>
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

const useStyles = makeStyles((theme) =>
    createStyles({
        map: {
            width: '100%',
            height: '100%',
            marginRight: '20px'
        },
        treeimg: {
            width: "50px",
            height: "50px",
            padding: "10px",
            paddingRight: "0px",
            borderRadius: "25%",
            objectFit: 'cover'
        }
    })
);
