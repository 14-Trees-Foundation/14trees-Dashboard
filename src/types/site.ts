
export enum maintainence_type {
    Full = 'FULL',
    Partial = 'PARTIAL'
}
export type Site = {
    id: number;
    key: number;
    name_marathi: string;
    name_english: string;
    owner: string;
    land_type: string;
    land_strata: string;
    district: string;
    taluka: string;
    village: string;
    area_acres: number | null;
    length_km: string;
    tree_count: string;
    unique_id: string;
    photo_album: string;
    consent_letter: string;
    grove_type: string;
    map_to: string;
    notion_db_pictures: string;
    split_village_name_1: string;
    split_village_name_2: string | null;
    create_id: string;
    site_key: string;
    site_key_2: string;
    temp_backup_copy_of_old_site_name_english_marathi: string;
    temp_copy_of_old_site_key: string;
    temp_old_site_name_in_english: string;
    temp_old_site_name_in_marathi: string;
    created_at: string;
    updated_at: string;
    maintenence_type: maintainence_type | null;
};

export type SitesDataState = {
    totalSites: number,
    sites: Record<number, Site>
}