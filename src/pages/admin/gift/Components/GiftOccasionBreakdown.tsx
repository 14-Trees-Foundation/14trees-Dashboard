import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Skeleton,
    Chip
} from '@mui/material';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import { GiftCardAnalyticsData } from '../hooks/useGiftCardAnalytics';

interface GiftOccasionBreakdownProps {
    data?: GiftCardAnalyticsData['by_occasion'];
    loading: boolean;
}

// Event type mapping from database values to display names
const EVENT_TYPE_MAP: Record<string, string> = {
    '1': 'Birthday',
    '2': 'Memorial',
    '3': 'General gift',
    '4': 'Wedding',
    '5': 'Anniversary',
    '6': 'Festival Celebration',
    '7': 'Retirement',
    'undefined': 'Not Specified',
    'Not Specified': 'Not Specified'
};

// Helper function to get event type display name
const getEventTypeName = (eventType: string): string => {
    return EVENT_TYPE_MAP[eventType] || eventType;
};

// Color palette for different occasion types
const COLORS = [
    '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f',
    '#0288d1', '#388e3c', '#f57c00', '#7b1fa2', '#c62828',
    '#0097a7', '#689f38', '#ef6c00', '#5e35b1', '#e64a19'
];

type MetricType = 'requests' | 'trees';

const GiftOccasionBreakdown: React.FC<GiftOccasionBreakdownProps> = ({ data, loading }) => {
    const [metricType, setMetricType] = useState<MetricType>('requests');

    // Transform data for bar chart - showing totals by occasion
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return data.map((occasion, index) => ({
            occasion: getEventTypeName(occasion.event_type),
            rawEventType: occasion.event_type,
            value: metricType === 'requests' ? occasion.total_requests : occasion.total_trees,
            color: COLORS[index % COLORS.length]
        }));
    }, [data, metricType]);

    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={400} />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        By Occasion Type
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="text.secondary">
                            No occasion data available
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">By Occasion Type</Typography>
                    <ToggleButtonGroup
                        value={metricType}
                        exclusive
                        onChange={(e, value) => value && setMetricType(value)}
                        size="small"
                        aria-label="metric type"
                    >
                        <ToggleButton value="requests" aria-label="requests">
                            Requests
                        </ToggleButton>
                        <ToggleButton value="trees" aria-label="trees">
                            Trees
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        layout="horizontal"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="occasion"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 11 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #ccc',
                                borderRadius: 4
                            }}
                            formatter={(value: number) => [value.toLocaleString(), metricType === 'requests' ? 'Requests' : 'Trees']}
                        />
                        <Bar
                            dataKey="value"
                            name={metricType === 'requests' ? 'Requests' : 'Trees'}
                            radius={[8, 8, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.slice(0, 5).map((occasion, index) => (
                        <Chip
                            key={occasion.event_type}
                            label={`${getEventTypeName(occasion.event_type)}: ${metricType === 'requests' ? occasion.total_requests : occasion.total_trees}`}
                            size="small"
                            sx={{
                                backgroundColor: `${COLORS[index % COLORS.length]}20`,
                                color: COLORS[index % COLORS.length],
                                fontWeight: 500
                            }}
                        />
                    ))}
                    {data.length > 5 && (
                        <Chip
                            label={`+${data.length - 5} more`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default GiftOccasionBreakdown;
