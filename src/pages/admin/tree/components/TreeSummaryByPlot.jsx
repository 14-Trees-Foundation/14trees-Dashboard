import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useRecoilValue } from 'recoil';

import {
    treeByPlots
 } from '../../../../store/adminAtoms';

export const TreeSummaryByPlot = () => {
    let treeByPlot = useRecoilValue(treeByPlots);
    return (
        <div>
            <Typography variant='h6' gutterBottom>
                Total tree count by plot name
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={treeByPlot}
                    stroke='#1f3625'
                >
                    <CartesianGrid strokeDasharray="2 2"/>
                    <XAxis
                        dataKey="plot_name.name"
                        stroke='#1f3625'
                        fill='#1f3625'
                    />
                    <YAxis stroke='#1f3625'/>
                    <Tooltip contentStyle={{color:'#1f3625'}}/>
                    <Bar dataKey="count" fill="#1f3625"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
