
export type View = {
    id: number,
    view_id: string,
    name: string,
    path: string,
    metadata: Record<string, any> | null,
    created_at: string,
    updated_at: string,
    users?: any[]
}