import { useState, useEffect } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';
import type {
	SurveyResponse,
	SurveyResponsesData,
	ResponseFilters,
	ResponseStats,
} from '../../../../types/surveys';

export const useSurveyResponses = (
	page: number,
	rowsPerPage: number,
	filters: ResponseFilters,
) => {
	const [data, setData] = useState<SurveyResponsesData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchResponses = async () => {
		setLoading(true);
		setError(null);
		try {
			const apiClient = new ApiClient();
			const offset = page * rowsPerPage;
			const response = await apiClient.getSurveyResponses(offset, rowsPerPage, {
				surveyId: filters.surveyId || undefined,
				submittedBy: filters.submittedBy || undefined,
				search: filters.search || undefined,
				startDate: filters.startDate || undefined,
				endDate: filters.endDate || undefined,
			});
			setData(response);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch responses');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchResponses();
	}, [
		page,
		rowsPerPage,
		filters.surveyId,
		filters.submittedBy,
		filters.search,
		filters.startDate,
		filters.endDate,
	]);

	return { data, loading, error, refetch: fetchResponses };
};

export const useSurveyResponse = (responseId: string | null) => {
	const [response, setResponse] = useState<SurveyResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!responseId) {
			setResponse(null);
			return;
		}

		const fetchResponse = async () => {
			setLoading(true);
			setError(null);
			try {
				const apiClient = new ApiClient();
				const data = await apiClient.getSurveyResponseById(responseId);
				setResponse(data);
			} catch (err: any) {
				setError(err.message || 'Failed to fetch response');
			} finally {
				setLoading(false);
			}
		};

		fetchResponse();
	}, [responseId]);

	return { response, loading, error };
};

export const useResponseStats = (surveyId?: string) => {
	const [stats, setStats] = useState<ResponseStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			setLoading(true);
			setError(null);
			try {
				const apiClient = new ApiClient();
				const data = await apiClient.getResponseStats(surveyId);
				setStats(data);
			} catch (err: any) {
				setError(err.message || 'Failed to fetch stats');
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [surveyId]);

	return { stats, loading, error };
};
