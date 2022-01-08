import { useState } from 'react';
import {
    Drawer,
    Divider,
    Box,
    AppBar,
    Toolbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import logo from "../../assets/logo_white_small.png";
import { useRecoilState } from 'recoil';
import { navIndex } from '../../store/adminAtoms';
import { AdminHome } from './home/AdminHome';
import { Tree } from './tree/Tree';

export const AdminLeftDrawer = () => {
    const theme = useTheme();
    const matches = useMediaQuery('(max-width:481px)');
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [index, setIndex] = useRecoilState(navIndex);

    const onClickNav = (value) => {
        setIndex(value);
    }

    const pages = [
        {
            page: AdminHome,
            displayName: 'Home',
            logo: logo
        },
        {
            page: Tree,
            displayName: 'Tree',
            logo: logo
        }
    ]
    const menuitem = () => {
        return (
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
        )
    }
    if(matches) {
        return (
            <Box>
                <AppBar position="fixed" open={open} className={classes.appbar}>
                    <Toolbar style={{backgroundColor: '#1F3625'}}>
                        <div className={classes.header}>
                            <MenuIcon onClick={() => setOpen(true)} />
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.mdrawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Divider />
                    <img className={classes.logo} alt={'logo'} src={logo} />
                    {
                        menuitem()
                    }
                </Drawer>
            </Box>
        )
    } else {
        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="left"
            >
                <Divider />
                <img className={classes.logo} alt={'logo'} src={logo} />
                {
                    menuitem()
                }
            </Drawer>
        )
    }
}

const useStyles = makeStyles((theme) =>
    createStyles({
        appbar: {
            color: '#ffffff'
        },
        drawer: {
            width: '14%',
            '& .MuiPaper-root': {
                width: '14%',
                backgroundColor: '#3F5344',
                borderTopRightRadius: '10px'
            }
        },
        mdrawer: {
            width: '20%',
            '& .MuiPaper-root': {
                width: '20%',
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