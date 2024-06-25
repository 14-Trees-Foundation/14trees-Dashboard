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

import { Typography } from "@mui/material";
import { CustomBox } from "../../../../components/CustomBox";
import { useAppSelector } from "../../../../redux/store/hooks";

export const PondsHistory = () => {
  const theme = useTheme();
  let pond = useAppSelector((state) => state.pondHistoryData);
  let data;
  if (pond?.updates?.length > 0) {
    data = pond?.updates.map((item) => {
      return {
        date: item.date,
        level: item.levelFt,
      };
    });
  }

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
      {data && (
        <CustomBox>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              Pond level (Feets):{" "}
              <em style={{ color: theme.custom.color.primary.blue }}>
                {pond?.name}
              </em>
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
                type="monotone"
                dataKey="level"
                stroke={theme.custom.color.primary.green}
                fill={theme.custom.color.primary.blue}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CustomBox>
      )}
    </div>
  );
};
