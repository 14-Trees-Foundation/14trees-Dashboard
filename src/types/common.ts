
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

export const EventTypes = [
    {
        value: '1',
        label: 'Birthday'
    },
    {
        value: '2',
        label: 'Memorial'
    },
    {
        value: '4',
        label: 'Wedding'
    },
    {
        value: '5',
        label: 'Anniversary'
    },
    {
        value: '6',
        label: 'Festival'
    },
    {
        value: '3',
        label: 'General gift'
    },
]