import React, { useState } from 'react';
import { DatePicker } from 'antd';
import type { TableColumnType } from 'antd';
import { GridFilterItem } from '@mui/x-data-grid';
import { BaseFilterProps, FilterDropdownProps } from './types';
import { BaseFilterDropdown } from './components/BaseFilterDropdown';
import { FilterActionButtons } from './components/FilterActionButtons';
import { createFilterIcon } from './utils/filterUtils';

interface DateFilterProps<T> extends BaseFilterProps<T> {
    label: string;
}

const DateFilterDropdown = <T extends object>({
    dataIndex,
    filters,
    label,
    setSelectedKeys,
    handleSetFilters,
    confirm,
    clearFilters,
    close
}: FilterDropdownProps<T> & { label: string }) => {
    const [lower, setLower] = useState<string>('');
    const [upper, setUpper] = useState<string>('');
    const [ld, setLd] = useState<any>(null);
    const [ud, setUd] = useState<any>(null);

    const handleReset = () => {
        clearFilters && clearFilters();
        setLower('');
        setUpper('');
        setLd(null);
        setUd(null);
        confirm();
        const newFilters = { ...filters };
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    };

    const handleApply = () => {
        confirm();
        let filter: GridFilterItem | null = null;
        
        if (lower && upper) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'between', value: [lower, upper] };
        } else if (lower) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'greaterThan', value: lower };
        } else if (upper) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'lessThan', value: upper };
        }

        if (filter) {
            handleSetFilters({
                ...filters,
                [dataIndex.toString()]: filter,
            });
            setSelectedKeys(['1']);
        }
    };

    return (
        <BaseFilterDropdown>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ margin: 2 }}>{label} After:</div>
                    <DatePicker 
                        value={ld} 
                        onChange={(date, stringDate) => {
                            setLower(stringDate as string); 
                            setLd(date);
                        }} 
                        style={{ margin: 2, backgroundColor: 'white' }} 
                        styles={{ popup: { root: { zIndex: 100001 } } }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ margin: 2 }}>{label} Before:</div>
                    <DatePicker 
                        value={ud} 
                        onChange={(date, stringDate) => {
                            setUpper(stringDate as string); 
                            setUd(date);
                        }} 
                        style={{ margin: 2, backgroundColor: 'white' }} 
                        styles={{ popup: { root: { zIndex: 100001 } } }}
                    />
                </div>
            </div>
            <FilterActionButtons
                onReset={handleReset}
                onApply={handleApply}
                onClose={close}
            />
        </BaseFilterDropdown>
    );
};

export const getColumnDateFilter = <T extends object>({
    dataIndex,
    filters,
    handleSetFilters,
    label
}: DateFilterProps<T>): TableColumnType<T> => {
    return {
        filterDropdown: ({ confirm, clearFilters, setSelectedKeys, close }) => (
            <DateFilterDropdown<T>
                dataIndex={dataIndex}
                filters={filters}
                setSelectedKeys={setSelectedKeys}
                handleSetFilters={handleSetFilters}
                confirm={confirm}
                clearFilters={clearFilters}
                close={close}
                label={label}
            />
        ),
        filterIcon: createFilterIcon,
    };
};