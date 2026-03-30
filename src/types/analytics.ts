export interface GiftCardSummaryKPIs {
	total_requests: number;
	corporate_count: number;
	personal_count: number;
	fulfilled_count: number;
	pending_count: number;
	total_trees: number;
	avg_trees_per_card: number;
	total_requests_delta: number | null;
	total_trees_delta: number | null;
	fulfilled_delta: number | null;
	pending_delta: number | null;
	corporate_delta: number | null;
	personal_delta: number | null;
}

export interface GiftCardMonthlyEntry {
	month: number;
	month_name: string;
	corporate: number;
	personal: number;
	total: number;
	total_trees: number;
	corporate_trees: number;
	personal_trees: number;
}

export interface GiftCardYearlyEntry {
	year: number;
	corporate: number;
	personal: number;
	total: number;
	corporate_trees: number;
	personal_trees: number;
	total_trees: number;
}

export interface GiftCardOccasionMonthlyEntry {
	month: number;
	month_name: string;
	count: number;
}

export interface GiftCardOccasionsResponse {
	occasions: Record<string, number>;
	monthly_by_occasion: Record<string, GiftCardOccasionMonthlyEntry[]>;
}

export interface GiftCardTreeDistribution {
	buckets: string[];
	corporate: number[];
	personal: number[];
	corporate_trees: number[];
	personal_trees: number[];
}

export interface GiftCardSourceSummary {
	website_requests: number;
	manual_requests: number;
	website_trees: number;
	manual_trees: number;
	website_pct: number;
	manual_pct: number;
}

export interface GiftCardSourceMonthlyEntry {
	month: number;
	month_name: string;
	year: number;
	website: number;
	manual: number;
	website_trees: number;
	manual_trees: number;
}

export interface GiftCardSourcesResponse {
	summary: GiftCardSourceSummary;
	monthly: GiftCardSourceMonthlyEntry[];
}

export interface GiftCardLeaderboardEntry {
	user_id: number;
	requester_name: string;
	group_id: number;
	group_name: string | null;
	request_type: 'Corporate' | 'Personal';
	total_requests: number;
	total_cards: number;
	fulfilled_cards: number;
	pending_cards: number;
	total_trees: number;
	total_amount_received: number;
	occasion_types: string[] | null;
	first_request_at: string;
	last_request_at: string;
}

export interface GiftCardRecentHistoryEntry {
	id: number;
	request_id: string;
	occasion: string | null;
	no_of_cards: number;
	status: string;
	gifted_on: string | null;
	created_at: string;
}

export interface GiftCardRequesterProfile {
	stats: GiftCardLeaderboardEntry;
	recent_history: GiftCardRecentHistoryEntry[];
}

export type AISummaryInsightType = 'TREND' | 'HIGHLIGHT' | 'ACTION';

export interface AISummaryInsight {
	type: AISummaryInsightType;
	text: string;
}

export interface AISummaryResponse {
	insights: AISummaryInsight[];
	fromCache: boolean;
	generatedAt: Date;
}

export interface DonationSummaryKPIs {
	total_donations: number;
	total_amount: number;
	total_trees: number;
	active_donors: number;
	avg_donation: number;
	tree_fulfillment_rate: number;
	monetary_only_count: number;
	monetary_only_amount: number;
	total_donations_delta: number | null;
	total_amount_delta: number | null;
	total_trees_delta: number | null;
	active_donors_delta: number | null;
}

export interface DonationMonthlyEntry {
	month: number;
	month_name: string;
	amount: number;
	trees: number;
	donation_count: number;
}

export interface DonationYearlyEntry {
	year: number;
	amount: number;
	trees: number;
	donation_count: number;
}

export interface DonorLeaderboardEntry {
	user_id: number | null;
	donor_name: string | null;
	group_id: number | null;
	group_name: string | null;
	group_type: string | null;
	donor_type: 'personal' | 'corporate';
	total_donations: number;
	total_amount: number;
	total_trees: number;
	avg_donation: number;
	first_donation_at: string;
	last_donation_at: string;
	years_active: number[];
	payment_methods: string[] | null;
}

export interface DonorLeaderboardResponse {
	personal: DonorLeaderboardEntry[];
	corporate: DonorLeaderboardEntry[];
}

export interface DonorRecentDonation {
	source_type: string;
	source_id: number;
	amount_received: number;
	trees_count: number | null;
	donation_date: string;
	donation_method: string | null;
	status: string;
	donor_name: string | null;
	group_name: string | null;
}

export interface DonorProfileStats {
	total_donations: number;
	total_amount: number;
	total_trees: number;
	avg_donation: number;
	first_donation_at: string;
	last_donation_at: string;
	years_active: number[];
	payment_methods: string[] | null;
}

export interface DonorProfile {
	stats: DonorProfileStats;
	recent_donations: DonorRecentDonation[];
}

export interface PaymentMethodEntry {
	method: string;
	count: number;
	total_amount: number;
	pct: number;
}

export interface DonationTypeSplit {
	both_count: number;
	trees_only_count: number;
	money_only_count: number;
	total: number;
	both_pct: number;
	trees_only_pct: number;
	money_only_pct: number;
}

export interface DonationFrequency {
	once: number;
	two_to_three: number;
	four_to_six: number;
	seven_plus: number;
}

export interface RepeatDonorStats {
	repeat_donors: number;
	total_donors: number;
	repeat_rate: number;
	avg_lifetime_donations: number;
	avg_lifetime_value: number;
}
