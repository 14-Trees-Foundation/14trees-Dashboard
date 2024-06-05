
export type UserTree = {
    key: string,
    _id: string,
    tree: string,
    user: string,
    orgid: string,
    donated_by: string,
    profile_image: [string],
    gifted_by: string,
    planted_by: string,
    memories: [string],
    plantation_type: string,
    date_added: Date,
};

export type UserTreeCountObj = {
    count: number,
    tree_id: string[],
    user: {
        name: string,
        email: string
    },
    plot: {
        name: string,
        plot_id: string
    },
    matched: {
        count: number
    }
}

export type AssignTreeRequest = {
    sapling_id: string,
    name: string,
    phone: string,
    email: string,
    org: string,
    donor: string,
    plantation_type: string,
    gifted_by: string,
    planted_by: string,
    desc: string,
}

export type UserTreeCountPaginationResponse = {
    total: number,
    result_count: number,
    offset: number,
    result: UserTreeCountObj[]
}

export type UserTreesDataState = Record<string, UserTree>
export type UserTreeCountDataState = {
    totalResults: number
    results: UserTreeCountObj[]
}