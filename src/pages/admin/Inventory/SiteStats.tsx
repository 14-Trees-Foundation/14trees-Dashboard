import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { Table } from "antd"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import GeneralTable from "../../../components/GenTable"

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 10} colSpan={7}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 9} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 8} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.tree_count))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 7} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.shrub_count))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.herb_count))}</Table.Summary.Cell>
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

interface SiteStatsProps {
    habits: string[]
    landTypes: string[]
    districts: string[]
    talukas: string[]
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const SiteStats: FC<SiteStatsProps> = ({ habits, landTypes, districts, talukas, villages, categories, serviceTypes }) => {

    const [siteTreeCountData, setSiteTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([])
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const handleSelectionChanges = (keys: any[]) => {
        setSelectedRows(keys);
    }

    const getFilters = () => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }

            if (item.columnField === 'land_type' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })

        const maintenanceIdx = filtersData.findIndex((item) => item.columnField === 'maintenance_type');
        if (maintenanceIdx > -1) {
            filtersData[maintenanceIdx].value = filtersData[maintenanceIdx].value.map((item: string) => {
                switch (item) {
                    case 'Distribution Only':
                        return 'DISTRIBUTION_ONLY';
                    case 'Plantation Only':
                        return 'PLANTATION_ONLY';
                    case 'Full Maintenance':
                        return 'FULL_MAINTENANCE';
                    case 'Waiting':
                        return 'WAITING';
                    case 'Cancelled':
                        return 'CANCELLED';
                    case 'TBD':
                        return 'TBD';
                    default:
                        return null;
                }
            })
        }

        if (categories.length !== 0 && !filters['category']) filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        if (serviceTypes.length !== 0) filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        if (talukas.length !== 0) filtersData.push({ columnField: 'taluka', operatorValue: 'isAnyOf', value: talukas });
        if (districts.length !== 0) filtersData.push({ columnField: 'district', operatorValue: 'isAnyOf', value: districts });
        if (villages.length !== 0) filtersData.push({ columnField: 'village', operatorValue: 'isAnyOf', value: villages });
        if (habits.length !== 0) filtersData.push({ columnField: 'habit', operatorValue: 'isAnyOf', value: habits });
        if (landTypes.length !== 0) filtersData.push({ columnField: 'land_type', operatorValue: 'isAnyOf', value: landTypes });

        return filtersData;
    }

    const getSites = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = getFilters();
        const stats = await apiClient.getSitesStats(page * pageSize, pageSize, filtersData, orderBy);

        setTotal(Number(stats.total));
        const newData = { ...siteTreeCountData };
        for (let i = 0; i < stats.results.length; i++) {
            newData[i + stats.offset] = {
                ...stats.results[i],
                key: stats.results[i].id
            };
        }
        setSiteTreeCountData(newData);
        setLoading(false);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const rows: any[] = []
            for (let i = 0; i < pageSize; i++) {
                if (i + page * pageSize >= total) break;
                const data = siteTreeCountData[i + page * pageSize]
                if (!data) {
                    getSites();
                    return;
                }
                rows.push(data);
            }

            setTableRows(rows);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [page, pageSize, total, siteTreeCountData])

    useEffect(() => {
        const handler = setTimeout(() => {
            getSites();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, orderBy, districts, talukas, villages, categories, serviceTypes])

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

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const filtersList = getFilters();
        const resp = await apiClient.getSitesStats(0, total, filtersList, orderBy);
        return resp.results;
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

    const getMaintenanceTypesString = (value: string) => {
        switch (value) {
            case 'DISTRIBUTION_ONLY':
                return 'Distribution Only';
            case 'PLANTATION_ONLY':
                return 'Plantation Only';
            case 'FULL_MAINTENANCE':
                return 'Full Maintenance';
            case 'WAITING':
                return 'Waiting';
            case 'CANCELLED':
                return 'Cancelled';
            case 'TBD':
                return 'TBD';
            default:
                return 'Unknown';
        }
    }

    const columns: any = [
        {
            title: 'Site Name',
            dataIndex: 'site_name',
            key: 'site_name',
            width: 300,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('site_name', filters, handleSetFilters),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 200,
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'category', filters, handleSetFilters, options: ['Public', 'Foundation', 'Unknown'] }),
        },
        {
            title: "Service Type",
            dataIndex: "maintenance_type",
            key: "maintenance_type",
            width: 250,
            render: getMaintenanceTypesString,
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'maintenance_type', filters, handleSetFilters, options: ['Distribution Only', 'Plantation Only', 'Full Maintenance', 'Waiting', 'Cancelled', 'TBD', 'Unknown'] })
        },
        {
            title: "Land Type",
            dataIndex: "land_type",
            key: "land_type",
            width: 200,
            render: (value: string) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'land_type', filters, handleSetFilters, options: ["Foundation", "Cremation", "Farm", "Roadside", "Temple", "Premises", "Gairan", "Forest", "School", 'Unknown'] })
        },
        {
            title: "Kml File",
            dataIndex: "kml_file_link",
            key: "kml_file_link",
            width: 100,
            render: (value: string) => value ? 'Yes' : 'No',
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
            width: 100,
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
            width: 120,
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                    Trees {getSortIcon('tree_count', orderBy.find((item) => item.column === 'tree_count')?.order)}
                </div>
            ),
            dataIndex: "tree_count",
            key: "Trees",
            align: 'right',
            width: 120,
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                    Shrubs {getSortIcon('shrub_count', orderBy.find((item) => item.column === 'shrub_count')?.order)}
                </div>
            ),
            dataIndex: "shrub_count",
            key: "Shrubs",
            align: 'right',
            width: 120,
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                    Herbs {getSortIcon('herb_count', orderBy.find((item) => item.column === 'herb_count')?.order)}
                </div>
            ),
            dataIndex: "herb_count",
            key: "Herbs",
            align: 'right',
            width: 120,
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
            width: 120,
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
            width: 120,
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
            width: 150,
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
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                    Giftable Inventory {getSortIcon('card_available', orderBy.find((item) => item.column === 'card_available')?.order)}
                </div>
            ),
            dataIndex: "card_available",
            key: "card_available",
            align: 'right',
            width: 150,
        },
    ]

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6">Site level stats</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={total}
                page={page}
                onPaginationChange={handlePageChange}
                onDownload={handleDownload}
                rowClassName={(record: any, index: number) => {
                    if (!record.category || !record.maintenance_type) return 'pending-item';
                    return '';
                }}
                tableName="Sites Inventory"
                footer
                onSelectionChanges={handleSelectionChanges}
                summary={(totalColumns: number) => {
                    if (totalColumns < 5) return undefined;
                    return TableSummary(tableRows, selectedRows, totalColumns)
                }}
            />
        </Box>
    )
}

export default SiteStats;