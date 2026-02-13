import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiClient from '../../../api/apiClient/apiClient';
import { UserItem, createUserItem } from '../types/userItem';

interface UseAlumniGroupDataResult {
    loading: boolean;
    users: UserItem[];
    aggregateMetrics: {
        totalTrees: number;
        totalRequests: number;
    };
}

export const useAlumniGroupData = (groupId: number): UseAlumniGroupDataResult => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [aggregateMetrics, setAggregateMetrics] = useState({
        totalTrees: 0,
        totalRequests: 0,
    });

    useEffect(() => {
        const fetchUsers = async () => {
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

                        if (userTreeMap.has(userId)) {
                            const userData = userTreeMap.get(userId)!;
                            userData.count += 1;
                        } else {
                            userTreeMap.set(userId, {
                                name: userName,
                                email: userEmail,
                                count: 1,
                                profilePhoto: undefined,
                            });
                        }
                    }
                });

                // Fetch profile photos for all users in one batch API call
                const userIds = Array.from(userTreeMap.keys());
                if (userIds.length > 0) {
                    try {
                        const profilePhotos = await apiClient.getUsersProfilePhotos(userIds);

                        // Update user map with profile photos
                        Object.entries(profilePhotos).forEach(([userIdStr, photoUrl]) => {
                            const userId = Number(userIdStr);
                            const userData = userTreeMap.get(userId);
                            if (userData && photoUrl) {
                                userData.profilePhoto = photoUrl;
                            }
                        });
                    } catch (error) {
                        console.error('Failed to fetch user profile photos:', error);
                        // Continue without photos if the batch fetch fails
                    }
                }

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
                console.error('Error fetching alumni group data:', error);
                toast.error(error.message || "Failed to fetch alumni group data");
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchUsers();
        }
    }, [groupId]);

    return { loading, users, aggregateMetrics };
};
