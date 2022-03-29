import { Box, Grid } from "@mui/material";

import { CustomBox } from "../../../../components/CustomBox";
import { TreeCountByType } from "../components/TreeCountByType";
import { TreeLoggedByDate } from "../components/TreeLoggedByDate";
import { TreeSummaryByPlot } from "../components/TreeSummaryByPlot";

export const Overall = () => {
  return (
    <Box sx={{ pt: 3, pb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomBox>
            <TreeSummaryByPlot />
          </CustomBox>
        </Grid>
        <Grid item xs={6}>
          <CustomBox>
            <TreeLoggedByDate />
          </CustomBox>
        </Grid>
        <Grid item xs={6}>
          <CustomBox>
            <TreeCountByType />
          </CustomBox>
        </Grid>
      </Grid>
    </Box>
  );
};
