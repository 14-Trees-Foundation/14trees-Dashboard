import { Typography } from "@mui/material";
import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import "react-toastify/dist/ReactToastify.css";

import { useRecoilValue } from "recoil";

import { filteredTreeTypeCountByPlot } from "../../../../store/selectors";
import { selectedPlot } from "../../../../store/adminAtoms";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 40) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 30;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        style={{ fontSize: "16px" }}
        textAnchor="middle"
        fill={"#1f3625"}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={"#1f3625"}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={"#1f3625"}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={"#1f3625"}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#1f3625"
      >{`Tree Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#1f3625"
      >
        {`(Percent ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const TreeTypeCountByPlot = () => {
  const [state, setState] = useState(0);
  let treeTypeCount = useRecoilValue(filteredTreeTypeCountByPlot);
  let selPlot = useRecoilValue(selectedPlot);

  let filteredCount = treeTypeCount.map((item) => {
    return {
      name: item.tree_type.name,
      value: item.count,
    };
  });

  const onPieEnter = (_, index) => {
    setState(index);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          Tree types in <em>{selPlot}</em>
        </Typography>
      </div>
      <ResponsiveContainer width={"100%"} height={400}>
        <PieChart width={"100%"}>
          <Pie
            activeIndex={state}
            activeShape={renderActiveShape}
            data={filteredCount}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#9BC53D"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
