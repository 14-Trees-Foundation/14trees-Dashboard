import { useEffect, useState } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';
import {
	GiftCardLeaderboardEntry,
	GiftCardMonthlyEntry,
	GiftCardOccasionsResponse,
	GiftCardRequesterProfile,
	GiftCardSourcesResponse,
	GiftCardSummaryKPIs,
	GiftCardTreeDistribution,
} from '../../../../types/analytics';

export function useGiftCardSummary() {
	const [data, setData] = useState<GiftCardSummaryKPIs | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardSummaryKPIs()
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, []);

	return { data, loading, error };
}

export function useGiftCardMonthly(year?: number) {
	const [data, setData] = useState<GiftCardMonthlyEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardMonthly(year)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [year]);

	return { data, loading, error };
}

export function useGiftCardOccasions(
	type: 'all' | 'corporate' | 'personal' = 'all',
) {
	const [data, setData] = useState<GiftCardOccasionsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardOccasions(type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [type]);

	return { data, loading, error };
}

export function useGiftCardTreeDistribution() {
	const [data, setData] = useState<GiftCardTreeDistribution | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardTreeDistribution()
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, []);

	return { data, loading, error };
}

export function useGiftCardSources() {
	const [data, setData] = useState<GiftCardSourcesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardSources()
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, []);

	return { data, loading, error };
}

export function useGiftCardLeaderboard(
	sortBy: 'trees' | 'cards' = 'trees',
	limit: number = 10,
) {
	const [data, setData] = useState<GiftCardLeaderboardEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardLeaderboard(sortBy, limit)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [sortBy, limit]);

	return { data, loading, error };
}

export function useRequesterProfile(userId: number | null) {
	const [data, setData] = useState<GiftCardRequesterProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (userId === null) {
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardRequesterProfile(userId)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [userId]);

	return { data, loading, error };
}
