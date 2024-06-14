
export type PaginatedResponse<T> = {
    offset: number,
    total: number,
    results: T[]
} 