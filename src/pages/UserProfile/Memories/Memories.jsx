import { createStyles, makeStyles } from '@mui/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Chip } from "../../../stories/Chip/Chip";
import { Popup } from "../../../stories/Popup/Popup";

import { useRecoilValue, useRecoilState } from 'recoil';
import { usersData, openPopup } from '../../../store/atoms';
import { useState } from 'react';

export const Memories = () => {
    const classes = useStyles();
    const matches = useMediaQuery('(max-width:481px)');

    const userinfo = useRecoilValue(usersData);
    const [open, setOpenPopup] = useRecoilState(openPopup);
    const [index, setIndex] = useState(0);

    let images = [];
    for (const tree of userinfo.trees) {
        images.push.apply(images, tree['memories']);
    }

    const next = () => {
        if (index < images.length - 1) {
            setIndex(index + 1)
        }
    }

    const prev = () => {
        if (index !== 0) {
            setIndex(index - 1)
        }
    }

    const onTogglePop = () => {
        setOpenPopup(!open)
    }

    const handleOpenPopup = () => {
        setOpenPopup(true)
    }

    if(open) {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Popup toggle={onTogglePop}>
                    <div className={classes.slideshowWindow}>
                        <div className={classes.slider} style={{ transform: matches ? `translate3d(${-index * 310}px, 0, 0)` : `translate3d(${-index * 700}px, 0, 0)`}}>
                            {images.map((image, index) => (
                                <div className={classes.slide} key={index}>
                                    <img className={classes.memimageWindow} src={image} alt={"A"}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginLeft: matches? '65%':'85%', marginRight: 'auto', width: '100%', paddingTop: '5px' }}>
                        <ArrowBackIosIcon fontSize="large" style={{ color: 'white', cursor: 'pointer' }} onClick={() => prev()} />
                        <ArrowForwardIosIcon fontSize="large" style={{ color: 'white', cursor: 'pointer', marginLeft: '30px' }} onClick={() => next()} />
                    </div>
                </Popup>
            </div>
        )
    } else {
        return (
            <div className={classes.main}>
                <div className={classes.header}>
                    <div style={{ fontSize: '16px', fontWeight: '700', padding: '5px' }}>
                        Memories
                    </div>
                    {/* <Chip label={"See All"} mode={'primary'} size={'small'} /> */}
                    <div style={{ marginLeft: 'auto', marginRight: '20px', paddingTop: '5px' }}>
                        <ArrowBackIosIcon fontSize="small" style={{ color: 'green', cursor: 'pointer' }} onClick={() => prev()} />
                        <ArrowForwardIosIcon fontSize="small" style={{ color: 'green', cursor: 'pointer' }} onClick={() => next()} />
                    </div>
                </div>
                <div className={classes.slideshow}>
                    <div className={classes.slider} style={{ transform: `translate3d(${-index * 240}px, 0, 0)` }}>
                        {images.map((image, index) => (
                            <div className={classes.slide} key={index}>
                                <img className={classes.memimage} src={image} alt={"A"} onClick={() => handleOpenPopup()}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        )
    }
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            width: '100%',
            maxHeight: '100%',
            borderRadius: '15px',
            backgroundColor: '#ffffff',
            marginLeft: '20px',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
            [theme.breakpoints.down('1500')]: {
                width: '98%',
            },
            [theme.breakpoints.down('480')]: {
                marginLeft: '1px',
                marginTop: '15px',
                width: '100%',
            },
        },
        header: {
            display: 'flex',
            paddingTop: '3%',
            paddingLeft: '3%'
        },
        slideshow: {
            margin: '5px',
            overflow: 'hidden',
        },
        slideshowWindow: {
            marginTop: '40px',
            overflow: 'hidden',
            [theme.breakpoints.down('480')]: {
                marginTop: '30px'
            }
        },
        slider: {
            whiteSpace: 'nowrap',
            transition: 'ease 1000ms',
        },
        slide: {
            display: 'inline-block',
            margin: '5px'
        },
        memimage: {
            width: '210px',
            height: '190px',
            borderRadius: '15px',
            objectFit: 'cover',
            padding: '2%',
            paddingTop: '4px',
            cursor: "pointer",
            [theme.breakpoints.down('1500')]: {
                width: '170px',
                height: '160px'
            }
        },
        memimageWindow: {
            width: '720px',
            height: '480px',
            borderRadius: '20px',
            objectFit: 'cover',
            padding: '2%',
            [theme.breakpoints.down('480')]: {
                width: '300px',
                height: '260px'
            }
        }
    })
);