import { useEffect, useState, useRef } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Donation } from "../../../../types/donation";
import { Order } from "../../../../types/common";
import { useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import ApiClient from "../../../../api/apiClient/apiClient";

export const useDonationData = (
  page: number,
  pageSize: number,
  filters: Record<string, GridFilterItem>,
  orderBy: Order[],
  getDonations: any
) => {
  const [loading, setLoading] = useState(false);
  const [tableRows, setTableRows] = useState<Donation[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const isMountedRef = useRef(true);

  const donationsData = useAppSelector((state: RootState) => state.donationsData);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get tags
  useEffect(() => {
    const getTags = async () => {
      try {
        const apiClient = new ApiClient();
        const tagsResp = await apiClient.getDonationTags();
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setTags(tagsResp.results);
        }
      } catch (error: any) {
        // Only show error if component is still mounted
        if (isMountedRef.current) {
          toast.error(error.message);
        }
      }
    }

    getTags();
  }, []);

  const fetchDonations = () => {
    if (isMountedRef.current) {
      setLoading(true);
    }
    try {
      let filtersData = Object.values(filters);
      getDonations(page * pageSize, pageSize, filtersData, orderBy);
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (isMountedRef.current) {
        setTableRows([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const records: Donation[] = [];
      const maxLength = Math.min((page + 1) * pageSize, donationsData.totalDonations);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(donationsData.paginationMapping, i)) {
          const id = donationsData.paginationMapping[i];
          const record = donationsData.donations[id];
          if (record) {
            records.push(record);
          }
        } else {
          fetchDonations();
          return;
        }
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setTableRows(records);
        setLoading(false);
      }
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [pageSize, page, donationsData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDonations();
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [filters, orderBy]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    // Note: page is 1-based in the component, but 0-based in our state
    // This will be handled in the main component
  };

  const handleSortingChange = (sorter: any) => {
    // This will be handled in the main component
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    // This will be handled in the main component
  };

  return {
    loading,
    setLoading,
    tableRows,
    setTableRows,
    tags,
    donationsData,
    fetchDonations,
    handlePaginationChange,
    handleSortingChange,
    handleSetFilters
  };
};