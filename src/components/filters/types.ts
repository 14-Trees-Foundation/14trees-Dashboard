import { GridFilterItem } from '@mui/x-data-grid';
import type { TableColumnType } from 'antd';
import { FilterConfirmProps } from 'antd/es/table/interface';

export interface BaseFilterProps<T> {
    dataIndex: keyof T;
    filters: Record<string, GridFilterItem>;
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void;
}

export interface FilterDropdownProps<T> extends BaseFilterProps<T> {
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    close: () => void;
}

export type FilterOperator = 
    | 'contains' 
    | 'equals' 
    | 'startsWith' 
    | 'endsWith' 
    | 'isEmpty' 
    | 'isNotEmpty' 
    | 'isAnyOf'
    | 'between'
    | 'greaterThan'
    | 'lessThan';

export interface FilterConfig {
    operators: FilterOperator[];
    defaultOperator: FilterOperator;
    multiSearch?: boolean;
}