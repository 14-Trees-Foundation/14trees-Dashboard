import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { toast } from "react-toastify";
import ApiClient from "../../api/apiClient/apiClient";
import { Spinner } from "../../components/Spinner";
import { NotFound } from "../notfound/NotFound";
import {
    Nature,
    Landscape,
    CalendarToday,
    CardGiftcard,
    Event as EventIcon,
    LocationOn,
    ArrowBackIos,
    ArrowForwardIos,
} from "@mui/icons-material";

interface GroupInfo {
    group_id: string;
    group_name: string;
    acres_of_land: number | null;
    years_of_partnership: number | null;
    no_of_visits: number | null;
    trees_planted: number | null;
    groves: string | null;
    events: number | null;
    gift_cards: number | null;
}

interface VisitData {
    group_id: string;
    visit_name: string;
    date: string;
    photo_album_link: string | null;
}

interface EventData {
    group_id: string;
    event_name: string;
    date: string;
    photo_album_link: string | null;
}

interface SpreadsheetData {
    group_info: GroupInfo | null;
    visits_data: VisitData[];
    events_data: EventData[];
}

interface GroupStats {
    trees: {
        mapped_trees: number;
        sponsored_trees: number;
        gifted_trees: number;
    };
    gift_card_requests: {
        for_group: number;
    };
    donations: {
        for_group: number;
    };
    group_members: number;
    spreadsheet_data: SpreadsheetData | null;
}

const GroupDashboard: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const classes = useStyles();
    const { name_key } = useParams<{ name_key: string }>();
    const [loading, setLoading] = useState(true);
    const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [currentVisitIndex, setCurrentVisitIndex] = useState(0);

    useEffect(() => {
        document.title = "Group Dashboard - 14 Trees";
        fetchGroupIdFromKey();
    }, [name_key]);

    useEffect(() => {
        if (groupId) {
            fetchGroupStats();
        }
    }, [groupId]);

    const fetchGroupIdFromKey = async () => {
        if (!name_key) {
            setError("Invalid group key");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const apiClient = new ApiClient();
            const group = await apiClient.getGroupByKey(name_key);
            setGroupId(group?.id?.toString() || "");
            console.log("Response from getGroupByKey:", group);
        } catch (err: any) {
            console.error("Error fetching group by key:", err);
            setError(err.message || "Group not found");
            toast.error("Group not found");
            setLoading(false);
        }
    };

    const fetchGroupStats = async () => {
        if (!groupId) {
            return;
        }

        try {
            setLoading(true);
            const apiClient = new ApiClient();
            const response = await apiClient.getGroupStats(parseInt(groupId));
            setGroupStats(response);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching group stats:", err);
            setError(err.message || "Failed to load group dashboard");
            toast.error("Failed to load group dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner text="Loading group dashboard..." />;
    }

    if (error || !groupStats) {
        return <NotFound text={error || "Group not found"} />;
    }

    const groupInfo = groupStats.spreadsheet_data?.group_info;
    const visitsData = groupStats.spreadsheet_data?.visits_data || [];
    const eventsData = groupStats.spreadsheet_data?.events_data || [];

    const handleNextVisit = () => {
        setCurrentVisitIndex((prev) => (prev + 1) % visitsData.length);
    };

    const handlePrevVisit = () => {
        setCurrentVisitIndex((prev) => (prev - 1 + visitsData.length) % visitsData.length);
    };

    return (
        <Box className={classes.root}>
            {/* Header Section - Similar to CSRHeader */}
            <Box className={classes.header}>
                <div className={classes.headerContent}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src="/dark_logo.png"
                            alt="14 Trees Foundation"
                            className={classes.logo}
                        />
                        <Typography variant={isMobile ? "h6" : "h4"} className={classes.headerTitle}>
                            Welcome to {groupInfo?.group_name || "Your"} Green Impact Dashboard
                        </Typography>
                    </Box>
                </div>
                <Divider sx={{ backgroundColor: "black", marginBottom: '15px', mx: isMobile ? 2 : 3 }} />
            </Box>

            {/* Main Content Area */}
            <Box className={classes.contentArea}>
                {/* Hero Section with Image and Welcome Text */}
                <Box className={classes.heroSection}>
                    <Grid container spacing={isMobile ? 2 : 3}>
                        <Grid item xs={12} md={5}>
                            <Box className={classes.heroImageContainer}>
                                <img
                                    // src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
                                    src = "https://14treesplants.s3.ap-south-1.amazonaws.com/groups/Skoda_ai.png?w=800&h=600"
                                    alt="Partnership"
                                    className={classes.heroImage}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=14+Trees+Partnership";
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Box className={classes.welcomeText}>
                                <Typography variant={isMobile ? "h6" : "h5"} className={classes.welcomeTitle} gutterBottom>
                                    Thank you for your partnership in restoring our ecosystems!
                                </Typography>
                                <Typography variant="body1" className={classes.welcomeBody}>
                                    At 14 Trees Foundation, we are deeply grateful for your commitment to environmental
                                    stewardship. Together, we are creating sustainable ecosystems, restoring degraded lands,
                                    and providing livelihoods to local communities. Your support helps us plant native trees,
                                    conserve biodiversity, and build a greener future for generations to come.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Key Metrics Section */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant={isMobile ? "h6" : "h5"} className={classes.sectionTitle}>
                        Your Environmental Impact
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <Nature className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupInfo?.trees_planted?.toLocaleString() || groupStats.trees.sponsored_trees.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Trees Planted
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <Landscape className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupInfo?.acres_of_land || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Acres of Land
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <CalendarToday className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupInfo?.years_of_partnership || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Years of Partnership
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <CardGiftcard className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupStats.gift_card_requests.for_group}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Gift Cards
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <LocationOn className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupInfo?.no_of_visits || visitsData.length}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Site Visits
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <Card className={classes.metricCard}>
                                <CardContent>
                                    <Box className={classes.metricHeader}>
                                        <EventIcon className={classes.metricIcon} />
                                    </Box>
                                    <Typography variant={isMobile ? "h6" : "h4"} className={classes.metricValue}>
                                        {groupInfo?.events || eventsData.length}
                                    </Typography>
                                    <Typography variant="body2" className={classes.metricLabel}>
                                        Groves/Events
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Visits Section */}
                {visitsData.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant={isMobile ? "h6" : "h5"} className={classes.sectionTitle}>
                            Site Visits
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Thank you for visiting our reforestation sites and witnessing the impact firsthand.
                        </Typography>

                        {isMobile ? (
                            // Mobile Carousel View
                            <Box className={classes.carouselContainer}>
                                <IconButton
                                    className={classes.carouselButton}
                                    onClick={handlePrevVisit}
                                    disabled={visitsData.length <= 1}
                                >
                                    <ArrowBackIos />
                                </IconButton>

                                <Card className={classes.carouselCard}>
                                    <CardContent>
                                        <Typography variant="h6" className={classes.cardTitle}>
                                            {visitsData[currentVisitIndex].visit_name}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                            <CalendarToday sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {visitsData[currentVisitIndex].date}
                                            </Typography>
                                        </Box>
                                        {visitsData[currentVisitIndex].photo_album_link && (
                                            <Box sx={{ mt: 2 }}>
                                                <a
                                                    href={visitsData[currentVisitIndex].photo_album_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={classes.link}
                                                >
                                                    View Photo Album →
                                                </a>
                                            </Box>
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                                            {currentVisitIndex + 1} / {visitsData.length}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <IconButton
                                    className={classes.carouselButton}
                                    onClick={handleNextVisit}
                                    disabled={visitsData.length <= 1}
                                >
                                    <ArrowForwardIos />
                                </IconButton>
                            </Box>
                        ) : (
                            // Desktop Grid View
                            <Grid container spacing={2}>
                                {visitsData.map((visit, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Card className={classes.dataCard}>
                                            <CardContent>
                                                <Typography variant="h6" className={classes.cardTitle}>
                                                    {visit.visit_name}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {visit.date}
                                                    </Typography>
                                                </Box>
                                                {visit.photo_album_link && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <a
                                                            href={visit.photo_album_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={classes.link}
                                                        >
                                                            View Photo Album →
                                                        </a>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}

                {/* Groves/Events Section */}
                {eventsData.length > 0 && (
                    <Box sx={{ mt: 4, mb: 3 }}>
                        <Typography variant={isMobile ? "h6" : "h5"} className={classes.sectionTitle}>
                            Groves Sponsored
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Your sponsored groves are creating lasting environmental impact in these communities.
                        </Typography>
                        <Grid container spacing={2}>
                            {eventsData.map((event, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card className={classes.dataCard}>
                                        <CardContent>
                                            <Typography variant="h6" className={classes.cardTitle}>
                                                {event.event_name}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                <CalendarToday sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.date}
                                                </Typography>
                                            </Box>
                                            {event.photo_album_link && (
                                                <Box sx={{ mt: 2 }}>
                                                    <a
                                                        href={event.photo_album_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={classes.link}
                                                    >
                                                        View Photo Album →
                                                    </a>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const useStyles = makeStyles((theme: any) =>
    createStyles({
        root: {
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "#B1BFB5", // Same as CSRPage
            position: "relative",
        },
        header: {
            padding: theme.spacing(2),
            backgroundColor: "#B1BFB5",
        },
        headerContent: {
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 24px 0",
            padding: "0px 8px",
            alignItems: "center",
            [theme.breakpoints.down("md")]: {
                margin: "12px 16px 0",
            },
        },
        headerTitle: {
            margin: 0,
            lineHeight: 1.2,
            fontWeight: 600,
        },
        logo: {
            height: 50,
            width: "auto",
            objectFit: "contain",
            [theme.breakpoints.down("md")]: {
                height: 40,
            },
        },
        contentArea: {
            padding: theme.spacing(3),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            overflowY: "auto",
            maxWidth: "1400px",
            margin: "0 auto",
            [theme.breakpoints.down("md")]: {
                padding: theme.spacing(2),
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
            },
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1.5),
                paddingLeft: theme.spacing(1.5),
                paddingRight: theme.spacing(1.5),
            },
        },
        heroSection: {
            backgroundColor: "#fff",
            borderRadius: theme.spacing(1),
            padding: theme.spacing(3),
            marginBottom: theme.spacing(3),
            boxShadow: theme.shadows[2],
            [theme.breakpoints.down("md")]: {
                padding: theme.spacing(2),
            },
        },
        heroImageContainer: {
            width: "100%",
            height: "300px",
            borderRadius: theme.spacing(1),
            overflow: "hidden",
            [theme.breakpoints.down("md")]: {
                height: "250px",
            },
            [theme.breakpoints.down("sm")]: {
                height: "200px",
            },
        },
        heroImage: {
            width: "100%",
            height: "100%",
            objectFit: "contain",
        },
        welcomeText: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            [theme.breakpoints.down("md")]: {
                marginTop: theme.spacing(2),
            },
        },
        welcomeTitle: {
            fontWeight: 600,
            color: theme.palette.primary.main,
        },
        welcomeBody: {
            lineHeight: 1.7,
            color: theme.palette.text.secondary,
            fontSize: "1rem",
            [theme.breakpoints.down("sm")]: {
                fontSize: "0.9rem",
            },
        },
        sectionTitle: {
            fontWeight: 600,
            color: theme.palette.primary.main,
            marginBottom: theme.spacing(1),
        },
        metricCard: {
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: theme.spacing(1),
            boxShadow: theme.shadows[2],
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
            },
        },
        metricHeader: {
            display: "flex",
            justifyContent: "center",
            marginBottom: theme.spacing(1),
        },
        metricIcon: {
            fontSize: 40,
            color: theme.palette.primary.main,
            [theme.breakpoints.down("sm")]: {
                fontSize: 28,
            },
        },
        metricValue: {
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: "center",
            marginBottom: theme.spacing(0.5),
            [theme.breakpoints.down("sm")]: {
                fontSize: "1.25rem",
            },
        },
        metricLabel: {
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontWeight: 500,
            fontSize: "0.875rem",
            [theme.breakpoints.down("sm")]: {
                fontSize: "0.7rem",
            },
        },
        carouselContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(2),
        },
        carouselButton: {
            backgroundColor: "#fff",
            boxShadow: theme.shadows[2],
            "&:hover": {
                backgroundColor: "#f5f5f5",
            },
            "&:disabled": {
                opacity: 0.3,
            },
        },
        carouselCard: {
            flex: 1,
            maxWidth: "500px",
            backgroundColor: "#fff",
            borderRadius: theme.spacing(1),
            boxShadow: theme.shadows[2],
        },
        dataCard: {
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: theme.spacing(1),
            boxShadow: theme.shadows[2],
            transition: "box-shadow 0.2s ease",
            "&:hover": {
                boxShadow: theme.shadows[4],
            },
        },
        cardTitle: {
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: "1.1rem",
            [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
            },
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": {
                textDecoration: "underline",
            },
        },
    })
);

export default GroupDashboard;
