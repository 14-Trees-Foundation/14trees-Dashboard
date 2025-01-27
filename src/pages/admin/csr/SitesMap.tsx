import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { Plot } from '../../../types/plot';
import '../Inventory/map.css'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { AutocompleteWithPagination } from '../../../components/AutoComplete';
import ApiClient from '../../../api/apiClient/apiClient';
import { Site } from '../../../types/site';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as siteActionCreators from '../../../redux/actions/siteActions';
import { toast } from 'react-toastify';

const containerStyle = {
    width: '100%',
    height: '75vh',
};

const lightGreen = "#00ff00";
const lightRed = "#ff0000";
const lightOrange = "#ffa500";
const lightBlue = "#0000ff";

const defaultPolygonOptions = {
    fillColor: lightBlue,
    fillOpacity: 0.1,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    visible: true,
    geodesic: false,
    zIndex: 1,
}

interface SitesMapProps {
    groupId?: number
    site?: Site
}


const SitesMap: React.FC<SitesMapProps> = ({ groupId, site }) => {

    const dispatch = useAppDispatch();
    const { getSites } = bindActionCreators(siteActionCreators, dispatch);

    const [sitePage, setSitePage] = useState(0);
    const [siteNameInput, setSiteNameInput] = useState("");
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [plots, setPlots] = useState<Plot[]>([]);

    let sitesList: Site[] = [];
    const siteData = useAppSelector((state) => state.sitesData);

    if (siteData) {
        sitesList = Object.values(siteData.sites);
        sitesList = sitesList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    useEffect(() => {
        if (site) setSelectedSite(site);
    }, [site])

    useEffect(() => {
        getSitesData();
    }, [sitePage, siteNameInput]);

    useEffect(() => {
        if (selectedSite) {
            getCSRPlotStats(0, 50, [{ columnField: 'site_id', operatorValue: 'equals', value: selectedSite.id }], groupId);
        }
    }, [selectedSite, groupId]);

    const getCSRPlotStats = async (offset: number, limit: number, filters: any[], group_id?: number) => {

        try {
            const apiClient = new ApiClient();
            const plotsResp = await apiClient.getPlotStatsForCorporate(offset, limit, group_id, filters);
            setPlots(plotsResp.results.filter(item => item.boundaries && item.boundaries?.coordinates[0]).map(item => ({ ...item, key: item.id })));
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const getSitesData = async () => {
        const siteNameFilter = {
            columnField: "name_english",
            value: siteNameInput,
            operatorValue: "contains",
        };

        getSites(sitePage * 10, 10, [siteNameFilter]);
    };

    const googleMapsApiKey = process.env.REACT_APP_API_MAP_KEY ?? '';
    const mapRef = React.useRef<google.maps.Map | null>(null);

    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [info, setInfo] = React.useState({
        available: true,
        booked: false,
        assigned: false,
        total: false,
        capacity: false,
        label: true,
        all: true,
    })

    const getPlotPolygon = (plot: Plot) => {
        const polygonPath = plot.boundaries?.coordinates[0]?.map(
            ([lat, lng]) => ({ lat, lng })
        );
        return polygonPath;
    };

    React.useEffect(() => {
        let latSum = 0, lngSum = 0;
        plots.forEach((plot) => {

            const center = calculatePlotCenter(plot);
            latSum += center.lat;
            lngSum += center.lng;
        })

        const size = Math.max(plots.length, 1);
        setCenter({ lat: latSum / size, lng: lngSum / size });
    }, [plots]);

    const calculatePlotCenter = (plot: Plot) => {
        let latSum = 0, lngSum = 0;
        const path = getPlotPolygon(plot).filter(item => item);
        path.forEach(point => {
            latSum += point.lat;
            lngSum += point.lng;
        });

        const size = Math.max(path.length, 1)
        return {
            lat: latSum / size,
            lng: lngSum / size,
        };
    };

    const getPolygonOptions = (plot: Plot) => {
        switch (plot.accessibility_status) {
            case 'accessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightGreen
                }
            case 'inaccessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightRed
                }
            case 'moderately_accessible':
                return {
                    ...defaultPolygonOptions,
                    fillColor: lightOrange
                }
            default:
                return defaultPolygonOptions
        }
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey,
    });

    return (
        <Box>
            {!site && <>
                <Typography variant="h5" ml={1}>Map View</Typography>
                <AutocompleteWithPagination
                    label="Select a site to see map view"
                    options={sitesList}
                    getOptionLabel={(option) => option?.name_english || ''}
                    onChange={(event, newValue) => {
                        setSelectedSite(newValue);
                    }}
                    onInputChange={(event) => {
                        const { value } = event.target;
                        setSitePage(0);
                        setSiteNameInput(value);
                    }}
                    setPage={setSitePage}
                    fullWidth
                    size="small"
                    value={selectedSite}
                />
            </>}

            <Box style={{ display: selectedSite ? 'block' : 'none' }}>
                    {isLoaded && <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={18}
                        mapTypeId='satellite'
                        center={center}
                        onLoad={(map) => { mapRef.current = map }}
                    >
                        {plots.map((plot) => (
                            <React.Fragment key={plot.id}>
                                <Polygon path={getPlotPolygon(plot)} options={getPolygonOptions(plot)} />
                                <Marker
                                    icon={{ url: 'https://maps.google.com/mapfiles/ms/micons/blue.png' }}
                                    position={calculatePlotCenter(plot)}
                                />
                                {info.all && <InfoWindow
                                    key={plot.id}
                                    position={calculatePlotCenter(plot)}
                                    options={{
                                        disableAutoPan: true,
                                        pixelOffset: new window.google.maps.Size(0, -10),
                                    }}
                                >
                                    <div style={{
                                        color: 'white', // White text
                                        padding: '5px',
                                        borderRadius: '5px',
                                        width: 'auto',
                                        border: 'none',
                                        overflow: 'hidden',
                                        lineHeight: '0.5',
                                    }}>
                                        {info.label && <strong style={{ color: '#ff5e6b' }}>{plot.label}</strong>}
                                        {info.available && <p><strong>Available: {plot.available}</strong></p>}
                                        {info.assigned && <p><strong>Assigned: {plot.assigned}</strong></p>}
                                        {info.booked && <p><strong>Booked: {plot.booked}</strong></p>}
                                        {info.capacity && <p><strong>Capacity: {Math.floor((plot.acres_area ?? 0) * 300)}</strong></p>}
                                        {info.total && <p><strong>Total: {plot.total}</strong></p>}
                                    </div>
                                </InfoWindow>}
                            </React.Fragment>
                        ))}

                    </GoogleMap>}
                <Box style={{ padding: 5, display: 'flex', alignItems: 'center', }}>
                    <FormControlLabel
                        label="Show Plot Label"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.label} onChange={() => { setInfo(prev => ({ ...prev, label: !prev.label })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Available"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.available} onChange={() => { setInfo(prev => ({ ...prev, available: !prev.available })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Assigned"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.assigned} onChange={() => { setInfo(prev => ({ ...prev, assigned: !prev.assigned })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Booked"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.booked} onChange={() => { setInfo(prev => ({ ...prev, booked: !prev.booked })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Capacity"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.capacity} onChange={() => { setInfo(prev => ({ ...prev, capacity: !prev.capacity })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Total"
                        disabled={!info.all}
                        control={
                            <Checkbox checked={info.total} onChange={() => { setInfo(prev => ({ ...prev, total: !prev.total })) }} />
                        }
                    />
                    <FormControlLabel
                        label="Show Labels"
                        control={
                            <Checkbox checked={info.all} onChange={() => { setInfo(prev => ({ ...prev, all: !prev.all })) }} />
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default SitesMap;
