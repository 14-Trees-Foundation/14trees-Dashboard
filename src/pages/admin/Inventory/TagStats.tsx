import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import { Box, Typography } from "@mui/material"
import { Table } from "antd"
import { getColumnSelectedItemFilter } from "../../../components/Filter"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"

interface TagStatsProps {}

const TagStats: FC<TagStatsProps> = ({  }) => {

    const [tagTreeCountData, setTagTreeCountData] = useState<PaginatedResponse<any>>({ total: 0, offset: 0, results: [] });

    const [tags, setTags] = useState<string[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])

    const getTags = async () => {
        const apiClient = new ApiClient();
        const resp = await apiClient.getPlotTags(0, 50);
        setTags(resp.results);
    }

    const getTagStats = async () => {
        const apiClient = new ApiClient();
        const tags = filters['tag']?.value ?? [];

        const stats = await apiClient.getTreeCountsForTags(0, 10, tags, orderBy);
        if (stats.offset === 0) {
            setTagTreeCountData(stats);
        }
    }

    useEffect(() => {
        getTagStats();
        getTags();
    }, [filters, orderBy])

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
                <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={ order === 'ASC' ? '#00b96b' : "grey"}/>
                <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={ order === 'DESC' ? '#00b96b' : "grey"}/>
            </div>
        )
    }

    const columns: any[] = [
        {
            title: "Tag",
            dataIndex: 'tag',
            key: 'tag',
            render: (value: any) => value ? value : 'Unknown',
            ...getColumnSelectedItemFilter({dataIndex: 'tag', filters, handleSetFilters, options: tags}),
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
                <Typography variant="h6">Tag level stats</Typography>
                <Table
                    columns={columns}
                    dataSource={tagTreeCountData.results}
                    pagination={{
                        total: tagTreeCountData.total,
                    }}
                />
            </Box>
        </div>
    )
}

export default TagStats;