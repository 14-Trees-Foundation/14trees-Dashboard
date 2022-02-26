import { useEffect, useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRecoilValue } from 'recoil';

import {
    selectedPlot
} from '../../../../store/adminAtoms';
import * as Axios from "../../../../api/local";
import { TreeLogByPlotDate } from "../components/TreeLogByPlotDate";
import { TreeTypeCountByPlot } from "../components/TreeTypeCountByPlot";
import { Spinner } from "../../../../components/Spinner";

const columns = [
    {
        field: 'sapling_id',
        headerName: 'Sapling ID',
        width: 150
    },
    {
        field: 'tree_name',
        headerName: 'Tree name',
        width: 180,
        editable: false,
    },
    {
        field: 'date_added',
        headerName: 'Date added',
        width: 180,
        editable: false,
        valueFormatter: (params) => {
            const valueFormatted = params.value.slice(0, 10);
            return `${valueFormatted}`;
        }
    },
    {
        field: 'assigned_to',
        headerName: 'Assigned To',
        width: 180,
        editable: false,
    },
    {
        field: 'donated_by',
        headerName: 'Donated By',
        width: 180,
        editable: false,
    },
    {
        field: 'added_by',
        headerName: 'Added By',
        width: 180,
        editable: false,
        align: 'center'
    },
];

export const Plotwise = () => {
    const [loading, setLoading] = useState(true);
    const [treeList, setTreeList] = useState({})
    let selPlot = useRecoilValue(selectedPlot);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let response = await Axios.default.get(`/trees/plot/list?plot_name=${selPlot}`);
            console.log(response.data)
            if (response.status === 200) {
                setTreeList(response.data);
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }, [selPlot, setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (loading) {
        return (
            <Spinner text={"Fetching tree list"} />
        )
    } else {
        return (
            <Box sx={{ pt: 3, pb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                            <TreeLogByPlotDate />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                            <TreeTypeCountByPlot />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{
                            backgroundColor: '#ffffff',
                            p: 2, borderRadius: 3,
                            height: '100%', minHeight: '900px',
                            '& .MuiButton-root': {
                                color: '#1f3625',
                                pr: 2
                            },
                            '& .MuiDataGrid-toolbarContainer': {
                                p: 2
                            }
                        }}>
                            <DataGrid
                                components={{ Toolbar: GridToolbar }}
                                getRowId={(row) => row.sapling_id}
                                rows={treeList}
                                columns={columns}
                                pageSize={50}
                                rowsPerPageOptions={[50]}
                                disableSelectionOnClick
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}