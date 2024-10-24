import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { Table } from "antd"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter"
import GeneralTable from "../../../components/GenTable"

interface SiteStatsProps {
    districts: string[]
    talukas: string[]
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const SiteStats: FC<SiteStatsProps> = ({ districts, talukas, villages, categories, serviceTypes }) => {

    const [siteTreeCountData, setSiteTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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
            newData[i + stats.offset] = stats.results[i];
        }
        setSiteTreeCountData(newData);
        setLoading(false);
    }

    useEffect(() => {
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
    }, [page, pageSize, total, siteTreeCountData])

    useEffect(() => {
        getSites();
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
                <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={ order === 'ASC' ? '#00b96b' : "grey"}/>
                <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={ order === 'DESC' ? '#00b96b' : "grey"}/>
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
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('site_name', filters, handleSetFilters),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'category', filters, handleSetFilters, options: ['Public', 'Foundation', 'Unknown'] }),
        },
        {
            title: "Service Type",
            dataIndex: "maintenance_type",
            key: "maintenance_type",
            render: getMaintenanceTypesString,
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'maintenance_type', filters, handleSetFilters, options: ['Distribution Only', 'Plantation Only', 'Full Maintenance', 'Waiting', 'Cancelled', 'TBD', 'Unknown'] })
        },
        {
            title: "Land Type",
            dataIndex: "land_type",
            key: "land_type",
            render: (value: string) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter<any>({ dataIndex: 'land_type', filters, handleSetFilters, options: ["Foundation", "Cremation", "Farm", "Roadside", "Temple", "Premises", "Gairan", "Forest", "School", 'Unknown'] })
        },
        {
            title: "Kml File",
            dataIndex: "kml_file_link",
            key: "kml_file_link",
            render: (value: string) => value ? 'Yes' : 'No',
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
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
                  Not Funded Assigned Trees {getSortIcon('unbooked_assigned', orderBy.find((item) => item.column === 'unbooked_assigned')?.order)}
                </div>
            ),
            dataIndex: "unbooked_assigned",
            key: "unbooked_assigned",
            align: 'right',
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  Not Funded and Not Assigned {getSortIcon('available', orderBy.find((item) => item.column === 'available')?.order)}
                </div>
            ),
            dataIndex: "available",
            key: "available",
            align: 'right',
        },
    ]

    return (
        <div>
            <Box>
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
                        if (!record.category || !record.maintenance_type ) return 'pending-item';
                        return ''; 
                    }}
                />
            </Box>
        </div>
    )
}

export default SiteStats;