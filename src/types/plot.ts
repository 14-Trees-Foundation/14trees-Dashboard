
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
    date_added: Date,
    trees_count?: number,
    mapped_trees_count?: number,
    assigned_trees_count?: number,
    available_trees_count?: number,
};

export type UpsertPlotResponse = {
    plot: Plot
}

export type PlotPaginationResponse = {
    total: number,
    result: Plot[]
}

export type PlotsDataState = {
    totalPlots: number,
    plots: Record<string, Plot>
}