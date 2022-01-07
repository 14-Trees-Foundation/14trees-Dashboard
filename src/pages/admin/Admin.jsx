import {
    Outlet
} from "react-router-dom";
import { createStyles, makeStyles } from '@mui/styles';

import bg from "../../assets/bg.png";

export const Admin = () => {
    const classes = useStyles();
    return (
        <div className={classes.box}>
            <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/>
            <div className={classes.overlay} style={{height: '100vh'}}>
                <Outlet />
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        box: {
            width: '100%',
            position: 'relative',
            backgroundColor: '#e5e5e5',
            overflow: 'auto',
            minHeight: '100vh',
        },
        bg: {
            width: '100%',
            objectFit: 'cover',
        },
        overlay: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            background: 'linear-gradient(358.58deg, #1F3625 17.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)',
        },
    })
)