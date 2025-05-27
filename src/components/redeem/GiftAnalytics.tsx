import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { CardGiftcard, Forest, GrassTwoTone, NaturePeople } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) =>
    createStyles({
        analyticsCard: {
            width: "100%",
            maxWidth: "180px",
            minHeight: "170px",
            maxHeight: "260px",
            borderRadius: "15px",
            textAlign: "center",
            padding: "16px",
            margin: "8px",
            background: "linear-gradient(145deg, #9faca3, #bdccc2)",
            boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        },
    })
);

interface GiftAnalyticsProps {
    userId?: number;
    groupId?: number;
    onGiftMultiple: () => void;
    onBulkGifting?: () => void;
    refreshTrigger?: number;
    isLoading?: boolean;
}

const GiftAnalytics: React.FC<GiftAnalyticsProps> = ({
    userId,
    groupId,
    onGiftMultiple,
    onBulkGifting,
    refreshTrigger = 0,
    isLoading = false
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId || groupId) {
            fetchAnalyticsData();
        }
    }, [userId, groupId, refreshTrigger]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            let analyticsData;

            if (userId) {
                analyticsData = await apiClient.getMappedGiftTreesAnalytics('user', userId);
            } else if (groupId) {
                analyticsData = await apiClient.getMappedGiftTreesAnalytics('group', groupId);
            }

            setAnalytics(analyticsData);
        } catch (error: any) {
            toast.error(error.message || "Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !analytics) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Loading analytics...</Typography>
            </Box>
        );
    }

    if (!analytics) return null;

    const availableTrees = Number(analytics?.total_trees) - Number(analytics?.gifted_trees) || 0;
    const canGiftMore = analytics?.total_trees !== analytics?.gifted_trees;

    return (
        <>
            <Box style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: isMobile ? '8px' : '0px',
                padding: isMobile ? '0 8px' : '0',
                overflow: 'auto'
            }}>
                <div className={classes.analyticsCard} style={{ margin: isMobile ? '4px' : '20px' }}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Forest fontSize="large" style={{ color: "#53ad7a" }} />
                        <Typography variant={isMobile ? "h4" : "h3"} color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {analytics?.total_trees ? analytics.total_trees : '0'}
                        </Typography>
                        <Typography variant={isMobile ? "caption" : "subtitle2"} color="#1f3625">
                            Trees opted for Gifting
                        </Typography>
                    </Box>
                </div>
                <div className={classes.analyticsCard} style={{ margin: isMobile ? '4px' : '20px' }}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <NaturePeople
                            fontSize="large"
                            style={{ color: "#573D1C" }}
                        />
                        <Typography variant={isMobile ? "h4" : "h3"} color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {analytics?.gifted_trees ? analytics.gifted_trees : '0'}
                        </Typography>
                        <Typography variant={isMobile ? "caption" : "subtitle2"} color="#1f3625">
                            Trees Gifted
                        </Typography>
                    </Box>
                </div>
                <div className={classes.analyticsCard} style={{ margin: isMobile ? '4px' : '20px' }}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <GrassTwoTone fontSize="large" style={{ color: "#F94F25" }} />
                        <Typography variant={isMobile ? "h4" : "h3"} color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {availableTrees}
                        </Typography>
                        <Typography variant={isMobile ? "caption" : "subtitle2"} color="#1f3625">
                            Available Giftable Inventory
                        </Typography>
                    </Box>
                </div>
            </Box>

            {canGiftMore &&
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: isMobile ? 16 : 10,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isMobile ? '96%' : 'auto',
                        gap: 2
                    }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={onGiftMultiple}
                            style={{
                                textTransform: 'none',
                                margin: isMobile ? '8px 0 0 0' : '10px 5px 0 0',
                                padding: isMobile ? '8px 16px' : '6px 16px',
                                fontSize: isMobile ? '0.85rem' : 'inherit',
                                width: isMobile ? '96%' : 'auto'
                            }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CardGiftcard />}
                            disabled={!canGiftMore || isLoading}
                            size={isMobile ? "small" : "medium"}
                        >
                            {isLoading ? "Loading Trees..." : "Gift Trees Now!"}
                        </Button>
                        {onBulkGifting && <Typography style={{
                            textTransform: 'none',
                            margin: isMobile ? '8px 0 0 0' : '10px 5px 0 0',
                            padding: isMobile ? '8px 16px' : '6px 16px',
                            fontSize: isMobile ? '0.85rem' : 'inherit',
                            width: isMobile ? '96%' : 'auto',
                            textAlign: 'center'
                        }}>OR</Typography>}
                        {onBulkGifting && <Button
                            variant="contained"
                            color="success"
                            onClick={onBulkGifting}
                            style={{
                                textTransform: 'none',
                                margin: isMobile ? '8px 0 0 0' : '10px 5px 0 0',
                                padding: isMobile ? '8px 16px' : '6px 16px',
                                fontSize: isMobile ? '0.85rem' : 'inherit',
                                width: isMobile ? '96%' : 'auto'
                            }}
                            startIcon={<CardGiftcard />}
                            disabled={!canGiftMore || isLoading}
                            size={isMobile ? "small" : "medium"}
                        >
                            {"Gift in Bulk!"}
                        </Button>}
                    </Box>
                    <Typography mt={1} variant={isMobile ? 'caption' : 'subtitle2'}>
                        (from your remaining stock of {availableTrees} trees)
                    </Typography>
                </Box>
            }
        </>
    );
};

export default GiftAnalytics; 