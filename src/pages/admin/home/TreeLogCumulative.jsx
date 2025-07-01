import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { treeLoggedByDate } from "../../../store/adminAtoms";
import { Typography } from "@mui/material";

export const TreeLogCumulative = () => {
  const theme = useTheme();
  let treeByDate = useRecoilValue(treeLoggedByDate);
  let cumTree = 0;
  
  // Ensure treeByDate is an array
  const treeArray = Array.isArray(treeByDate) ? treeByDate : [];
  
  // Only reverse and map if we have data
  const reversedData = [...treeArray].reverse();
  
  const data = reversedData.map(item => {
    // Ensure _id and count exist and are valid
    const id = item && item._id ? item._id : 'unknown';
    const count = item && typeof item.count === 'number' ? item.count : 0;
    
    return {
      date: id,
      total_tree: (cumTree += count),
    };
  });
  return (
    <div
      style={{
        width: "100%",
        height: "530px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          Cumulative tree count
        </Typography>
      </div>
      <ResponsiveContainer height={480}>
        <AreaChart
          width={"100%"}
          data={data}
          margin={{
            top: 40,
            right: 40,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total_tree"
            stroke={theme.custom.color.primary.green}
            fill={theme.custom.color.primary.lightgreen}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
