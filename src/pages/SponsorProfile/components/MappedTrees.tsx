import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useLocation, useParams } from "react-router-dom";
import { RequestItem, mapGiftRequestToRequestItem, mapDonationToRequestItem, createMiscellaneousRequestItem } from "../types/requestItem";
import { UserItem, createUserItem } from "../types/userItem";
import RequestList from "./RequestList";
import UserList from "./UserList";
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
    const [users, setUsers] = useState<UserItem[]>([]);
    const [name, setName] = useState('');
    const [groupType, setGroupType] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [aggregateMetrics, setAggregateMetrics] = useState({
        totalTrees: 0,
        totalRequests: 0,
    });


    const fetchGroupDetails = async (groupId: number) => {
        try {
            const apiClient = new ApiClient();
            const filters = [{ columnField: 'id', operatorValue: 'equals', value: groupId }];
            const groupResponse = await apiClient.getGroups(0, 1, filters);

            if (groupResponse.results.length > 0) {
                const group = groupResponse.results[0];
                setGroupType(group.type);
                setName(group.name);
                return group.type;
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching group details:", error);
            toast.error(error.message || "Failed to fetch group details");
            return null;
        }
    };

    const fetchUsersForAlumniGroup = async (groupId: number) => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();

            // Fetch all trees for this group
            const treesResponse = await apiClient.getMappedTreesForGroup(groupId, 0, 10000, []);

            // Aggregate trees by user
            const userTreeMap = new Map<number, { name: string; email?: string; count: number; profilePhoto?: string }>();

            treesResponse.results.forEach((tree) => {
                if (tree.sponsored_by_user) {
                    const userId = tree.sponsored_by_user;
                    const userName = tree.sponsor_user_name || `User ${userId}`;
                    const userEmail = tree.sponsor_user_email;

                    // Check if this tree has a user holding tree photo (assigned_to === user_id and user_tree_image exists)
                    const hasUserPhoto = tree.assigned_to === userId && tree.user_tree_image;
                    const userPhoto = hasUserPhoto ? tree.user_tree_image : undefined;

                    if (userTreeMap.has(userId)) {
                        const userData = userTreeMap.get(userId)!;
                        userData.count += 1;
                        // Update profile photo if we found one and don't have one yet
                        if (userPhoto && !userData.profilePhoto) {
                            userData.profilePhoto = userPhoto;
                        }
                    } else {
                        userTreeMap.set(userId, {
                            name: userName,
                            email: userEmail,
                            count: 1,
                            profilePhoto: userPhoto,
                        });
                    }
                }
            });

            // Convert map to UserItem array and sort by tree count (descending)
            const userItems: UserItem[] = Array.from(userTreeMap.entries())
                .map(([userId, userData]) =>
                    createUserItem(userId, userData.name, userData.count, userData.email, userData.profilePhoto)
                )
                .sort((a, b) => b.treeCount - a.treeCount);

            setUsers(userItems);

            // Calculate aggregate metrics
            const totalTrees = userItems.reduce((sum, user) => sum + user.treeCount, 0);
            const totalRequests = userItems.length;
            setAggregateMetrics({ totalTrees, totalRequests });

        } catch (error: any) {
            toast.error(error.message || "Failed to fetch users for alumni group");
        } finally {
            setLoading(false);
        }
    };

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
        const fetchData = async () => {
            if (id) {
                const numericId = Number(id);
                if (isGroupView) {
                    // Fetch group details first to check if it's an ALUMNI group
                    const type = await fetchGroupDetails(numericId);

                    if (type?.toUpperCase() === 'ALUMNI') {
                        // For ALUMNI groups, show users instead of requests
                        await fetchUsersForAlumniGroup(numericId);
                    } else {
                        // For regular groups, show requests
                        await fetchRequests(0, numericId);
                    }
                } else {
                    // For individual users, show requests
                    await fetchRequests(numericId);
                }
            }
        };

        fetchData();
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
                    {loading && !name ? 'Loading...' : `${name}'s Dashboard`}
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

            {/* Request List or User List (for ALUMNI groups) */}
            <Box
                className="no-scrollbar"
                data-testid={isGroupView && groupType?.toUpperCase() === 'ALUMNI' ? "user-list-container" : "request-list-container"}
                sx={{
                    height: 'calc(100vh - 450px)', // Adjusted for hero section
                    overflowY: 'auto',
                    // Mobile: adjust height and padding
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 350px)',
                    }
                }}
            >
                {isGroupView && groupType?.toUpperCase() === 'ALUMNI' ? (
                    <UserList
                        users={users}
                        loading={loading}
                        isGroupView={isGroupView}
                    />
                ) : (
                    <RequestList
                        requests={requests}
                        onRequestClick={handleRequestClick}
                        loading={loading}
                        isGroupView={isGroupView}
                    />
                )}
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