
export type Plot = {
    key: string,
    _id: string,
    name: string,
    plot_id: string,
    tags: [string],
    desc: string,
    boundaries: {
        type: string,
        coordinates: [[[number]]]
    },
    center: {
        type: string,
        coordinates: [number]
    },
    date_added: Date
};

export type PlotsDataState = Record<string, Plot>;