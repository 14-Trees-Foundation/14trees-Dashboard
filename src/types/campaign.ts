export type CampaignEmailConfig = {
    sponsor_email?: {
        enabled: boolean;
        from_name: string;
        from_email?: string;
        subject_template_single: string;
        subject_template_multi: string;
        reply_to?: string;
        cc_emails: string[];
        template_name_single: string;
        template_name_multi: string;
        custom_data?: Record<string, any>;
    };
    receiver_email?: {
        enabled: boolean;
        from_name: string;
        subject_template: string;
        template_name: string;
        custom_data?: Record<string, any>;
    };
};

export type Campaign = {
    key: number;
    id: number;
    c_key: string;
    name: string;
    description: string | null;
    email_config: CampaignEmailConfig | null;
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
    email_config?: CampaignEmailConfig | null;
};