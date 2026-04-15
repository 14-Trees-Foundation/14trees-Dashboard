import ApiClient from '../../../../api/apiClient/apiClient';
import { User } from '../types';

/**
 * Search for users using the API
 */
export const searchUsersApi = async (searchTerm: string): Promise<User[]> => {
	try {
		const apiClient = new ApiClient();
		const userData = await apiClient.searchUsers(searchTerm);
		return userData || [];
	} catch (error) {
		console.error('Error in searchUsersApi:', error);
		throw error;
	}
};

/**
 * Get user by ID
 */
export const getUserByIdApi = async (
	userId: number | string,
): Promise<User | null> => {
	try {
		const apiClient = new ApiClient();
		const response = await apiClient.getUsers(0, 1, [
			{ columnField: 'id', operatorValue: 'equals', value: userId },
		]);

		if (response && response.results && response.results.length > 0) {
			return response.results[0];
		}

		return null;
	} catch (error) {
		console.error('Error in getUserByIdApi:', error);
		throw error;
	}
};
