import { useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { Order } from "../../../types/common";
import { Box, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getSortIcon } from "../../../components/Filter";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 4} colSpan={3}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.card_available))}</Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface CSRPlotStatesProps {
    groupId?: number
}

const CSRPlotStates: React.FC<CSRPlotStatesProps> = ({ groupId }) => {

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

    const getCSRPlotStats = async (offset: number, limit: number, group_id: number, filters: any[], orderBy: Order[]) => {
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
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters)));
        return filtersData;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!groupId) return;

            const filtersData = getFiltersData(filters);
            const currentPageTrees: Tree[] = [];
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!plots[i]) {
                    getCSRPlotStats(page * pageSize, pageSize, groupId, filtersData, orderBy);
                    return;
                }

                currentPageTrees.push(plots[i]);
            }
            setTableRows(currentPageTrees);
        }, 300);

        return () => { clearTimeout(handler); }
    }, [groupId, plots, page, pageSize, filters, totalRecords])

    const handleDownload = async () => {
        if (!groupId) return [];
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
            dataIndex: "site_name",
            key: "Site name",
            title: "Site name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
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
            key: "Booked Trees",
            title: getSortableHeader("Booked Trees", "booked"),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory (Unassigned)",
            title: getSortableHeader("Unfunded Inventory (Unassigned)", "available"),
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
    ];

    return (
        <Box mt={2}>
            <Typography variant="h5" ml={1}>CSR Plots</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                tableName="CSR Plots"
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