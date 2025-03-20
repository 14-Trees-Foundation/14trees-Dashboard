export type GiftRedeemTransaction = {
    id: number;
    created_by: number;
    created_by_name?: string;
    modified_by: number;
    modified_by_name?: string;
    recipient: number;
    recipient_name?: string;
    primary_message: string;
    secondary_message: string;
    logo_message: string;
    occasion_name: string | null;
    occasion_type: string | null;
    gifted_by: string | null;
    gifted_on: Date;
    card_image_url?: string;
    illustration_s3_path?: string;
    template_image?: string;
    sapling_id?: string;
    plant_type?: string;
    trees_count?: number;
    created_at: string;
    updated_at: string;
}