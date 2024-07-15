
export enum maintenance_type {
 

    FULL_MAINTENANCE= 'FULL_MAINTENANCE',
	PLANTATION_ONLY='PLANTATION_ONLY',
	DISTRIBUTION_ONLY='DISTRIBUTION_ONLY'
}
export enum site_data_check_type {
    Yes="Yes",
    No ="No"
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
    consent_document_link:  string| null;
    google_earth_link: string|null;
    trees_planted: Number|null;
    tags: string[]|null;
    account: string|null;
    data_errors: string|null;
    date_planted: Date|null;
    site_data_check: site_data_check_type|null;
   
    create_id: string;
    
    created_at: string;
    updated_at: string;
    maintenance_type: maintenance_type | null;
};

export type SitesDataState = {
    totalSites: number,
    sites: Record<number, Site>
}