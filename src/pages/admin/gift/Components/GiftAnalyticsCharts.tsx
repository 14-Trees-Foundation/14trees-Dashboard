import React, { useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Skeleton
} from '@mui/material';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { DateFieldType, TimePeriodType, GiftCardAnalyticsData } from '../hooks/useGiftCardAnalytics';

interface GiftAnalyticsChartsProps {
    data: GiftCardAnalyticsData | null;
    dateField: DateFieldType;
    setDateField: (field: DateFieldType) => void;
    timePeriod: TimePeriodType;
    setTimePeriod: (period: TimePeriodType) => void;
    loading: boolean;
}

const GiftAnalyticsCharts: React.FC<GiftAnalyticsChartsProps> = ({
    data,
    dateField,
    setDateField,
    timePeriod,
    setTimePeriod,
    loading
}) => {
    // Transform data for chart
    const chartData = useMemo(() => {
        if (!data || !data.monthly) return [];

        return data.monthly.map(item => ({
            month: item.month,
            monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit'
            }),
            'Total Requests': item.requests,
            'Corporate Requests': item.requests_corporate,
            'Personal Requests': item.requests_personal,
            'Total Trees': item.trees,
            'Corporate Trees': item.trees_corporate,
            'Personal Trees': item.trees_personal
        }));
    }, [data]);

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={400} />
                </CardContent>
            </Card>
        );
    }

    if (!data || chartData.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Month-on-Month Trends
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="text.secondary">
                            No data available for the selected period
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">Month-on-Month Trends</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <ToggleButtonGroup
                            value={dateField}
                            exclusive
                            onChange={(e, value) => value && setDateField(value)}
                            size="small"
                            aria-label="date field"
                        >
                            <ToggleButton value="created_at" aria-label="created date">
                                Created Date
                            </ToggleButton>
                            <ToggleButton value="gifted_on" aria-label="gifted date">
                                Gifted Date
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            value={timePeriod}
                            exclusive
                            onChange={(e, value) => value && setTimePeriod(value)}
                            size="small"
                            aria-label="time period"
                        >
                            <ToggleButton value="6m" aria-label="6 months">
                                6M
                            </ToggleButton>
                            <ToggleButton value="1y" aria-label="1 year">
                                1Y
                            </ToggleButton>
                            <ToggleButton value="2y" aria-label="2 years">
                                2Y
                            </ToggleButton>
                            <ToggleButton value="all" aria-label="all time">
                                All
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="monthLabel"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            yAxisId="left"
                            label={{ value: 'Requests', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Trees', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #ccc',
                                borderRadius: 4
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />

                        {/* Requests Lines */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Total Requests"
                            stroke="#1976d2"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Corporate Requests"
                            stroke="#2e7d32"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Personal Requests"
                            stroke="#ed6c02"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3 }}
                        />

                        {/* Trees Bars */}
                        <Bar
                            yAxisId="right"
                            dataKey="Corporate Trees"
                            fill="#66bb6a"
                            fillOpacity={0.7}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="Personal Trees"
                            fill="#ffa726"
                            fillOpacity={0.7}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 2, px: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Lines represent gift card requests (left axis), bars represent trees gifted (right axis)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GiftAnalyticsCharts;
