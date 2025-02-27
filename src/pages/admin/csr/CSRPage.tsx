import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { useEffect, useState } from "react";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { Dashboard, CardGiftcard, Landscape, Forest, GrassTwoTone, Map, NaturePeople } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import { NotFound } from "../../notfound/NotFound";

const CSRPage: React.FC = () => {

    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number, message: string }>({ code: 404, message: '' });

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');
        const userId = localStorage.getItem('userId') ? Number(localStorage.getItem("userId")) : 0;

        if (roles.includes(UserRoles.Admin) || roles.includes(UserRoles.SuperAdmin)) {
            setStatus({ code: 200, message: '' })
            return;
        }

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get('v') || '';
                const apiClient = new ApiClient();
                const resp = await apiClient.verifyViewAccess(viewId, userId, location.pathname);
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
        // {
        //     displayName: 'Overview',
        //     logo: Dashboard,
        //     key: 0,
        //     display: true,
        //     onClick: () => { handleScroll('corporate-impact-overview') }
        // },
        // {
        //     displayName: 'Reforestation Sites',
        //     logo: Map,
        //     key: 1,
        //     display: true,
        //     onClick: () => { handleScroll('reforestation-sites') }
        // },
        // {
        //     displayName: 'Plantation Plots',
        //     logo: Landscape,
        //     key: 2,
        //     display: true,
        //     onClick: () => { handleScroll('plantation-plots') }
        // },
        // {
        //     displayName: 'Biodiversity Supported',
        //     logo: GrassTwoTone,
        //     key: 3,
        //     display: true,
        //     onClick: () => { handleScroll('biodiversity-supported') }
        // },
        // {
        //     displayName: 'Sponsored Trees',
        //     logo: Forest,
        //     key: 4,
        //     display: true,
        //     onClick: () => { handleScroll('tree-sponsorship-details') }
        // },
        {
            displayName: 'Gift Trees',
            logo: NaturePeople,
            key: 5,
            display: true,
            onClick: () => { handleScroll('your-wall-of-tree-gifts') }
        },
        // {
        //     displayName: 'Green Gift Contributions',
        //     logo: CardGiftcard,
        //     key: 6,
        //     display: true,
        //     onClick: () => { handleScroll('green-gift-contributions') }
        // },
    ]

    return (
        loading
            ? <Spinner text={''} />
            : status.code !== 200
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
                            sx={{ minWidth: "1080px", p: 2, width: "100%" }}
                        >
                            <CSRInventory />
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

export default CSRPage;