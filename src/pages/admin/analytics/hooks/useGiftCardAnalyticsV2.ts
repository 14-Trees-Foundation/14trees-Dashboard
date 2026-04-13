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
	GiftCardYearlyEntry,
} from '../../../../types/analytics';

type GiftCardRequestTypeFilter = 'all' | 'corporate' | 'personal';
type GiftCardSourceFilter = 'all' | 'website' | 'manual';

export function useGiftCardSummary(
	year?: number,
	source?: GiftCardSourceFilter,
) {
	const [data, setData] = useState<GiftCardSummaryKPIs | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardSummaryKPIs(year, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [year, source]);

	return { data, loading, error };
}

export function useGiftCardMonthly(
	year?: number,
	source?: GiftCardSourceFilter,
) {
	const [data, setData] = useState<GiftCardMonthlyEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardMonthly(year, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [year, source]);

	return { data, loading, error };
}

export function useGiftCardYearly(
	type?: 'all' | 'corporate' | 'personal',
	source?: 'all' | 'website' | 'manual',
) {
	const [data, setData] = useState<GiftCardYearlyEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardYearly(type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [type, source]);

	return { data, loading, error };
}

export function useGiftCardOccasions(
	type: 'all' | 'corporate' | 'personal' = 'all',
	source?: GiftCardSourceFilter,
	year?: number,
) {
	const [data, setData] = useState<GiftCardOccasionsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardOccasions(type, source, year || undefined)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [type, source, year]);

	return { data, loading, error };
}

export function useGiftCardTreeDistribution(
	year?: number,
	type?: GiftCardRequestTypeFilter,
	source?: GiftCardSourceFilter,
) {
	const [data, setData] = useState<GiftCardTreeDistribution | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardTreeDistribution(year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [year, type, source]);

	return { data, loading, error };
}

export function useGiftCardSources(
	year?: number,
	type?: GiftCardRequestTypeFilter,
) {
	const [data, setData] = useState<GiftCardSourcesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardSources(year, type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [year, type]);

	return { data, loading, error };
}

export function useGiftCardLeaderboard(
	sortBy: 'trees' | 'cards' = 'trees',
	limit: number = 10,
	year?: number,
	type?: GiftCardRequestTypeFilter,
	source?: GiftCardSourceFilter,
) {
	const [data, setData] = useState<GiftCardLeaderboardEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardLeaderboard(sortBy, limit, year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [sortBy, limit, year, type, source]);

	return { data, loading, error };
}

export function useRequesterProfile(
	id: number | null,
	type: 'user' | 'group' = 'user',
) {
	const [data, setData] = useState<GiftCardRequesterProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id === null) {
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		const apiClient = new ApiClient();

		setLoading(true);
		setError(null);
		apiClient
			.getGiftCardRequesterProfile(id, type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	}, [id, type]);

	return { data, loading, error };
}
