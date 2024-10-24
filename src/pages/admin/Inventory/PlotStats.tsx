import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { Box, Button, TextField, Typography } from "@mui/material"
import getColumnSearchProps from "../../../components/Filter"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import GeneralTable from "../../../components/GenTable"

interface PlotStatsProps {}

const PlotStats: FC<PlotStatsProps> = ({  }) => {

    const [plotsTreeCountData, setPlotsTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const getPlotStats = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);

        const stats = await apiClient.getPlotAggregations(page * pageSize, pageSize, filtersData, orderBy);
        
        setTotal(Number(stats.total));
        const newData = { ...plotsTreeCountData };
        for (let i = 0; i < stats.results.length; i++) {
            newData[i + stats.offset] = stats.results[i];
        }

        setPlotsTreeCountData(newData);
        setLoading(false);
    }

    useEffect(() => {
        const rows: any[] = []
        for (let i = 0; i < pageSize; i++) {
            if (i + page * pageSize >= total) break;
            const data = plotsTreeCountData[i + page * pageSize]
            if (!data) {
                getPlotStats();
                return;
            }
            rows.push(data);
        }

        setTableRows(rows);
    }, [page, pageSize, total, plotsTreeCountData])

    useEffect(() => {
        getPlotStats();
    }, [filters, orderBy])

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];

        const updateOrder = (sorter: { field: string, order: 'ASC' | 'DESC' }) => {
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
        const filtersList = Object.values(filters)
        const resp = await apiClient.getPlotAggregations(0, total, filtersList, orderBy);
        return resp.results;
    }

    const handleSearch = async () => {
        const start = startDate ? new Date(startDate).toISOString().slice(0, 10) + 'T00:00:00Z' : undefined;
        const end = endDate ? new Date(endDate).toISOString().slice(0, 10) + 'T23:59:59Z' : undefined;

        let newFilter: any = null
        if (startDate && endDate) newFilter = { columnField: "created_at", operatorValue: "between", value: [start, end] }
        else if (startDate) newFilter = { columnField: "created_at", operatorValue: "greaterThan", value: start }
        else if (endDate) newFilter  = { columnField: "created_at", operatorValue: "lessThan", value: end }

        if (newFilter) {
            setFilters(prev => {
                return {
                    ...prev,
                    'created_at': newFilter
                }
            })
        } else {
            setFilters(prev => {
                const newFilters = { ...prev }
                if (newFilters['created_at']) Reflect.deleteProperty(newFilters, 'created_at');
                return newFilters
            })
        }
    }

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setFilters(prev => {
            const newFilters = { ...prev }
            if (newFilters['created_at']) Reflect.deleteProperty(newFilters, 'created_at');
            return newFilters
        })
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

    const columns: any[] = [
        {
            title: "Plot Name",
            dataIndex: 'name',
            key: 'name',
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSearchProps('name', filters, handleSetFilters),
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
                <Typography variant="h6">Time based stats</Typography>
                <Typography variant='body1' marginLeft={1}>Select time range to see tree plantation progress at plot level</Typography>
                <Box style={{ display: "flex", alignItems: "center", maxWidth: "100%", marginTop: 10 }}>
                    <TextField
                        name="start_date" 
                        label="Start Date" 
                        type="date" 
                        value={startDate ? startDate.toISOString().substring(0, 10): ''} 
                        onChange={(e: any) => setStartDate(new Date(e.target.value))} 
                        InputLabelProps={{ shrink: true }} 
                        style={{ margin: "5px 10px" }}
                        size="small"
                    />
                    <TextField
                        name="end_date" 
                        label="End Date" 
                        type="date" 
                        value={endDate ? endDate.toISOString().substring(0, 10): ''} 
                        onChange={(e: any) => setEndDate(new Date(e.target.value))} 
                        InputLabelProps={{ shrink: true }}
                        style={{ margin: "5px 10px" }}
                        size="small"
                    />
                    <Button 
                        variant="contained"
                        color="success"
                        style={{ marginLeft: "10px", textTransform: "none" }}
                        onClick={handleSearch}
                        size="medium"
                    >Apply</Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleReset}
                        style={{ marginLeft: "10px", textTransform: "none" }}
                        size="medium"
                    >Reset</Button>
                </Box>
                <GeneralTable 
                    loading={loading}
                    columns={columns}
                    rows={tableRows}
                    totalRecords={total}
                    page={page}
                    onPaginationChange={handlePageChange}
                    onDownload={handleDownload}
                />
            </Box>
        </div>
    )
}

export default PlotStats;