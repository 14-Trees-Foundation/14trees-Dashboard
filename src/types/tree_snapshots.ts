
export type TreeImage = {
    key: number,
    id: number,
    sapling_id: string,
    image: string,
    tree_status: string,
    user_id: number
    image_date: Date,
    created_at: Date,
}

export type TreeImagesDataState = {
    totalTreeImages: number,
    treeImages: Record<number, TreeImage>
};