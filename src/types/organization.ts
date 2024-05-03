
export type Organization = {
    key: string,
    _id: string,
    name: string,
    type: string,
    desc: string,
    date_added: Date,
}

export type OrganizationsDataState = Record<string, Organization>