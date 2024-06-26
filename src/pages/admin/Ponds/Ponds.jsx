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
import { makeStyles } from "@mui/styles";
import {PondComponent} from "./components/AllPondTable";
import * as Axios from "../../../api/local";
import { Spinner } from "../../../components/Spinner";
import { allPonds, selectedPond, pondHistory } from "../../../store/adminAtoms";
import { PondsHistory } from "./components/PondsHistory";

const useStyles = makeStyles({
  root: {
    "& .MuiPaper-root": {
      borderRadius: '20px',
      maxHeight: '450px',
      boxShadow: "4px 4px 6px #98a49c, -4px -4px 6px #cadace",
    }
  },
  select: {
    "& ul": {
      backgroundColor: "#b1bfb5",
    },
    "& li": {
      fontSize: 14,
    },
  },
});

export const Ponds = () => {
  const [loading, setLoading] = useState(false);
  const [ponds, setAllPonds] = useRecoilState(allPonds);
  const setSelectedPond = useSetRecoilState(selectedPond);
  const setPondHistory = useSetRecoilState(pondHistory);
  const classes = useStyles();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.post(`/ponds/get`);
      if (response.status === 200) {
        setAllPonds(response.data.results);
        setSelectedPond(response.data.results[0].name);
      }
      // let hisRes = await Axios.default.get(
      //   `/ponds/history?pond_name=${response.data.results[0].name}`
      // );
      // if (hisRes.status === 200 && hisRes.data[0]) {
      //   hisRes.data[0].updates.forEach((element, index) => {
      //     element["date"] = element["date"].substring(0, 10);
      //   });
      //   setPondHistory(hisRes.data[0].updates);
      // }
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
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PondComponent />
            </Grid>
            <Grid item xs={12}>
              <PondsHistory />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
};
