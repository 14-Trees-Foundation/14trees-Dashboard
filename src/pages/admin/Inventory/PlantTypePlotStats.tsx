import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import { Box, Typography } from "@mui/material"
import GeneralTable from "../../../components/GenTable"
import { Table } from "antd"
import { toast } from "react-toastify"

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 7} colSpan={7}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 5} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 4} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.assigned))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.unbooked_assigned))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => (Number(item.available) || 0) + (Number(item.unbooked_assigned) || 0)))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.card_available))}</Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface PlantTypePlotStatsProps {
    habits: string[]
    landTypes: string[]
    districts: string[]
    talukas: string[]
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const PlantTypePlotStats: FC<PlantTypePlotStatsProps> = ({ habits, landTypes, districts, talukas, villages, categories, serviceTypes }) => {

    const [plantTypeTreeCountData, setPlantTypeTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [tags, setTags] = useState<string[]>([]);

    const getTags = async () => {
        try {
            const apiClient = new ApiClient();
            const resp = await apiClient.getTags(0, 100);
            setTags(resp.results.map(item => item.tag));
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getTags();
    }, [])

    const getFilters = () => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'illustration_link') {
                if (item.value.includes('Available')) {
                    item.operatorValue = 'isNotEmpty';
                    item.value = '';
                } else {
                    item.value = (item.value as string[]).filter(item => item !== 'Not Available');
                    item.value.push(null);
                }
            } else if (item.columnField === 'template_id') {
                if (item.value.includes('Yes')) {
                    item.operatorValue = 'isNotEmpty';
                    item.value = '';
                } else {
                    item.value = (item.value as string[]).filter(item => item !== 'No');
                    item.value.push(null);
                }
            }
        })

        // if (categories.length !== 0 && !filters['category']) filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        // if (serviceTypes.length !== 0) filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        // if (talukas.length !== 0) filtersData.push({ columnField: 'taluka', operatorValue: 'isAnyOf', value: talukas });
        // if (districts.length !== 0) filtersData.push({ columnField: 'district', operatorValue: 'isAnyOf', value: districts });
        // if (villages.length !== 0) filtersData.push({ columnField: 'village', operatorValue: 'isAnyOf', value: villages });
        // if (habits.length !== 0) filtersData.push({ columnField: 'habit', operatorValue: 'isAnyOf', value: habits });
        // if (landTypes.length !== 0) filtersData.push({ columnField: 'land_type', operatorValue: 'isAnyOf', value: landTypes });

        return filtersData;
    }

    const getPlantTypes = async () => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const filtersData = getFilters();
            const stats = await apiClient.getPlantTypeStateForPlots(page * pageSize, pageSize, filtersData, orderBy);
            
            setTotal(Number(stats.total));
            const newData = { ...plantTypeTreeCountData };
            for (let i = 0; i < stats.results.length; i++) {
                newData[i + stats.offset] = newData[i + stats.offset] = {
                    ...stats.results[i],
                    key: stats.results[i].plant_type
                }
            }
            setPlantTypeTreeCountData(newData);
        } catch (error: any) {
            toast.error(error.message)
        }

        setLoading(false);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    useEffect(() => {
        const rows: any[] = []
        for (let i = 0; i < pageSize; i++) {
            if (i + page * pageSize >= total) break;
            const data = plantTypeTreeCountData[i + page * pageSize]
            if (!data) {
                getPlantTypes();
                return;
            }
            rows.push(data);
        }

        setTableRows(rows);
    }, [page, pageSize, total, plantTypeTreeCountData])

    useEffect(() => {
        getPlantTypes();
    // }, [filters, orderBy, villages, talukas, districts, categories, serviceTypes])
    }, [filters, orderBy])

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const filtersList = getFilters();
        const resp = await apiClient.getTreeCountsForPlantTypes(0, total, filtersList, orderBy);
        return resp.results;
    }

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleSelectionChanges = (keys: any[]) => {
        setSelectedRows(keys);
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
                <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={order === 'ASC' ? '#00b96b' : "grey"} />
                <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={order === 'DESC' ? '#00b96b' : "grey"} />
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
            width: 150,
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
            width: 150,
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
            width: 150,
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
            width: 200,
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
            width: 200,
        },
        {
            title: "Total Unfunded Inventory",
            dataIndex: "total_unfunded",
            key: "total_unfunded",
            align: 'right',
            width: 200,
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
            width: 200,
        },
    ]

    const columns: any[] = [
        {
            title: "Plant Type",
            dataIndex: 'plant_type',
            key: 'plant_type',
            width: 200,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('plant_type', filters, handleSetFilters),
        },
        {
            title: "Habitat",
            dataIndex: 'habit',
            key: 'habit',
            width: 150,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter({dataIndex: 'habit', filters, handleSetFilters, options: ["Tree", "Herb", "Shrub"]}),
        },
        {
            title: "Card Template",
            dataIndex: 'template_id',
            key: 'Card Template',
            width: 150,
            render: (value: any) => value ? "Yes" : 'No',
            ...getColumnSelectedItemFilter({dataIndex: 'template_id', filters, handleSetFilters, options: ["Yes", "No"]}),
        },
        {
            title: "Plot",
            dataIndex: 'plot_name',
            key: 'Plot',
            width: 350,
            ...getColumnSearchProps('plot_name', filters, handleSetFilters),
        },
        {
            title: "Plot Tags",
            dataIndex: 'plot_tags',
            key: 'Plot Tags',
            width: 250,
            render: (value: any) => value ? value?.join(', ') : '',
            ...getColumnSelectedItemFilter({dataIndex: 'plot_tags', filters, handleSetFilters, options: tags}),
        },
        {
            title: "Site",
            dataIndex: 'site_name',
            key: 'Site',
            width: 350,
            ...getColumnSearchProps('site_name', filters, handleSetFilters),
        },
        ...commonDataColumn
    ]

    return (
        <div>
            <Box>
                <Typography variant="h6">Plant types inventory</Typography>
                <GeneralTable
                    loading={loading}
                    page={page}
                    rows={tableRows}
                    columns={columns}
                    totalRecords={total}
                    pageSize={pageSize}
                    onPaginationChange={handlePageChange}
                    onDownload={handleDownload}
                    onSelectionChanges={handleSelectionChanges}
                    tableName={"Plant type Inventory"}
                    footer
                    summary={(totalColumns: number) => {
                        if (totalColumns < 5) return undefined;
                        return TableSummary(tableRows, selectedRows, totalColumns)
                    }}
                />
            </Box>
        </div>
    )
}

export default PlantTypePlotStats;