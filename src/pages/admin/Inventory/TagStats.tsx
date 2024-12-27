import { FC, useEffect, useRef, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter"
import GeneralTable from "../../../components/GenTable"
import { Segmented, Table, TableColumnsType } from "antd"
import { Order } from "../../../types/common"

function getColumn(field: string, treeHabitat: string) {
    return field + (treeHabitat ? "_" + treeHabitat : '')
}

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number, treeHabitat: string) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 10} colSpan={2}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 9} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 8} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.tree_count))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 7} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.shrub_count))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.herb_count))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 5} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item[getColumn("booked", treeHabitat)]))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 4} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item[getColumn("assigned", treeHabitat)]))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item[getColumn("unbooked_assigned", treeHabitat)]))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item[getColumn("available", treeHabitat)]))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => (Number(item[getColumn("available", treeHabitat)]) || 0) + (Number(item[getColumn("unbooked_assigned", treeHabitat)]) || 0)))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.card_available))}</Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface TagStatsProps {
    habits: string[]
    landTypes: string[]
    districts: string[]
    talukas: string[]
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const TagStats: FC<TagStatsProps> = ({ habits, landTypes, villages, districts, talukas, categories, serviceTypes }) => {

    const [tagTreeCountData, setTagTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [tags, setTags] = useState<string[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [treeHabit, setTreeHabit] = useState<'trees' | 'shrubs' | 'herbs' | ''>('trees');

    const handleSelectionChanges = (keys: any[]) => {
        setSelectedRows(keys);
    }

    const getTags = async () => {
        const apiClient = new ApiClient();
        const resp = await apiClient.getTags(0, 100);
        setTags(resp.results.map(item => item.tag));
    }

    const getFilters = () => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })

        if (categories.length !== 0 && !filters['category']) filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        if (serviceTypes.length !== 0) filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        if (talukas.length !== 0) filtersData.push({ columnField: 'taluka', operatorValue: 'isAnyOf', value: talukas });
        if (districts.length !== 0) filtersData.push({ columnField: 'district', operatorValue: 'isAnyOf', value: districts });
        if (villages.length !== 0) filtersData.push({ columnField: 'village', operatorValue: 'isAnyOf', value: villages });
        if (habits.length !== 0) filtersData.push({ columnField: 'habit', operatorValue: 'isAnyOf', value: habits });
        if (landTypes.length !== 0) filtersData.push({ columnField: 'land_type', operatorValue: 'isAnyOf', value: landTypes });

        return filtersData;
    }

    const getTagStats = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = getFilters();

        const stats = await apiClient.getTreeCountsForTags(page * pageSize, pageSize, filtersData, orderBy);
        setTotal(Number(stats.total));
        const newData = { ...tagTreeCountData };
        for (let i = 0; i < stats.results.length; i++) {
            newData[i + stats.offset] = {
                ...stats.results[i],
                key: stats.results[i].tag
            }
        }
        setTagTreeCountData(newData);
        setLoading(false);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const rows: any[] = []
            for (let i = 0; i < pageSize; i++) {
                if (i + page * pageSize >= total) break;
                const data = tagTreeCountData[i + page * pageSize]
                if (!data) {
                    getTagStats();
                    return;
                }
                rows.push(data);
            }

            setTableRows(rows);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [page, pageSize, total, tagTreeCountData])

    useEffect(() => {
        const handler = setTimeout(() => {
            getTagStats();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, orderBy, villages, talukas, districts, categories, serviceTypes])

    useEffect(() => {
        getTags();
    }, [])

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

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const filtersList = getFilters();
        const resp = await apiClient.getTreeCountsForTags(0, total, filtersList, orderBy);
        return resp.results;
    }

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    const [columns, setColumns] = useState<TableColumnsType<any>>([
        {
            title: "Tag",
            dataIndex: 'tag',
            key: 'tag',
            width: 250,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter({ dataIndex: 'tag', filters, handleSetFilters, options: tags }),
        },
        {
            title: getSortableHeader("Total", "total"),
            dataIndex: "total",
            key: "total",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Trees", "tree_count"),
            dataIndex: "tree_count",
            key: "Trees",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Shrubs", "shrub_count"),
            dataIndex: "shrub_count",
            key: "Shrubs",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Herbs", "herb_count"),
            dataIndex: "herb_count",
            key: "Herbs",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Booked", "booked"),
            dataIndex: "booked",
            key: "booked",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Assigned", "assigned"),
            dataIndex: "assigned",
            key: "assigned",
            align: 'right',
            width: 120,
        },
        {
            title: getSortableHeader("Unfunded Inventory (Assigned)", "unbooked_assigned"),
            dataIndex: "unbooked_assigned",
            key: "unbooked_assigned",
            align: 'right',
            width: 150,
        },
        {
            title: getSortableHeader("Unfunded Inventory (Unassigned)", "available"),
            dataIndex: "available",
            key: "available",
            align: 'right',
            width: 150,
        },
        {
            title: "Total Unfunded Inventory",
            dataIndex: "total_unfunded",
            key: "total_unfunded",
            align: 'right',
            width: 150,
            render: (value: any, record: any) => (Number(record.available) || 0) + (Number(record.unbooked_assigned) || 0),
        },
        {
            title: getSortableHeader("Giftable Inventory", "card_available"),
            dataIndex: "card_available",
            key: "card_available",
            align: 'right',
            width: 150,
        },
    ]);

    useEffect(() => {

        const getColumnClass = () => {
            if (treeHabit === 'trees') return 'bg-green';
            if (treeHabit === 'shrubs') return 'bg-cyan';
            if (treeHabit === 'herbs') return 'bg-yellow';

            return 'bg-orange'
        }

        setColumns(prev => {
            return prev.map((column: any) => {
                if (column.dataIndex.startsWith("booked")) {
                    return {
                        ...column,
                        dataIndex: getColumn("booked", treeHabit),
                        title: getSortableHeader("Booked Trees", getColumn("booked", treeHabit)),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex.startsWith("assigned")) {
                    return {
                        ...column,
                        dataIndex: getColumn("assigned", treeHabit),
                        title: getSortableHeader("Assigned Trees", getColumn("assigned", treeHabit)),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex.startsWith("unbooked_assigned")) {
                    return {
                        ...column,
                        dataIndex: getColumn("unbooked_assigned", treeHabit),
                        title: getSortableHeader("Unfunded Inventory (Assigned)", getColumn("unbooked_assigned", treeHabit)),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex.startsWith("available")) {
                    return {
                        ...column,
                        dataIndex: getColumn("available", treeHabit),
                        title: getSortableHeader("Unfunded Inventory (Unassigned)", getColumn("available", treeHabit)),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex.startsWith("card_available")) {
                    return {
                        ...column,
                        dataIndex: getColumn("card_available", treeHabit),
                        title: getSortableHeader("Giftable Inventory", getColumn("card_available", treeHabit)),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex === 'total_unfunded') {
                    return {
                        ...column,
                        render: (value: any, record: any) => (Number(record[getColumn("available", treeHabit)]) || 0) + (Number(record[getColumn("unbooked_assigned", treeHabit)]) || 0),
                        className: getColumnClass(),
                    }
                } else if (column.dataIndex === "total") {
                    return {
                        ...column,
                        className: treeHabit === '' ? 'bg-orange' : undefined,
                    }
                } else if (column.dataIndex === "tree_count") {
                    return {
                        ...column,
                        className: treeHabit === 'trees' ? 'bg-green' : undefined,
                    }
                } else if (column.dataIndex === "shrub_count") {
                    return {
                        ...column,
                        className: treeHabit === 'shrubs' ? 'bg-cyan' : undefined,
                    }
                } else if (column.dataIndex === "herb_count") {
                    return {
                        ...column,
                        className: treeHabit === 'herbs' ? 'bg-yellow' : undefined,
                    }
                }

                return column;
            })
        })

    }, [treeHabit, orderBy])


    return (
        <div>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="felx-end"
                    marginBottom={1}
                >
                    <Typography variant="h6">Tag level stats</Typography>
                    <Segmented<{ value: 'trees' | 'herbs' | 'shrubs' | '', label: string }>
                        size="large"
                        options={[{ value: 'trees', label: 'Trees' }, { value: 'shrubs', label: 'Shrubs' }, { value: 'herbs', label: 'Herbs' }, { value: '', label: 'Total' }]}
                        onChange={(item: any) => {
                            setTreeHabit(item)
                        }}
                    />
                </Box>
                <GeneralTable
                    columns={columns}
                    loading={loading}
                    rows={tableRows}
                    totalRecords={total}
                    page={page}
                    onPaginationChange={handlePageChange}
                    onDownload={handleDownload}
                    onSelectionChanges={handleSelectionChanges}
                    tableName="Tags Inventory"
                    footer
                    summary={(totalColumns: number) => {
                        if (totalColumns < 5) return undefined;
                        return TableSummary(tableRows, selectedRows, totalColumns, treeHabit)
                    }}
                />
            </Box>
        </div>
    )
}

export default TagStats;