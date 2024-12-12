
export type Boundaries = {
    type: string,
    coordinates: number[][][]
}

export type Location = {
    type: string,
    coordinates: number[]
}

export type UserRole = 'super-admin' | 'admin' | 'treelogging' | 'user'

export const UserRoles = {
    SuperAdmin: 'super-admin' as UserRole,
    Admin: 'admin' as UserRole,
    TreeLogger: 'treelogging' as UserRole,
    User: 'user' as UserRole,
}

export type Order = { 
    column: string, 
    order: 'ASC' | 'DESC' 
}