import { useAuth } from '../pages/admin/auth/auth';

export interface RbacPermission {
	resource: string;
	action: string;
	data_scope?: string;
}

/**
 * Hook to check RBAC permissions for the currently authenticated user.
 *
 * Permissions are loaded at login from the backend and stored in localStorage.
 * Falls back to localStorage so permissions survive a page refresh before the
 * auth context is fully hydrated.
 */
export function useRbacPermissions() {
	const auth = useAuth();

	// Prefer live context; fall back to localStorage on page refresh
	const permissions: RbacPermission[] = (() => {
		if (auth.rbacPermissions && auth.rbacPermissions.length > 0) {
			return auth.rbacPermissions;
		}
		try {
			const stored = localStorage.getItem('rbacPermissions');
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	})();

	const can = (resource: string, action: string): boolean => {
		return permissions.some(
			(p) => p.resource === resource && p.action === action,
		);
	};

	return { can, permissions };
}
