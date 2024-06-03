
export type TreeType = {
    key: string,
    _id: string,
    name: string,
    scientific_name: string,
    name_english: string,
    tree_id: string,
    image: [string],
    family: string,
    habit: string,
    remarkable_char: string,
    med_use: string,
    other_use: string,
    food: string,
    eco_value: string,
    parts_userd: string,
    tags: [string],
    desc: string,
}

export type CreateTreeTypeResponse = {
    csvupload: string,
    treetype: TreeType
}

export type TreeTypePaginationResponse = {
    total: number,
    result: TreeType[]
}

export type TreeTypesDataState = {
    totalTreeTypes: number,
    treeTypes: Record<string, TreeType>
}
export type SearchTreeTypesDataState = Record<string, TreeType>