export type GiftRequestType = 'Gift Cards' | 'Normal Assignment' | 'Promotion' | 'Test' | 'Visit'
export type SponsorshipType = 'Unverified' | 'Pledged' | 'Promotional' | 'Unsponsored Visit' | 'Donation Received'

export const GiftRequestType_CARDS_REQUEST: GiftRequestType = 'Gift Cards'
export const GiftRequestType_NORAML_ASSIGNMENT: GiftRequestType = 'Normal Assignment'
export const GiftRequestType_PROMOTION: GiftRequestType = 'Promotion'
export const GiftRequestType_TEST: GiftRequestType = 'Test'
export const GiftRequestType_VISIT: GiftRequestType = 'Visit'

export type GiftCard = {
    key: number;
    id: number;
    user_id: number;
    sponsor_id: number | null;
    created_by: number;
    group_id: number;
    no_of_cards: number;
    category: string;
    grove: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user_name?: string;
    user_email?: string;
    group_name?: string;
    created_by_name?: string;
    plot_ids?: number[];
    primary_message: string;
    secondary_message: string;
    event_name: string;
    event_type: string;
    planted_by: string;
    logo_message: string;
    request_id: string;
    logo_url: string | null;
    validation_errors: string[] | null;
    status: string;
    presentation_id: string | null;
    presentation_ids: string[];
    notes: string | null;
    payment_id: number | null;
    album_id: number | null;
    tags: string[] | null;
    booked: number,
    assigned: number,
    gifted_on: string;
    request_type: string | null;
    sponsorship_type: SponsorshipType;
    donation_receipt_number: string | null;
    amount_received: number;
    total_amount: number;
    donation_date: string | null;
    mail_status: string[] | null;
    processed_by: number | null;
    processed_by_name?: string;
    recipient_name: string;
}

export type GiftRequestUser = {
    key: number;
    id: number;
    recipient: number;
    assignee: number;
    gift_request_id: number;
    gifted_trees: number;
    profile_image_url?: string;
    recipient_name?: string;
    recipient_email?: string;
    recipient_phone?: string;
    assignee_name?: string;
    assignee_email?: string;
    assignee_phone?: string;
    relation?: string;
    created_at: string;
    updated_at: string;
}

export type GiftCardUser = {
    key: number;
    id: number;
    gifted_to: number;
    assigned_to: number;
    gift_request_user_id: number | null;
    gift_card_request_id: number;
    tree_id: number;
    card_image_url?: string;
    profile_image_url?: string;
    created_at: string;
    updated_at: string;
    sapling_id?: string;
    recipient_name?: string;
    recipient_email?: string;
    recipient_phone?: string;
    assignee_name?: string;
    assignee_email?: string;
    assignee_phone?: string;
    relation?: string;
    plant_type?: string;
}

export type GiftCardsDataState = {
    loading: boolean,
    totalGiftCards: number,
    giftCards: Record<string, GiftCard>
    paginationMapping: Record<number, number> 
}

export type GiftCardUsersDataState = {
    totalGiftCardUsers: number,
    giftCardUsers: Record<string, GiftCardUser>
}

