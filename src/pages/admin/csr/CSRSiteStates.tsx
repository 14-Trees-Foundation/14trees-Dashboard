import { useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { Order } from "../../../types/common";
import { Box, Button, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import SitesMap from "./SitesMap";

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 5} colSpan={totalColumns - 2}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 4} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} >{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.card_available))}</Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface CSRSiteStatesProps {
    groupId?: number
    tags: string[]
}

const CSRSiteStates: React.FC<CSRSiteStatesProps> = ({ groupId, tags }) => {

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [sites, setSites] = useState<Record<number, any>>({});
    const [totalRecords, setTotalRecords] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
        setSites({});
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
        setSites({});
        setTotalRecords(10);
    }, [groupId])

    const getCSRSiteStats = async (offset: number, limit: number, filters: any[], orderBy: Order[], group_id?: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const sitesResp = await apiClient.getSiteStatsForCorporate(offset, limit, group_id, filters, orderBy);

            setSites(prev => {
                const sitesData = { ...prev };
                for (let i = 0; i < sitesResp.results.length; i++) {
                    sitesData[sitesResp.offset + i] = { ...sitesResp.results[i], key: sitesResp.results[i].id }
                }

                return sitesData;
            })
            setTotalRecords(Number(sitesResp.total));

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
            const filtersData = getFiltersData(filters);
            const currentPageTrees: Tree[] = [];
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!sites[i]) {
                    getCSRSiteStats(page * pageSize, pageSize, filtersData, orderBy, groupId);
                    return;
                }

                currentPageTrees.push(sites[i]);
            }
            setTableRows(currentPageTrees);
        }, 300);

        return () => { clearTimeout(handler); }
    }, [groupId, sites, page, pageSize, filters, totalRecords])

    const handleDownload = async () => {
        if (!groupId) return [];
        setLoading(true);
        const filtersData = getFiltersData(filters);
        try {
            const apiClient = new ApiClient();
            const sitesResp = await apiClient.getSiteStatsForCorporate(0, totalRecords, groupId, filtersData, orderBy);

            setSites(prev => {
                const sitesData = { ...prev };
                for (let i = 0; i < sitesResp.results.length; i++) {
                    sitesData[sitesResp.offset + i] = { ...sitesResp.results[i], key: sitesResp.results[i].id }
                }

                return sitesData;
            })
            setTotalRecords(Number(sitesResp.total));
            setLoading(false);
            return sitesResp.results;
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
            setSites({});
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
            dataIndex: "name_english",
            key: "Site name",
            title: "Site name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('name_english', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 150,
            hidden: true,
            render: (tags) => tags ? tags.join(", ") : '',
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
        },
        {
            dataIndex: "area_acres",
            key: "area_acres",
            title: "Area (Acres)",
            width: 150,
            align: "center",
            hidden: true,
        },
        {
            dataIndex: "kml_file_link",
            key: "kml_file_link",
            title: "Kml File",
            width: 150,
            align: "center",
            hidden: true,
            render: (value, record, index) => {
                return value ? <Button variant="outlined" color="success"><a href={value} download={record.name_english + '.kml'} style={{ textTransform: 'none', color: 'inherit' }}>Download</a></Button> : 'Not Available'
            },
            ...getColumnSearchProps("kml_file_link", filters, handleSetFilters),
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
    ];

    return (
        <Box mt={10} id="reforestation-sites">
            <Typography variant="h4" ml={1} >Reforestation Sites</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>Explore the locations where your sponsored trees have been planted. View details of each site, including its geographical impact and sustainability progress.</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                tableName="Reforestation Sites"
                onSelectionChanges={handleSelectionChanges}
                summary={(totalColumns: number) => {
                    if (totalColumns < 5) return undefined;
                    return TableSummary(tableRows, selectedRows, totalColumns)
                }}
                footer
                expandable={{
                    render: (record: any) => (<SitesMap groupId={groupId} site={record} />),
                    isExpandable: (record: any) => record.kml_file_link ? true: false,
                }}
            />
        </Box>
    );
}

export default CSRSiteStates;