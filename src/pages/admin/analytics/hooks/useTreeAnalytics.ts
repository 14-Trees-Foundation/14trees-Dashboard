import { useEffect, useState } from 'react';
import ApiClient from '../../../../api/apiClient/apiClient';
import {
	TreeSummaryKPIs,
	TreeByLocationEntry,
	TreeSpeciesEntry,
	TreeAvailabilityEntry,
	TreeInventoryEntry,
	TreePlotPlantTypeEntry,
	TreeAgeEntry,
	TreeAgeLocationEntry,
} from '../../../../types/analytics';

export function useTreeSummary(
	year?: number,
	district?: string,
	taluka?: string,
	village?: string,
) {
	const [data, setData] = useState<TreeSummaryKPIs | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreeSummary(year, district, taluka, village)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, district, taluka, village]);
	return { data, loading, error, refetch: fetch };
}

export function useTreesByLocation(
	level?: 'district' | 'taluka' | 'village' | 'site' | 'plot',
	year?: number,
	district?: string,
	taluka?: string,
	village?: string,
	site_id?: number,
	sortBy?: string,
	sortOrder?: 'asc' | 'desc',
) {
	const [data, setData] = useState<TreeByLocationEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreesByLocation(
				level,
				year,
				district,
				taluka,
				village,
				site_id,
				sortBy,
				sortOrder,
			)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [
		level,
		year,
		district,
		taluka,
		village,
		site_id,
		sortBy,
		sortOrder,
	]);
	return { data, loading, error, refetch: fetch };
}

export function useTreeSpecies(
	year?: number,
	district?: string,
	taluka?: string,
	village?: string,
) {
	const [data, setData] = useState<TreeSpeciesEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreeSpecies(year, district, taluka, village)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [year, district, taluka, village]);
	return { data, loading, error, refetch: fetch };
}

export function useTreeAvailability(
	district?: string,
	taluka?: string,
	village?: string,
	site_id?: number,
	plot_id?: number,
	site_category?: 'Foundation' | 'Public' | 'Others',
	page: number = 1,
	limit: number = 10,
) {
	const [data, setData] = useState<TreeAvailabilityEntry[] | null>(null);
	const [pagination, setPagination] = useState<{
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreeAvailability(
				district,
				taluka,
				village,
				site_id,
				plot_id,
				site_category,
				page,
				limit,
			)
			.then((res) => {
				setData(res.data);
				setPagination(res.pagination);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [
		district,
		taluka,
		village,
		site_id,
		plot_id,
		site_category,
		page,
		limit,
	]);
	return { data, pagination, loading, error, refetch: fetch };
}

export function useTreeInventory(
	site_category?: 'Foundation' | 'Public' | 'Others',
) {
	const [data, setData] = useState<TreeInventoryEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreeInventory(site_category)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [site_category]);
	return { data, loading, error, refetch: fetch };
}

export function useTreeAgeDistribution(
	district?: string,
	taluka?: string,
	village?: string,
) {
	const [data, setData] = useState<TreeAgeEntry[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreeAgeDistribution(district, taluka, village)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [district, taluka, village]);
	return { data, loading, error, refetch: fetch };
}

export function useTreesByAgeAndLocation(
	ageBucket: string,
	district?: string,
	taluka?: string,
	village?: string,
	site_id?: number,
	page: number = 1,
	limit: number = 10,
) {
	const [data, setData] = useState<TreeAgeLocationEntry[] | null>(null);
	const [pagination, setPagination] = useState<{
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreesByAgeAndLocation(
				ageBucket,
				district,
				taluka,
				village,
				site_id,
				page,
				limit,
			)
			.then((res) => {
				setData(res.data);
				setPagination(res.pagination);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [
		ageBucket,
		district,
		taluka,
		village,
		site_id,
		page,
		limit,
	]);
	return { data, pagination, loading, error, refetch: fetch };
}

export function useTreePlantTypesByPlot(
	district?: string,
	taluka?: string,
	village?: string,
	site_id?: number,
	plot_id?: number,
	site_category?: 'Foundation' | 'Public' | 'Others',
	page: number = 1,
	limit: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'asc' | 'desc',
) {
	const [data, setData] = useState<TreePlotPlantTypeEntry[] | null>(null);
	const [pagination, setPagination] = useState<{
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = () => {
		const apiClient = new ApiClient();
		setLoading(true);
		setError(null);
		apiClient
			.getTreePlantTypesByPlot(
				district,
				taluka,
				village,
				site_id,
				plot_id,
				site_category,
				page,
				limit,
				search,
				sortBy,
				sortOrder,
			)
			.then((res) => {
				setData(res.data);
				setPagination(res.pagination);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || 'Failed to load');
				setLoading(false);
			});
	};

	useEffect(fetch, [
		district,
		taluka,
		village,
		site_id,
		plot_id,
		site_category,
		page,
		limit,
		search,
		sortBy,
		sortOrder,
	]);
	return { data, pagination, loading, error, refetch: fetch };
}
