import { Boundaries, Location } from "./common";

export const PlotAccessibilityList = [
    { value: "accessible", label: "Accessible" },
    { value: "inaccessible", label: "Inaccessible" },
    { value: "moderately_accessible", label: "Moderately Accessible" },
];

export type Plot = {
    key: number,
    id: number,
    name: string,
    plot_id: string,
    label: string,
    accessibility_status: string | null,
    tags: string[],
    gat: string,
    category: number,
    desc: string,
    boundaries: Boundaries,
    center: Location,
    pit_count: number | null,
    total?: number,
    tree_count?: number,
    shrub_count?: number,
    herb_count?: number,
    booked?: number,
    assigned?: number,
    available?: number,
    void_total?: number,
    void_booked?: number,
    void_assigned?: number,
    void_available?: number,
    card_available?: number,
    unbooked_assigned?: number,
    booked_trees?: number,
    assigned_trees?: number,
    available_trees?: number,
    unbooked_assigned_trees?: number,
    booked_shrubs?: number,
    assigned_shrubs?: number,
    available_shrubs?: number,
    unbooked_assigned_shrubs?: number,
    booked_herbs?: number,
    assigned_herbs?: number,
    available_herbs?: number,
    unbooked_assigned_herbs?: number,
    acres_area?: number,
    distinct_plants?: string[],
    site_id: string,
    site_name: string,
    created_at: Date,
    updated_at: Date,
};

export type PlotsDataState = {
    loading: boolean,
    totalPlots: number,
    plots: Record<number, Plot>
    paginationMapping: Record<number, number> 
}