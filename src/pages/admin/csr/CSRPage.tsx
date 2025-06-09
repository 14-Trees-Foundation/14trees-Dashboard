import { useEffect, useState } from "react";
import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { NaturePeople, ExitToApp, Settings } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import {
    Box,
    useMediaQuery,
    useTheme,
    Button,
    Backdrop,
    Avatar,
    Typography,
    Popover,
    IconButton,
    Stack,
    Divider,
} from "@mui/material";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import CSRSettings from "./CSRSettings";
import { NotFound } from "../../notfound/NotFound";
import { GoogleLogout } from "react-google-login";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EventIcon from "@mui/icons-material/Event";
import { Group } from "../../../types/Group";

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

    let auth = useAuth();
    const navigate = useNavigate();

    const getInitials = (name: string) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    useEffect(() => {
        auth.signin("user", 13124, ["all"], ["super-admin"], "", () => { });
        localStorage.setItem("userId", "13124");
    }, []);

    const handleLogout = () => {
        setLogoutLoading(true);
        localStorage.removeItem("loginInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");

        auth.signout(() => {
            setLogoutLoading(false);
            toast.success("Logged out successfully!");
            navigate("/login", { replace: true });
        });
    };

    const onGoogleLogoutSuccess = () => {
        handleLogout();
    };

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
        console.log(auth);
        if (
            auth.roles?.includes(UserRoles.Admin) ||
            auth.roles?.includes(UserRoles.SuperAdmin)
        ) {
            setStatus({ code: 200, message: "" });
            setLoading(false);
            return;
        }

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get("v") || "";
                const apiClient = new ApiClient();
                const resp = await apiClient.verifyViewAccess(
                    viewId,
                    auth.userId,
                    location.pathname
                );
                setStatus(resp);
            } catch (error: any) {
                toast.error(error.message);
            }
            setLoading(false);
        }, 300);

        return () => {
            clearTimeout(intervalId);
        };
    }, [auth, location]);

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
            key: 5, // Changed from number to string for consistency
            display: true,
            onClick: () => setActiveTab("greenTributeWall")
        },
        // {
        //     displayName: 'Green Gift Contributions',
        //     logo: CardGiftcard,
        //     key: 6,
        //     display: true,
        //     onClick: () => { handleScroll('green-gift-contributions') }
        // },
        {
            displayName: "Settings",
            logo: Settings,
            key: 7,
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
                    <Box sx={{ display: "flex", position: "relative" }}>
                        <SinglePageDrawer pages={items} />

                        {/* === Bottom Left Stack: Birthday + Avatar === */}
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: 16,
                                left: 16,
                                zIndex: 1200,
                                display: "flex",
                                flexDirection: "column-reverse", // avatar at bottom, birthday on top
                                alignItems: "flex-start",
                                gap: 2, // separation between boxes
                            }}
                        >
                            {/* Logout Avatar Box */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    backgroundColor: "#A8B6A9",
                                    borderRadius: 999,
                                    px: 2,
                                    py: 1,
                                    boxShadow: 3,
                                    border: "1px solid rgba(0,0,0,0.1)",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "#336B43",
                                        color: "white",
                                        width: 36,
                                        height: 36,
                                        fontWeight: "bold",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {auth.user?.name ? getInitials(auth.user.name) : "U"}
                                </Avatar>

                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 500, color: "#333", flexGrow: 1 }}
                                >
                                    {auth.user?.name || "User"}
                                </Typography>

                                <GoogleLogout
                                    clientId={import.meta.env.VITE_APP_CLIENT_ID}
                                    onLogoutSuccess={onGoogleLogoutSuccess}
                                    render={(renderProps) => (
                                        <Button
                                            onClick={renderProps.onClick}
                                            variant="text"
                                            sx={{
                                                minWidth: "auto",
                                                p: 0.5,
                                                color: "#336B43",
                                            }}
                                        >
                                            <ExitToApp />
                                        </Button>
                                    )}
                                />
                            </Box>

                            {/* Birthday Box (above avatar) */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    backgroundColor: "#A8B6A9",
                                    borderRadius: 2,
                                    px: 2,
                                    py: 2,
                                    boxShadow: 3,
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    minWidth: 150,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Upcoming Events
                                    </Typography>
                                    <NotificationsNoneIcon sx={{ color: "#336B43" }} />
                                </Box>
                                <Divider sx={{ width: "100%" }} />

                                {/* === Dummy Data for Events (keeping original logic unchanged) === 
                                <Stack spacing={1} sx={{ maxHeight: 120, overflowY: "auto" }}> */}
                                {/* Dummy Birthday Event 
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                bgcolor: "#336B43",
                                                fontSize: 12,
                                            }}
                                        >
                                            JD
                                        </Avatar>
                                        <Box>
                                            <Typography fontSize={12} fontWeight={500}>
                                                John Doe's Birthday 🎂
                                            </Typography>
                                            <Typography fontSize={11} color="gray">
                                                <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                {new Date().toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box> */}

                                {/* Dummy Diwali Event 
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                bgcolor: "#336B43",
                                                fontSize: 12,
                                            }}
                                        >
                                            🎆
                                        </Avatar>
                                        <Box>
                                            <Typography fontSize={12} fontWeight={500}>
                                                Diwali 🪔
                                            </Typography>
                                            <Typography fontSize={11} color="gray">
                                                <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack> */}

                                {birthdayData?.upcomingBirthdays?.length ? (
                                    <Stack spacing={1} sx={{ maxHeight: 120, overflowY: "auto" }}>
                                        {birthdayData.upcomingBirthdays.map((b) => (
                                            <Box
                                                key={b.id}
                                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        bgcolor: "#336B43",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {getInitials(b.name)}
                                                </Avatar>
                                                <Box>
                                                    <Typography fontSize={12} fontWeight={500}>
                                                        {b.name}
                                                    </Typography>
                                                    <Typography fontSize={11} color="gray">
                                                        <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                        {new Date(b.upcoming_date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography fontSize={12} color="gray">
                                        No Events soon.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            {activeTab === "greenTributeWall" && <CSRInventory/>}
                            {activeTab === "Setting-Details" && <CSRSettings />}
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
            overflow: "auto",
            width: "100%",
            position: "relative",
            backgroundColor: "#B1BFB5",
            minHeight: "100vh",
            height: "100%",
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