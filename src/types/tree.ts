import { Location } from "./common";

export type Tree = {
    key: number,
    id: number,
    sapling_id: string,
    plant_type_id: number,
    plot_id: number,
    image: string,
    tags: string[] | null,
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
    user_tree_image: string
    memory_images: string[]
    event_id: number,
    created_at: Date,
    updated_at: Date,
    tree_status: string,
    deleted_at: Date | null,

    plant_type?: string,
    habit?: string,
    plot?: string,
    site_name?: string,
    mapped_user_name?: string,
    mapped_group_name?: string,
    sponsor_user_name?: string,
    sponsor_group_name?: string,
    assigned_to_name?: string,
    illustration_s3_path?: string,
    template_image?: string,
    
    // Association with Gift/Donation/Visit
    association_type?: string | null, // "Gift Cards" | "Normal Assignment" | "Visit" | "Donation"
    request_id?: number | null, // The corresponding request ID (gift_card_request.id or donation.id)
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
    trees: Record<number, Tree>
};

type MapTreesBaseRequest = {
    mapped_to: 'user' | 'group',
    id: number,
    name?: string,
    email?: string,
    phone?: string,
    type?: string,
    description?: string,
    sponsor_id?: number,
    sponsor_name?: string,
    sponsor_email?: string,
    sponsor_phone?: string,
    sponsor_type?: string,
    sponsor_description?: string,
}

export type MapTreesUsingSaplingIdsRequest = MapTreesBaseRequest & {
    sapling_ids: string[],
}

export type MapTreesUsingPlotIdRequest = MapTreesBaseRequest & {
    plot_id: number,
    count: number,
}