import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import {
  Divider,
  Typography,
  Box,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

import * as Axios from "../../../api/local";
import { Spinner } from "../../../components/Spinner";
import { allPonds, selectedPond, pondHistory } from "../../../store/adminAtoms";
import { PondsList } from "./components/PondsList";
import { PondsHistory } from "./components/PondsHistory";

export const Ponds = () => {
  const [loading, setLoading] = useState(false);
  const [ponds, setAllPonds] = useRecoilState(allPonds);
  const setSelectedPond = useSetRecoilState(selectedPond);
  const setPondHistory = useSetRecoilState(pondHistory);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/ponds/`);
      if (response.status === 200) {
        setAllPonds(response.data);
        setSelectedPond(response.data[0].name);
      }
      let hisRes = await Axios.default.get(
        `/ponds/history?pond_name=${response.data[0].name}`
      );
      if (hisRes.status === 200) {
        hisRes.data[0].updates.forEach((element, index) => {
          element["date"] = element["date"].substring(0, 10);
        });
        setPondHistory(hisRes.data[0].updates);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [setAllPonds, setLoading, setSelectedPond, setPondHistory]);

  useEffect(() => {
    if (Object.keys(ponds).length === 0) {
      fetchData();
    }
  }, [ponds, fetchData]);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 12px",
          }}
        >
          <Typography variant="h3">Ponds</Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {Object.keys(ponds).length > 0 && (
              <Select
                sx={{ mt: 1, width: "30ch" }}
                fullWidth
                onChange={(e) => setSelectedPond(e.target.value)}
                defaultValue="none"
              >
                <MenuItem disabled value="none">
                  Select Pond
                </MenuItem>
                {ponds?.map((pond) => {
                  return (
                    <MenuItem key={pond._id} value={pond.name}>
                      {pond.name}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </div>
        </div>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <PondsList />
            </Grid>
            <Grid item xs={7}>
              <PondsHistory />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
};
