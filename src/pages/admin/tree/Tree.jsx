import { useEffect, useCallback, useState } from "react";
import {
  Divider,
  Typography,
  Box,
  Grid,
  Paper,
  Autocomplete,
  TextField
} from "@mui/material";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

import { Tab, TabsList, TabPanel } from "../../../components/CustomTabs";
import * as Axios from "../../../api/local";
import {
  searchTreeData,
  treeByPlots,
  treeLogByPlotDate,
  treeTypeCount,
  treeTypeCountByPlot,
  selectedPlot,
} from "../../../store/adminAtoms";
import { Spinner } from "../../../components/Spinner";
import { SearchBox } from "./components/SearchBox";
import { SearchResult } from "./components/SearchResult";
import { Overall } from "./overall/Overall";
import { Plotwise } from "./plotwise/Plotwise";

const CustomPaper = (props) => {
  return (
    <Paper
      style={{
        minWidth: '450px',
        marginRight:'50px',
        borderRadius: "20px",
        boxShadow: "4px 4px 6px #98a49c, -4px -4px 6px #cadace",
        background: "#b1bfb5",
      }}
      {...props}
    />
  );
};

export const Tree = () => {
  const [loading, setLoading] = useState(true);
  const searchTree = useRecoilValue(searchTreeData);
  const [treeByPlotsData, setTreeByPlots] = useRecoilState(treeByPlots);
  const setTreeLogByPlot = useSetRecoilState(treeLogByPlotDate);
  const setTreeTypeCountByPlot = useSetRecoilState(treeTypeCountByPlot);
  const [selectedPlotName, setSelectedPlot] = useRecoilState(selectedPlot);
  const setTreeCountByType = useSetRecoilState(treeTypeCount);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/trees/groupbyplots`);
      if (response.status === 200) {
        setTreeByPlots(response.data);
      }

      response = await Axios.default.get(`/trees/treelogbyplot`);
      if (response.status === 200) {
        response.data.forEach((element, index) => {
          element["_id"]["date"] = element["_id"]["date"].substring(0, 10);
        });
        setTreeLogByPlot(response.data);
        setSelectedPlot(response.data[0].plot.name);
      }
      response = await Axios.default.get(`/trees/treetypecount`);
      if (response.status === 200) {
        setTreeCountByType(response.data);
      }
      response = await Axios.default.get(`/trees/treetypecount/plotwise`);
      if (response.status === 200) {
        setTreeTypeCountByPlot(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [
    setTreeByPlots,
    setTreeCountByType,
    setSelectedPlot,
    setTreeLogByPlot,
    setTreeTypeCountByPlot,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Spinner text={"Fetching Tree Data!"} />;
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
          <Typography variant="h3">Trees</Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Autocomplete
              sx={{
                mt: 1,
                width: "35ch",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  borderRadius: "25px",
                  boxShadow: "4px 4px 8px #98a49c, -4px -4px 8px #cadace",
                },
              }}
              PaperComponent={CustomPaper}
              options={treeByPlotsData}
              autoHighlight
              getOptionLabel={(option) => option.plot_name.name}
              onChange={(event, newValue) => {
                setSelectedPlot(newValue.plot_name.name)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select plot"
                  variant="outlined"
                />
              )}
            />
            <SearchBox setLoading={setLoading} />
          </div>
        </div>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <Box sx={{ p: 3 }}>
          <TabsUnstyled defaultValue={0}>
            <TabsList>
              <Tab>Overall Summary</Tab>
              <Tab>{selectedPlotName}</Tab>
            </TabsList>
            <TabPanel value={0}>
              <Overall />
            </TabPanel>
            <TabPanel value={1}>
              <Plotwise />
            </TabPanel>
          </TabsUnstyled>
          <Grid container spacing={3}>
            {Object.keys(searchTree).length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: "#ffffff",
                    p: 2,
                    borderRadius: 3,
                    maxWidth: "500px",
                  }}
                >
                  <SearchResult />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </>
    );
  }
};
