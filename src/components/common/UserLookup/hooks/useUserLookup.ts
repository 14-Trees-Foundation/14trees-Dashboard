import { useState, useEffect, useCallback } from 'react';
import { User, UseUserLookupProps } from '../types';
import { searchUsersApi, getUserByIdApi } from '../utils/userApi';

export const useUserLookup = ({
  minSearchLength = 3,
  debounceMs = 300,
  onSearch,
  initialUserId,
  mode = 'add',
}: UseUserLookupProps = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userLookupLoading, setUserLookupLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string>('');

  // Fetch initial user data when editing
  useEffect(() => {
    const fetchInitialUser = async () => {
      if (mode === 'edit' && initialUserId) {
        try {
          setUserLookupLoading(true);
          const userData = await getUserByIdApi(initialUserId);
          
          if (userData) {
            setSelectedUser(userData);
          } else {
            console.warn(`User with ID ${initialUserId} not found`);
            // Create placeholder user
            setSelectedUser({
              id: initialUserId,
              name: `User ${initialUserId}`,
              email: ''
            });
          }
        } catch (error) {
          console.error('Error fetching initial user data:', error);
          setError('Failed to load user data');
          // Create placeholder user
          setSelectedUser({
            id: initialUserId,
            name: `User ${initialUserId}`,
            email: ''
          });
        } finally {
          setUserLookupLoading(false);
        }
      } else {
        setSelectedUser(null);
      }
    };

    fetchInitialUser();
  }, [mode, initialUserId]);

  // Search function with debounce
  const searchUsers = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < minSearchLength) {
      setUsers([]);
      setUserLookupLoading(false);
      setError('');
      return;
    }

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setUserLookupLoading(true);
    setError('');

    // Set new timeout for debounce
    const newTimeout = setTimeout(async () => {
      try {
        let userData: User[];
        
        if (onSearch) {
          // Use custom search function if provided
          userData = await onSearch(searchTerm);
        } else {
          // Use default API search
          userData = await searchUsersApi(searchTerm);
        }
        
        setUsers(userData || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users');
        setUsers([]);
      } finally {
        setUserLookupLoading(false);
      }
    }, debounceMs);

    setSearchTimeout(newTimeout);
  }, [minSearchLength, debounceMs, onSearch, searchTimeout]);

  // Handle user selection
  const handleUserSelection = useCallback((event: any, newValue: User | null) => {
    setSelectedUser(newValue);
    setError('');
  }, []);

  // Reset function
  const resetUserLookup = useCallback(() => {
    setUsers([]);
    setSelectedUser(null);
    setError('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  }, [searchTimeout]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    users,
    selectedUser,
    userLookupLoading,
    error,
    searchUsers,
    handleUserSelection,
    resetUserLookup,
    setSelectedUser,
  };
};