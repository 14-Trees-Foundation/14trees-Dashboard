import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import NatureIcon from '@mui/icons-material/Nature';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    percentage?: number;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, percentage, color }) => {
    return (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: `${color}15`,
                            color: color,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {value.toLocaleString()}
                </Typography>
                {percentage !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                        {percentage.toFixed(1)}% of total
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

interface GiftAnalyticsMetricsProps {
    data?: {
        total_requests: number;
        total_requests_corporate: number;
        total_requests_personal: number;
        total_trees: number;
        total_trees_corporate: number;
        total_trees_personal: number;
    };
    loading: boolean;
}

const GiftAnalyticsMetrics: React.FC<GiftAnalyticsMetricsProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 2 }} />
                                <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                                <Skeleton variant="text" height={20} width="60%" />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (!data) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No analytics data available</Typography>
            </Box>
        );
    }

    const requestCorporatePercentage = data.total_requests > 0
        ? (data.total_requests_corporate / data.total_requests) * 100
        : 0;
    const requestPersonalPercentage = data.total_requests > 0
        ? (data.total_requests_personal / data.total_requests) * 100
        : 0;
    const treesCorporatePercentage = data.total_trees > 0
        ? (data.total_trees_corporate / data.total_trees) * 100
        : 0;
    const treesPersonalPercentage = data.total_trees > 0
        ? (data.total_trees_personal / data.total_trees) * 100
        : 0;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Total Gift Card Requests"
                    value={data.total_requests}
                    icon={<CardGiftcardIcon fontSize="large" />}
                    color="#1976d2"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Corporate Requests"
                    value={data.total_requests_corporate}
                    icon={<BusinessIcon fontSize="large" />}
                    percentage={requestCorporatePercentage}
                    color="#2e7d32"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Personal Requests"
                    value={data.total_requests_personal}
                    icon={<PersonIcon fontSize="large" />}
                    percentage={requestPersonalPercentage}
                    color="#ed6c02"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Total Trees Gifted"
                    value={data.total_trees}
                    icon={<NatureIcon fontSize="large" />}
                    color="#0288d1"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Corporate Trees"
                    value={data.total_trees_corporate}
                    icon={<NatureIcon fontSize="large" />}
                    percentage={treesCorporatePercentage}
                    color="#388e3c"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                    title="Personal Trees"
                    value={data.total_trees_personal}
                    icon={<NatureIcon fontSize="large" />}
                    percentage={treesPersonalPercentage}
                    color="#f57c00"
                />
            </Grid>
        </Grid>
    );
};

export default GiftAnalyticsMetrics;
