import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useLocation, useParams } from "react-router-dom";
import { RequestItem, mapGiftRequestToRequestItem, mapDonationToRequestItem, createMiscellaneousRequestItem } from "../types/requestItem";
import RequestList from "./RequestList";
import TreesModal from "./TreesModal";
import SponsorHeroSection from "./SponsorHeroSection";

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { id } = useParams();

    const location = useLocation();
    const isGroupView = location.pathname.includes('/group/');

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [name, setName] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [aggregateMetrics, setAggregateMetrics] = useState({
        totalTrees: 0,
        totalRequests: 0,
    });


    const fetchRequests = async (userId: number, groupId?: number) => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();

            // Fetch gift card requests
            const giftCardsFilters = isGroupView
                ? [{ columnField: 'group_id', operatorValue: 'equals', value: groupId }]
                : [{ columnField: 'user_id', operatorValue: 'equals', value: userId }];

            const giftCardsResponse = await apiClient.getGiftCards(0, 1000, giftCardsFilters);

            // Fetch donations
            const donationsFilters = isGroupView
                ? [{ columnField: 'group_id', operatorValue: 'equals', value: groupId }]
                : [{ columnField: 'user_id', operatorValue: 'equals', value: userId }];

            const donationsResponse = await apiClient.getDonations(0, 1000, donationsFilters);

            // Fetch historical/miscellaneous trees count
            const miscFilters: any[] = [
                { columnField: 'donation_id', operatorValue: 'isNull' },
                { columnField: 'gift_card_request_id', operatorValue: 'isNull' }
            ];

            const miscTreesResponse = isGroupView
                ? await apiClient.getMappedTreesForGroup(groupId!, 0, 1, miscFilters)
                : await apiClient.getMappedTreesForTheUser(userId, 0, 1, miscFilters);

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

            // Set sponsor/group name from response
            const sponsorName = isGroupView
                ? (miscTreesResponse as any).group_name || 'Group'
                : giftCardsResponse.results[0]?.user_name || donationsResponse.results[0]?.user_name || 'User';

            setName(sponsorName);

        } catch (error: any) {
            toast.error(error.message || "Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };


    const handleRequestClick = (request: RequestItem) => {
        setSelectedRequest(request);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        if (id) {
            const numericId = Number(id);
            if (isGroupView) {
                fetchRequests(0, numericId); // groupId
            } else {
                fetchRequests(numericId); // userId
            }
        }
    }, [id, isGroupView]);


    return (
        <Box
            p={2}
            data-testid="mapped-trees-container"
            sx={{
                // Mobile: no padding to maximize space
                '@media (max-width: 768px)': {
                    padding: 1,
                }
            }}
        >
            {/* Header */}
            <Box mb={3}>
                <Typography mb={1} variant="h4" color={"#323232"} data-testid="dashboard-header">
                    {name}'s Dashboard
                </Typography>
                <Divider />
            </Box>

            {/* Hero Section with Aggregate Metrics */}
            <Box sx={{ mb: 4 }}>
                <SponsorHeroSection
                    totalTrees={aggregateMetrics.totalTrees}
                    totalRequests={aggregateMetrics.totalRequests}
                    loading={loading}
                    isGroupView={isGroupView}
                />
            </Box>

            {/* Request List */}
            <Box
                className="no-scrollbar"
                data-testid="request-list-container"
                sx={{
                    height: 'calc(100vh - 450px)', // Adjusted for hero section
                    overflowY: 'auto',
                    // Mobile: adjust height and padding
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 350px)',
                    }
                }}
            >
                <RequestList
                    requests={requests}
                    onRequestClick={handleRequestClick}
                    loading={loading}
                    isGroupView={isGroupView}
                />
            </Box>

            {/* Trees Modal */}
            <TreesModal
                open={modalOpen}
                onClose={handleModalClose}
                request={selectedRequest}
                userId={isGroupView ? undefined : Number(id)}
                groupId={isGroupView ? Number(id) : undefined}
            />
        </Box>
    );
}

export default MappedTrees;