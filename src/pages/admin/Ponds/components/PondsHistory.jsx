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

import { pondHistory, selectedPond } from "../../../../store/adminAtoms";
import { Typography, Box } from "@mui/material";

export const PondsHistory = () => {
  const theme = useTheme();
  let history = useRecoilValue(pondHistory);
  let pondName = useRecoilValue(selectedPond);
//  let data = history.map(({levelFt, date, images, ...attrs}) => ({date, levelFt}))
console.log(history)
let data;
if(history.length > 0){
    data = history.map((item) => {
        return {
          date: item.date,
          level: item.levelFt
        }
      
      })
}
console.log(data)

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
        {
            data && (
                <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 3, boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          Pond level (Feets): <em style={{color:theme.custom.color.primary.blue}}>{pondName}</em>
        </Typography>
      </div>
      <ResponsiveContainer height={595}>
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
            type="basisOpen"
            dataKey="level"
            stroke={theme.custom.color.primary.green}
            fill={theme.custom.color.primary.blue}
          />
        </AreaChart>
      </ResponsiveContainer>
      </Box>
            )
        }
    </div>
  );
};
