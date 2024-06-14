import { Boundaries, Location } from "./common";

export type Plot = {
    key: number,
    id: number,
    name: string,
    plot_id: string,
    tags: string[],
    desc: string,
    boundaries: Boundaries,
    center: Location,
    trees_count?: number,
    mapped_trees_count?: number,
    assigned_trees_count?: number,
    available_trees_count?: number,
    created_at: Date,
    updated_at: Date,
};

export type PlotsDataState = {
    totalPlots: number,
    plots: Record<number, Plot>
}