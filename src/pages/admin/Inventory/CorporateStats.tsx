import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { Table } from "antd"
import getColumnSearchProps from "../../../components/Filter"
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import { Group } from "../../../types/Group"
import { AutocompleteWithPagination } from "../../../components/AutoComplete"
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks"
import { bindActionCreators } from "@reduxjs/toolkit"
import * as groupActionCreators from "../../../redux/actions/groupActions";

interface CorporateStatsProps { }

const CorporateStats: FC<CorporateStatsProps> = ({ }) => {

    const [data, setData] = useState<any[]>([]);
    const [siteData, setSiteData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);

    const [groupPage, setGroupPage] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupNameInput, setGroupNameInput] = useState("");
    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    useEffect(() => {
        getGroupsData();
    }, [groupPage, groupNameInput]);

    const getGroupsData = async () => {
        const groupNameFilter = {
            columnField: "name",
            value: groupNameInput,
            operatorValue: "contains",
        };

        getGroups(groupPage * 10, 10, [groupNameFilter]);
    };

    let groupsList: Group[] = [];
    const groupData = useAppSelector((state) => state.groupsData);

    if (groupData) {
        groupsList = Object.values(groupData.groups);
        groupsList = groupsList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const getCorporateStats = async (group: Group) => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);

        const stats: any[] = await apiClient.getTreeCountForCorporate(group.id);

        const siteData: Record<number, any> = {};
        stats.forEach((item) => {
            if (!siteData[item.siteId]) siteData[item.siteId] = { ...item };
            else {
                siteData[item.siteId].total += item.total;
                siteData[item.siteId].booked += item.booked;
                siteData[item.siteId].assigned += item.assigned;
                siteData[item.siteId].available += item.available;
            }
        })

        setSiteData(Object.values(siteData));
        setTotal(stats.length);
        setData(stats)
        setLoading(false);
    }

    useEffect(() => {
        if (selectedGroup) getCorporateStats(selectedGroup);
    }, [selectedGroup])

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

    const columns: any[] = [
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


    const plotColumns: any[] = [
        {
            title: "Plot",
            dataIndex: 'plot_name',
            key: 'plot_name',
            ...getColumnSearchProps('plot_name', filters, handleSetFilters),
        },
        ...columns
    ]

    const siteColumns: any[] = [
        {
            title: "Site",
            dataIndex: 'site_name',
            key: 'site_name',
            ...getColumnSearchProps('site_name', filters, handleSetFilters),
        },
        ...columns
    ]

    return (
        <div>
            <Box>
                <Typography variant="h6">Corporate level stats</Typography>
                <AutocompleteWithPagination
                    label="Select a Group"
                    options={groupsList}
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(event, newValue) => {
                        setSelectedGroup(newValue);
                    }}
                    onInputChange={(event) => {
                        const { value } = event.target;
                        setGroupPage(0);
                        setGroupNameInput(value);
                    }}
                    setPage={setGroupPage}
                    fullWidth
                    size="small"
                    value={selectedGroup}
                />
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Table
                        columns={plotColumns}
                        loading={loading}
                        dataSource={data}
                    />
                    <Table
                        columns={siteColumns}
                        loading={loading}
                        dataSource={siteData}
                    />
                </Box>
            </Box>
        </div>
    )
}

export default CorporateStats;