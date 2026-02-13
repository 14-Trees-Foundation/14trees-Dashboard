import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiClient from '../../../api/apiClient/apiClient';
import { RequestItem, mapGiftRequestToRequestItem, mapDonationToRequestItem, createMiscellaneousRequestItem } from '../types/requestItem';

interface UseUserSponsorshipDataResult {
    loading: boolean;
    requests: RequestItem[];
    aggregateMetrics: {
        totalTrees: number;
        totalRequests: number;
    };
}

export const useUserSponsorshipData = (userId: number): UseUserSponsorshipDataResult => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [aggregateMetrics, setAggregateMetrics] = useState({
        totalTrees: 0,
        totalRequests: 0,
    });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const apiClient = new ApiClient();

                // Fetch gift card requests
                const giftCardsFilters = [{ columnField: 'user_id', operatorValue: 'equals', value: userId }];
                const giftCardsResponse = await apiClient.getGiftCards(0, 1000, giftCardsFilters);

                // Fetch donations
                const donationsFilters = [{ columnField: 'user_id', operatorValue: 'equals', value: userId }];
                const donationsResponse = await apiClient.getDonations(0, 1000, donationsFilters);

                // Fetch historical/miscellaneous trees count
                const miscFilters: any[] = [
                    { columnField: 'donation_id', operatorValue: 'isNull' },
                    { columnField: 'gift_card_request_id', operatorValue: 'isNull' }
                ];
                const miscTreesResponse = await apiClient.getMappedTreesForTheUser(userId, 0, 1, miscFilters);

                // Map gift card requests to RequestItems (filter out Test/Promotion and 0 tree requests)
                const giftRequestItems: RequestItem[] = giftCardsResponse.results
                    .map(request => mapGiftRequestToRequestItem(request))
                    .filter((item): item is RequestItem => item !== null && item.treeCount > 0);

                // Map donations to RequestItems (filter out 0 tree donations)
                const donationRequestItems: RequestItem[] = donationsResponse.results
                    .map(donation => mapDonationToRequestItem(donation))
                    .filter(item => item.treeCount > 0);

                // Create miscellaneous item if there are historical trees
                const miscCount = Number(miscTreesResponse.total);
                const miscRequestItems: RequestItem[] = miscCount > 0
                    ? [createMiscellaneousRequestItem(miscCount)]
                    : [];

                // Combine all requests and sort by date (newest first)
                // Miscellaneous should always appear at the end
                const allRequests = [...giftRequestItems, ...donationRequestItems];
                allRequests.sort((a, b) => b.date.getTime() - a.date.getTime());

                // Add miscellaneous at the end
                if (miscRequestItems.length > 0) {
                    allRequests.push(...miscRequestItems);
                }

                setRequests(allRequests);

                // Calculate aggregate metrics
                const totalTrees = allRequests.reduce((sum, req) => sum + req.treeCount, 0);
                const totalRequests = allRequests.length;
                setAggregateMetrics({ totalTrees, totalRequests });

            } catch (error: any) {
                console.error('Error fetching user sponsorship data:', error);
                toast.error(error.message || "Failed to fetch sponsorship data");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchRequests();
        }
    }, [userId]);

    return { loading, requests, aggregateMetrics };
};
