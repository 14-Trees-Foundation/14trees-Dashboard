import { useState, useEffect, useCallback, useMemo } from 'react';
import { GridFilterItem } from '@mui/x-data-grid';
import { treeApiService } from '../utils/treeApi';

export const useTreeFilters = () => {
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [plots, setPlots] = useState<any[]>([]);
  const [plantTypes, setPlantTypes] = useState<any[]>([]);

  // Load initial data for filters
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [tagsResp, plotsResp, plantTypesResp] = await Promise.all([
          treeApiService.getPlantTypeTags(),
          treeApiService.getPlots(),
          treeApiService.getPlantTypes(),
        ]);

        setTags(tagsResp.results || []);
        setPlots(plotsResp.results || []);
        setPlantTypes(plantTypesResp.results || []);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    loadFilterData();
  }, []);

  // Handle plant type filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => {
        const newFilters = { ...prev };
        
        if (selectedPlantTypes.length === 0) {
          delete newFilters["plant_type"];
        } else {
          newFilters["plant_type"] = {
            columnField: "plant_type",
            operatorValue: 'isAnyOf',
            value: selectedPlantTypes,
          };
        }
        
        return newFilters;
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [selectedPlantTypes]);

  const handleSetFilters = useCallback((newFilters: Record<string, GridFilterItem>) => {
    setFilters(newFilters);
  }, []);

  const handlePlantTypeSelect = useCallback((plantType: string) => {
    setSelectedPlantTypes(prev => {
      const idx = prev.findIndex(item => item === plantType);
      if (idx === -1) {
        return [...prev, plantType];
      } else {
        return prev.filter(item => item !== plantType);
      }
    });
  }, []);

  const handlePlantTypeReset = useCallback(() => {
    setSelectedPlantTypes([]);
  }, []);

  const addFilter = useCallback((field: string, operator: string, value: any) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      // Remove filter if value is empty
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[field];
        return newFilters;
      });
      return;
    }

    const newFilter: GridFilterItem = {
      columnField: field,
      operatorValue: operator,
      value: value,
    };

    setFilters(prev => ({
      ...prev,
      [field]: newFilter,
    }));
  }, []);

  const removeFilter = useCallback((field: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSelectedPlantTypes([]);
  }, []);

  const getActiveFilterCount = useCallback(() => {
    return Object.keys(filters).length;
  }, [filters]);

  // Memoize filters to ensure stable reference when content doesn't change
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  return {
    filters: memoizedFilters,
    selectedPlantTypes,
    tags,
    plots,
    plantTypes,
    handleSetFilters,
    handlePlantTypeSelect,
    handlePlantTypeReset,
    addFilter,
    removeFilter,
    clearAllFilters,
    getActiveFilterCount,
  };
};