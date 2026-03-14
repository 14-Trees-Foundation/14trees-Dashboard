import ApiClient from "../../../api/apiClient/apiClient";

export interface SearchOption {
  id: number;
  name: string;
  label: string;
  site_name?: string; // For plots
}

export interface SearchOptionsResponse {
  staff: SearchOption[];
  sites: SearchOption[];
  plots: SearchOption[];
}

export const fetchSearchOptions = async (): Promise<SearchOptionsResponse> => {
  const apiClient = new ApiClient();
  
  try {
    // Fetch all options in parallel
    const [staffResponse, sitesResponse, plotsResponse] = await Promise.all([
      apiClient.getUsers(0, 1000), // Get all users/staff using getUsers instead of searchUsers
      apiClient.getSites(0, 1000), // Get all sites
      apiClient.getPlots(0, 1000) // Get all plots
    ]);

    // Transform staff data
    const staff: SearchOption[] = staffResponse.results?.map((user: any) => ({
      id: user.id,
      name: user.name,
      label: `${user.name}${user.email ? ` (${user.email})` : ''}`
    })) || [];

    // Transform sites data
    const sites: SearchOption[] = sitesResponse.results?.map((site: any) => ({
      id: site.id,
      name: site.name_english || site.name,
      label: site.name_english || site.name
    })) || [];

    // Transform plots data
    const plots: SearchOption[] = plotsResponse.results?.map((plot: any) => ({
      id: plot.id,
      name: plot.name,
      label: `${plot.name}${plot.site_name ? ` (${plot.site_name})` : ''}`,
      site_name: plot.site_name
    })) || [];

    return { staff, sites, plots };
  } catch (error) {
    console.error("Failed to fetch search options:", error);
    throw error;
  }
};

// Cache for search options to avoid repeated API calls
let searchOptionsCache: SearchOptionsResponse | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedSearchOptions = async (): Promise<SearchOptionsResponse> => {
  const now = Date.now();
  
  if (searchOptionsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return searchOptionsCache;
  }
  
  try {
    searchOptionsCache = await fetchSearchOptions();
    cacheTimestamp = now;
    return searchOptionsCache;
  } catch (error) {
    // If we have cached data and the API fails, return cached data
    if (searchOptionsCache) {
      console.warn("API failed, returning cached search options");
      return searchOptionsCache;
    }
    throw error;
  }
};

// Clear cache when needed
export const clearSearchOptionsCache = (): void => {
  searchOptionsCache = null;
  cacheTimestamp = 0;
};