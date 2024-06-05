
export type Tree = {
    key: string,
    _id: string,
    sapling_id: string,
    tree_id: string,
    plot_id: string,
    user_id: string,
    image: [string],
    height: number,
    date_added: Date,
    tags: [string],
    location: {
        type: string,
        coordinates: number[]
    },
    mapped_to: string,
    link: string,
    event_type: string,
    desc: string,
    date_assigned: Date,
    plot?: {
        name: string
    },
    tree?: {
        name: string
    },
    user?: {
        name: string
    },
    assigned_to?: {
        name: string
    },
};

export type CreateTreeRequest = {
    sapling_id: string,
    tree_id: string,
    plot_id: string,
    user_id: string,
    images: string,
    height: number,
    lat: number,
    lng: number,
    mapped_to: string,
}

export type PaginationTreeResponse = {
    total: number,
    offset: number,
    results: Tree[]
}

export type TreesDataState = {
    totalTrees: number,
    trees: Record<string, Tree>
};