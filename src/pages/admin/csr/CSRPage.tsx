import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { useEffect, useState } from "react";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { Dashboard, CardGiftcard, Landscape, Forest, GrassTwoTone, Map, NaturePeople, Notifications } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box, useMediaQuery, useTheme, IconButton, Badge, Popover, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import { NotFound } from "../../notfound/NotFound";
import {BirthdayNotification} from "../../../types/notification"

const CSRPage: React.FC = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number, message: string }>({ code: 404, message: '' });
    // Notification state
    const [notifications, setNotifications] = useState<BirthdayNotification[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    let auth = useAuth();
    useEffect(() => {
        auth.signin("User", 13124, ["all"], ["super-admin"], "", () => { })
        localStorage.setItem("userId", "13124");
        
        const fetchNotifications = async () => {
            try {
                const apiClient = new ApiClient();
                // Assuming you have the user ID available (replace 13124 with actual dynamic ID if needed)
                const userId = 13124; // Or get from auth: auth.userId
                const notifications = await apiClient.getBirthdayNotifications([userId]);
                setNotifications(notifications);
                
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                toast.error("Could not load notifications");
            }
        };
    
        fetchNotifications();
    }, []);

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => { 
        console.log(auth);
        if (auth.roles?.includes(UserRoles.Admin) || auth.roles?.includes(UserRoles.SuperAdmin)) {
            setStatus({ code: 200, message: '' });
            setLoading(false);
            return;
        }

        const intervalId = setTimeout(async () => {
            setLoading(true);
            try {
                const viewId = searchParams.get('v') || '';
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
        loading
            ? <Spinner text={''} />
            : status.code !== 200
                ? <NotFound text={status.message} />
                : (<div className={classes.box}>
                    <Box
                        sx={{
                            display: "flex",
                            position: 'relative',
                        }}
                    >
                        <SinglePageDrawer pages={items} />
                        <Box
                            component="main"
                            sx={{ 
                                minWidth: isMobile ? "98%" : "1080px", 
                                mt: isMobile ? 8 : 0, 
                                p: isMobile ? 0 : 2, 
                                width: "100%" 
                            }}
                        >
                            {/* Notification Bell Icon */}
                            <Box sx={{ 
                                position: 'absolute', 
                                top: 16, 
                                right: 16, 
                                zIndex: 1 
                            }}>
                                <IconButton 
                                    color="inherit" 
                                    onClick={handleNotificationClick}
                                    aria-label="notifications"
                                >
                                    <Badge badgeContent={notifications.length} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                            </Box>
                            
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleNotificationClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Box sx={{ p: 2, width: 300 }}>
                                    <Typography variant="h6" component="div">
                                        Notifications
                                    </Typography>
                                    {notifications.length > 0 ? (
                                        <List>
                                            {notifications.map((notification) => (
                                                <ListItem key={notification.id}>
                                                    <ListItemText 
                                                        primary={notification.message}
                                                        secondary={notification.date}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" sx={{ p: 2 }}>
                                            No new notifications
                                        </Typography>
                                    )}
                                </Box>
                            </Popover>
                            
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