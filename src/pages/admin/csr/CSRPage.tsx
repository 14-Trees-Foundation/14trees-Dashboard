import { useEffect, useState } from "react";
import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { NaturePeople, Settings, CardGiftcard, VolunteerActivism, History } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import {
    Box,
    useMediaQuery,
    useTheme,
    Backdrop,
} from "@mui/material";
import { useLocation, useSearchParams, useParams } from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import CSRSettings from "./CSRSettings";
import { NotFound } from "../../notfound/NotFound";
import { Group } from "../../../types/Group";
import CSRGiftRequests from "./CSRGiftRequests";
import CSRHeader from "./CSRHeader";
import CSRDonations from "./CSRDonations";
import CSRGiftHistory from "./CSRGiftHistory";

type BirthdayData = {
    hasBirthday: boolean;
    count: number;
    upcomingBirthdays: {
        id: number;
        name: string;
        birth_date: string;
        upcoming_date: string;
    }[];
};

const CSRPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number; message: string }>({ code: 404, message: "", });
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [birthdayData, setBirthdayData] = useState<BirthdayData | null>(null);
    const [activeTab, setActiveTab] = useState<string>("greenTributeWall"); // Default to first tab
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? "birthday-popover" : undefined;
    const { groupId } = useParams();

    let auth = useAuth();

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset =
                window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');
        const userId = localStorage.getItem('userId') ? Number(localStorage.getItem("userId")) : 0;

        if (roles.includes(UserRoles.Admin) || roles.includes(UserRoles.SuperAdmin)) {
            setStatus({ code: 200, message: '' });
            setLoading(false);
            return;
        }

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get("v") || "";
                const apiClient = new ApiClient();
                const resp = await apiClient.verifyViewAccess(viewId, userId, location.pathname);
                setStatus(resp);
            } catch (error: any) {
                toast.error(error.message);
            }
            setLoading(false);
        }, 300);

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
            displayName: "Green Tribute Wall",
            logo: NaturePeople,
            key: 0, // Changed from number to string for consistency
            display: true,
            onClick: () => setActiveTab("greenTributeWall")
        },
        {
            displayName: 'Pre-Purchase',
            logo: CardGiftcard,
            key: 1,
            display: true,
            onClick: () => setActiveTab("prePurchase")
        },
        {
            displayName: 'Gift History',
            logo: History,
            key: 2,
            display: true,
            onClick: () => setActiveTab("giftHistory")
        },
        {
            displayName: 'Donations',
            logo: VolunteerActivism,
            key: 3,
            display: true,
            onClick: () => setActiveTab("donations")
        },
        {
            displayName: "Corporate Settings",
            logo: Settings,
            key: 4,
            display: true,
            onClick: () => setActiveTab("Setting-Details")
        },
    ];

    return (
        <>
            <Backdrop open={logoutLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Spinner text={"Logging you out..."} />
            </Backdrop>

            {loading ? (
                <Spinner text={""} />
            ) : status.code !== 200 ? (
                <NotFound text={status.message} />
            ) : (
                <div className={classes.box}>
                    <Box sx={{ display: "flex", position: "relative", height: "100vh", overflow: "hidden" }}>
                        <SinglePageDrawer pages={items} setLogoutLoading={setLogoutLoading} />

                        {/* === Bottom Left Stack: Birthday + Avatar === */}
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: 16,
                                left: 16,
                                zIndex: 1200,
                                display: "flex",
                                flexDirection: "column-reverse",
                                alignItems: "flex-start",
                                gap: 2,
                            }}
                        >
                        </Box>

                        <Box 
                            sx={{ 
                                flex: 1,
                                overflow: "auto",
                                height: "100vh",
                                position: "relative",
                                width: { xs: "100%", md: "80%" },
                            }}
                        >
                            <CSRHeader groupId={groupId} onGroupChange={group => { setCurrentGroup(prev => prev ? prev : group) }} />
                            <Box sx={{ p: 2 }}>
                                {activeTab === "greenTributeWall" && currentGroup && <CSRInventory selectedGroup={currentGroup}/>}
                                {activeTab === "prePurchase" && currentGroup && <CSRGiftRequests selectedGroup={currentGroup} groupId={currentGroup.id}/>}
                                {activeTab === "giftHistory" && currentGroup && <CSRGiftHistory selectedGroup={currentGroup} groupId={currentGroup.id} />}
                                {activeTab === "donations" && currentGroup && <CSRDonations selectedGroup={currentGroup} />}
                                {activeTab === "Setting-Details" && currentGroup && <CSRSettings group={currentGroup} onGroupChange={group => { setCurrentGroup(group) }}/>}
                            </Box>
                        </Box>
                    </Box>
                </div>
            )}
        </>
    );
}

const useStyles = makeStyles((theme: any) =>
    createStyles({
        box: {
            width: "100%",
            position: "relative",
            backgroundColor: "#B1BFB5",
            minHeight: "100vh",
            height: "100%",
            overflow: "hidden", // Prevent double scrollbars
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