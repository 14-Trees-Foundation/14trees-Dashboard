import { Fragment } from 'react';
import { Grid } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { Memories } from "../Memories/Memories";
import { InfoChip } from "../../../stories/InfoChip/InfoChip";
import { usersData, navIndex } from '../../../store/atoms';

export const UserInfo = () => {
    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
    const setIndex = useSetRecoilState(navIndex);
    const handleTreeClick = () => {
        setIndex(2);
    }

    const treeDoneWidth = (userinfo.trees.length / 14) * 100;
    // const numEvent = userinfo.user
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Grid container>
                <Grid item xs={3}>
                    <img
                        className={classes.userimg}
                        alt="Card"
                        src={userinfo.user.profile_image[0] === "" ? "https://picsum.photos/523/354" : userinfo.user.profile_image[0]} />
                </Grid>
                <Grid item xs={3} className={classes.infobox}>
                    <div className={classes.info}>
                        <div className={classes.label}>Name</div>
                        <div className={classes.data}>{userinfo.user.user.name}</div>
                        {
                            (userinfo.user.user.org) ?
                                <Fragment>
                                    <div className={classes.label}>Organization</div>
                                    <div className={classes.data}>{userinfo.user.user.org}</div>
                                </Fragment> :
                                ""
                        }
                    </div>
                    <div style={{ paddingLeft: '20px' }}>
                        <div style={{ position: 'absolute', bottom: '0' }}>
                            <div style={{ display: 'flex' }}>
                                <InfoChip count={userinfo.trees.length} label="Trees Planted" onClick={handleTreeClick} />
                                {/* TODO: Events attended configuration on backend */}
                                <InfoChip count={userinfo.trees.length} label="Events attended" />
                            </div>
                            <div className={classes.overall}>
                                <div className={classes.done} style={{ "width": `${treeDoneWidth}%` }}>
                                </div>
                                <div className={classes.count}>
                                    {14 - userinfo.trees.length}
                                    <div className={classes.countdesc}>
                                        Trees away from neutralising your carbon footprint
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} className={classes.memory}>
                    <Memories />
                </Grid>
            </Grid>
        </div>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        grid: {
            // '& .MuiGrid-root': {
            //     paddingLeft: '0'
            // }
        },
        userimg: {
            width: '100%',
            height: '100%',
            maxHeight: '260px',
            borderRadius: '15px',
            objectFit: 'cover',
            maxWidth: '250px',
            [theme.breakpoints.down('1500')]: {
                maxHeight: '220px',
                maxWidth: '210px',
            }
        },
        infobox: {
            height: '260px',
            position: 'relative',
            // marginLeft: '-30px',
            [theme.breakpoints.down('1500')]: {
                height: '220px',
            }
        },
        info: {
            paddingTop: '10%',
            paddingLeft: '20px',
            maxHeight: '30%',
        },
        username: {
            lineHeight: '50px',
            fontSize: '28px',
            color: '#1F3625',
            paddingLeft: '20px',
            fontWeight: '500'
        },
        label: {
            fontSize: '13px',
            fontWeight: '350',
            marginBottom: '5px'
        },
        data: {
            fontSize: '20px',
            fontWeight: '450',
            marginBottom: '8px'
        },
        overall: {
            display: 'flex',
            backgroundColor: '#1F3625',
            marginTop: '7%',
            color: '#ffffff',
            fontWeight: '400',
            minHeight: '50px',
            borderRadius: '10px',
            [theme.breakpoints.down('1500')]: {
                minHeight: '40px',
            }
        },
        done: {
            backgroundColor: '#9BC53D',
            borderRadius: '10px',
            alignItems: 'center',
            fontWeight: '550',
            fontSize: '25px',
        },
        count: {
            fontWeight: '500',
            position: 'absolute',
            marginLeft: '0.25em',
            marginTop: '0.25em',
            fontSize: '25px',
            display: 'flex'
        },
        countdesc: {
            // marginTop: '0.4em',
            fontSize: '11px',
            textAlign: 'center',
            // paddingTop: '7px'
        },
        memory:{
            maxWidth: '48%',
            [theme.breakpoints.down('1500')]: {
                maxWidth: '47%',
            }
        }
    })
);