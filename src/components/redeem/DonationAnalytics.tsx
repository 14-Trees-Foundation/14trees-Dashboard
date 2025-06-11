import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, useMediaQuery, useTheme, Divider } from "@mui/material";
import { Forest, GrassTwoTone, NaturePeople, GroupAdd } from "@mui/icons-material";
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
    onAssignMultiple?: () => void;
    onBulkAssignment?: () => void;
    isLoading?: boolean;
}

const DonationAnalytics: React.FC<DonationAnalyticsProps> = ({
    userId,
    groupId,
    refreshTrigger = 0,
    onAssignMultiple,
    onBulkAssignment,
    isLoading = false,
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
    const canAssignMore = availableTrees > 0;

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
                            Total Trees
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
                            Trees Assigned
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
                            Trees available for assignment
                        </Typography>
                    </Box>
                </div>
            </Box>

            {canAssignMore && (onAssignMultiple || onBulkAssignment) && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2,
                    width: '100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        gap: 2,
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        {onAssignMultiple && (
                            <Button
                            variant="contained"
                            color="success"
                            onClick={onAssignMultiple}
                            style={{
                                textTransform: 'none',
                                margin: isMobile ? '8px 0 0 0' : '10px 5px 0 0',
                                padding: isMobile ? '8px 16px' : '6px 16px',
                                fontSize: isMobile ? '0.85rem' : 'inherit',
                                width: isMobile ? '96%' : 'auto'
                            }}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <GroupAdd />}
                                disabled={isLoading}
                            >
                                Assign Trees Now!
                            </Button>
                        )}

                        {onBulkAssignment && (
                            <>
                                {onAssignMultiple && <Typography>OR</Typography>}
                                <Button
                                     variant="contained"
                                     color="success"
                                     onClick={onBulkAssignment}
                                     style={{
                                         textTransform: 'none',
                                         margin: isMobile ? '8px 0 0 0' : '10px 5px 0 0',
                                         padding: isMobile ? '8px 16px' : '6px 16px',
                                         fontSize: isMobile ? '0.85rem' : 'inherit',
                                         width: isMobile ? '96%' : 'auto'
                                     }}
                                    disabled={isLoading}
                                >
                                    Assign In Bulk!
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default DonationAnalytics;