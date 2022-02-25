import { Box, Grid } from "@mui/material";
import { TreeLogByPlotDate } from "../components/TreeLogByPlotDate";
import { TreeTypeCountByPlot } from "../components/TreeTypeCountByPlot";

export const Plotwise = () => {
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
            </Grid>
        </Box>
    )
}