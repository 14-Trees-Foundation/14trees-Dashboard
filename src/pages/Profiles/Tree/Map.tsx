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

import { useRecoilValue } from "recoil";
import { usersData, selUsersData } from "../../../store/atoms";
import { Tree } from "../../../types/tree";
import { Plot } from "../../../types/plot";

require("dotenv").config();

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "6px",
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
    zoom: 22,
    minZoom: 16,
    maxZoom: 22,
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
        [
            18.92883906964203,
            73.7769217462353
        ],
        [
            18.92705962338517,
            73.77601906599243
        ],
        [
            18.92691470408016,
            73.77663242954684
        ],
        [
            18.92764441915284,
            73.77778245391168
        ],
        [
            18.92883906964203,
            73.7769217462353
        ]
    ];

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script-for-profile",
        googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY || "" ,
    });

    let position = { lat: boundaries[0][0], lng: boundaries[0][1] };
    if (tree.location?.coordinates && tree.location.coordinates.length === 2) {
        position = { lat: tree.location.coordinates[0], lng: tree.location.coordinates[1] };
    }

    return (
        isLoaded
        ? (<div className={classes.map}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: 0, lng: 0 }}
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
        </div>)
        : (<div></div>)
    );
};

const useStyles = makeStyles((theme) =>
    createStyles({
        map: {
            width: "100%",
            height: "100%",
            marginRight: "20px",
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
