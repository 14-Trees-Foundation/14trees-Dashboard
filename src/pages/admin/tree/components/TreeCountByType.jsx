import { Typography } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

import { useRecoilValue } from "recoil";

import { treeTypeCount } from "../../../../store/adminAtoms";

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
        style={{ fontSize: "12px" }}
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
        style={{ fontSize: "12px" }}
        textAnchor={textAnchor}
        fill="#1f3625"
      >{`Tree Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        style={{ fontSize: "12px" }}
        dy={18}
        textAnchor={textAnchor}
        fill="#1f3625"
      >
        {`(Percent ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const TreeCountByType = () => {
  let treeCountByType = useRecoilValue(treeTypeCount);

  let fiilteredCount = treeCountByType.map((item) => {
    return {
      name: item?.tree_type[0]?.name,
      value: item?.count,
    };
  });

  // fiilteredCount = fiilteredCount.slice(0, 50);

  const [state, setState] = useState(0);

  const onPieEnter = (_, index) => {
    setState(index);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Total tree by tree-type
      </Typography>
      {/* <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={treeByPlot}
                    stroke='#1f3625'
                    onClick={(e) => setSelectedPlot(e.activeLabel)}
                >
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis
                        dataKey="plot_name.name"
                        stroke='#1f3625'
                        fill='#1f3625'
                    />
                    <YAxis stroke='#1f3625' />
                    <Tooltip contentStyle={{ color: '#1f3625' }} />
                    <Bar dataKey="count" fill="#1f3625" />
                </BarChart>
            </ResponsiveContainer> */}
      <ResponsiveContainer width={"100%"} height={400}>
        <PieChart width={"100%"} height={350}>
          <Pie
            activeIndex={state}
            activeShape={renderActiveShape}
            data={fiilteredCount}
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
