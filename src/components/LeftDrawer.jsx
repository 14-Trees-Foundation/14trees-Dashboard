import Drawer from '@mui/material/Drawer';
import { createStyles, makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';

import { Profile } from '../pages/UserProfile/Profile';
import { Maps } from "../pages/Maps/Maps";

import { useRecoilState } from 'recoil';
import { navIndex } from '../store/atoms'

import logo from "../assets/logo_white_small.png"

export const LeftDrawer = () => {

    const classes = useStyles();
    const [index, setIndex] = useRecoilState(navIndex);

    const onClickNav = (value) => {
        setIndex(value);
    }

    const pages = [
        {
            page: Profile,
            displayName: 'Profile',
            logo: logo
        },
        {
            page: Maps,
            displayName: 'Site Map',
            logo: logo
        },
        {
            page: Maps,
            displayName: 'Trees',
            logo: logo
        },
    ]

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
        >
            <Divider />
            <img className={classes.logo} alt={'logo'} src={logo} />
            <div className={classes.itemlist}>
                {
                    pages.map((item, i) => {
                        return (
                            <div className={classes.item} onClick={() => onClickNav(i)} key={i}>
                                <div className={index === i ? classes.selected : classes.itembtn}>
                                    <img className={classes.itemlogo} alt={"items"} src={item.logo} />
                                    <div className={classes.itemtext}>{item.displayName}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </Drawer>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        drawer: {
            width: '14%',
            '& .MuiPaper-root': {
                width: '14%',
                backgroundColor: '#3F5344',
                borderTopRightRadius: '10px'
            }
        },
        itemlist: {
            width: '100%',
            color: '#ffffff',
        },
        item: {
            cursor: 'pointer',
            color: '#ffffff',
            width: '80%',
            margin: '0 auto 20px auto',
        },
        itembtn: {
            borderRadius: '20px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3F5344',
            '&:hover': {
                backgroundColor: '#9BC53D',
            },
        },
        selected: {
            borderRadius: '20px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#9BC53D',
        },
        logo: {
            width: '80px',
            height: '100px',
            margin: '12px auto 30px auto',
            paddingTop: '25px',
            [theme.breakpoints.down('md')]: {
                width: '60px',
                height: '80px',
            },
            [theme.breakpoints.down('sm')]: {
                width: '40px',
                height: '55px',
            }
        },
        itemlogo: {
            width: '18px',
            height: '20px',
        },
        itemtext: {
            margin: '5px',
            fontWeight: 450,
            fontSize: 16,
            [theme.breakpoints.down('md')]: {
                display: 'none'
            }
        },
    })
)