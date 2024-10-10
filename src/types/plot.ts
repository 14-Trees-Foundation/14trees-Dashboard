import { Boundaries, Location } from "./common";

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
    total?: number,
    booked?: number,
    assigned?: number,
    available?: number,
    void_total?: number,
    void_booked?: number,
    void_assigned?: number,
    void_available?: number,
    acres_area?: number,
    site_id: string,
    site_name: string,
    created_at: Date,
    updated_at: Date,
};

export type PlotsDataState = {
    totalPlots: number,
    plots: Record<number, Plot>
    paginationMapping: Record<number, number> 
}