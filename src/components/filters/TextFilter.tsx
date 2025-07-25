import React, { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import type { TableColumnType } from 'antd';
import { BaseFilterProps, FilterDropdownProps, FilterOperator } from './types';
import { useFilterState } from './hooks/useFilterState';
import { BaseFilterDropdown } from './components/BaseFilterDropdown';
import { FilterOperatorSelect } from './components/FilterOperatorSelect';
import { FilterActionButtons } from './components/FilterActionButtons';
import { createFilterIcon } from './utils/filterUtils';

interface TextFilterProps<T> extends BaseFilterProps<T> {
    multiSearch?: boolean;
}

const TextFilterDropdown = <T extends object>({
    dataIndex,
    filters,
    selectedKeys,
    multiSearch,
    setSelectedKeys,
    handleSetFilters,
    confirm,
    clearFilters,
    close
}: FilterDropdownProps<T> & { multiSearch?: boolean }) => {
    const operators: FilterOperator[] = [
        'contains', 'equals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'
    ];
    
    if (multiSearch) {
        operators.push('isAnyOf');
    }

    const { filterOption, setFilterOption, handleReset, handleApply } = useFilterState(
        dataIndex,
        filters,
        handleSetFilters,
        'contains'
    );

    // Local state to preserve input values
    const [inputValue, setInputValue] = useState<string>('');
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

    // Initialize from existing filter only once when component mounts
    useEffect(() => {
        const existingFilter = filters[dataIndex.toString()];
        if (existingFilter) {
            setFilterOption(existingFilter.operatorValue as FilterOperator);
            if (existingFilter.operatorValue === 'isAnyOf') {
                const values = Array.isArray(existingFilter.value) ? existingFilter.value : [existingFilter.value];
                setMultiSelectValue(values);
                setSelectedKeys(values);
            } else {
                const value = Array.isArray(existingFilter.value) ? existingFilter.value[0] : existingFilter.value;
                setInputValue(value || '');
                setSelectedKeys(value ? [value] : []);
            }
        }
    }, []); // Empty dependency array - only run once on mount

    const handleApplyClick = () => {
        if (filterOption === 'isEmpty' || filterOption === 'isNotEmpty') {
            setSelectedKeys([' ']);
        }
        
        const value = filterOption !== "isAnyOf"
            ? inputValue?.trim()
            : multiSelectValue.map(item => item.trim());
            
        handleApply(confirm, value);
    };

    const handleResetClick = () => {
        if (clearFilters) {
            setInputValue('');
            setMultiSelectValue([]);
            handleReset(clearFilters, confirm);
        }
    };

    return (
        <BaseFilterDropdown>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilterOperatorSelect
                    value={filterOption}
                    onChange={setFilterOption}
                    operators={operators}
                />
                {filterOption !== "isAnyOf" && (
                    <Input
                        placeholder={`Search ${dataIndex.toString()}`}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                )}
                {filterOption === "isAnyOf" && (
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        value={multiSelectValue}
                        onChange={(value) => {
                            setMultiSelectValue(value);
                            setSelectedKeys(value);
                        }}
                        tokenSeparators={['\n', ',']}
                        styles={{ popup: { root: { zIndex: 10001 } } }}
                        style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
                    />
                )}
            </div>
            <FilterActionButtons
                onReset={handleResetClick}
                onApply={handleApplyClick}
                onClose={close}
            />
        </BaseFilterDropdown>
    );
};

export const getColumnSearchProps = <T extends object>(
    dataIndex: keyof T,
    filters: Record<string, any>,
    handleSetFilters: (filters: Record<string, any>) => void,
    multiSearch?: boolean
): TableColumnType<T> => {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <TextFilterDropdown
                dataIndex={dataIndex}
                filters={filters}
                multiSearch={multiSearch}
                handleSetFilters={handleSetFilters}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                confirm={confirm}
                close={close}
                clearFilters={clearFilters}
            />
        ),
        filterIcon: createFilterIcon,
    };
};