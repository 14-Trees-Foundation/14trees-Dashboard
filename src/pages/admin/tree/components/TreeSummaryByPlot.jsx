import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { CSVLink } from "react-csv";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useRecoilValue, useSetRecoilState } from "recoil";

import { treeByPlots, selectedPlot } from "../../../../store/adminAtoms";
import { useState } from "react";

export const TreeSummaryByPlot = () => {
  const theme = useTheme();
  const [focusBar, setFocusBar] = useState(null);

  let treeByPlot = useRecoilValue(treeByPlots);
  const [top, setTop] = useState(20);
  const [open, setOpen] = useState(false);
  const setSelectedPlot = useSetRecoilState(selectedPlot);

  let selectedPlots = treeByPlot.slice(0, top);

  const handleChange = (event) => {
    setTop(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  let headers = [
    { label: "Tree Coount", key: "count" },
    { label: "Plot Name", key: "plot_name" },
  ];
  let data = treeByPlot.map((item) => {
    return {
      count: item.count,
      plot_name: item.plot_name.name,
    };
  });

  let date = new Date().toISOString().slice(0, 10);
  let file_name = "tree_count_by_plot" + date + ".csv";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          Tree count by plot
        </Typography>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" gutterBottom>
            Select top plot count
          </Typography>
          <FormControl size="small" sx={{ pl: 2, pr: 2 }}>
            <Select
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={top}
              onChange={handleChange}
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>40</MenuItem>
              <MenuItem value={100}>All</MenuItem>
            </Select>
          </FormControl>
          <CSVLink data={data} filename={file_name} headers={headers}>
            <DownloadForOfflineIcon
              fontSize="large"
              style={{ cursor: "pointer", color: "#1f3625" }}
            />
          </CSVLink>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={selectedPlots}
          stroke="#1f3625"
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setFocusBar(state.activeTooltipIndex);
            } else {
              setFocusBar(null);
            }
          }}
          onClick={(e) => setSelectedPlot(e.activeLabel)}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="plot_name.name" stroke="#1f3625" fill="#1f3625" />
          <YAxis stroke="#1f3625" />
          <Tooltip contentStyle={{ color: "#1f3625" }} />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  focusBar === index
                    ? theme.custom.color.primary.lightgreen
                    : theme.custom.color.primary.green
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
