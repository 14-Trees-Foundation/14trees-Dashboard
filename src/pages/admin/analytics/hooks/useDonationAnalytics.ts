import { useEffect, useState } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';
import {
	DonationSummaryKPIs,
	DonationMonthlyEntry,
	DonationYearlyEntry,
	DonorLeaderboardResponse,
	DonorProfile,
	PaymentMethodEntry,
	DonationTypeSplit,
	DonationFrequency,
	RepeatDonorStats,
} from '../../../../types/analytics';

type DonationTypeFilter = 'all' | 'personal' | 'corporate';
type DonationSourceFilter = 'all' | 'website' | 'manual';

export function useDonationSummary(
	year?: number,
	type?: DonationTypeFilter,
	source?: DonationSourceFilter,
) {
	const [data, setData] = useState<DonationSummaryKPIs | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonationSummaryKPIs(year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type, source]);
	return { data, loading, error, refetch: fetch };
}

export function useDonationMonthly(
	year?: number,
	type?: DonationTypeFilter,
	source?: DonationSourceFilter,
) {
	const [data, setData] = useState<DonationMonthlyEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonationMonthly(year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type, source]);
	return { data, loading, error, refetch: fetch };
}

export function useDonationYearly(
	type?: DonationTypeFilter,
	source?: DonationSourceFilter,
) {
	const [data, setData] = useState<DonationYearlyEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonationYearly(type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [type, source]);
	return { data, loading, error, refetch: fetch };
}

export function useDonorLeaderboard(
	sortBy: string = 'amount',
	limit: number = 10,
	year?: number,
	type?: DonationTypeFilter,
	source?: DonationSourceFilter,
) {
	const [data, setData] = useState<DonorLeaderboardResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonorLeaderboard(sortBy, limit, year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [sortBy, limit, year, type, source]);
	return { data, loading, error, refetch: fetch };
}

export function useDonorProfile(
	id: number | null,
	profileType: 'user' | 'group' = 'user',
) {
	const [data, setData] = useState<DonorProfile | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
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
			.getDonorProfile(id, profileType)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [id, profileType]);
	return { data, loading, error, refetch: fetch };
}

export function usePaymentMethods(year?: number, type?: DonationTypeFilter) {
	const [data, setData] = useState<PaymentMethodEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getPaymentMethods(year, type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type]);
	return { data, loading, error, refetch: fetch };
}

export function useDonationTypeSplit(
	year?: number,
	type?: DonationTypeFilter,
	source?: DonationSourceFilter,
) {
	const [data, setData] = useState<DonationTypeSplit | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonationTypeSplit(year, type, source)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type, source]);
	return { data, loading, error, refetch: fetch };
}

export function useDonationFrequency(year?: number, type?: DonationTypeFilter) {
	const [data, setData] = useState<DonationFrequency | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getDonationFrequency(year, type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type]);
	return { data, loading, error, refetch: fetch };
}

export function useRepeatDonorStats(year?: number, type?: DonationTypeFilter) {
	const [data, setData] = useState<RepeatDonorStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getRepeatDonorStats(year, type)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, type]);
	return { data, loading, error, refetch: fetch };
}
