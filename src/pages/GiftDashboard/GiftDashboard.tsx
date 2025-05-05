import { useAuth } from "../admin/auth/auth";
import { useEffect, useState } from "react";
import { SinglePageDrawer } from "../../components/SinglePageDrawer";
import { NaturePeople } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useSearchParams, useParams } from "react-router-dom";
import ApiClient from "../../api/apiClient/apiClient";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../../components/Spinner";
import { NotFound } from "../notfound/NotFound";
import GiftTrees from "./GiftTrees";


const GiftDashboard: React.FC = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const { userId } = useParams();
    const [sponsorId, setSponsorId] = useState<number | null>(null);

    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number, message: string, view_name: string }>({ code: 404, message: '', view_name: '' })

    useEffect(() => {
        if (userId && !isNaN(parseInt(userId))) {
            setSponsorId(parseInt(userId));
        }
    }, [userId])

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    useEffect(() => {

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get('v') || '';
                const apiClient = new ApiClient();
                const resp = await apiClient.verifyViewAccess(viewId, Number(userId) || 0, location.pathname);
                setStatus(resp);
            } catch (error: any) {
                toast.error(error.message);
            }
            setLoading(false);
        }, 300)

        return () => {
            clearTimeout(intervalId);
        }

    }, [location])

    const items = [
        {
            displayName: 'Green Tribute Wall',
            logo: NaturePeople,
            key: 5,
            display: true,
            onClick: () => { handleScroll('your-wall-of-tree-gifts') }
        },
    ]

    return (
        loading
            ? <Spinner text={''} />
            : status.code !== 200 || !sponsorId
                ? <NotFound text={status.message} />
                : (<div className={classes.box}>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <SinglePageDrawer pages={items} />
                        <Box
                            component="main"
                            sx={{ minWidth: isMobile || isTablet ? "98%" : "1080px", p: isMobile || isTablet ? 0 : 2, width: "100%" }}
                        >
                            <Box>
                                <ToastContainer />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant={isMobile ? "h5" : "h3"} style={{ marginTop: isMobile ? '70px' : '5px', marginBottom: '5px', marginLeft: isMobile ? '10px' : '0px' }}>{status.view_name}</Typography>
                                </div>
                                <Divider sx={{ backgroundColor: "black", marginBottom: '15px', mx: isMobile ? 1 : 0 }} />
                                <GiftTrees userId={sponsorId} />
                            </Box>
                        </Box>
                    </Box>
                </div>)
    );
}

const useStyles = makeStyles((theme: any) =>
    createStyles({
        box: {
            overflow: "auto",
            width: "100%",
            position: "relative",
            backgroundColor: "#B1BFB5",
            minHeight: "100vh",
            heigth: "100%",
        },
        bg: {
            width: "100%",
            objectFit: "cover",
        },
        outlet: {
            [theme.breakpoints.down("768")]: {
                marginTop: "48px",
            },
        },
    })
);

export default GiftDashboard;