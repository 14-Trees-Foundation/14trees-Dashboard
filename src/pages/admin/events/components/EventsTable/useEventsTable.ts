import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../../redux/store/hooks";
import { RootState } from "../../../../../redux/store/store";
import { GridFilterItem } from "@mui/x-data-grid";
import { Event } from "../../../../../types/event";
import { useEventsApi } from "../../hooks/api/useEventsApi";

export const useEventsTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [tableRows, setTableRows] = useState<Event[]>([]);

  const eventsData = useAppSelector((state: RootState) => state.eventsData);
  const apiHook = useEventsApi();
  
  let eventsList: Event[] = [];
  if (eventsData) {
    eventsList = Object.values(eventsData.Events);
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    apiHook.getEventsData(page, pageSize, filters);
  }, [filters]);

  // Effect to update table rows when data changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (eventsData.loading) return;

      const records: Event[] = [];
      const maxLength = Math.min((page + 1) * pageSize, eventsData.totalEvents);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(eventsData.paginationMapping, i)) {
          const id = eventsData.paginationMapping[i];
          const record = eventsData.Events[id];
          if (record) {
            records.push(record);
          }
        } else {
          apiHook.getEventsData(page, pageSize, filters);
          break;
        }
      }

      setTableRows(records);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [pageSize, page, eventsData]);

  return {
    // State
    page,
    pageSize,
    filters,
    tableRows,
    eventsData,
    eventsList,
    
    // Actions
    handlePaginationChange,
    handleSetFilters,
  };
};