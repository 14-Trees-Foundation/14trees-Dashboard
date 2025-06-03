export type Campaign = {
    key: number;
    id: number;
    c_key: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type CampaignsDataState = {
    loading: boolean;
    totalCampaigns: number;
    campaigns: Record<number, Campaign>;
    paginationMapping: Record<number, number>;
};

export type CampaignFormValues = {
    name: string;
    c_key: string;
    description?: string | null;
};