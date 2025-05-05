import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Define the props interface 
interface PieChartProps {
  corporateCount: number;
  personalCount: number;
}

const COLORS = ['#0088FE', '#FFBB28']; // Corporate = Blue, Personal = Yellow

const GiftTreesChart: React.FC<PieChartProps> = ({ corporateCount, personalCount }) => {
    const data = [
        { name: 'Corporate', value: corporateCount },
        { name: 'Personal', value: personalCount }
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <PieChart width={400} height={300}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default GiftTreesChart;
