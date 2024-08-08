import { useState, useEffect } from "react";

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
import Button from "@mui/material/Button";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { useDispatch } from "react-redux";
import { Switch } from "antd";

require("dotenv").config();

interface Center {
   lat: number,
   lng: number
}

export const SiteMap = (KmlSource: any) => {
  
  const dispatch = useDispatch();
  const { getPlots } = bindActionCreators(plotActionCreators, dispatch);
  const classes = useStyles();

  const UrlForKml = KmlSource.KmlSource
  console.log("UrlForKml: " , UrlForKml)

  const containerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "6px",
   
    display:"flex"
    
   
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
  // Pune: 18.5204° N, 73.8567° E
  // Pur Gayran 18.84256, 74.02249

  const center: Center = {
    lat: +18.84256,
    lng: +74.02249,
  };


  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-for-sites",
    googleMapsApiKey: process.env.REACT_APP_API_MAP_KEY?process.env.REACT_APP_API_MAP_KEY:"" ,
  });

  const [selectedCenter, setSelectedCenter] = useState<Center| null>(null);
  const [showPlotName, setPlotName] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});

  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowContent, setInfoWindowContent] = useState("");

  const handleSetFilters = (filters: any) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    getPlotData();
  }, [page, filters]);

  const getPlotData = async () => {
    setTimeout(async () => {
      let filtersData = Object.values(filters);
      await getPlots(page * 10, 10, filtersData);
    }, 1000);
  };

 
  let plotsList = [];
  let plotsName = [];
  const plotsData = useAppSelector((state) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots);
    console.log("Plots list for UI: ", plotsList);
    if (plotsList) {
      for (let i = 0; i < 3; i++) {
        plotsName.push(plotsList[i]);
      }
      console.log("plotname ,", plotsName);
    }
  }

  const onButtonClick = () => {
    setSelectedCenter(center);
  };

  const onShowNameButtonClick = () => {
    setSelectedCenter(center);
    setPlotName(true);
  };

  const handleKmlLoad = ((kmlLayer: any) => {
    google.maps.event.addListener(kmlLayer, "click", (event: any) => {
      setInfoWindowPosition(event.latLng);
      setInfoWindowContent(event.featureData.infoWindowHtml);
    });
  });

  const multiplePositions = [
    {
      //74.02656389177469
//18.8418642283084
//Plot -1



      lat: +74.02656389177469,
      lng: +18.8418642283084,
      name: plotsName[0]?.name,
      trees_count: plotsName[0]?.trees_count,
      mapped_trees_count: plotsName[0]?.mapped_trees_count,
    },

    {
      lat: +74.02525985697372,
      lng: +18.84296361535512,
      name: plotsName[1]?.name,
      trees_count: plotsName[1]?.trees_count,
      mapped_trees_count: plotsName[1]?.mapped_trees_count,
    },

    
  ];


  return isLoaded ? (
    <div className={classes.map}>
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={mapOptions}
      >
        <KmlLayer url={UrlForKml} options={{ preserveViewport: false }} onLoad={handleKmlLoad} />
        {/* {multiplePositions.map((eachMarker) => ( */}
         
            {/* {selectedCenter && showPlotName && (
              <InfoWindow
                onCloseClick={() => {
                  setSelectedCenter(null);
                }}
                position={{
                  lat: +74.02656389177469,
                  lng: +18.8418642283084,
                }}
              >
                <div>
                  <h3>Name Plot-1</h3>
                  {/* <h3>Available tree: {eachMarker.trees_count}</h3>
                  <h3>Mapped Tree: {eachMarker.mapped_trees_count}</h3> */}
                {/* </div>
              </InfoWindow>
            )} */} 
        {/* ))} */}

        {infoWindowPosition && (
        <InfoWindow
          position={infoWindowPosition}
          onCloseClick={() => setInfoWindowPosition(null)}
        >
         <div>Marker in Kml</div>
        </InfoWindow>
      )}
      </GoogleMap>
      <Button onClick={handleKmlLoad}>Show pop up</Button>
      <Button
        onClick={() => {
          setSelectedCenter(null);
        }}
      >
        Close pop up
      </Button>
      {/* <Switch  onChange={onShowNameButtonClick} checked={showPlotName}>Show plot Name</Switch> */}
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
      width: "600px",
      height: "600px",
      display: "flex",
      marginLeft: "500px",
      alignItems: "center",
      justifyContent: "center",
     
    
    },
  })
);