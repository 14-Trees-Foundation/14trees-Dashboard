import { useState, useEffect } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';

const apiClient = new ApiClient();
import type {
	SurveyConfig,
	SurveyConfigsResponse,
	SurveyFilters,
} from '../../../../types/surveys';

export const useSurveyForms = (
	page: number,
	rowsPerPage: number,
	filters: SurveyFilters,
) => {
	const [data, setData] = useState<SurveyConfigsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchForms = async () => {
		setLoading(true);
		setError(null);
		try {
			const offset = page * rowsPerPage;
			const response = await apiClient.getSurveyConfigs(offset, rowsPerPage, {
				status: filters.status !== 'all' ? filters.status : undefined,
				search: filters.search || undefined,
				startDate: filters.startDate || undefined,
				endDate: filters.endDate || undefined,
			});
			setData(response);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch survey forms');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchForms();
	}, [
		page,
		rowsPerPage,
		filters.status,
		filters.search,
		filters.startDate,
		filters.endDate,
	]);

	return { data, loading, error, refetch: fetchForms };
};

export const useSurveyForm = (surveyId: string | null) => {
	const [form, setForm] = useState<SurveyConfig | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!surveyId) {
			setForm(null);
			return;
		}

		const fetchForm = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await apiClient.getSurveyConfig(surveyId);
				setForm(response);
			} catch (err: any) {
				setError(err.message || 'Failed to fetch survey form');
			} finally {
				setLoading(false);
			}
		};

		fetchForm();
	}, [surveyId]);

	return { form, loading, error };
};
