import React, { useState } from 'react';
import { Select, Segmented, Space } from 'antd';
import type { TableColumnType, SelectProps } from 'antd';
import { BaseFilterProps, FilterDropdownProps, FilterOperator } from './types';
import { useFilterState } from './hooks/useFilterState';
import { BaseFilterDropdown } from './components/BaseFilterDropdown';
import { FilterActionButtons } from './components/FilterActionButtons';
import { createFilterIcon } from './utils/filterUtils';

interface SelectFilterProps<T> extends BaseFilterProps<T> {
    options: string[];
}

const SelectFilterDropdown = <T extends object>({
    dataIndex,
    filters,
    options,
    selectedKeys,
    setSelectedKeys,
    handleSetFilters,
    confirm,
    clearFilters,
    close
}: FilterDropdownProps<T> & { options: string[] }) => {
    const [filterOption, setFilterOption] = useState<'contains' | 'isAnyOf'>('isAnyOf');

    const { handleReset, handleApply } = useFilterState(
        dataIndex,
        filters,
        handleSetFilters,
        'isAnyOf'
    );

    const selectOptions: SelectProps['options'] = options.map(item => ({
        value: item,
        label: item
    }));

    const handleApplyClick = () => {
        if (selectedKeys.length === 0) {
            if (clearFilters) {
                handleReset(clearFilters, confirm);
            }
        } else {
            handleApply(confirm, selectedKeys);
        }
    };

    const handleResetClick = () => {
        if (clearFilters) {
            handleReset(clearFilters, confirm);
            setFilterOption('isAnyOf');
        }
    };

    return (
        <BaseFilterDropdown>
            <Select
                mode="tags"
                placeholder="Please select"
                value={selectedKeys}
                onChange={(value) => setSelectedKeys(value)}
                options={selectOptions}
                styles={{ popup: { root: { zIndex: 10001 } } }}
                style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
            />
            <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Filter Type: </p>
                <Segmented<string>
                    options={['Any', 'All']}
                    onChange={(value) => {
                        setFilterOption(value === 'All' ? 'contains' : 'isAnyOf');
                    }}
                />
            </Space>
            <FilterActionButtons
                onReset={handleResetClick}
                onApply={handleApplyClick}
                onClose={close}
            />
        </BaseFilterDropdown>
    );
};

export const getColumnSelectedItemFilter = <T extends object>({
    dataIndex,
    filters,
    handleSetFilters,
    options
}: SelectFilterProps<T>): TableColumnType<T> => {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <SelectFilterDropdown
                dataIndex={dataIndex}
                options={options}
                filters={filters}
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