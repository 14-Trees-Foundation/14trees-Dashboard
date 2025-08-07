import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GridFilterItem } from '@mui/x-data-grid';
import { Tree, UseTreeDataProps } from '../types';
import { treeApiService } from '../utils/treeApi';

export const useTreeData = ({
  plotIds: plotIdsProp = [],
  treeScope,
  includeNonGiftable = false,
  includeAllHabitats = false,
  filters: filtersProp,
  pageSize,
}: UseTreeDataProps) => {
  const isMountedRef = useRef(true);
  const [treesData, setTreesData] = useState<Record<number, Tree>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableRows, setTableRows] = useState<Tree[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create stable references for object/array dependencies to prevent infinite loops
  const filters = useMemo(() => filtersProp, [JSON.stringify(filtersProp)]);
  const plotIds = useMemo(() => plotIdsProp, [JSON.stringify(plotIdsProp)]);

  // Cleanup function
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTrees = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    
    try {
      const filtersData: any[] = [];
      
      // Add plot filter if plotIds are provided
      if (plotIds.length > 0) {
        filtersData.push({
          columnField: 'plot_id',
          operatorValue: 'isAnyOf',
          value: plotIds
        });
      }

      // Add other filters
      filtersData.push(...Object.values(filters));

      const treesResp = await treeApiService.fetchTrees(
        page * pageSize,
        pageSize,
        filtersData,
        {
          scope: treeScope,
          includeNonGiftable,
          includeAllHabitats,
        }
      );

      if (!isMountedRef.current) return;

      setTotal(Number(treesResp.total));
      setTreesData(prev => {
        const newTrees = { ...prev };
        for (let i = 0; i < treesResp.results.length; i++) {
          newTrees[treesResp.offset + i] = treesResp.results[i];
        }
        return newTrees;
      });
    } catch (error) {
      console.error('Error fetching trees:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [plotIds, treeScope, includeNonGiftable, includeAllHabitats, filters, page, pageSize]);

  // Reset data when filters or plot selection changes
  useEffect(() => {
    setTreesData({});
    setPage(0);
  }, [filters, plotIds, includeNonGiftable]);

  // Handle table rows updates
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      const records: Tree[] = [];
      const maxLength = Math.min((page + 1) * pageSize, total);
      
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(treesData, i)) {
          const record = treesData[i];
          if (record) {
            records.push(record);
          }
        } else {
          // If we don't have data for this index, we'll need to fetch
          // But don't fetch here to avoid infinite loops
          break;
        }
      }
      
      setTableRows(records);
    }, 300);

    return () => clearTimeout(handler);
  }, [pageSize, page, treesData, total]);

  // Fetch trees when dependencies change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!isMountedRef.current) return;
      fetchTrees();
    }, 300);

    return () => clearTimeout(handler);
  }, [plotIds, treeScope, includeNonGiftable, includeAllHabitats, filters, page, pageSize, refreshTrigger, fetchTrees]);

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage - 1);
    if (newPageSize !== pageSize) {
      // If page size changes, reset data
      setTreesData({});
      setPage(0);
    }
  }, [pageSize]);

  const refreshData = useCallback(() => {
    setTreesData({});
    setPage(0);
    // Trigger a refresh by incrementing the refresh trigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    trees: tableRows,
    total,
    page: page + 1, // Convert to 1-based for UI
    loading,
    treesData: Object.values(treesData),
    handlePaginationChange,
    refreshData,
  };
};