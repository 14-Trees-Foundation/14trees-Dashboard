import { Location } from "./common";

export type Tree = {
    key: number,
    id: number,
    sapling_id: string,
    plant_type_id: number,
    plot_id: number,
    image: [string],
    tags: [string],
    location: Location,
    planted_by: string,
    mapped_to_user: number,
    mapped_to_group: number,
    mapped_at: Date,
    sponsored_by_user: number,
    sponsored_by_group: number,
    gifted_by: number,
    gifted_to: number,
    assigned_to: number,
    assigned_at: Date,
    user_tree_images: string[]
    memory_images: string[]
    event_id: number,
    created_at: Date,
    updated_at: Date,

    plant_type?: string,
    plot?: string,
    mapped_user_name?: string,
    assigned_to_name?: string,
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

export type TreesDataState = {
    totalTrees: number,
    trees: Record<string, Tree>
};