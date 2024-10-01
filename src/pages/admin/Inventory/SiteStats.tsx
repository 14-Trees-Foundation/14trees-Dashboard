import { Table } from "antd"
import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { Box, Typography } from "@mui/material"

const getData = (data: any[], key: string) => {
    const dataMap: Record<string, any> = {}
    const dataList: string[] = []

    data.forEach((item: any) => {
        if (!item[key]) return;

        if (!dataMap[item[key] + item.category]) {
            dataMap[item[key] + item.category] = {
                [key]: item[key],
                category: item.category,
                capacity: 0,
                total: 0,
                booked: 0,
                assigned: 0,
                available: 0
            }

            dataList.push(item[key])
        }

        dataMap[item[key] + item.category].total += parseInt(item.trees_count || '0')
        dataMap[item[key] + item.category].booked += parseInt(item.mapped_trees_count || '0')
        dataMap[item[key] + item.category].assigned += parseInt(item.assigned_trees_count || '0')
        dataMap[item[key] + item.category].available += parseInt(item.available_trees_count || '0')
        dataMap[item[key] + item.category].capacity += Math.floor(item.acres_area * 300)
    })

    return {
        dataList,
        data: Object.values(dataMap)
    }
}

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

    const [data, setData] = useState<any[]>([])
    const [aggregatedData, setAggregatedData] = useState<any[]>([])
    const [districtData, setDistrictData] = useState<any[]>([])
    const [talukaData, setTalukaData] = useState<any[]>([])
    const [villageData, setVillageData] = useState<any[]>([])

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

        const districtData = getData(stats.results, 'district');
        setDistrictData(districtData.data);

        const talukaData = getData(stats.results, 'taluka');
        setTalukaData(talukaData.data);

        const villageData = getData(stats.results, 'village');
        setVillageData(villageData.data);
    }

    useEffect(() => {
        getSitesData();
    }, [])

    const commonDataColumn = [
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
        },
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
        },
        ...commonDataColumn
    ] 

    const dataColumn = [
        {
            title: "Site Name",
            dataIndex: "site_name",
            key: "site_name",
        },
        ...commonDataColumn
    ]

    const districtDataColumn = [
        {
            title: "District",
            dataIndex: "district",
            key: "district",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        ...commonDataColumn
    ]

    const talukaDataColumn = [
        {
            title: "Taluka",
            dataIndex: "taluka",
            key: "taluka",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        ...commonDataColumn
    ]

    const villageDataColumn = [
        {
            title: "Village",
            dataIndex: "village",
            key: "village",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        ...commonDataColumn
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
            <Box>
                <Typography variant="h6">Top 5 Foundation sites based on availability</Typography>
                <Table 
                    columns={dataColumn}
                    dataSource={data.filter((item: any) => item.category === 'Foundation').sort((a: any, b: any) => b.available - a.available).slice(0, 5)}
                />
            </Box>
            <Box>
                <Typography variant="h6">Top 5 Public sites based on availability</Typography>
                <Table 
                    columns={dataColumn}
                    dataSource={data.filter((item: any) => item.category === 'Public').sort((a: any, b: any) => b.available - a.available).slice(0, 5)}
                />
            </Box>
            <Box>
                <Typography variant="h6">District level stats</Typography>
                <Table 
                    columns={districtDataColumn}
                    dataSource={districtData}
                />
            </Box>
            <Box>
                <Typography variant="h6">Taluka level stats</Typography>
                <Table 
                    columns={talukaDataColumn}
                    dataSource={talukaData}
                />
            </Box>
            <Box>
                <Typography variant="h6">Village level stats</Typography>
                <Table 
                    columns={villageDataColumn}
                    dataSource={villageData}
                />
            </Box>
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