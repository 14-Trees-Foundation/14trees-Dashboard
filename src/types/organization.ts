
export type Organization = {
    key: string,
    _id: string,
    name: string,
    type: string,
    desc: string,
    date_added: Date,
}

export type OrganizationPaginationResponse = {
    total: number,
    result: Organization[]
}

export type OrganizationsDataState = {
    totalOrganizations: number,
    organizations: Record<string, Organization>
}