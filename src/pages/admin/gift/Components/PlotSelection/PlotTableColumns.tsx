import { TableColumnsType } from "antd";
import { Plot } from "../../../../../types/plot";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";

export const createPlotTableColumns = (
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    orderBy: { column: string, order: 'ASC' | 'DESC' }[],
    handleSortingChange: (sorter: any) => void
): TableColumnsType<Plot> => {
    
    const accessibilityList = [
        { value: "accessible", label: "Accessible" },
        { value: "inaccessible", label: "Inaccessible" },
        { value: "moderately_accessible", label: "Moderately Accessible" },
    ];

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    return [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader("Total Trees", 'total'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "tree_count",
            key: "Trees",
            title: getSortableHeader("Trees", 'tree_count'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "shrub_count",
            key: "Shrubs",
            title: getSortableHeader("Shrubs", 'shrub_count'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "herb_count",
            key: "Herbs",
            title: getSortableHeader("Herbs", 'herb_count'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available_trees",
            key: "Available (Unfunded Inventory)",
            title: getSortableHeader("Available (Unfunded Inventory)", 'available_trees'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "card_available_trees",
            key: "Giftable Inventory",
            title: getSortableHeader("Giftable Inventory", 'card_available_trees'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "distinct_plants",
            key: "distinct_plants",
            title: "Unique Plant Types",
            align: "right",
            width: 100,
            render: (value) => value?.length || 0
        },
        {
            dataIndex: "accessibility_status",
            key: "accessibility_status",
            title: "Accessibility",
            align: "center",
            width: 200,
            render: (value) => value ? accessibilityList.find((item) => item.value === value)?.label : "Unknown",
            ...getColumnSelectedItemFilter({ dataIndex: 'accessibility_status', filters, handleSetFilters, options: accessibilityList.map((item) => item.label).concat("Unknown") })
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
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 150,
            render: (tags) => tags ? tags.join(", ") : '',
        },
        {
            dataIndex: "gat",
            key: "gat",
            title: "Gat No.",
            align: "center",
            width: 150,
        },
    ];
};