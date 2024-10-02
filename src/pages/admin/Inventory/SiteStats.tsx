import { Table } from "antd"
import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { Box, Typography } from "@mui/material"
import DistrictStats from "./DistrictStats"
import TalukaStats from "./TalukaStats"
import VillageStats from "./VillageStats"

const getAggregatedData = (data: any[]) => {
    const aggStats = {
        'Public': {
            category: 'Public',
            capacity: 0,
            total: 0,
            booked: 0,
            assigned: 0,
            available: 0
        },
        'Foundation': {
            category: 'Foundation',
            capacity: 0,
            total: 0,
            booked: 0,
            assigned: 0,
            available: 0
        },
        'Overall': {
            category: 'Overall',
            capacity: 0,
            total: 0,
            booked: 0,
            assigned: 0,
            available: 0
        }

    }
    for (const item of data) {
        if (item.category === 'Foundation') {
            aggStats.Foundation.capacity += Math.floor(item.acres_area * 300)
            aggStats.Foundation.total += parseInt(item.trees_count || '0')
            aggStats.Foundation.booked += parseInt(item.mapped_trees_count || '0')
            aggStats.Foundation.assigned += parseInt(item.assigned_trees_count || '0')
            aggStats.Foundation.available += parseInt(item.available_trees_count || '0')
        } else {
            aggStats.Public.capacity += Math.floor(item.acres_area * 300)
            aggStats.Public.total += parseInt(item.trees_count || '0')
            aggStats.Public.booked += parseInt(item.mapped_trees_count || '0')
            aggStats.Public.assigned += parseInt(item.assigned_trees_count || '0')
            aggStats.Public.available += parseInt(item.available_trees_count || '0')
        }

        aggStats.Overall.capacity += Math.floor(item.acres_area * 300)
        aggStats.Overall.total += parseInt(item.trees_count || '0')
        aggStats.Overall.booked += parseInt(item.mapped_trees_count || '0')
        aggStats.Overall.assigned += parseInt(item.assigned_trees_count || '0')
        aggStats.Overall.available += parseInt(item.available_trees_count || '0')
    }

    return [aggStats.Foundation, aggStats.Public, aggStats.Overall]
}

const SiteStats: FC = () => {

    const [data, setData] = useState<any[]>([]);
    const [aggregatedData, setAggregatedData] = useState<any[]>([]);

    const getSitesData = async () => {
        const apiClient = new ApiClient();
        const stats = await apiClient.getSitesStats();
        setData(stats.results.map((item: any) => {
            return {
                ...item,
                total: parseInt(item.trees_count || '0'),
                booked: parseInt(item.mapped_trees_count || '0'),
                assigned: parseInt(item.assigned_trees_count || '0'),
                available: parseInt(item.available_trees_count || '0'),
                capacity: Math.floor(item.acres_area * 300)
            }
        }));

        const aggStats = getAggregatedData(stats.results);
        setAggregatedData(aggStats);
    }

    useEffect(() => {
        getSitesData();
    }, [])

    const commonDataColumn = [
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
        },
        {
            title: "Booked",
            dataIndex: "booked",
            key: "booked",
        },
        {
            title: "Assigned",
            dataIndex: "assigned",
            key: "assigned",
        },
        {
            title: "Available",
            dataIndex: "available",
            key: "available",
        },
    ]

    const aggregatedDataColumn = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown'
        },
        ...commonDataColumn
    ] 

    const dataColumn = [
        {
            title: "Site Name",
            dataIndex: "site_name",
            key: "site_name",
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
            render: (value: any) => value ? value : 'Unknown'
        },
        ...aggregatedDataColumn
    ]

    return (
        <div>
            <Box>
                <Typography variant="h6">Overall site stats</Typography>
                <Table 
                    columns={aggregatedDataColumn}
                    dataSource={aggregatedData}
                />
            </Box>
            <DistrictStats />
            <TalukaStats />
            <VillageStats />

            <Box>
                <Typography variant="h6">Site level stats</Typography>
                <Table 
                    columns={dataColumn}
                    dataSource={data}
                />
            </Box>
        </div>
    )
}

export default SiteStats;