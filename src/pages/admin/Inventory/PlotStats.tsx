import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { Box, Button, Input, TextField, Typography } from "@mui/material"
import { Table } from "antd"
import getColumnSearchProps from "../../../components/Filter"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"

interface PlotStatsProps {}

const PlotStats: FC<PlotStatsProps> = ({  }) => {

    const [plotTreeCountData, setPlotTreeCountData] = useState<PaginatedResponse<any>>({ total: 0, offset: 0, results: [] });

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const getPlotStats = async () => {
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);

        const stats = await apiClient.getPlotAggregations(0, 10, filtersData, orderBy);
        if (stats.offset === 0) {
            setPlotTreeCountData(stats);
        }
    }

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

    const handleSearch = async () => {
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);
        const start = startDate ? new Date(startDate).toISOString().slice(0, 10) + 'T00:00:00Z' : undefined;
        const end = endDate ? new Date(endDate).toISOString().slice(0, 10) + 'T23:59:59Z' : undefined;

        if (startDate && endDate) {
            filtersData.push(
                { columnField: "created_at", operatorValue: "between", value: [start, end] });
        } else if (startDate) {
            filtersData.push(
                { columnField: "created_at", operatorValue: "greaterThan", value: start });
        } else if (endDate) {
            filtersData.push(
                { columnField: "created_at", operatorValue: "lessThan", value: end });
        }

        const stats = await apiClient.getPlotAggregations(0, 10, filtersData, orderBy);
        if (stats.offset === 0) {
            setPlotTreeCountData(stats);
        }
    }

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);

        getPlotStats();
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
                  Available {getSortIcon('available', orderBy.find((item) => item.column === 'available')?.order)}
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
                <Typography variant="h6">Plot level stats</Typography>
                <Box style={{ display: "flex", alignItems: "center", maxWidth: "100%" }}>
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
                <Table
                    columns={columns}
                    dataSource={plotTreeCountData.results}
                    pagination={{
                        total: plotTreeCountData.total,
                    }}
                />
            </Box>
        </div>
    )
}

export default PlotStats;