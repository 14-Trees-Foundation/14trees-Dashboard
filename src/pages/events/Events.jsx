import React, { Fragment } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { Appbar } from './Appbar';
import headerimg from '../../assets/header.png';
import logos from '../../assets/logos.png';
import item1 from '../../assets/item1.png';
import item2 from '../../assets/item2.png';
import vector1 from '../../assets/vector1.png';

import { Divider } from '@mui/material';


export const Events = () => {

    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.main}>
                <Appbar />
                <div className={classes.header}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <div className={classes.logos}>
                                    <img className={classes.logo} src={logos} alt="logo" />
                                </div>
                                <p className={classes.maintxt}>
                                    Celebrating 20 years of reimagining mobility together
                                </p>
                                <Divider style={{background: '#ffffff'}}/>
                                <div className={classes.detail}>
                                    <div style={{marginBottom: '5px'}}>Event name: KPIT</div>
                                    <div style={{marginBottom: '20px'}}>Organized On: 28th of oct, 2021</div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.num}>
                                        12
                                    </div>
                                    <div className={classes.numDetail}>
                                        People Attended
                                    </div>
                                    <div style={{width: '20px'}}></div>
                                    <div className={classes.num}>
                                        20
                                    </div>
                                    <div className={classes.numDetail}>
                                        Trees Planted
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <div style={{position: 'relative'}}>
                                    <img className={classes.item2} src={item2} alt="item1" />
                                    <img className={classes.headerimg} src={headerimg} alt="header logo"/>
                                    <img className={classes.item1} src={item1} alt="item2" />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                {/* <img style={{width: '100%', height: '100px'}} src={vector1} alt="vector1"/> */}
            </div>
        </Fragment>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main:{
            minHeight: '100vh',
            backgroundColor: '#846C5B',
        },
        header: {
            padding: theme.spacing(8),
            backgroundColor: '#846C5B',
            paddingTop: theme.spacing(4),
            minHeight: '100vh',
            maxWidth: '100vw',
            marginLeft: "auto",
            marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(3),
            },
        },
        item2: {
            position: 'absolute',
            zIndex: '1',
            width: '130px',
            height: '80px',
            left: '-40px'
        },
        item1: {
            position: 'absolute',
            zIndex: '1',
            width: '80px',
            height: '80px',
            left:'90%',
            top: '58vh'
        },
        headerimg:{
            position: 'absolute',
            width: '100%',
            height: '65vh',
            top: '10px',
            [theme.breakpoints.down('480')]: {
                height: '45vh',
            },
        },
        logos: {
            display: 'flex',
        },
        logo: {
            maxWidth: '320px',
            height: '70px',
            padding: theme.spacing(1),
        },
        maintxt: {
            fontSize: '45px',
            color: '#ffffff',
            fontWeight: 'bold',
        },
        detail: {
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '350',
            marginTop: theme.spacing(4),
            display: 'block'
        },
        num:{
            fontSize: '35px',color: '#EDD9A3', fontWeight: '300'
        },
        numDetail: {
            fontSize: '13px', width: '60px', color: '#ffffff', fontWeight: '300', padding: theme.spacing(1)
        }
    })
)