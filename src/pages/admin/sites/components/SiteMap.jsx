import { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
  Marker,
  InfoBox,
  InfoWindow,
  KmlLayer,
} from "@react-google-maps/api";
import { createStyles, makeStyles } from "@mui/styles";
import icon from "../../../../assets/marker.png";
import StepForm from "./StepForm";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

require("dotenv").config();

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "6px",
  // boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
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

const center = {
  lat: +26.9124,
  lng: +75.7873,
};

const multiplePositions = [
  { lat: +26.894, lng: +75.8033 },

  { lat: +26.924, lng: +75.8267 },

  { lat: +26.853, lng: +75.8047 },
];

export const SiteMap = () => {
  const classes = useStyles();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-for-sites",
    googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY,
  });

  const [selectedCenter, setSelectedCenter] = useState(null);

  const onButtonClick = (i) => {
    setSelectedCenter(center);
  };

  return isLoaded ? (
    <div className={classes.map}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={mapOptions}
      >
        {multiplePositions.map((eachMarker) => (
          <Marker position={{ lat: eachMarker.lat, lng: eachMarker.lng }}>
            {selectedCenter && (
              <InfoWindow
                onCloseClick={() => {
                  setSelectedCenter(null);
                }}
                position={{
                  lat: selectedCenter.latitude,
                  lng: selectedCenter.longitude,
                }}
              >
                <Alert severity="success">
                  Here is a gentle confirmation that your action was successful.
                </Alert>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      <Button onClick={onButtonClick}>Show pop up</Button>
      <Button
        onClick={() => {
          setSelectedCenter(null);
        }}
      >
        Close pop up
      </Button>
    </div>
  ) : (
    <>
      <div>error in maps</div>
    </>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    map: {
      width: "100%",
      height: "100%",
      marginRight: "20px",
    },
  })
);
