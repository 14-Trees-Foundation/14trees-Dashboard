export type CsrRequestStatus =
	| 'pending_plot_selection'
	| 'pending_assignment'
	| 'partially_assigned'
	| 'completed'
	| 'cancelled';

export type CsrPaymentStatus =
	| 'Linked (Both)'
	| 'Linked (Payment)'
	| 'Linked (Donation)'
	| 'Not Linked';

export interface CsrRequest {
	id: number;
	group_id: number;
	group_name?: string;
	group_logo_url?: string;
	sponsor_user_id?: number | null;
	sponsor_user_name?: string | null;
	financial_year: string;
	no_of_trees: number;
	trees_assigned: number;
	donation_date: string | null;
	amount_received: number | null;
	amount_per_tree: number | null;
	donation_id: number | null;
	payment_id: number | null;
	contact_person: string | null;
	contact_email: string | null;
	status: CsrRequestStatus;
	notes: string | null;
	created_by: number | null;
	deleted_at: string | null;
	created_at: string;
	updated_at: string;
	// virtual/computed
	payment_status?: CsrPaymentStatus;
	payment_order_id?: string | null;
	// joined when fetching detail
	donation_amount_donated?: number | null;
	donation_donation_date?: string | null;
	donation_status?: string | null;
	payment_amount?: number | null;
	payment_created_at?: string | null;
	plot_count?: number;
	linked_total_trees?: number;
	linked_available_trees?: number;
	// sub-allocations
	visits?: CsrVisit[];
	plantation_trees?: number;
	gift_card_trees?: number;
	visit_trees?: number;
}

export interface CsrVisit {
	id: number;
	visit_name: string;
	visit_date: string;
	site_id: number;
	trees_allocated: number;
	status: string;
}

export interface CsrCorporate {
	group_id: number;
	group_name: string;
	logo_url: string | null;
	total_requests: number;
	total_committed: number;
	total_planted: number;
	last_donation_date: string | null;
	current_fy_planted: number;
}

export interface CsrBookResult {
	booked: number;
	requested: number;
	shortfall: number;
	status: CsrRequestStatus;
	csr_request: CsrRequest;
}

export interface CsrDataState {
	loading: boolean;
	totalRequests: number;
	requests: Record<number, CsrRequest>;
	paginationMapping: Record<number, number>;
}
