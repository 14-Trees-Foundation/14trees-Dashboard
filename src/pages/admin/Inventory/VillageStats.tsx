import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import GeneralStats from "./GeneralStats"


const VillageStats: FC = () => {

    const [villageTreeCountData, setVillageTreeCountData] = useState<PaginatedResponse<any>>({ total: 0, offset: 0, results: [] });

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([])

    const getVillages = async () => {
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })
        const stats = await apiClient.getTreesCountForVillages(0, 10, filtersData, orderBy);
        
        if (stats.offset === 0) {
            setVillageTreeCountData(stats);
        }
    }

    useEffect(() => {
        getVillages();
    }, [filters, orderBy])

    return (
        <GeneralStats 
            field="village"
            treesCountData={villageTreeCountData}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
            filters={filters}
            onFiltersChange={handleSetFilters}
        />
    )
}

export default VillageStats;