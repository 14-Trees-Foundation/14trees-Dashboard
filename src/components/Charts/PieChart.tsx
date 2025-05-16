import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

interface DataItem {
  key: string;
  value: number;
}

interface PieChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  colors?: string[];
  title?: string;
  cardProps?: {
    elevation?: number;
    sx?: React.CSSProperties;
  };
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  title,
  cardProps = { elevation: 3, sx: {} },
}) => {
  // Filter out items with zero/null values
  const filteredData = data.filter(item => item.value > 0);
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);

  // Add percentage field for labeling
  const chartData = filteredData.map(item => ({
    name: item.key,
    value: item.value,
    percentage: ((item.value / total) * 100).toFixed(1),
  }));

  if (filteredData.length === 0) {
    return (
      <Card {...cardProps}>
        <CardContent>
          {title && <Typography variant="h6">{title}</Typography>}
          <Typography>No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card {...cardProps}>
      <CardContent>
        {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RechartsPieChart width={width} height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(width, height) / 2.5}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`Count: ${value}`, name]}
            />
            <Legend />
          </RechartsPieChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;
