import { Box, Grid } from "@mui/material";
import { TreeCountByType } from "../components/TreeCountByType";

import { TreeLoggedByDate } from "../components/TreeLoggedByDate";
import { TreeSummaryByPlot } from "../components/TreeSummaryByPlot"

export const Overall = () => {
    return (
        <Box sx={{ pt: 3, pb: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                        <TreeSummaryByPlot />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                        <TreeLoggedByDate />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3 }}>
                        <TreeCountByType />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}