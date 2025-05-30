import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Avatar
} from "@mui/material";
import { ReferralUserCards } from "./component/referraluser";
import ApiClient from '../../api/apiClient/apiClient';
import { useParams } from 'react-router-dom';

export const ReferralUserPage = () => {
    const { rfr } = useParams();
    const [loading, setLoading] = useState(true);
    const [userNameLoading, setUserNameLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState({
        totalRaised: 0,
        totalTrees: 0,
        donations: [],
        gifts: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const apiClient = new ApiClient();
            try {
                if (!rfr) return;

                // Fetch user name first
                const nameResponse = await apiClient.getUserNameByReferral(rfr);
                setUserName(nameResponse.name);

                // Then fetch dashboard data
                const dashboardResponse = await apiClient.getReferralDashboard(rfr);
                setDashboardData(dashboardResponse);

            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setUserNameLoading(false);
                setLoading(false);
            }
        };

        fetchData();
    }, [rfr]);

    const pageContainerStyle = {
        p: 3,
        background: 'rgb(114 143 121 / 48%)',
        minHeight: '100vh'
    };

    if (loading || userNameLoading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                backgroundColor: 'rgb(114 143 121 / 48%)'
            }}>
                <CircularProgress size={60} sx={{ color: '#3F5344' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ ...pageContainerStyle, p: 0, m: 0 }}>
            {/* FULL-WIDTH HEADER */}
            <Box
                sx={{
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #3F5344',
                    padding: '8px 24px',
                    backgroundColor: '#BBC9BC',
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    component="img"
                    src="/dark_logo.png"
                    alt="Logo"
                    sx={{
                        height: 40,
                        mr: 1.2,
                        objectFit: 'contain',
                    }}
                />
                <Typography variant="h6" sx={{
                    color: '#000000',
                    fontWeight: 600,
                    textShadow: '1px 1px 1.5px rgba(0,0,0,0.05)'
                }}>
                    {userName ? `${userName}'s Referral Contributions` : 'Referral Contributions'}
                </Typography>
            </Box>

            {/* PAGE CONTENT */}
            <Container maxWidth="lg" sx={{ backgroundColor: 'transparent', mt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{
                        mb: 3,
                        backgroundColor: '#9BC53D',
                        color: '#3F5344'
                    }}>
                        {error}
                    </Alert>
                )}

                <ReferralUserCards data={dashboardData} />
            </Container>
        </Box>
    );
};