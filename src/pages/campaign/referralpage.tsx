import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container
} from "@mui/material";
import { ReferralCards } from "./component/referralCards";
import ApiClient from '../../api/apiClient/apiClient';

export const ReferralsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [referralData, setReferralData] = useState({
        personalReferrals: 0,
        campaignReferrals: 0,
        totalReferrals: 0
    });

    useEffect(() => {
        const fetchReferralData = async () => {
            const apiClient = new ApiClient();
            try {
                const data = await apiClient.getReferralCounts();
                setReferralData(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load referral data');
            } finally {
                setLoading(false);
            }
        };

        fetchReferralData();
    }, []);

    const pageContainerStyle = {
        p: 3,
        background: 'rgb(114 143 121 / 48%)',
        minHeight: '100vh'
    };

    if (loading) {
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
            {/* Added Header */}
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
                    Referral Analytics Dashboard
                </Typography>
            </Box>

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

                <ReferralCards data={referralData} />
            </Container>
        </Box>
    );
};