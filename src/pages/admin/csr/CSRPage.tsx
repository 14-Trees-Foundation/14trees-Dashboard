import CSRInventory from "./CSRInventory";
import { useAuth } from "../auth/auth";
import { useEffect, useState } from "react";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { Dashboard, CardGiftcard, Landscape, Forest, GrassTwoTone, Map, NaturePeople, Notifications } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box, useMediaQuery, useTheme, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { UserRoles } from "../../../types/common";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/Spinner";
import { NotFound } from "../../notfound/NotFound";

interface BirthdayResponse {
  hasBirthday: boolean;
  count: number;
  upcomingBirthdays: Array<{
    id: number;
    name: string;
    birth_date: string;
    upcoming_date: string;
  }>;
}

const CSRPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ code: number, message: string }>({ code: 404, message: '' });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [birthdayData, setBirthdayData] = useState<BirthdayResponse | null>(null);

    let auth = useAuth();
    useEffect(() => {
        auth.signin("User", 13124, ["all"], ["super-admin"], "", () => { })
        localStorage.setItem("userId", "13124");
    }, []);

    const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setAnchorEl(null);
    };

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
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
    ];

    const open = Boolean(anchorEl);
    const id = open ? 'birthday-notifications-popover' : undefined;

    return (
        loading
            ? <Spinner text={''} />
            : status.code !== 200
                ? <NotFound text={status.message} />
                : (<div className={classes.box}>
                    {/* Notification Button */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: 2,
                            position: "fixed",
                            right: 0,
                            top: 0,
                            zIndex: theme.zIndex.appBar
                        }}
                    >
                        <IconButton 
                            color="inherit" 
                            onClick={handleNotificationsClick}
                            aria-describedby={id}
                        >
                            <Badge 
                                badgeContent={birthdayData?.count || 0} 
                                color="error"
                                invisible={!birthdayData?.hasBirthday}
                            >
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleNotificationsClose}
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
                                    Upcoming Birthdays
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                {birthdayData?.hasBirthday ? (
                                    <List dense>
                                        {birthdayData.upcomingBirthdays.map((user) => (
                                            <ListItem key={user.id}>
                                                <ListItemText
                                                    primary={user.name}
                                                    secondary={`Birthday on ${new Date(user.upcoming_date).toLocaleDateString()}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No upcoming birthdays
                                    </Typography>
                                )}
                            </Box>
                        </Popover>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <SinglePageDrawer pages={items} />
                        <Box
                            component="main"
                            sx={{ minWidth: isMobile ? "98%" : "1080px", mt: isMobile ? 8 : 0, p: isMobile ? 0 : 2, width: "100%" }}
                        >
                            <CSRInventory onBirthdayData={setBirthdayData} />
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