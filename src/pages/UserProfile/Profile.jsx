import { createStyles, makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';

import { useState } from "react";
import { UserInfo } from "./UserInfo/UserInfo";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

import { useRecoilValue } from 'recoil';
import { usersData } from '../../store/atoms';

import logo from "../../assets/icon_round.png"

export const Profile = () => {
    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
    const [activeStep, setActiveStep] = useState(0);

    const handleInfoChange = (i) => {
        setActiveStep(i)
    }

    const username = userinfo.user.user.name.split(" ")[0]

    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <img src={logo} alt={logo} style={{ width: '50px', height: '50px' }} />
                <div className={classes.username}>
                    {username}'s Dashboard
                </div>
            </div>
            <Divider style={{ marginLeft: '4%', marginRight: '4%' }} />
            <div style={{ padding: '4%' }}>
                <div className={classes.user}>
                    <UserInfo />
                </div>
                <div className={classes.treemap}>
                    <div style={{ display: 'flex' }}>
                        <div className={classes.tree}><Trees /></div>
                        <div className={classes.map}><Map /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            height: '100%',
        },
        header:{
            display: 'flex',
            height: '5vh',
            padding: '3.5vh',
            [theme.breakpoints.down('1500')]: {
                height: '4vh',
                padding: '3vh',
            }
        },
        username: {
            lineHeight: '50px',
            fontSize: '34px',
            color: '#1F3625',
            fontWeight: '500',
            marginLeft: '20px',
            [theme.breakpoints.down('1500')]: {
                lineHeight: '40px',
                fontSize: '28px',
            }
        },
        user: {
            display: 'flex',
            maxHeight: '22vh',
            [theme.breakpoints.down('1500')]: {
                maxHeight: '32vh',
            }
        },
        treemap: {
            fontSize: '30px',
            height: '50vh',
            marginTop: '7%',
            [theme.breakpoints.down('1500')]: {
                height: '52vh',
                marginTop: '1.5%',
            },
        },
        tree: {
            width: '40%',
            height: '50vh',
            marginRight: '-20px',
            zIndex: '1',
            [theme.breakpoints.down('1500')]: {
                height: '52vh',
            },
            [theme.breakpoints.down('1025')]: {
                width: '50%',
            },
        },
        map: {
            width: '70%',
            height: '50vh',
            marginLeft: '-10px',
            [theme.breakpoints.down('1500')]: {
                height: '52vh',
            },
            [theme.breakpoints.down('1025')]: {
                width: '60%',
            },
        }
    })
);