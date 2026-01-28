import { useState, useEffect, useMemo } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';

export type DateFieldType = 'created_at' | 'gifted_on';
export type TimePeriodType = '6m' | '1y' | '2y' | 'all';

export interface GiftCardAnalyticsData {
    summary: {
        total_requests: number;
        total_requests_corporate: number;
        total_requests_personal: number;
        total_trees: number;
        total_trees_corporate: number;
        total_trees_personal: number;
    };
    monthly: Array<{
        month: string;
        requests: number;
        requests_corporate: number;
        requests_personal: number;
        trees: number;
        trees_corporate: number;
        trees_personal: number;
    }>;
    by_occasion: Array<{
        event_type: string;
        total_requests: number;
        total_trees: number;
        monthly: Array<{
            month: string;
            requests: number;
            requests_corporate: number;
            requests_personal: number;
            trees: number;
            trees_corporate: number;
            trees_personal: number;
        }>;
    }>;
}

export const useGiftCardAnalytics = () => {
    const [dateField, setDateField] = useState<DateFieldType>('created_at');
    const [timePeriod, setTimePeriod] = useState<TimePeriodType>('1y');
    const [analyticsData, setAnalyticsData] = useState<GiftCardAnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate date range based on time period
    const { startDate, endDate, months } = useMemo(() => {
        const end = new Date();
        const start = new Date();

        switch (timePeriod) {
            case '6m':
                start.setMonth(start.getMonth() - 6);
                return { startDate: undefined, endDate: undefined, months: 6 };
            case '1y':
                start.setMonth(start.getMonth() - 12);
                return { startDate: undefined, endDate: undefined, months: 12 };
            case '2y':
                start.setMonth(start.getMonth() - 24);
                return { startDate: undefined, endDate: undefined, months: 24 };
            case 'all':
                // For "all", we'll use a very old start date
                return {
                    startDate: '2020-01-01',
                    endDate: end.toISOString().split('T')[0],
                    months: undefined
                };
            default:
                return { startDate: undefined, endDate: undefined, months: 12 };
        }
    }, [timePeriod]);

    // Fetch analytics data
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);

            try {
                const apiClient = new ApiClient();
                const data = await apiClient.getGiftCardMonthOnMonthAnalytics(
                    dateField,
                    startDate,
                    endDate,
                    months
                );
                setAnalyticsData(data);
            } catch (err: any) {
                console.error('Failed to fetch gift card analytics:', err);
                setError(err.message || 'Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateField, startDate, endDate, months]);

    const refetch = () => {
        setAnalyticsData(null);
        // Trigger re-fetch by updating a dependency
        setDateField(prev => prev);
    };

    return {
        dateField,
        setDateField,
        timePeriod,
        setTimePeriod,
        analyticsData,
        loading,
        error,
        refetch
    };
};
