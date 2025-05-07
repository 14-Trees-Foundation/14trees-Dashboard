import { Fragment, useEffect, useRef, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
  Marker,
  InfoBox,
} from "@react-google-maps/api";

import icon from "../../../assets/tree-1.svg";
import { useRecoilValue } from "recoil";
import { usersData, selUsersData } from "../../../store/atoms";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "6px",
};

const initialOptions = {
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

const mapOptions = {
  disableDefaultUI: true,
  mapTypeId: "hybrid",
  minZoom: 6,
  maxZoom: 22,
  panControl: true,
  rotateControl: true,
  keyboardShortcuts: false,
};

const boxOptions = { closeBoxURL: "", enableEventPropagation: true };

export const Map = () => {
  const classes = useStyles();
  const userinfo = useRecoilValue(usersData);
  const currTree = useRecoilValue(selUsersData);
  const trees = userinfo.user_trees;

  let boundaries = [];
  let pathObj = currTree.boundaries?.coordinates[0]?.map(
    ([lat, lng]) => ({ lat, lng })
  );
  pathObj && boundaries.push(pathObj);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_API_MAP_KEY,
  });

  const mapRef = useRef(null);
  const [polygonOptions, setPolygonOptions] = useState(initialOptions);
  const [zoomLevel, setZoomLevel] = useState(1); // Start with a higher zoom level

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      let opacity = 0.1;
      const interval = setInterval(() => {
        opacity = opacity === 0.1 ? 0.5 : 0.1;
        setPolygonOptions((prevOptions) => ({
          ...prevOptions,
          fillOpacity: opacity,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      // console.log("Map loaded");
      const targetZoom = 16; // Desired zoom level
      const zoomInterval = setInterval(() => {
        
        setZoomLevel((prevZoom) => {
          // console.log("Zooming current level: ", prevZoom);
          if (prevZoom > targetZoom) {
            clearInterval(zoomInterval);
            return prevZoom;
          }
          return prevZoom + 0.1; // Decrease zoom level gradually
        });
      }, 100); // Adjust the interval time for smoother animation

      return () => clearInterval(zoomInterval);
    }
  }, [isLoaded]);

  const onMarkerClick = (i) => {
    console.log(i);
  };

  // Check if boundaries is empty or null
  if (!isLoaded || !boundaries.length) {
    return <></>;
  }
  return (
    <div className={classes.map}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={boundaries[0][0]}
        zoom={zoomLevel}
        options={mapOptions}
        onLoad={(map) => (mapRef.current = map)}
      >
        {trees.map((tree, i) => (
          <Fragment key={i}>
            {currTree.sapling_id === tree.sapling_id && (
              <>
                <Marker
                  icon={{
                    url: icon,
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                  position={boundaries[0][0]}
                  animation={1}
                  onClick={() => onMarkerClick(i)}
                />
                <Polygon
                  paths={boundaries[0]}
                  options={polygonOptions}
                  className="polygon-path"
                />
                <InfoBox options={boxOptions} position={boundaries[0][0]}>
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
                          : tree.plant_type_images &&
                            tree.plant_type_images.length > 0
                          ? tree.plant_type_images[0]
                          : ""
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
            )}
          </Fragment>
        ))}
      </GoogleMap>
    </div>
  )
  
};

const useStyles = makeStyles((theme) =>
  createStyles({
    map: {
      width: "100%",
      height: "100%",
      marginRight: "20px",
      [theme.breakpoints.down("480")]: {
        height: "300px",
      },
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
