import ApiClient from '../../../api/apiClient/apiClient';
import {
	BatchVerifyResult,
	TreeAuditSessionDetail,
	TreeAuditSessionRow,
} from './types';

const getSessionStatus = (session: {
	total_photos: number;
	verified_photos: number;
	pending_photos: number;
	rejected_photos: number;
}): 'pending' | 'in_progress' | 'completed' => {
	if (
		session.verified_photos >= session.total_photos &&
		session.total_photos > 0
	) {
		return 'completed';
	}
	if (session.verified_photos > 0 || session.rejected_photos > 0) {
		return 'in_progress';
	}
	return 'pending';
};

export const fetchTreeAuditSessions = async (
	offset: number,
	limit: number,
	search?: string,
	status?: string,
): Promise<{ results: TreeAuditSessionRow[]; total: number }> => {
	const apiClient = new ApiClient();
	const response = await apiClient.getTreeAuditSessions(
		offset,
		limit,
		search,
		status,
	);

	const results = ((response?.data || []) as any[])
		.filter((session) => session.form_type === 'tree_audit')
		.map((session) => ({
			id: session.upload_session_id,
			upload_session_id: session.upload_session_id,
			form_type: 'tree_audit' as const,
			total_photos: Number(session.total_photos || 0),
			verified_photos: Number(session.verified_photos || 0),
			pending_photos: Number(session.pending_photos || 0),
			rejected_photos: Number(session.rejected_photos || 0),
			uploaded_by: Number(session.uploaded_by || 0),
			uploaded_at: session.uploaded_at,
			status: getSessionStatus({
				total_photos: Number(session.total_photos || 0),
				verified_photos: Number(session.verified_photos || 0),
				pending_photos: Number(session.pending_photos || 0),
				rejected_photos: Number(session.rejected_photos || 0),
			}),
			worker_name: session.worker_name ?? null,
			plot_name: session.plot_name ?? null,
			site_name: session.site_name ?? null,
		}));

	return {
		results,
		total: Number(response?.pagination?.total || results.length),
	};
};

export const fetchTreeAuditSessionDetail = async (
	sessionId: string,
): Promise<TreeAuditSessionDetail> => {
	const apiClient = new ApiClient();
	const response = await apiClient.getTreeAuditSessionDetail(sessionId);
	return response.data as TreeAuditSessionDetail;
};

export const batchVerifyTreeAuditPhotos = async (
	items: Array<{ id: number; sapling_id: string }>,
): Promise<BatchVerifyResult> => {
	const apiClient = new ApiClient();
	const response = await apiClient.batchVerifyTreeSnapshots(items);
	const failed = response?.data?.failed || [];
	const submittedIds = items.map((item) => item.id);
	const failedIds = new Set<number>(
		failed.map((item: { id: number }) => item.id),
	);
	return {
		updatedIds: submittedIds.filter((id) => !failedIds.has(id)),
		failed,
		total: Number(response?.data?.total || items.length),
	};
};

export const rejectTreeAuditPhoto = async (
	id: number,
	reason: string,
): Promise<void> => {
	const apiClient = new ApiClient();
	await apiClient.rejectTreeSnapshot(id, reason);
};
