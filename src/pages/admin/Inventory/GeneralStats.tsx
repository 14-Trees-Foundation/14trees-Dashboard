import { Table } from "antd"
import { FC } from "react"
import { Box, Typography } from "@mui/material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"

interface GeneralStatsProps {
    field: string
    treesCountData: PaginatedResponse<any>
    orderBy: {column: string, order: 'ASC' | 'DESC'}[]
    onOrderByChange: (orderBy: {column: string, order: 'ASC' | 'DESC'}[]) => void
    filters: Record<string, GridFilterItem>
    onFiltersChange: (filters: Record<string, GridFilterItem>) => void
}

const GeneralStats: FC<GeneralStatsProps> = ({ field, treesCountData, orderBy, onOrderByChange, filters, onFiltersChange }) => {

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
            onOrderByChange(newOrder);
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
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'category', filters, handleSetFilters: onFiltersChange, options: ['Public', 'Foundation', 'Unknown'] }),
        },
        ...commonDataColumn
    ] 

    const districtDataColumn: any[] = [
        {
            title: field.slice(0, 1).toUpperCase() + field.slice(1),
            dataIndex: field,
            key: field,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps(field, filters, onFiltersChange),
        },
        ...aggregatedDataColumn
    ]

    return (
        <div>
            <Box>
                <Typography variant="h6">{field.slice(0, 1).toUpperCase() + field.slice(1)} level stats</Typography>
                <Table 
                    columns={districtDataColumn}
                    dataSource={treesCountData.results}
                    pagination={{
                        total: treesCountData.total,
                    }}
                />
            </Box>
        </div>
    )
}

export default GeneralStats;