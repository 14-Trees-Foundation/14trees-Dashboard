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

import { useRecoilValue, useRecoilState } from 'recoil';
import { usersData, currSelTree } from '../../../store/atoms';

require('dotenv').config();

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    // boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
};

const options = {
    fillColor: "green",
    fillOpacity: 0.1,
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
    fillOpacity: 0.35,
}

const mapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'satellite',
    zoom: 15,
    minZoom: 11,
    maxZoom: 22,
    panControl: true,
    rotateControl: true,
    keyboardShortcuts: false,
}

const boxOptions = { closeBoxURL: '', enableEventPropagation: true };

const removeDupBoundaries = (boundaries) => {
    const flag = {};
    const unique = [];
    boundaries.forEach(boundary => {
        if(!flag[boundary[0].lat]) {
            flag[boundary[0].lat] = true
            unique.push(boundary)
        }
    });
    return unique
}

export const Map = () => {

    const classes = useStyles();
    const userinfo = useRecoilValue(usersData);
    const [currTree, setCurrTree] = useRecoilState(currSelTree);
    const trees = userinfo.trees
    const [map, setMap] = useState(null);

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, []);

    let boundaries = [];
    let treeCenters = [];
    for (const tree of trees) {
        let pathObj = tree.tree.plot_id.boundaries.coordinates[0].map(([lat, lng]) => ({ lat, lng }));
        boundaries.push(pathObj);
        let [lat, lng] = tree.tree.location.coordinates;
        treeCenters.push({lat, lng});
    }

    const uniqBoundaries = removeDupBoundaries(boundaries)

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
                zoom={17}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {treeCenters.map((marker, i) => (
                    <Fragment key={i}>
                        {
                            currTree === i &&
                                <Polygon
                                    paths={boundaries[i]}
                                    options={selectedOption}
                                />
                        }
                        <Marker
                            icon={icon}
                            // TODO: change this to tree location
                            position={boundaries[i][0]}
                            animation={1}
                            onClick={() => onMarkerClick(i)}>
                        </Marker>
                        {
                            currTree === i &&
                            <InfoBox
                                options={boxOptions}
                                // TODO: change this to tree location
                                position={boundaries[i][0]}
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
                {uniqBoundaries.map((marker, i) => {
                        return(<Polygon
                            paths={marker}
                            options={options}
                        />)
                    })}
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
