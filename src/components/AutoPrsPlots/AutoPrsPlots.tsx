import { Box } from "@mui/material"
import getColumnSearchProps, { getSortableHeader } from "../Filter";
import { useState } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Plot } from "../../types/plot";
import GeneralTable from "../GenTable";

interface Props {
    type: 'doante' | 'gift-trees'
}

const AutoPrsPlots: React.FC<Props> = ({ type }) => {

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<Plot[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

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
            setPage(0);
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    }

    const columns: any[] = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 150,
            ...getColumnSearchProps('label', filters, handleSetFilters)
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader("Total Trees", 'total', orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "tree_count",
            key: "Trees",
            title: getSortableHeader("Trees", 'tree_count', orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "booked",
            key: "Booked Trees",
            title: getSortableHeader("Booked Trees", "booked", orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "assigned",
            key: "Assigned Trees",
            title: getSortableHeader("Assigned Trees", "assigned", orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "unbooked_assigned",
            key: "Unfunded Inventory (Assigned)",
            title: getSortableHeader("Unfunded Inventory (Assigned)", "unbooked_assigned", orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory (Unassigned)",
            title: getSortableHeader("Unfunded Inventory (Unassigned)", "available", orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "card_available",
            key: "Giftable Inventory",
            title: getSortableHeader("Giftable Inventory", "card_available", orderBy, handleSortingChange),
            align: "right",
            width: 150,
        },
    ];


    return (
        <Box>
            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={plotsData.totalPlots}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                footer
                tableName="Plots"
            />
        </Box>
    );
}

export default AutoPrsPlots;