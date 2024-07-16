
export type User = {
    key: number,
    id: number,
    name: string,
    user_id: string,
    phone: string,
    email: string,
    birth_date: Date,
    created_at: Date,
    updated_at: Date,
};

export type UsersDataState = {
    totalUsers: number,
    users: Record<number, User>
}