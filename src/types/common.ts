
export type Boundaries = {
    type: string,
    coordinates: number[][][]
}

export type Location = {
    type: string,
    coordinates: number[]
}

export type UserRole = 'super-admin' | 'admin' | 'treelogging' | 'sponsor'

export const UserRoles = {
    SuperAdmin: 'super-admin' as UserRole,
    Admin: 'admin' as UserRole,
    TreeLogger: 'treelogging' as UserRole,
    Sponsor: 'sponsor' as UserRole,
}