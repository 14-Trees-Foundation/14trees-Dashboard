import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the props interface
interface PieChartProps {
  corporateCount: number;
  personalCount: number;
}

const COLORS = ['#2e7d32', '#ed6c02']; // Corporate = Green, Personal = Orange

const GiftTreesChart: React.FC<PieChartProps> = ({ corporateCount, personalCount }) => {
    const total = corporateCount + personalCount;
    const data = [
        { name: 'Corporate', value: corporateCount },
        { name: 'Personal', value: personalCount }
    ];

    // Custom label renderer with percentage
    const renderCustomLabel = (entry: any) => {
        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
        return `${entry.name}: ${percent}%`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ccc',
                            borderRadius: 4
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>

            {total > 0 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Total Gift Cards
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default GiftTreesChart;