import { Divider, Typography, Box } from "@mui/material"
import { TreeSummaryByPlot } from "./components/TreeSummaryByPlot"

export const Tree =() => {
    return (
        <div>
            <Typography variant="h3">Trees</Typography>
            <Divider sx={{backgroundColor: '#ffffff'}}/>
            <Box sx={{p:3}}>
                <TreeSummaryByPlot />
            </Box>
        </div>
    )
}