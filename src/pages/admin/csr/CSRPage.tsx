import { useEffect, useState } from "react";
import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { NaturePeople, ExitToApp } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box, useMediaQuery, useTheme, Button, Backdrop, Avatar, Typography, } from "@mui/material";
import { useLocation, useSearchParams, useNavigate,} from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import { NotFound } from "../../notfound/NotFound";
import { GoogleLogout } from "react-google-login";

const CSRPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number; message: string }>({ code: 404, message: "", });
    const [logoutLoading, setLogoutLoading] = useState(false);

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
        auth.signin("user", 13124, ["all"], ["super-admin"], "", () => {});
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
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: "smooth" });
        }
    };

    useEffect(() => {
        console.log(auth);
        if (auth.roles?.includes(UserRoles.Admin) || auth.roles?.includes(UserRoles.SuperAdmin)) {
            setStatus({ code: 200, message: "" });
            setLoading(false);
            return;
        }

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get("v") || "";
                const apiClient = new ApiClient();
                const resp = await apiClient.verifyViewAccess(viewId, auth.userId, location.pathname);
                setStatus(resp);
            } catch (error: any) {
                toast.error(error.message);
            }
            setLoading(false);
        }, 300)

        return () => {
            clearTimeout(intervalId);
        }

    }, [auth, location])

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
            displayName: 'Green Tribute Wall',
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

                        {/* Updated Bottom-left user info row */}
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: 16,
                                left: 16, 
                                zIndex: 1200,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                backgroundColor: "white",
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

                            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "#333" }}>
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

                        <Box
                            component="main"
                            sx={{
                                minWidth: isMobile ? "98%" : "1080px",
                                mt: isMobile ? 8 : 0,
                                p: isMobile ? 0 : 2,
                                width: "100%",
                            }}
                        >
                            <CSRInventory />
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