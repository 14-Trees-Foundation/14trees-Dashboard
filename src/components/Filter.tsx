import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { GridFilterItem } from '@mui/x-data-grid';

import { Select, Button as Btn, Input, Space } from 'antd'
import type { TableColumnType, InputRef } from 'antd';
import { FilterConfirmProps } from 'antd/es/table/interface';

export default function getColumnSearchProps<T extends object>(dataIndex: keyof T, filters: Record<string, GridFilterItem>, handleSetFilters: (filters: Record<string, GridFilterItem>) => void): TableColumnType<T> {

    let filterOption = 'contains'
    // const searchInput = useRef<InputRef>(null);

    const filterOptions: Record<string, string> = {
        'contains': 'Contains',
        'equals': 'Equals',
        'startsWith': 'Starts with',
        'endsWith': 'Ends with',
        'isEmpty': 'Is empty',
        'isNotEmpty': 'Is not empty'
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

    return ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center' }} >
                    <Select
                        defaultValue={filterOptionsArray[0]}
                        style={{ marginBottom: 8, marginRight: 6 }}
                        options={filterOptionsArray}
                        onChange={(value) => { filterOption = value; }}
                    />
                    <Input
                        // ref={searchInput}
                        placeholder={`Search ${dataIndex.toString()}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                </div>
                <Space style={{ display: 'flex', alignItems: 'center'}}>
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
                                value: (selectedKeys as string[])[0],
                            }
                            console.log(newFilters);
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
        ),
        filterIcon: (filtered: boolean) => (
            <FilterAltRoundedIcon style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        // onFilter: (value, record) =>
        //     { console.log(filters);
        //     return record[dataIndex]
        //     .toString()
        //     .toLowerCase()
        //     .includes((value as string).toLowerCase())},
        // onFilterDropdownOpenChange: (visible) => {
        //     if (visible) {
        //         setTimeout(() => searchInput.current?.select(), 100);
        //     }
        // },
    })
};