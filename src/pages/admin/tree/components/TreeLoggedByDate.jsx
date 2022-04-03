import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useRecoilValue } from "recoil";

import { treeLoggedByDate } from "../../../../store/adminAtoms";

export const TreeLoggedByDate = () => {
  const theme = useTheme();
  let treeByDate = useRecoilValue(treeLoggedByDate);
  const [days, setDays] = useState(20);
  const [open, setOpen] = useState(false);

  let treeByDateShow = treeByDate.slice(0, days);

  const handleChange = (event) => {
    setDays(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ "& .MuiSelectSselect": { paddingTop: "5px" } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle1" gutterBottom>
          Tree count by date (All Plots/All Users)
        </Typography>
        <FormControl size="small">
          <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={days}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={100}>All</MenuItem>
          </Select>
        </FormControl>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={treeByDateShow}
          stroke="#1f3625"
          margin={{ bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis stroke="#1f3625" />
          <Tooltip contentStyle={{ color: "#1f3625" }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#000000"
            fill={theme.custom.color.primary.brown}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
