
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

export type UsersDataState = Record<string,User>;