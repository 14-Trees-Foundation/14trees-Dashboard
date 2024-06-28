import { useState } from "react";
import {
  Box,
  Grid,
} from "@mui/material";
import {PondComponent} from "./components/AllPondTable";
import { PondsHistory } from "./components/PondsHistory";
import { ToastContainer } from "react-toastify";

export const Ponds = () => {
  const [ selectedPond, setSelectedPond ] = useState(null);

  return (
    <>
      <ToastContainer />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PondComponent setSelectedPond={setSelectedPond} />
          </Grid>
          <Grid item xs={12}>
            <PondsHistory selectedPond={selectedPond} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
