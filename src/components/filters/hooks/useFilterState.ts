import { useState, useCallback } from 'react';
import { GridFilterItem } from '@mui/x-data-grid';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { FilterOperator } from '../types';

export const useFilterState = <T>(
    dataIndex: keyof T,
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    defaultOperator: FilterOperator = 'contains'
) => {
    const [filterOption, setFilterOption] = useState<FilterOperator>(defaultOperator);

    const handleReset = useCallback((
        clearFilters: () => void,
        confirm: (param?: FilterConfirmProps) => void
    ) => {
        clearFilters();
        confirm();
        const newFilters = { ...filters };
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    }, [dataIndex, filters, handleSetFilters]);

    const handleApply = useCallback((
        confirm: (param?: FilterConfirmProps) => void,
        value: any
    ) => {
        confirm();
        const newFilters = { ...filters };
        newFilters[dataIndex.toString()] = {
            columnField: dataIndex.toString(),
            operatorValue: filterOption,
            value: value,
        };
        handleSetFilters(newFilters);
    }, [dataIndex, filters, handleSetFilters, filterOption]);

    return {
        filterOption,
        setFilterOption,
        handleReset,
        handleApply,
    };
};