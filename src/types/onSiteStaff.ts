
export type OnsiteStaff = {
    key: string,
    _id: string,
    name: string,
    user_id: string,
    phone: number,
    image: string,
    email: string,
    role: string,
    permissions: [string],
    dob: Date,
    date_added: Date,
};

export type OnsiteStaffDataState = Record<string, OnsiteStaff>