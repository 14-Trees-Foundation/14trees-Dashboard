import { FC, Fragment } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
    GoogleMap,
    useJsApiLoader,
    Polygon,
    Marker,
    InfoBox,
} from "@react-google-maps/api";

import icon from "../../../assets/marker.png";

import { Tree } from "../../../types/tree";
import { Card } from "@mui/material";

const containerStyle = {
    width: "100%",
    height: "100%",
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
};

const selectedOption = {
    ...options,
    fillOpacity: 0.35,
};

const mapOptions = {
    disableDefaultUI: true,
    mapTypeId: "hybrid",
    zoom: 26,
    minZoom: 16,
    maxZoom: 50,
    panControl: true,
    rotateControl: true,
    keyboardShortcuts: false,
};

const boxOptions = { closeBoxURL: "", enableEventPropagation: true };

interface TreeMapProps {
    tree: Tree
}

export const Map: FC<TreeMapProps> = ({ tree }) => {
    const classes = useStyles();

    let boundaries: [number, number][] = [
        [18.92751833912228,73.77212379622209], 
        [18.92752594978088,73.77222208637563], 
        [18.92755774237601,73.7721940988185], 
        [18.92756431139442,73.77216744406999],
        [18.92756216983834,73.77211167923981],
        [18.92748612876533,73.7720605115741],
        [18.92751833912228,73.77212379622209]
    ];

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script-for-profile",
        googleMapsApiKey: import.meta.env.VITE_APP_API_MAP_KEY ? import.meta.env.VITE_APP_API_MAP_KEY : "",
    });

    let position = { lat: boundaries[0][0], lng: boundaries[0][1] };
    if (tree.location?.coordinates && tree.location.coordinates.length === 2) {
        position = { lat: 18.92752599978088 || tree.location.coordinates[0], lng: 73.7721940988185 || tree.location.coordinates[1] };
    }

    return (
        isLoaded
        ? (<Card className={classes.map}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                options={mapOptions}
            >
                <Fragment>
                    <>
                        <Marker
                            icon={icon}
                            position={position}
                            animation={1}
                        />
                        <Polygon paths={boundaries.map((c: [number, number]) => ({ lat: c[0], lng: c[1] }))} options={selectedOption} />
                        <InfoBox
                            options={boxOptions}
                            position={position}
                        >
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    width: "140px",
                                    height: "70px",
                                    borderRadius: "20px",
                                    display: "flex",
                                }}
                            >
                                <img
                                    alt="tree"
                                    src={
                                        tree.image && tree.image !== ""
                                            ? tree.image
                                            : ''
                                    }
                                    className={classes.treeimg}
                                />
                                <div
                                    style={{
                                        color: "e9e9e9",
                                        textAlign: "center",
                                        margin: "auto 0",
                                        marginLeft: "10px",
                                    }}
                                >
                                    <h3>{tree.plant_type}</h3>
                                </div>
                            </div>
                        </InfoBox>
                    </>
                </Fragment>
            </GoogleMap>
        </Card>)
        : (<div></div>)
    );
};

const useStyles = makeStyles((theme) =>
    createStyles({
        map: {
            width: "100%",
            height: "50vh",
            borderRadius: 4,
        },
        treeimg: {
            width: "50px",
            height: "50px",
            padding: "10px",
            paddingRight: "0px",
            borderRadius: "25%",
            objectFit: "cover",
        },
    })
);