import React, { useState } from 'react';
import { Input, Select } from 'antd';
import type { TableColumnType } from 'antd';
import { GridFilterItem } from '@mui/x-data-grid';
import { BaseFilterProps, FilterDropdownProps } from './types';
import { BaseFilterDropdown } from './components/BaseFilterDropdown';
import { FilterActionButtons } from './components/FilterActionButtons';
import { createFilterIcon } from './utils/filterUtils';

interface NumericFilterProps<T> extends BaseFilterProps<T> {
    label: string;
}

const NumericFilterDropdown = <T extends object>({
    dataIndex,
    filters,
    label,
    setSelectedKeys,
    handleSetFilters,
    confirm,
    clearFilters,
    close
}: FilterDropdownProps<T> & { label: string }) => {
    const [filterType, setFilterType] = useState<'equals' | 'range' | 'isAnyOf'>('equals');
    const [lower, setLower] = useState<string>('');
    const [upper, setUpper] = useState<string>('');
    const [equalTo, setEqualTo] = useState<string>('');
    const [anyOfValues, setAnyOfValues] = useState<string[]>([]);

    const handleReset = () => {
        clearFilters && clearFilters();
        setLower('');
        setUpper('');
        setEqualTo('');
        setAnyOfValues([]);
        confirm();
        const newFilters = { ...filters };
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    };

    const handleApply = () => {
        confirm();
        let filter: GridFilterItem | null = null;

        if (filterType === 'equals' && equalTo) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'equals', value: equalTo };
        } else if (filterType === 'range' && lower && upper) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'between', value: [lower, upper] };
        } else if (filterType === 'isAnyOf' && anyOfValues.length > 0) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'isAnyOf', value: anyOfValues };
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
            {/* Filter Type Selector */}
            <div style={{ marginBottom: 8 }}>
                <Select
                    value={filterType}
                    onChange={(value) => {
                        setFilterType(value);
                        setLower('');
                        setUpper('');
                        setEqualTo('');
                        setAnyOfValues([]);
                    }}
                    options={[
                        { label: 'Equals', value: 'equals' },
                        { label: 'Range', value: 'range' },
                        { label: 'Is Any Of', value: 'isAnyOf' },
                    ]}
                    style={{ width: '100%' }}
                    styles={{ popup: { root: { zIndex: 10001 } } }}
                />
            </div>

            {/* Input Fields Based on Filter Type */}
            {filterType === 'equals' && (
                <Input
                    type="number"
                    value={equalTo}
                    onChange={(e) => setEqualTo(e.target.value)}
                    placeholder={`Enter ${label}`}
                    style={{ marginBottom: 8, width: 250 }}
                />
            )}

            {filterType === 'range' && (
                <>
                    <div>
                        <Input
                            type="number"
                            value={lower}
                            onChange={(e) => setLower(e.target.value)}
                            placeholder={`Enter Min ${label}`}
                            style={{ marginBottom: 8, width: 250 }}
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            value={upper}
                            onChange={(e) => setUpper(e.target.value)}
                            placeholder={`Enter Max ${label}`}
                            style={{ marginBottom: 8, width: 250 }}
                        />
                    </div>
                </>
            )}

            {filterType === 'isAnyOf' && (
                <Select
                    mode="tags"
                    placeholder="Please select"
                    value={anyOfValues}
                    onChange={(value) => setAnyOfValues(value)}
                    tokenSeparators={['\n', ',']}
                    styles={{ popup: { root: { display: 'none', zIndex: 10001 } } }}
                    style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
                />
            )}

            <FilterActionButtons
                onReset={handleReset}
                onApply={handleApply}
                onClose={close}
            />
        </BaseFilterDropdown>
    );
};

export const getColumnNumericFilter = <T extends object>({
    dataIndex,
    filters,
    handleSetFilters,
    label
}: NumericFilterProps<T>): TableColumnType<T> => {
    return {
        filterDropdown: ({ confirm, clearFilters, setSelectedKeys, close }) => (
            <NumericFilterDropdown<T>
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