import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

interface BarData {
  key: string;
  value: number;
}

interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  barColor?: string;
  showValues?: boolean;
  axisColor?: string;
  labelColor?: string;
  title?: string;
  cardProps?: {
    elevation?: number;
    sx?: React.CSSProperties;
  };
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  barColor = '#4a90e2',
  showValues = true,
  axisColor = '#333',
  labelColor = '#666',
  title,
  cardProps = { elevation: 0, sx: {} },
}) => {
  if (!data || data.length === 0) {
    return (
      <Card {...cardProps}>
        <CardContent>
          <Typography>No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    name: item.key,
    value: item.value,
  }));

  return (
    <Card {...cardProps}>
      <CardContent>
        {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
        <div style={{ width, height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={formattedData}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke={axisColor}
                tick={{ fill: labelColor, fontSize: 12 }}
              />
              <YAxis
                stroke={axisColor}
                tick={{ fill: labelColor, fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`Count: ${value}`, 'Value']}
                labelStyle={{ color: labelColor }}
                contentStyle={{ borderColor: barColor }}
              />
              <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
                {showValues && (
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill={labelColor}
                    fontSize={12}
                  />
                )}
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColor} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;