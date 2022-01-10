import { useEffect, useCallback, useState } from "react";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { createStyles, makeStyles } from '@mui/styles';

import * as Axios from "../../api/local";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import { Box } from "@mui/material";
import {
    totalTrees,
    totalTreeTypes,
    uniqueUsers,
    totalPlots,
    adminNavIndex
} from '../../store/adminAtoms';
import { AdminHome } from "./home/AdminHome";
import logo from "../../assets/logo_white_small.png";
import { Tree } from "./tree/Tree";
import { Forms } from "./Forms";

export const Admin = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const setTotalTrees = useSetRecoilState(totalTrees);
    const setTotalTreeTypes = useSetRecoilState(totalTreeTypes);
    const setUniqueUsers = useSetRecoilState(uniqueUsers);
    const setTotalPlots = useSetRecoilState(totalPlots);
    const index = useRecoilValue(adminNavIndex);

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
        },
        {
            page: Forms,
            displayName: 'Forms',
            logo: logo
        },
    ]
    const mainBox = () => {
        const Page = pages[index].page
        return (
            <Page />
        )
    }

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className={classes.box}>
                {/* <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/> */}
                <Box sx={{ display: 'flex', mt:{xs:7, md: 3} }}>
                    <AdminLeftDrawer />
                    <Box component="main" sx={{ minWidth: '900px', p:2,width: '100%' }}>
                    {
                        mainBox()
                    }
                    </Box>
                </Box >
            </div>
        )
    }
}

const useStyles = makeStyles((theme) =>
    createStyles({
        box: {
            overflow: 'auto',
            width: '100%',
            position: 'relative',
            backgroundColor: '#e5e5e5',
            minHeight: '100vh',
            heigth: '100%'
        },
        bg: {
            width: '100%',
            objectFit: 'cover',
        },
    })
)