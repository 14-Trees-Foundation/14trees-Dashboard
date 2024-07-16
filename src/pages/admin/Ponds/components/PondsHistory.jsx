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
import { useEffect, useRef } from "react";
import { Empty } from "antd";

export const PondsHistory = ({ selectedPond }) => {
  const theme = useTheme();
  const targetRef = useRef(null);

  let waterLevelData = useAppSelector((state) => state.pondWaterLevelUpdatesData);
  let data;
  if (waterLevelData && waterLevelData.pondWaterLevelUpdates) {
    const updates = Object.values(waterLevelData.pondWaterLevelUpdates);
    data = updates.map((item) => {
      return {
        date: item.updated_at?.substring(0, 10),
        level: parseFloat(item.level_ft),
      };
    });
  }

  useEffect(() => {
    if (data && selectedPond && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
      ref={targetRef}
    >
      {data && data.length > 0 && (
        <CustomBox>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              Pond level (Feets):{" "}
              <em style={{ color: theme.custom.color.primary.blue }}>
                {selectedPond?.name}
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

      {data && selectedPond && data.length === 0 && (
        <CustomBox>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              Pond level (Feets):{" "}
              <em style={{ color: theme.custom.color.primary.blue }}>
                {selectedPond?.name}
              </em>
            </Typography>
          </div>
          <Empty />
        </CustomBox>
      )}
    </div>
  );
};
