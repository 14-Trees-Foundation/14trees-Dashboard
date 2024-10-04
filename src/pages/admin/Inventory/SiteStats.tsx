import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { Box, Typography } from "@mui/material"
import { Table } from "antd"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"


const SiteStats: FC = () => {

    const [siteTreeCountData, setSiteTreeCountData] = useState<PaginatedResponse<any>>({ total: 0, offset: 0, results: [] });

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])

    const getSites = async () => {
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })
        const stats = await apiClient.getSitesStats(0, 10, filtersData, orderBy);
        
        if (stats.offset === 0) {
            setSiteTreeCountData(stats);
        }
    }

    useEffect(() => {
        getSites();
    }, [filters, orderBy])

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

    const getMaintenanceTypesString = (value: string) => {
        switch (value) {
            case 'DISTRIBUTION_ONLY':
                return 'Distribution Only';
            case 'PLANTATION_ONLY':
                return 'Plantation Only';
            case 'FULL_MAINTENANCE':
                return 'Full Maintenance';
            default:
                return 'Unknown';
        }
    }

    const columns: any = [
        {
            title: 'Site Name',
            dataIndex: 'site_name',
            key: 'site_name',
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('site_name', filters, handleSetFilters),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'category', filters, handleSetFilters, options: ['Public', 'Foundation', 'Unknown'] }),
        },
        {
            title: "Maintenance Type",
            dataIndex: "maintenance_type",
            key: "maintenance_type",
            render: getMaintenanceTypesString,
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'maintenance_type', filters, handleSetFilters, options: ['Distribution Only', 'Plantation Only', 'Full Maintenance', 'Unknown'] })
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
            render: (value: any) => value ? Math.floor(value * 300) : 'Unknown'
        },
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

    return (
        <div>
            <Box>
                <Typography variant="h6">Site level stats</Typography>
                <Table
                    columns={columns}
                    dataSource={siteTreeCountData.results}
                    pagination={{
                        total: siteTreeCountData.total,
                    }}
                />
            </Box>
        </div>
    )
}

export default SiteStats;