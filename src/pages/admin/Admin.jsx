import { useEffect, useCallback, useState } from "react";
import {
    Outlet
} from "react-router-dom";
import { useSetRecoilState } from 'recoil';
import { createStyles, makeStyles } from '@mui/styles';

import * as Axios from "../../api/local";
import bg from "../../assets/bg.png";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import { Box } from "@mui/material";
import {
    totalTrees,
    totalTreeTypes,
    uniqueUsers,
    totalPlots,
} from '../../store/adminAtoms';

export const Admin = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const setTotalTrees = useSetRecoilState(totalTrees);
    const setTotalTreeTypes = useSetRecoilState(totalTreeTypes);
    const setUniqueUsers = useSetRecoilState(uniqueUsers);
    const setTotalPlots = useSetRecoilState(totalPlots);

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            let response = await Axios.default.get(`/analytics/totaltrees`);
            if (response.status === 200) {
                setTotalTrees(response.data);
            }

            response = await Axios.default.get(`/analytics/totaltreetypes`);
            if (response.status === 200) {
                setTotalTreeTypes(response.data);
            }

            response = await Axios.default.get(`/analytics/totalUsers`);
            if (response.status === 200) {
                setUniqueUsers(response.data);
            }

            response = await Axios.default.get(`/analytics/totalPlots`);
            if (response.status === 200) {
                setTotalPlots(response.data);
            }
        } catch (error) {
            console.log(error)
        }

        setLoading(false);
    }, [setTotalTrees, setTotalTreeTypes, setUniqueUsers, setTotalPlots]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/>
                <div className={classes.overlay} style={{height: '100vh'}}>
                <Box sx={{ display: 'flex' }}>
                    <AdminLeftDrawer />
                    <Box component="main" sx={{ width: '100%', marginTop: '100px' }}>
                        <Outlet />
                    </Box>
                </Box >
                </div>
            </div>
        )
    }
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