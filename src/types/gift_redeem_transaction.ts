export type GiftRedeemTransaction = {
    id: number;
    created_by: number;
    group_id: number | null;
    user_id: number | null;
    created_by_name?: string;
    modified_by: number;
    modified_by_name?: string;
    recipient: number;
    recipient_name?: string;
    recipient_email?: string;
    recipient_communication_email?: string;
    primary_message: string;
    secondary_message: string;
    logo_message: string;
    occasion_name: string | null;
    occasion_type: string | null;
    gifted_by: string | null;
    gifted_on: Date;
    
    // Enhanced transaction source tracking fields
    gift_source_type: 'fresh_request' | 'pre_purchased' | null;
    source_request_id: number | null;
    gift_type_display?: string;
    source_description?: string;
    
    // Source request details (when available)
    source_request_identifier?: string;
    source_event_name?: string;
    source_request_date?: string;
    
    tree_details?: {
        plant_type: string,
        sapling_id: string,
        card_image_url?: string | null,
        template_image?: string | null,
        illustration_s3_path?: string | null,
        logo_url?: string | null,
    }[],
    trees_count?: number;
    mail_sent: boolean | null;
    mail_sent_at: string | null;
    mail_error: string | null;
    created_at: string;
    updated_at: string;
}