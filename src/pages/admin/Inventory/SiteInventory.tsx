import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { Site } from "../../../types/site";
import { Box, Checkbox, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { Plot } from "../../../types/plot";
import ApiClient from "../../../api/apiClient/apiClient";
import MapWithKmlLayer from "./SiteMap";

const SiteInventory: FC = () => {

    const [sitePage, setSitePage] = useState(0);
    const [siteNameInput, setSiteNameInput] = useState("");
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [selectedPlots, setSelectedPlots] = useState<number[]>([]);
    const dispatch = useAppDispatch();
    const { getSites } = bindActionCreators(siteActionCreators, dispatch);

    useEffect(() => {
        getSitesData();
    }, [sitePage, siteNameInput]);

    useEffect(() => {
        if (selectedSite) {
            getPlotsData();
        }
    }, [selectedSite]);

    const getPlotsData = async () => {
        if (selectedSite) {
            const apiClient = new ApiClient();
            const response = await apiClient.getPlots(0, -1, [{ columnField: "site_id", value: selectedSite.id, operatorValue: "equals" }]);
            setPlots(response.results);
            setSelectedPlots([]);
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

    let sitesList: Site[] = [];
    const siteData = useAppSelector((state) => state.sitesData);

    if (siteData) {
        sitesList = Object.values(siteData.sites);
        sitesList = sitesList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const handleCheckBoxClick = (plotId: number) => {
        if (selectedPlots.includes(plotId)) {
            setSelectedPlots(selectedPlots.filter(plot => plot !== plotId));
        } else {
            setSelectedPlots([...selectedPlots, plotId]);
        }
    }

    const handleAllCheckBoxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedPlots(plots.map(plot => plot.id));
        } else {
            setSelectedPlots([]);
        }
    }

    const calculateSum = (nums:( number | string | undefined)[]) => {
        let sum = 0;
        nums.forEach(num => sum += num ? Number(num) : 0);
        return sum;
    }

    const getKmlUrl = () => {
        if (selectedSite && selectedSite.google_earth_link) {
            const fileId = selectedSite.google_earth_link[0].split("/d/")[1].split("/")[0];
            return `https://drive.google.com/uc?export=view&id=${fileId}`
        }

        return ''
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Inventory Management</Typography>
            <Divider sx={{ backgroundColor: "black", marginBottom: 3 }}/>
            <AutocompleteWithPagination
                label="Select a Site"
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

            {(selectedSite && selectedSite.google_earth_link) && <MapWithKmlLayer url={getKmlUrl()} />}

            {selectedSite && <Box>
                <TableContainer >
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Plot Details</TableCell>
                                <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>Tree Details</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Checkbox onChange={handleAllCheckBoxClick}/></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Plot Name</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Area in Acres</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Booked</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Assigned</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Available</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plots.map((plot) => (
                                <TableRow key={plot.id} >
                                    <TableCell><Checkbox checked={selectedPlots.includes(plot.id)} onChange={() => handleCheckBoxClick(plot.id)}/></TableCell>
                                    <TableCell>{plot.name}</TableCell>
                                    <TableCell align="right">{plot.acres_area}</TableCell>
                                    <TableCell align="right">{plot.acres_area ? Math.floor(plot.acres_area * 300) : 'Unknown'}</TableCell>
                                    <TableCell align="right">{plot.trees_count}</TableCell>
                                    <TableCell align="right">{plot.mapped_trees_count}</TableCell>
                                    <TableCell align="right">{plot.assigned_trees_count}</TableCell>
                                    <TableCell align="right">{plot.available_trees_count}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell rowSpan={1} colSpan={3} align="right">Total</TableCell>
                                <TableCell align="right">{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 0))}</TableCell>
                                <TableCell align="right">{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.trees_count))}</TableCell>
                                <TableCell align="right">{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.mapped_trees_count))}</TableCell>
                                <TableCell align="right">{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.assigned_trees_count))}</TableCell>
                                <TableCell align="right">{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.available_trees_count))}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>}
        </Box>
    )
}

export default SiteInventory;