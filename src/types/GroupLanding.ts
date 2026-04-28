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
	visit_count: number;
	csr_event_count: number;
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
	request_type: string | null;
	status: string;
	visit_hero_image: string | null;
};

export type GroupLandingVisit = GroupLandingGiftCard;

export type GroupLandingData = {
	group: GroupLandingGroup;
	stats: GroupLandingStats;
	events: GroupLandingEvent[];
	gift_cards: GroupLandingGiftCard[];
	visits: GroupLandingVisit[];
	csr_events: GroupLandingGiftCard[];
};

export type GroupGiftCardItem = {
	id: number;
	gift_card_request_id: number;
	request_id: string | null;
	event_type: string | null;
	status: string | null;
	card_image_url: string | null;
	event_name: string | null;
	gifted_on: string | null;
	recipient_name: string | null;
	assigned_to_name: string | null;
	sapling_id: string | null;
	tree_type: string | null;
	info_card_s3_path: string | null;
	illustration_s3_path: string | null;
};

export type GroupGiftCardsData = {
	cards: GroupGiftCardItem[];
};

export type GroupVisitCardItem = GroupGiftCardItem & {
	request_type: string | null;
	user_tree_image: string | null;
	image: string | null;
	visit_hero_image: string | null;
};

export type GroupVisitCardsData = {
	cards: GroupVisitCardItem[];
};

export type CsrTreeSpecies = {
	tree_type: string;
	count: number;
	info_card_s3_path: string | null;
	illustration_s3_path: string | null;
};

export type GroupCsrEventCardItem = {
	sponsored_by_user_id: number | null;
	sponsored_by_user_name: string | null;
	total_trees: string | number;
	gifted_on: string | null;
	event_type: string | null;
	event_name: string | null;
	status: string | null;
	request_type: string | null;
	display_image: string | null;
	tree_species: CsrTreeSpecies[];
};

export type GroupCsrEventCardsData = {
	cards: GroupCsrEventCardItem[];
};
