
export type Group = {
    key: number,
    id: number,
    name: string,
    type: string,
    description: string,
    logo_url: string | null,
    address: string | null,
    created_at: Date,
    updated_at: Date,
    sponsored_trees?: number,
}

export type BulkUserGroupMappingResponse = {
    success: number,
    failed: number,
    failed_records: any[],
}

export type GroupMappingState = Record<number, BulkUserGroupMappingResponse>

export type GroupsDataState = {
    totalGroups: number,
    groups: Record<string, Group>
}