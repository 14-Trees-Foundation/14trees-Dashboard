import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiClient from '../../../api/apiClient/apiClient';

interface UseSponsorProfileResult {
    loading: boolean;
    name: string;
    groupType: string | null;
}

export const useSponsorProfile = (
    id: string | undefined,
    isGroupView: boolean
): UseSponsorProfileResult => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [groupType, setGroupType] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const apiClient = new ApiClient();
                const numericId = Number(id);

                if (isGroupView) {
                    // Fetch group details
                    const filters = [{ columnField: 'id', operatorValue: 'equals', value: numericId }];
                    const groupResponse = await apiClient.getGroups(0, 1, filters);

                    if (groupResponse.results.length > 0) {
                        const group = groupResponse.results[0];
                        setGroupType(group.type);
                        setName(group.name);
                    }
                } else {
                    // Fetch user details
                    const userFilters = [{ columnField: 'id', operatorValue: 'equals', value: numericId }];
                    const userResponse = await apiClient.getUsers(0, 1, userFilters);

                    if (userResponse.results.length > 0) {
                        setName(userResponse.results[0].name);
                    }
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                toast.error(error.message || 'Failed to fetch profile details');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, isGroupView]);

    return { loading, name, groupType };
};
