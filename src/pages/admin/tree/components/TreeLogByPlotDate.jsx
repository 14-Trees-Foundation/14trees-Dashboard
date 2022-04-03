import { Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRecoilValue } from "recoil";

import { filteredTreeLogByPlotDate } from "../../../../store/selectors";
import { selectedPlot } from "../../../../store/adminAtoms";

export const TreeLogByPlotDate = () => {
  let treeByPlotDate = useRecoilValue(filteredTreeLogByPlotDate);
  let selPlot = useRecoilValue(selectedPlot);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          Tree/date in <em>{selPlot}</em>
        </Typography>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={treeByPlotDate} stroke="#1f3625">
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="_id.date" stroke="#1f3625" fill="#1f3625" />
          <YAxis stroke="#1f3625" />
          <Tooltip contentStyle={{ color: "#1f3625" }} />
          <Bar dataKey="count" fill="#1f3625" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
