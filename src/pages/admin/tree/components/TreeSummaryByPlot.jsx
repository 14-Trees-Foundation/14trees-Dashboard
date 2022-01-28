import { Typography } from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { CSVLink } from "react-csv";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    treeByPlots,
    selectedPlot
} from '../../../../store/adminAtoms';

export const TreeSummaryByPlot = () => {
    let treeByPlot = useRecoilValue(treeByPlots);
    const setSelectedPlot = useSetRecoilState(selectedPlot);

    let headers = [
        { label: "Tree Coount", key: "count" },
        { label: "Plot Name", key: "plot_name" },
    ]
    let data = treeByPlot.map(item => {
        return {
            count: item.count,
            plot_name: item.plot_name.name
        }
    })

    let date = new Date().toISOString().slice(0, 10);
    let file_name = 'tree_count_by_plot' + date + '.csv';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6' gutterBottom>
                    Tree count by plot
                </Typography>
                <CSVLink data={data} filename={file_name} headers={headers}>
                    <DownloadForOfflineIcon fontSize='large' style={{ cursor: 'pointer', color: '#1f3625' }} />
                </CSVLink>
            </div>
            <ResponsiveContainer width="100%" height={400}>
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
            </ResponsiveContainer>
        </div>
    )
}
