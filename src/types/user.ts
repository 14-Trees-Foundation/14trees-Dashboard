
export type User = {
    key: number,
    id: number,
    name: string,
    user_id: string,
    phone: string,
    email: string,
    communication_email: string | null,
    birth_date: string | null,
    created_at: Date,
    updated_at: Date,
};

export type UsersDataState = {
    loading: boolean,
    totalUsers: number,
    users: Record<number, User>,
    paginationMapping: Record<number, number>,
}