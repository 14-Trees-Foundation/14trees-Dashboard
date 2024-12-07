

export type GiftCard = {
    key: number;
    id: number;
    user_id: number;
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
    notes: string | null;
    payment_id: number | null;
    album_id: number | null;
    tags: string[] | null;
    booked: number,
    assigned: number,
}

export type GiftCardUser = {
    key: number;
    id: number;
    gifted_to: number;
    assigned_to: number;
    gift_card_request_id: number;
    tree_id: number;
    card_image_url?: string;
    profile_image_url?: string;
    created_at: string;
    updated_at: string;
    sapling_id?: string;
    gifted_to_name?: string;
    gifted_to_email?: string;
    gifted_to_phone?: string;
    assigned_to_name?: string;
    assigned_to_email?: string;
    assigned_to_phone?: string;
    relation?: string;
    plant_type?: string;
}

export type GiftCardsDataState = {
    totalGiftCards: number,
    giftCards: Record<string, GiftCard>
}

export type GiftCardUsersDataState = {
    totalGiftCardUsers: number,
    giftCardUsers: Record<string, GiftCardUser>
}

