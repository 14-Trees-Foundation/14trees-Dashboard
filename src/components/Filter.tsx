import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { GridFilterItem } from '@mui/x-data-grid';

import { Select, Button as Btn, Input, Space, DatePicker, Segmented } from 'antd'
import type { TableColumnType, SelectProps } from 'antd';
import { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { Order } from '../types/common';

interface FilterItemProps<T> {
    dataIndex: keyof T
    filters: Record<string, GridFilterItem>
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void
    multiSearch?: boolean
}

export default function getColumnSearchProps<T extends object>(dataIndex: keyof T, filters: Record<string, GridFilterItem>, handleSetFilters: (filters: Record<string, GridFilterItem>) => void, multiSearch?: boolean): TableColumnType<T> {

    return ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <ColumnSearchDropdown
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
        filterIcon: (filtered: boolean) => (
            <FilterAltRoundedIcon style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    })
};

interface ColumnSearchDropdownProps<T> extends FilterItemProps<T> {
    setSelectedKeys: (selectedKeys: React.Key[]) => void,
    selectedKeys: React.Key[],
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    close: () => void;
}

const ColumnSearchDropdown = <T extends object>({ dataIndex, filters, selectedKeys, multiSearch, setSelectedKeys, handleSetFilters, confirm, clearFilters, close }: ColumnSearchDropdownProps<T>) => {

    const [filterOption, setFilterOption] = useState('contains');

    const filterOptions: Record<string, string> = {
        'contains': 'Contains',
        'equals': 'Equals',
        'startsWith': 'Starts with',
        'endsWith': 'Ends with',
        'isEmpty': 'Is empty',
        'isNotEmpty': 'Is not empty'
    }

    if (multiSearch) {
        filterOptions['isAnyOf'] = "Is Any"
    }

    const filterOptionsArray: any = []
    Object.entries(filterOptions).forEach(([key, value]) => {
        filterOptionsArray.push({ label: value, value: key })
    });

    const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps | undefined) => void, dataIndex: keyof T) => {
        clearFilters();
        confirm({ closeDropdown: false });
        let newFilters = { ...filters }
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    };

    return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center' }} >
                <Select
                    defaultValue={filterOptionsArray[0]}
                    style={{ marginBottom: 8, marginRight: 6 }}
                    options={filterOptionsArray}
                    dropdownStyle={{ zIndex: 10001 }}
                    onChange={(value) => { setFilterOption(value) }}
                />
                {filterOption !== "isAnyOf" && <Input
                    placeholder={`Search ${dataIndex.toString()}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    style={{ marginBottom: 8, display: 'block' }}
                />}
                {filterOption === "isAnyOf" && <Select
                    mode="tags"
                    placeholder="Please select"
                    value={selectedKeys}
                    onChange={(value) => setSelectedKeys(value)}
                    tokenSeparators={['\n', ',']}
                    dropdownStyle={{ zIndex: 10001 }}
                    style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
                />}
            </div>
            <Space style={{ display: 'flex', alignItems: 'center' }}>
                <Btn
                    onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Btn>
                <Btn
                    size="small"
                    onClick={() => {
                        if (filterOption === 'isEmpty' || filterOption === 'isNotEmpty') setSelectedKeys([' '])
                        confirm({ closeDropdown: false });
                        let newFilters = { ...filters }
                        newFilters[dataIndex.toString()] = {
                            columnField: dataIndex.toString(),
                            operatorValue: filterOption,
                            value: filterOption !== "isAnyOf"
                                ? (selectedKeys as string[])[0]?.trim()
                                : (selectedKeys as string[]).map(item => item.trim()),
                        }
                        handleSetFilters(newFilters);
                    }}
                >
                    Apply
                </Btn>
                <Btn
                    size="small"
                    onClick={() => {
                        close();
                    }}
                >
                    close
                </Btn>
            </Space>
        </div>
    )
}



type FilterSelectItemProp<T> = {
    dataIndex: keyof T,
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    options: string[]
}

export function getColumnSelectedItemFilter<T extends object>({ dataIndex, filters, handleSetFilters, options }: FilterSelectItemProp<T>): TableColumnType<T> {

    return ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <SelectItemFilterDropdown
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
        filterIcon: (filtered: boolean) => (
            <FilterAltRoundedIcon style={{ color: filtered ? '#1677ff' : undefined }} />
        ),

    })
};

interface SelectItemFilterDropdownProps<T> extends FilterSelectItemProp<T> {
    setSelectedKeys: (selectedKeys: React.Key[]) => void,
    selectedKeys: React.Key[],
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    close: () => void;
}

const SelectItemFilterDropdown = <T extends object>({ dataIndex, filters, options, selectedKeys, setSelectedKeys, handleSetFilters, confirm, clearFilters, close }: SelectItemFilterDropdownProps<T>) => {

    const [filterOption, setFilterOption] = useState<'contains' | 'isAnyOf'>('isAnyOf');

    const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps | undefined) => void, dataIndex: keyof T) => {
        clearFilters();
        confirm({ closeDropdown: false });
        let newFilters = { ...filters }
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
        setFilterOption('isAnyOf');
    };

    let selectOptions: SelectProps['options'] = options.map(item => ({
        value: item,
        label: item
    }))

    return (
        <div style={{ padding: 8, zIndex: 10 }} onKeyDown={(e) => e.stopPropagation()}>
            <Select
                mode="tags"
                placeholder="Please select"
                value={selectedKeys}
                onChange={(value) => setSelectedKeys(value)}
                options={selectOptions}
                dropdownStyle={{ zIndex: 10001 }}
                style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
            />
            <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Filter Type: </p>
                <Segmented<string>
                    options={['Any', 'All']}
                    onChange={(value) => {
                        setFilterOption(value === 'All' ? 'contains' : 'isAnyOf')
                    }}
                />
            </Space>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Btn
                    onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Btn>
                <Btn
                    size="small"
                    onClick={() => {
                        confirm({ closeDropdown: false });
                        let newFilters = { ...filters }
                        newFilters[dataIndex.toString()] = {
                            columnField: dataIndex.toString(),
                            operatorValue: filterOption,
                            value: selectedKeys,
                        }

                        if (selectedKeys.length === 0) {
                            clearFilters && handleReset(clearFilters, confirm, dataIndex);
                        } else {
                            handleSetFilters(newFilters);
                        }
                    }}
                >
                    Apply
                </Btn>
                <Btn
                    size="small"
                    onClick={() => {
                        close();
                    }}
                >
                    close
                </Btn>
            </Space>
        </div>
    )
}

export const getColumnDateFilter = <T extends object>({ dataIndex, filters, handleSetFilters, label }: FilterItemProps<T> & { label: string }): TableColumnType<T> => {
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
        filterIcon: (filtered: boolean) => (
            <FilterAltRoundedIcon style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    };
};

interface DateFilterDropdownProps<T> extends FilterItemProps<T> {
    setSelectedKeys: (selectedKeys: React.Key[]) => void,
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    close: () => void;
    label: string;
}

const DateFilterDropdown = <T extends object>({ dataIndex, filters, label, setSelectedKeys, handleSetFilters, confirm, clearFilters, close }: DateFilterDropdownProps<T>) => {
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
        confirm({ closeDropdown: false });
        let newFilters = { ...filters };
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    };

    const handleApply = () => {
        confirm({ closeDropdown: false });
        let filter: GridFilterItem | null = null;
        if (lower && upper) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'between', value: [lower, upper] }
        } else if (lower) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'greaterThan', value: lower }
        } else if (upper) {
            filter = { columnField: dataIndex.toString(), operatorValue: 'lessThan', value: upper }
        }

        if (filter) {
            handleSetFilters({
                ...filters,
                [dataIndex.toString()]: filter,
            });
            setSelectedKeys(['1'])
        }
    };

    return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ margin: 2 }}>{label} After:</div>
                    <DatePicker value={ld} onChange={(date, stringDate) => {setLower(stringDate as string); setLd(date)}} style={{ margin: 2, backgroundColor: 'white' }} popupStyle={{ zIndex: 100001 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ margin: 2 }}>{label} Before:</div>
                    <DatePicker value={ud} onChange={(date, stringDate) => {setUpper(stringDate as string); setUd(date)}} style={{ margin: 2, backgroundColor: 'white' }} popupStyle={{ zIndex: 100001 }} />
                </div>
            </div>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Btn onClick={handleReset} size="small" style={{ width: 90 }}>
                    Reset
                </Btn>
                <Btn size="small" onClick={handleApply}>
                    Apply
                </Btn>
                <Btn size="small" onClick={() => close()}>
                    Close
                </Btn>
            </Space>
        </div>
    );
};

/**
 * Filter for numeric column
 */
export const getColumnNumericFilter = <T extends object>({ dataIndex, filters, handleSetFilters, label }: FilterItemProps<T> & { label: string }): TableColumnType<T> => {
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
        filterIcon: (filtered: boolean) => (
            <FilterAltRoundedIcon style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    };
};

interface NumericFilterDropdownProps<T> extends FilterItemProps<T> {
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    close: () => void;
    label: string;
}

const NumericFilterDropdown = <T extends object>({ dataIndex, filters, label, setSelectedKeys, handleSetFilters, confirm, clearFilters, close }: NumericFilterDropdownProps<T>) => {
    const [filterType, setFilterType] = useState<'equals' | 'range' | 'isAnyOf'>('equals'); // Default to 'equals'
    const [lower, setLower] = useState<string>('');
    const [upper, setUpper] = useState<string>('');
    const [equalTo, setEqualTo] = useState<string>('');
    const [anyOfValues, setAnyOfValues] = useState<string[]>([]); // For "Is Any Of"

    const handleReset = () => {
        clearFilters && clearFilters();
        setLower('');
        setUpper('');
        setEqualTo('');
        setAnyOfValues([]);
        confirm({ closeDropdown: false });
        let newFilters = { ...filters };
        Reflect.deleteProperty(newFilters, dataIndex);
        handleSetFilters(newFilters);
    };

    const handleApply = () => {
        confirm({ closeDropdown: false });
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
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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
                    dropdownStyle={{ zIndex: 10001 }}
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
                    dropdownStyle={{ display: 'none', zIndex: 10001 }}
                    style={{ display: 'block', marginBottom: 8, alignItems: 'center', width: 250 }}
                />
            )}

            {/* Action Buttons */}
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Btn onClick={handleReset} size="small" style={{ width: 90 }}>
                    Reset
                </Btn>
                <Btn size="small" onClick={handleApply}>
                    Apply
                </Btn>
                <Btn size="small" onClick={() => close()}>
                    Close
                </Btn>
            </Space>
        </div>
    );
};

export const getSortIcon = (field: string, order: 'ASC' | 'DESC' | undefined, handleSortingChange: (param: { field: string, order?: 'ASC' | 'DESC' }) => void) => {
    return (
        <div
            style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
            onClick={() => {
                let newOrder: 'ASC' | 'DESC' | undefined = 'ASC';
                if (order === 'ASC') newOrder = 'DESC';
                else if (order === 'DESC') newOrder = undefined;
                handleSortingChange({ field, order: newOrder });
            }}
        >
            <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={order === 'ASC' ? '#00b96b' : "grey"} />
            <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={order === 'DESC' ? '#00b96b' : "grey"} />
        </div>
    )
}

export const getSortableHeader = (header: string, key: string, orderBy: Order[], handleSortingChange: (param: { field: string, order?: 'ASC' | 'DESC' }) => void) => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
        </div>
    )
}