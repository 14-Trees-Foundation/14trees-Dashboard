
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
        coordinates: [number]
    },
    mapped_to: string,
    link: string,
    event_type: string,
    desc: string,
    date_assigned: Date
};

export type TreesDataState = Record<string, Tree>;