export interface TreeAuditSessionRow {
	id: string;
	upload_session_id: string;
	form_type: 'tree_audit';
	total_photos: number;
	verified_photos: number;
	pending_photos: number;
	rejected_photos: number;
	uploaded_by: number;
	uploaded_at: string;
	status: 'pending' | 'in_progress' | 'completed';
	worker_name?: string | null;
	plot_name?: string | null;
	site_name?: string | null;
}

export interface TreeAuditPhoto {
	id: number;
	upload_session_id: string;
	form_type: 'tree_audit' | 'tree_add';
	image: string | null;
	lat: number | null;
	lng: number | null;
	created_at: string;
	verification_status?: string | null;
	entry_status?: string | null;
	verified_by?: number | null;
	verified_at?: string | null;
	rejection_reason?: string | null;
	sapling_id?: string | null;
	tree_id?: number | string | null;
}

export interface TreeAuditSessionDetail {
	session_id: string;
	form_type: 'tree_audit' | 'tree_add';
	worker: {
		id: number;
		name: string;
		email?: string;
	};
	plot: {
		id: number;
		name: string;
		site: {
			id: number;
			name: string;
		} | null;
	} | null;
	photos: TreeAuditPhoto[];
}

export interface BatchVerifyFailure {
	id: number;
	reason: string;
}

export interface BatchVerifyResult {
	updatedIds: number[];
	failed: BatchVerifyFailure[];
	total: number;
}
