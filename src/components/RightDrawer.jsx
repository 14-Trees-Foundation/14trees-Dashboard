import { createStyles, makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

import { NewsFeed } from './NewsFeed'
import { Impact } from "../stories/Impact/Impact";

export const RightDrawer = () => {
    const classes = useStyles();
    return (
        <Drawer
            className={classes.rdrawer}
            variant="permanent"
            anchor="right"
        >
        <div>
            <div className={classes.main}>
                <h3 style={{ marginLeft: '9%' }}>Overall Impact</h3>
                <Divider style={{ margin: '0 9% 2% 9%' }} />
                <div className={classes.infobox}>
                    <Impact count={'150+'} text={"People employed from local community"} />
                    <Impact count={'190+'} text={"Ponds created to increase water label"} />
                </div>
                <div className={classes.infobox}>
                    <Impact size={'large'} count={'28000+'} text={"Trees planted till date"} />
                </div>
                <h3 style={{ marginLeft: '9%' }}>What's New</h3>
                <Divider style={{ margin: '0 9% 2% 9%' }} />
            </div>
            <div className={classes.feed}>
                <NewsFeed />
            </div>
        </div>
        </Drawer>
    )
}


const useStyles = makeStyles((theme) =>
    createStyles({
        rdrawer: {
            width: '21%',
            '& .MuiPaper-root': {
                width: '21%',
                backgroundColor: '#B1BFB5',
                paddingTop: '20px',
                overflowY: 'hidden'
            },
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        main: {
            maxHeight: '55vh',
            [theme.breakpoints.up('lg')]: {
                maxHeight: '45vh',
            }
        },
        infobox: {
            marginLeft: '9%',
            marginRight: '20px',
            display: 'flex',
            [theme.breakpoints.down('lg')]: {
                flexWrap: 'wrap'
            }
        },
        feed: {
            marginLeft: '9%',
            marginRight: '20px',
            maxHeight: '48vh',
            overflowX: 'hidden',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '10px',
            '&::-webkit-scrollbar': {
                width: '0.6em',

            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#1F3625',
                borderRadius: '0.3em',
                height: '10px'
            },
            [theme.breakpoints.up('1500')]: {
                maxHeight: '55vh',
            },
            [theme.breakpoints.down('1025')]: {
                marginTop: '5px',
                maxHeight: '35vh',
            }
        }
    }))