import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useRecoilValue } from 'recoil';

import {
    treeLoggedByDate
 } from '../../../../store/adminAtoms';

export const TreeLoggedByDate = () => {
    let treeByDate = useRecoilValue(treeLoggedByDate);
    const [days, setDays] = useState(10);
    const [open, setOpen] = useState(false);

    let treeByDateShow = treeByDate.slice(0,days)

    const handleChange = (event) => {
        setDays(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div style={{'& .MuiSelect-select':{paddingTop:'5px'}}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography variant='h6' gutterBottom>
                    Trees logged in last 20 days
                </Typography>
                <FormControl size='small'>
                    <Select
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={days}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={100}>All</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={treeByDateShow}
                    stroke='#1f3625'
                    margin={{ bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="2 2"/>
                    <XAxis dataKey="_id" stroke='#1f3625' fill='#1f3625' interval={2} angle={-30} textAnchor="end"/>
                    <YAxis stroke='#1f3625'/>
                    <Tooltip contentStyle={{color:'#1f3625'}}/>
                    <Bar dataKey="count" fill="#1f3625"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
