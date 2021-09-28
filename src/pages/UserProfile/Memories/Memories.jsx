import { createStyles, makeStyles } from '@mui/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Chip } from "../../../stories/Chip/Chip";

import { useRecoilValue } from 'recoil';
import { usersData } from '../../../store/atoms';
import { useState } from 'react';

export const Memories = () => {
    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
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

    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <div style={{ fontSize: '16px', fontWeight: '700', padding: '5px' }}>
                    Memories
                </div>
                <Chip label={"See All"} mode={'primary'} size={'small'} />
                <div style={{ marginLeft: 'auto', marginRight: '20px', paddingTop: '5px' }}>
                    <ArrowBackIosIcon fontSize="small" style={{ color: 'green', cursor: 'pointer' }} onClick={() => prev()} />
                    <ArrowForwardIosIcon fontSize="small" style={{ color: 'green', cursor: 'pointer' }} onClick={() => next()} />
                </div>
            </div>
            <div className={classes.slideshow}>
                <div className={classes.slider} style={{ transform: `translate3d(${-index * 240}px, 0, 0)` }}>
                    {images.map((image, index) => (
                        <div className={classes.slide} key={index}>
                            <img className={classes.memimage} src={image} alt={"A"} />
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            width: '90%',
            height: '35vh',
            borderRadius: '12px',
            marginTop: '25px',
            backgroundColor: '#ffffff',
            marginLeft: '25px',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
            [theme.breakpoints.down('1500')]: {
                width: '88%',
            }
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
        slider: {
            whiteSpace: 'nowrap',
            transition: 'ease 1000ms',
        },
        slide: {
            display: 'inline-block',
            margin: '5px'
        },
        memimage: {
            width: '230px',
            height: '26vh',
            borderRadius: '13px',
            objectFit: 'cover',
            padding: '2%',
        },
    })
);