import { Table } from "antd"
import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { Box, Typography } from "@mui/material"
import DistrictStats from "./DistrictStats"
import TalukaStats from "./TalukaStats"
import VillageStats from "./VillageStats"
import SiteStats from "./SiteStats"

const InventoryStats: FC = () => {

    const [aggregatedData, setAggregatedData] = useState<any[]>([]);

    const getTreesCountForCategories = async () => {
        const apiClient = new ApiClient();
        const stats = await apiClient.getTreesCountForPlotCategories();
        
        const overall = {
            category: 'Overall',
            total: 0,
            booked: 0,
            assigned: 0,
            available: 0
        }

        for (const item of stats.results) {
            overall.total += parseInt(item.total || '0')
            overall.booked += parseInt(item.booked || '0')
            overall.assigned += parseInt(item.assigned || '0')
            overall.available += parseInt(item.available || '0')
        }

        const finalList: any[] = [];
        const item = stats.results.find((item: any) => item.category === 'Public');
        if (item) finalList.push(item)

        const item2 = stats.results.find((item: any) => item.category === 'Foundation');
        if (item2) finalList.push(item2)

        const item3 = stats.results.find((item: any) => item.category === null);
        if (item3) finalList.push(item3)

        setAggregatedData([...finalList, overall]);
    }

    useEffect(() => {
        getTreesCountForCategories();
    }, [])

    const commonDataColumn = [
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: 'right',
        },
        {
            title: "Booked",
            dataIndex: "booked",
            key: "booked",
            align: 'right',
        },
        {
            title: "Assigned",
            dataIndex: "assigned",
            key: "assigned",
            align: 'right',
        },
        {
            title: "Available",
            dataIndex: "available",
            key: "available",
            align: 'right',
        },
    ]

    const aggregatedDataColumn: any = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown'
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
            <DistrictStats />
            <TalukaStats />
            <VillageStats />
            <SiteStats />
        </div>
    )
}

export default InventoryStats;