import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { makeStyles } from '@mui/styles';

import { useRecoilValue } from 'recoil';

import {
    treeByPlots
 } from '../../../../store/adminAtoms';

export const TreeSummaryByPlot = () => {
    let treeByPlot = useRecoilValue(treeByPlots);
    console.log(treeByPlot)
    // treeByPlot = treeByPlot.sort((a, b) => (a.count) - (b.count));

    // const classes = useStyles();
    return (
        <div style={{padding:'16px'}}>
                <BarChart
                    width={1080}
                    height={600}
                    data={treeByPlot}
                    stroke='#ffffff'
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="plot_name.name" stroke='#ffffff' fill='#1f3625'/>
                    <YAxis stroke='#ffffff'/>
                    <Tooltip contentStyle={{color:'#1f3625'}}/>
                    <Bar dataKey="count" fill="#1f3625"/>
                </BarChart>
        </div>
    )
}

// const useStyles = makeStyles((theme) => ({
//     bar: {
//         backgroundColor: '#ff0000'
//     }
// }))