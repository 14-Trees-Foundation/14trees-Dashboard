export interface UserItem {
  id: number; // user_id
  name: string; // user name
  email?: string; // user email
  treeCount: number; // Total trees sponsored by this user in the group
  profilePhoto?: string; // Profile photo URL if available
}

/**
 * Creates a UserItem from aggregated tree data
 */
export function createUserItem(
  userId: number,
  userName: string,
  treeCount: number,
  email?: string,
  profilePhoto?: string
): UserItem {
  return {
    id: userId,
    name: userName,
    email,
    treeCount,
    profilePhoto,
  };
}