import React, { Fragment } from "react";
import logo from '../../assets/logo_white_small.png';
import { Chip } from "../../stories/Chip/Chip";
import { createStyles, makeStyles } from '@mui/styles';

export const AppBar = () => {

    const classes = UseStyle();

    return (
        <Fragment>
            <div className={classes.appbar}>
                <nav className={classes.content}>
                    <div className={classes.logo}>
                        <img style={{ width: '40px', marginLeft: '5px' }} src={logo} alt="logo banner" />
                    </div>
                    <div className={classes.right}>
                        <h2 className={classes.links}>Home</h2>
                        <h2 className={classes.links}>Events</h2>
                        <h2 className={classes.links}>Search</h2>
                        <h2 className={classes.links}>About</h2>
                        <Chip
                            label={'Admin Login'}
                            mode={'primary'}
                        // handleClick={onChipSelect}
                        />
                    </div>
                </nav>
            </div>
        </Fragment>
    )
}

const UseStyle = makeStyles((theme) =>
    createStyles({
        appbar: {
            width: '100vw',
            position: 'absolute',
            top: '0',
            left: '0',
        },
        content: {
            height: '67px',
            display: 'flex',
            width: '100 %',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '5px'
        },
        logo: {
            height: '60px',
            width: '60px',
            alignItems: 'center',
            marginLeft: '1rem'
        },
        right: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        links: {
            fontWeight: '350',
            color: '#ffffff',
            marginLeft: '2%',
            marginRight: '2%',
            cursor: 'pointer',
            [theme.breakpoints.down('md')]: {
                display: 'none'
            }
        }
    }))