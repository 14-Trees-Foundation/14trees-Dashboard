export type EventLandingEvent = {
	id: number;
	name: string;
	description: string | null;
	event_date: string;
	link: string;
	site_name: string | null;
	group_id: number | null;
	group_name: string | null;
	group_name_key: string | null;
	group_logo_url: string | null;
	landing_image_s3_path: string | null;
	landing_image_mobile_s3_path: string | null;
	event_poster: string | null;
	location: { lat: number; lng: number } | null;
	theme_color: string | null;
};

export type EventLandingImage = {
	id: number;
	image_url: string;
	sequence: number;
};

export type EventLandingParticipant = {
	user_id: number;
	name: string;
	image_url: string | null;
	sapling_id: string | null;
	tree_image: string | null;
	plant_type_name: string | null;
	plant_type_english_name: string | null;
	plant_type_illustration: string | null;
};

export type EventLandingMessage = {
	id: number;
	message: string;
	user_name: string | null;
	sequence: number;
};

export type EventLandingTree = {
	id: number;
	sapling_id: string | null;
	assigned_to: number | null;
	image_url: string | null;
	tree_image: string | null;
	plant_type_name: string | null;
	plant_type_english_name: string | null;
	plant_type_illustration: string | null;
	user_id: number | null;
	user_name: string | null;
};

export type EventLandingData = {
	event: EventLandingEvent;
	images: EventLandingImage[];
	participants: EventLandingParticipant[];
	trees: EventLandingTree[];
	messages: EventLandingMessage[];
};
