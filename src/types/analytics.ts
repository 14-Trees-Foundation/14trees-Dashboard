export interface GiftCardSummaryKPIs {
	total_requests: number;
	corporate_count: number;
	personal_count: number;
	fulfilled_count: number;
	pending_count: number;
	total_trees: number;
	avg_trees_per_card: number;
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
