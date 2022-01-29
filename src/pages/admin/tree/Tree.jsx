import { useEffect, useCallback, useState } from 'react';
import { Divider, Typography, Box, Grid, Select, MenuItem } from "@mui/material";

import * as Axios from "../../../api/local";
import {
    searchTreeData,
    treeByPlots,
    treeLoggedByDate,
    treeLogByPlotDate,
    treeTypeCount,
    treeTypeCountByPlot,
    selectedPlot
} from '../../../store/adminAtoms';
import { TreeSummaryByPlot } from "./components/TreeSummaryByPlot";
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { Spinner } from '../../../components/Spinner';
import { TreeLoggedByDate } from './components/TreeLoggedByDate';
import { SearchBox } from './components/SearchBox';
import { SearchResult } from './components/SearchResult';
import { TreeLogByPlotDate } from './components/TreeLogByPlotDate';
import { TreeCountByType } from './components/TreeCountByType';
import { TreeTypeCountByPlot } from './components/TreeTypeCountByPlot';

export const Tree = () => {
    const [loading, setLoading] = useState(true);
    const searchTree = useRecoilValue(searchTreeData)
    const [treeByPlotsData, setTreeByPlots] = useRecoilState(treeByPlots);
    const setTreeLoggedByDate = useSetRecoilState(treeLoggedByDate);
    const setTreeLogByPlot = useSetRecoilState(treeLogByPlotDate);
    const setTreeTypeCountByPlot = useSetRecoilState(treeTypeCountByPlot);
    const [selectedPlotName, setSelectedPlot] = useRecoilState(selectedPlot);
    const setTreeCountByType = useSetRecoilState(treeTypeCount);

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            let response = await Axios.default.get(`/trees/groupbyplots`);
            if (response.status === 200) {
                setTreeByPlots(response.data);
            }

            response = await Axios.default.get(`/trees/loggedbydate`);
            if (response.status === 200) {
                response.data.forEach((element, index) => {
                    element['_id'] = element['_id'].substring(0, 10)
                });
                setTreeLoggedByDate(response.data);
            }

            response = await Axios.default.get(`/trees/treelogbyplot`);
            if (response.status === 200) {
                response.data.forEach((element, index) => {
                    element['_id']['date'] = element['_id']['date'].substring(0, 10)
                });
                setTreeLogByPlot(response.data);
                setSelectedPlot(response.data[0].plot.name)
            }
            response = await Axios.default.get(`/trees/treetypecount`);
            if (response.status === 200) {
                setTreeCountByType(response.data);
            }
            response = await Axios.default.get(`/trees/treetypecount/plotwise`);
            if (response.status === 200) {
                console.log(response.data)
                setTreeTypeCountByPlot(response.data);
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }, [setTreeByPlots, setTreeLoggedByDate, setTreeCountByType, setSelectedPlot, setTreeLogByPlot, setTreeTypeCountByPlot]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (loading) {
        return <Spinner text={"Fetching Tree Data!"} />
    } else {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px' }}>
                    <Typography variant="h3">Trees</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Select sx={{ mt: 1, width: '22ch' }}
                            fullWidth
                            onChange={(e) => setSelectedPlot(e.target.value)}
                            defaultValue="none"
                        >
                            <MenuItem disabled value="none" >Select Plot</MenuItem>
                            {treeByPlotsData?.map(plot => {
                                return (
                                    <MenuItem key={plot.plot_name.name} value={plot.plot_name.name}>
                                        {plot.plot_name.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <SearchBox setLoading={setLoading} />
                    </div>
                </div>
                <Divider sx={{ backgroundColor: '#ffffff' }} />
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {
                            Object.keys(searchTree).length > 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3, maxWidth: '500px' }}>
                                        <SearchResult />
                                    </Box>
                                </Grid>
                            )
                        }
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                                <TreeSummaryByPlot />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {selectedPlotName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                                <TreeLogByPlotDate />
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                                <TreeTypeCountByPlot />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' gutterBottom>
                                Tree count by date (All Plots/All Users)
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                                <TreeLoggedByDate />
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                                <TreeCountByType />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}