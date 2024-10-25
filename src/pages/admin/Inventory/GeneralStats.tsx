import { Table } from "antd"
import { FC } from "react"
import { Box, Typography } from "@mui/material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import { GridFilterItem } from "@mui/x-data-grid"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import GeneralTable from "../../../components/GenTable"

interface GeneralStatsProps {
    field: string
    loading: boolean,
    total: number,
    page: number,
    tableRows: any[],
    onPageChange: (page: number, pageSize: number) => void
    orderBy: {column: string, order: 'ASC' | 'DESC'}[]
    onOrderByChange: (orderBy: {column: string, order: 'ASC' | 'DESC'}[]) => void
    filters: Record<string, GridFilterItem>
    onFiltersChange: (filters: Record<string, GridFilterItem>) => void
    onDownload: () => Promise<any[]>
}

const GeneralStats: FC<GeneralStatsProps> = ({ field, loading, total, page, tableRows, onPageChange, orderBy, onOrderByChange, filters, onFiltersChange, onDownload }) => {

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
                  Unfunded Inventory (Assigned) {getSortIcon('unbooked_assigned', orderBy.find((item) => item.column === 'unbooked_assigned')?.order)}
                </div>
            ),
            dataIndex: "unbooked_assigned",
            key: "unbooked_assigned",
            align: 'right',
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Unfunded Inventory (Unassigned) {getSortIcon('available', orderBy.find((item) => item.column === 'available')?.order)}
                </div>
            ),
            dataIndex: "available",
            key: "available",
            align: 'right',
        },
        {
            title: "Total Unfunded Inventory",
            dataIndex: "total_unfunded",
            key: "total_unfunded",
            align: 'right',
            render: (value: any, record: any) => (Number(record.available) || 0) + (Number(record.unbooked_assigned) || 0),
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Giftable Inventory {getSortIcon('card_available', orderBy.find((item) => item.column === 'card_available')?.order)}
                </div>
            ),
            dataIndex: "card_available",
            key: "card_available",
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
                <GeneralTable 
                    loading={loading}
                    page={page}
                    rows={tableRows}
                    columns={districtDataColumn}
                    totalRecords={total}
                    onPaginationChange={onPageChange}
                    onDownload={onDownload}
                    rowClassName={(record, index) => {
                        if (!record[field] || !record['category']) return 'pending-item';
                        return '';
                    }}
                />
            </Box>
        </div>
    )
}

export default GeneralStats;