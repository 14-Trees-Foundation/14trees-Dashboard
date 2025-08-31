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
export const getUserByIdApi = async (userId: number | string): Promise<User | null> => {
  try {
    const apiClient = new ApiClient();
    // Try to get user by ID using getUserRoles which returns user data
    const userData = await apiClient.getUserRoles(userId);
    
    if (userData && userData.user) {
      return userData.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getUserByIdApi:', error);
    throw error;
  }
};