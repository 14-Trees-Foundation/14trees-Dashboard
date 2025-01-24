import { useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { Order } from "../../../types/common";
import { Box, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";

const accessibilityList = [
    { value: "accessible", label: "Accessible" },
    { value: "inaccessible", label: "Inaccessible" },
    { value: "moderately_accessible", label: "Moderately Accessible" },
];

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }
    
    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={totalColumns - 4}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 5} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 4} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.card_available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} ></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface CSRPlotStatesProps {
    groupId?: number
    tags: string[]
}

const CSRPlotStates: React.FC<CSRPlotStatesProps> = ({ groupId, tags }) => {

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [plots, setPlots] = useState<Record<number, any>>({});
    const [totalRecords, setTotalRecords] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
        setPlots({});
        setTotalRecords(10);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleSelectionChanges = (keys: any[]) => {
        setSelectedRows(keys);
    }

    useEffect(() => {
        setPage(0);
        setPlots({});
        setTotalRecords(10);
    }, [groupId])

    const getCSRPlotStats = async (offset: number, limit: number, filters: any[], orderBy: Order[], group_id?: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const plotsResp = await apiClient.getPlotStatsForCorporate(offset, limit, group_id, filters, orderBy);

            setPlots(prev => {
                const plotsData = { ...prev };
                for (let i = 0; i < plotsResp.results.length; i++) {
                    plotsData[plotsResp.offset + i] = {...plotsResp.results[i], key: plotsResp.results[i].id }
                }

                return plotsData;
            })
            setTotalRecords(Number(plotsResp.total));

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    const getFiltersData = (filters: any) => {
        let filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        
        const accessibilityIdx = filtersData.findIndex(item => item.columnField === 'accessibility_status');
        if (accessibilityIdx > -1) {
            filtersData[accessibilityIdx].value = filtersData[accessibilityIdx].value.map((item: string) => {
            switch (item) {
                case "Accessible":
                return "accessible";
                case "Inaccessible":
                return "inaccessible";
                case "Moderately Accessible":
                return "moderately_accessible";
                default:
                return null;
            }
            })
        }

        return filtersData;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtersData = getFiltersData(filters);
            const currentPageTrees: Tree[] = [];
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!plots[i]) {
                    getCSRPlotStats(page * pageSize, pageSize, filtersData, orderBy, groupId);
                    return;
                }

                currentPageTrees.push(plots[i]);
            }
            setTableRows(currentPageTrees);
        }, 300);

        return () => { clearTimeout(handler); }
    }, [groupId, plots, page, pageSize, filters, totalRecords])

    const handleDownload = async () => {
        setLoading(true);
        const filtersData = getFiltersData(filters);
        try {
            const apiClient = new ApiClient();
            const plotsResp = await apiClient.getPlotStatsForCorporate(0, totalRecords, groupId, filtersData, orderBy);

            setPlots(prev => {
                const plotsData = { ...prev };
                for (let i = 0; i < plotsResp.results.length; i++) {
                    plotsData[plotsResp.offset + i] = {...plotsResp.results[i], key: plotsResp.results[i].id }
                }

                return plotsData;
            })
            setTotalRecords(Number(plotsResp.total));
            setLoading(false);
            return plotsResp.results;
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
            return [];
        }
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

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    const columns: TableColumnsType<any> = [
        {
            dataIndex: "name",
            key: "Plot name",
            title: "Plot name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "accessibility_status",
            key: "accessibility_status",
            title: "Accessibility",
            align: "center",
            width: 200,
            hidden: true,
            render: (value) => value ? accessibilityList.find((item) => item.value === value)?.label : "Unknown",
            ...getColumnSelectedItemFilter({ dataIndex: 'accessibility_status', filters, handleSetFilters, options: accessibilityList.map((item) => item.label).concat("Unknown") })
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 250,
            hidden: true,
            render: (tags) => tags ? tags.join(", ") : '',
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
        },
        {
            dataIndex: "total_booked",
            key: "Sponsor Ownership",
            title: "Sponsor Ownership",
            align: "center",
            width: 250,
            render: (value: any, record: any) => record.booked === Number(record.total_booked) ? 'Exclusive' : 'Shared',
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader("Total Trees", 'total'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "booked",
            key: "Sponsored Trees",
            title: getSortableHeader("Sponsored Trees", "booked"),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory",
            title: getSortableHeader("Unfunded Inventory", "available"),
            align: "right",
            width: 200,
        },
        {
            dataIndex: "card_available",
            key: "Giftable Inventory",
            title: getSortableHeader("Giftable Inventory", "card_available"),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "site_name",
            key: "Site name",
            title: "Site name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
    ];

    return (
        <Box mt={10} id="plantation-plots">
            <Typography variant="h4" ml={1} >Plantation Plots</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>Dive deeper into the individual plots within each site.</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                tableName="Plantation Plots"
                onSelectionChanges={handleSelectionChanges}
                summary={(totalColumns: number) => {
                    if (totalColumns < 5) return undefined;
                    return TableSummary(tableRows, selectedRows, totalColumns)
                }}
                footer
            />
        </Box>
    );
}

export default CSRPlotStates;