export type GroupLandingGroup = {
	id: number;
	name: string;
	name_key: string | null;
	description: string | null;
	logo_url: string | null;
	hero_image_url: string | null;
	acres_of_land: number | null;
	years_of_partnership: number | null;
};

export type GroupLandingStats = {
	trees_sponsored: number;
	event_count: number;
	gift_card_count: number;
};

export type GroupLandingEvent = {
	id: number;
	name: string;
	link: string | null;
	event_date: string;
	type: number | null;
	landing_image_s3_path: string | null;
	event_poster: string | null;
	site_name: string | null;
	event_images: string[];
};

export type GroupLandingGiftCard = {
	id: number;
	request_id: string;
	event_name: string | null;
	no_of_cards: number;
	gifted_on: string | null;
	display_image: string | null;
	event_type: string | null;
	status: string;
};

export type GroupLandingData = {
	group: GroupLandingGroup;
	stats: GroupLandingStats;
	events: GroupLandingEvent[];
	gift_cards: GroupLandingGiftCard[];
};
