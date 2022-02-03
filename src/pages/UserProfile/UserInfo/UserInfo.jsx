import { Fragment } from 'react';
import { Grid } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useRecoilValue, useRecoilState } from 'recoil';
// import { useSetRecoilState } from 'recoil';

import { Memories } from "../Memories/Memories";
import { InfoChip } from "../../../stories/InfoChip/InfoChip";
import { usersData, openProfilePopup } from '../../../store/atoms';
// import { navIndex } from '../../../store/atoms';
import { Popup } from "../../../stories/Popup/Popup";

export const UserInfo = () => {
    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
    // const setIndex = useSetRecoilState(navIndex);
    const [open, setOpenPopup] = useRecoilState(openProfilePopup);
    const handleTreeClick = () => {
        console.log("Tree clicked")
        // setIndex(2);
    }
    const onTogglePop = () => {
        setOpenPopup(!open)
    }

    const handleOpenPopup = () => {
        setOpenPopup(true)
    }

    const treeDoneWidth = (userinfo.trees.length / 14) * 100;

    if (open) {
        return (
            <div>
                <Popup toggle={onTogglePop}>
                    <img className={classes.imageWindow} src={userinfo.user.profile_image[0]} alt={"A"} />
                </Popup>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Grid container>
                    <Grid item xs={6} md={3}>
                        <img
                            onClick={() => handleOpenPopup()}
                            className={classes.userimg}
                            alt="Card"
                            src={userinfo.user.profile_image[0] === "" ? userinfo.trees[0].tree.tree_id.image[0] : userinfo.user.profile_image[0]} />
                    </Grid>
                    <Grid item xs={6} md={3} className={classes.infobox}>
                        <div className={classes.info}>
                            <div className={classes.label}>Name</div>
                            <div className={classes.data}>{userinfo.user.user.name}</div>
                            {
                                (userinfo.user.donated_by === undefined || userinfo.user.donated_by === null)
                                    ?
                                    (
                                        <Fragment>
                                            <div className={classes.label}>Organization</div>
                                            <div className={classes.data}>{userinfo.user.orgid.name}</div>
                                            <div className={classes.growth}>
                                                <div style={{ marginTop: '20px' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <InfoChip count={userinfo.trees.length} label="Trees Planted" onClick={handleTreeClick} />
                                                        {/* TODO: Events attended configuration on backend */}
                                                        {/* <InfoChip count={userinfo.trees.length} label="Events attended" /> */}
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
                                        </Fragment>
                                    )
                                    :
                                    <>
                                        <div className={classes.label}>Gifted By</div>
                                        <div className={classes.data}>{userinfo.user.donated_by.name}</div>
                                    </>
                            }
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Memories />
                    </Grid>
                </Grid>
            </div>
        )
    }
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
            cursor: 'pointer',
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
            paddingLeft: '20px',
            minHeight: '30%',
            [theme.breakpoints.down('480')]: {
                paddingLeft: '10px',
            },
            [theme.breakpoints.between('481', '900')]: {
                paddingLeft: '0px',
                marginLeft: '-10px'
            }
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
            fontWeight: '300',
            marginBottom: '5px',
            [theme.breakpoints.down('1025')]: {
                fontSize: '10px',
            }
        },
        data: {
            fontSize: '17px',
            fontWeight: '600',
            marginBottom: '8px',
            [theme.breakpoints.down('1025')]: {
                fontSize: '16px',
            }
        },
        growth: {
            [theme.breakpoints.down('480')]: {
                paddingLeft: '10px',
            },
            [theme.breakpoints.between('481', '900')]: {
                paddingLeft: '0px',
                marginLeft: '-10px'
            }
        },
        overall: {
            display: 'flex',
            backgroundColor: '#1F3625',
            marginTop: '7%',
            color: '#ffffff',
            fontWeight: '350',
            minHeight: '50px',
            borderRadius: '10px',
            maxWidth: '180px',
            [theme.breakpoints.down('1500')]: {
                minHeight: '40px',
            },
        },
        done: {
            backgroundColor: '#9BC53D',
            borderRadius: '10px',
            alignItems: 'center',
            fontWeight: '400',
            fontSize: '25px',
        },
        count: {
            fontWeight: '450',
            position: 'absolute',
            marginLeft: '0.25em',
            marginTop: '0.25em',
            fontSize: '25px',
            display: 'flex'
        },
        countdesc: {
            fontSize: '11px',
            textAlign: 'center',
            maxWidth: '150px',
            [theme.breakpoints.down('1025')]: {
                fontSize: '9px',
            }
        },
        imageWindow: {
            height: '80%',
            borderRadius: '20px',
            objectFit: 'cover',
            padding: '2%',
            width: 'auto',
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(3),
            [theme.breakpoints.between('481', '1024')]: {
                width: 'auto',
                marginTop: '2%',
                marginLeft: '15%'
            },
            [theme.breakpoints.down('480')]: {
                width: 'auto',
                marginLeft: '5%'
            }
        }
    })
);