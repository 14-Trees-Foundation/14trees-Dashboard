
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

export type UserTreesDataState = Record<string, UserTree>