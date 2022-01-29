import { Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { CSVLink } from "react-csv";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRecoilValue } from 'recoil';

import {
    filteredTreeTypeCountByPlot
} from '../../../../store/selectors';
import { selectedPlot } from '../../../../store/adminAtoms';
import * as Axios from "../../../../api/local";

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 40) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 30;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} style={{ fontSize: '16px' }} textAnchor="middle" fill={'#1f3625'}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={'#1f3625'}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={'#1f3625'}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={'#1f3625'} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#1f3625">{`Tree Count ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#1f3625">
                {`(Percent ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export const TreeTypeCountByPlot = () => {
    const [treeTypesCount, setTreeTypesCount] = useState([]);
    const csvLink = useRef();
    const [state, setState] = useState(0);
    let treeTypeCount = useRecoilValue(filteredTreeTypeCountByPlot);
    let selPlot = useRecoilValue(selectedPlot);

    let filteredCount = treeTypeCount.map(item => {
        return ({
            name: item.tree_type.name,
            value: item.count
        })
    })

    let headers = [
        { label: "Sapling ID", key: "sapling_id" },
        { label: "Tree Name", key: "name" },
        { label: "Date Added", key: "date" },
    ]

    const getTreeTypeCountByPlotName = async () => {
        try {
            let response = await Axios.default.get(`/trees/treetypecount/plot?plot_name=${selPlot}`);
            if (response.status === 200) {
                let data = response.data.map(item => {
                    return {
                        sapling_id: item.sapling_id,
                        name: item.tree_name.name,
                        date: item.date_added.slice(0, 10),
                    }
                })
                setTreeTypesCount(data);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    const onPieEnter = (_, index) => {
        setState(index);
    };

    let date = new Date().toISOString().slice(0, 10);
    let file_name = 'tree_type_count_' + selPlot + '_' + date + '.csv';

    return (
        <div>
            <ToastContainer />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='subtitle1' gutterBottom>
                    Tree types in <em>{selPlot}</em>
                </Typography>
                <CSVLink style={{ textDecoration: 'none' }} data={treeTypesCount} headers={headers} filename={file_name} ref={csvLink} target='_blank'>
                    <DownloadForOfflineIcon fontSize='large' style={{ cursor: 'pointer', color: '#1f3625' }} onClick={getTreeTypeCountByPlotName} />
                </CSVLink>
            </div>
            <ResponsiveContainer width={'100%'} height={400}>
                <PieChart width={'100%'} height={350}>
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
    )
}
