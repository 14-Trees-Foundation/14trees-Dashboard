
export type PlantType = {
    key: number,
    id: number,
    name: string,
    name_english: string | null,
    common_name_english: string | null,
    common_name_marathi: string | null,
    scientific_name: string | null,
    known_as: string | null,
    plant_type_id: string | null,
    images: string[] | null,
    tags: string[] | null,
    habit: string | null,
    family: string | null,
    food: string | null,
    category: string | null,
    med_use: string | null,
    other_use: string | null,
    eco_value: string | null,
    names_index: string | null,
    description: string | null,
    created_at: Date,
    updated_at: Date,
}

export type PlantTypesDataState = {
    totalPlantTypes: number,
    plantTypes: Record<string, PlantType>
}