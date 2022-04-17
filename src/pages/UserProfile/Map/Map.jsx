import { Fragment } from "react";
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

require("dotenv").config();

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "6px",
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
};

const selectedOption = {
  ...options,
  fillOpacity: 0.35,
};

const mapOptions = {
  disableDefaultUI: true,
  mapTypeId: "hybrid",
  zoom: 12,
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
  const trees = userinfo.usertrees;

  let boundaries = [];
  let pathObj = currTree.tree.plot.boundaries.coordinates[0].map(
    ([lat, lng]) => ({ lat, lng })
  );
  boundaries.push(pathObj);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY,
  });

  const onMarkerClick = (i) => {
    console.log(i);
  };
  return isLoaded ? (
    <div className={classes.map}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={boundaries[0][0]}
        zoom={16}
        options={mapOptions}
      >
        {trees.map((tree, i) => (
          <Fragment key={i}>
            {currTree.tree.sapling_id === tree.tree.sapling_id && (
              <>
                <Marker
                  icon={icon}
                  position={boundaries[0][0]}
                  animation={1}
                  onClick={() => onMarkerClick(i)}
                ></Marker>
                <Polygon paths={boundaries[0]} options={selectedOption} />
                <InfoBox
                  options={boxOptions}
                  position={boundaries[0][0]}
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
                        tree.tree.image
                          ? tree.tree.image.length === 0 ||
                            tree.tree.image[0] === ""
                            ? tree.tree.tree_type.image[0]
                            : tree.tree.image[0]
                          : tree.tree.tree_type.image[0]
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
                      <h3>{tree.tree.tree_type.name}</h3>
                    </div>
                  </div>
                </InfoBox>
              </>
            )}
          </Fragment>
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
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
