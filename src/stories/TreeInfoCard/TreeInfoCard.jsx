import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';

import icon from '../assets/markericon.png';

import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SwipeableViews from 'react-swipeable-views';

const UseStyle = makeStyles((theme) => ({
    main: {
        width: '100%',
        minHeight: '400px',
        height: '100%',
        borderRadius: '7px 0 0 7px',
        maxWidth: '500px',
        backgroundColor: '#1F3625',
        display: 'inline-block',
        [theme.breakpoints.down('md')]:{
            '& .MuiFormControl-root':{
                width: '93%',
                margin: '12px',
            },
        }
    },
    info: {
        backgroundColor: '#ffffff',
        margin: '10px 10px 0px 10px',
        minHeight: '340px',
        height: '80vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius:'7px',
        minWidth: '93%',
        '&::-webkit-scrollbar':{
            display: 'none',
        }
    },
    treeinfo: {
        paddingTop: '45px',
        paddingLeft: '7px'
    },
    memories: {
        marginLeft: '10px',
        marginBottom: '10px',
        display: 'flex',
        flexWrap: 'no-wrap',
        overflowX: 'auto',
    },
    memimg: {
        borderRadius:'7px',
        flex: '0 0 auto',
        height: '200px',
        maxWidth: '330px',
        marginRight: '15px',
    },
    navbtn: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '3vh 10px 15px 10px',
        color: '#ffffff'
    },
    keybtn: {
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: '350',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    }
}));

const images = [
  {
    label: 'San Francisco',
    sci_name: 'Some sci name',
    imgPath:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Bird',
    sci_name: 'Some sci name',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Bali, Indonesia',
    sci_name: 'Some sci name',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    label: 'Goč, Serbia',
    sci_name: 'Some sci name',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];

export const TreeInfoCard = ({activeStep, ...props}) => {
    const classes = UseStyle();
    const theme = useTheme();

    return (
        <div className={classes.main}>
            <div className={classes.info}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    enableMouseEvents
                >
                    {images.map((step, index) => (
                    <div key={step.label}>
                        {Math.abs(activeStep - index) <= 2 ? (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    borderRadius={'7%'}
                                    component="img"
                                    sx={{
                                        height: 300,
                                        display: 'block',
                                        maxWidth: 300,
                                        overflow: 'hidden',
                                        width: '100%',
                                        padding: '10px',
                                    }}
                                    src={step.imgPath}
                                    alt={step.label}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <div className={classes.treeinfo}>
                                    <div style={{fontSize:'20px',fontWeight: 'bold'}}>{step.label}</div>
                                    <div>{step.sci_name}</div>
                                    <div style={{color:'#9BC53D', fontSize:'12px'}}>{step.sci_name}</div>
                                    <div style={{color:'#9BC53D', fontSize:'12px'}}>{step.sci_name}</div>
                                    <Button style={{marginTop:'10px'}} size='large' variant="contained" color='primary'>Submit</Button>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{display: 'flex', marginLeft: '10px'}}>
                                    <img src={icon} alt={'icon'} style={{width:'30px', height:'30px'}}/>
                                    <p style={{textAlign:'center', lineHeight:'30px',margin:'0 0 0 5px'}}>Characteristics</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                            <div style={{display: 'flex', marginLeft: '10px'}}>
                                    <img src={icon} alt={'icon'} style={{width:'30px', height:'30px'}}/>
                                    <p style={{textAlign:'center', lineHeight:'30px',margin:'0 0 0 5px'}}>Benefits</p>
                                </div>
                            </Grid>
                            <Grid item xs={11}>
                                <p style={{borderBottom: '2px solid #e9e9e9', marginLeft:'20px'}}></p>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{display: 'flex', marginLeft: '10px'}}>
                                    <img src={icon} alt={'icon'} style={{width:'30px', height:'30px'}}/>
                                    <p style={{textAlign:'center', lineHeight:'30px',margin:'0 0 0 5px'}}>Event: Individual Visit</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.memories}>
                                    <img className={classes.memimg} src={step.imgPath} alt={step.label}/>
                                    <img className={classes.memimg} src={step.imgPath} alt={step.label}/>
                                    <img className={classes.memimg} src={step.imgPath} alt={step.label}/>
                                </div>
                            </Grid>
                        </Grid>
                        ) : null}
                    </div>
                    ))}
                </SwipeableViews>
            </div>
            <div className={classes.navbtn}>
                {props.children}
            </div>
        </div>
    );
}

TreeInfoCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  img: PropTypes.string,
  date: PropTypes.string
};

export default TreeInfoCard;