
export type User = {
    key: string,
    _id: string,
    name: string,
    userid: string,
    phone: number,
    email: string,
    dob: Date,
    date_added: Date,
    pin : number,
    org : string
};

export type UserPaginationResponse = {
    total: number,
    result: User[]
}

export type UsersDataState = {
    totalUsers: number,
    users: Record<string, User>
}
export type SearchUsersDataState = Record<string,User>;