import { createStyles, makeStyles } from '@mui/styles';
import { Button, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';

import { totalTrees, totalTreeTypes } from '../../store/adminAtoms';

export const AdminHome = () => {
    const navigate = useNavigate();
    const totalTree = useRecoilValue(totalTrees);
    const totalTreeType = useRecoilValue(totalTreeTypes);
    const classes = useStyles();
    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={6} md={3}>
                    <div className={classes.card}>
                        <Box>
                            <Typography variant="body1">Total Trees</Typography>
                            <Typography variant="h3">{totalTree.count}</Typography>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={6} md={3}>
                    <div className={classes.card}>
                        <Box>
                            <Typography variant="body1">Total Trees</Typography>
                            <Typography variant="h3">{totalTreeType.count}</Typography>
                        </Box>
                    </div>
                </Grid>
            </Grid>
            <div style={{display: 'flex'}}>
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
            maxWidth: '160px',
            minHeight: '160px',
            maxHeight: '260px',
            borderRadius: '15px',
            backgroundColor: '#ffffff',
            marginLeft: '20px',
            textAlign: 'center',
            padding: '16px',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)'
        },
    })
)