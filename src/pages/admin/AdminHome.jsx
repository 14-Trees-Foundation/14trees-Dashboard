import { createStyles, makeStyles } from '@mui/styles';
import { Button, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';

import {
    totalTrees,
    totalTreeTypes,
    uniqueUsers,
    totalPlots
 } from '../../store/adminAtoms';

export const AdminHome = () => {
    const navigate = useNavigate();
    const totalTree = useRecoilValue(totalTrees);
    const totalTreeType = useRecoilValue(totalTreeTypes);
    const uniqueUser = useRecoilValue(uniqueUsers);
    const totalPlot = useRecoilValue(totalPlots);
    const classes = useStyles();
    return (
        <div>
            <Grid container>
                <Grid item xs={6} md={2}>
                    <div className={classes.card}>
                        <Box sx={{paddingTop: '16px'}}>
                            <Typography color="#1f3625" variant="body1">Total Trees</Typography>
                            <Typography variant="h3" color="#9BC53D">{totalTree.count}</Typography>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={6} md={2}>
                    <div className={classes.card}>
                        <Box sx={{paddingTop: '16px'}}>
                            <Typography variant="body1" color="#1f3625">Total Tree Types</Typography>
                            <Typography variant="h3" color="#9BC53D">{totalTreeType.count}</Typography>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={6} md={2}>
                    <div className={classes.card}>
                        <Box sx={{paddingTop: '16px'}}>
                            <Typography variant="body1" color="#1f3625">Total Unique Profile</Typography>
                            <Typography variant="h3" color="#9BC53D">{uniqueUser.count}</Typography>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={6} md={2}>
                    <div className={classes.card}>
                        <Box sx={{paddingTop: '16px'}}>
                            <Typography variant="body1" color="#1f3625">Total Plots</Typography>
                            <Typography variant="h3" color="#9BC53D">{totalPlot.count}</Typography>
                        </Box>
                    </div>
                </Grid>
            </Grid>
            <div style={{display: 'flex', justifyContent:'center', maxWidth: '480px'}}>
                <Button
                    sx={{m:2}}
                    size='large'
                    variant="contained"
                    color='primary'
                    onClick={() => navigate('/admin/assigntrees')}>
                        AssignTrees
                </Button>
                <Button
                    sx={{m:2}}
                    size='large'
                    variant="contained"
                    color='primary'
                    onClick={() => navigate('/admin/addorg')}>
                        Add Org
                </Button>
            </div>
        </div>
    )
}


const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            width: '100%',
            maxWidth: '150px',
            minHeight: '150px',
            maxHeight: '260px',
            borderRadius: '15px',
            backgroundColor: '#ffffff',
            textAlign: 'center',
            padding: '16px',
            margin: '16px',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)'
        },
    })
)