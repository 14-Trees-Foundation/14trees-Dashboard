import { Table } from "antd"
import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { Box, Typography } from "@mui/material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import './inventory.css'

interface DistrictStatsProps {
    districts: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const DistrictStats: FC<DistrictStatsProps> = ({ districts, categories, serviceTypes }) => {

    const [districtTreeCountData, setDistrictTreeCountData] = useState<PaginatedResponse<any>>({ total: 0, offset: 0, results: [] });

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];

        const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        }

        if (sorter.field) {
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    }

    const getDistricts = async () => {
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })

        if (categories.length !== 0 && !filters['category']) {
            filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        }

        if (serviceTypes.length !== 0) {
            filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        }
        if (districts.length !== 0) {
            filtersData.push({ columnField: 'district', operatorValue: 'isAnyOf', value: districts });
        }
        const stats = await apiClient.getTreesCountForDistricts(0, 10, filtersData, orderBy);
        
        if (stats.offset === 0) {
            setDistrictTreeCountData(stats);
        }
    }

    useEffect(() => {
        getDistricts();
    }, [filters, orderBy, districts])

    const getSortIcon = (field: string, order?: 'ASC' | 'DESC') => {
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
                <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={ order === 'ASC' ? '#00b96b' : "grey"}/>
                <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={ order === 'DESC' ? '#00b96b' : "grey"}/>
            </div>
        )
    }

    const commonDataColumn = [
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Total {getSortIcon('total', orderBy.find((item) => item.column === 'total')?.order)}
                </div>
            ),
            dataIndex: "total",
            key: "total",
            align: 'right',
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Booked {getSortIcon('booked', orderBy.find((item) => item.column === 'booked')?.order)}
                </div>
            ),
            dataIndex: "booked",
            key: "booked",
            align: 'right',
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Assigned {getSortIcon('assigned', orderBy.find((item) => item.column === 'assigned')?.order)}
                </div>
            ),
            dataIndex: "assigned",
            key: "assigned",
            align: 'right',
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Available {getSortIcon('available', orderBy.find((item) => item.column === 'available')?.order)}
                </div>
            ),
            dataIndex: "available",
            key: "available",
            align: 'right',
        },
    ]

    const aggregatedDataColumn = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'category', filters, handleSetFilters, options: ['Public', 'Foundation', 'Unknown'] }),
        },
        ...commonDataColumn
    ] 

    const districtDataColumn: any[] = [
        {
            title: "District",
            dataIndex: "district",
            key: "district",
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('district', filters, handleSetFilters),
        },
        ...aggregatedDataColumn
    ]

    return (
        <div>
            <Box>
                <Typography variant="h6">District level stats</Typography>
                <Table 
                    columns={districtDataColumn}
                    dataSource={districtTreeCountData.results}
                    rowClassName={(item) => !item.category || !item.district ? 'pending-item' : ''}
                    pagination={{
                        total: districtTreeCountData.total,
                    }}
                />
            </Box>
        </div>
    )
}

export default DistrictStats;