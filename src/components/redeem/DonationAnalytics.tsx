import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { Forest, GrassTwoTone, NaturePeople } from "@mui/icons-material";
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

interface DonationAnalyticsProps {
    userId?: number;
    groupId?: number;
    refreshTrigger?: number;
}

const DonationAnalytics: React.FC<DonationAnalyticsProps> = ({
    userId,
    groupId,
    refreshTrigger = 0,
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
                analyticsData = await apiClient.getMappedDonationTreesAnalytics('user', userId);
            } else if (groupId) {
                analyticsData = await apiClient.getMappedDonationTreesAnalytics('group', groupId);
            }

            setAnalytics(analyticsData);
        } catch (error: any) {
            toast.error(error.message || "Failed to load donation analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !analytics) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography>Loading donation analytics...</Typography>
            </Box>
        );
    }

    if (!analytics) return null;

    const availableTrees = Number(analytics?.remaining_trees) || 0;

    return (
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
                        Trees Allocated for Donation
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
                        {analytics?.donated_trees ? analytics.donated_trees : '0'}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "subtitle2"} color="#1f3625">
                        Trees Donated
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
                        Available for Donation
                    </Typography>
                </Box>
            </div>
        </Box>
    );
};

export default DonationAnalytics;