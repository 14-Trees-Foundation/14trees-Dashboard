

export type GiftCard = {
    key: number;
    id: number;
    user_id: number;
    group_id: number;
    no_of_cards: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user_name?: string;
    group_name?: string;
    plot_ids?: number[];
    primary_message: string;
    secondary_message: string;
    event_name: string;
    planted_by: string;
    logo_message: string;
    request_id: string;
    logo_url: string | null;
}

export type GiftCardUser = {
    key: number;
    id: number;
    user_id: number;
    card_id: number;
    tree_id: number;
    card_image_url?: string;
    created_at: string;
    updated_at: string;
    sapling_id?: string;
    user_name?: string;
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

