import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import { PaginatedResponse } from "../../../types/pagination"
import GeneralStats from "./GeneralStats"

interface VillageStatsProps {
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const VillageStats: FC<VillageStatsProps> = ({ villages, categories, serviceTypes }) => {

    const [villageTreeCountData, setVillageTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{column: string, order: 'ASC' | 'DESC'}[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const getVillages = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = Object.values(filters);
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })

        if (categories.length !== 0 && !filters['category']) {
            filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        }

        if (villages.length !== 0) {
            filtersData.push({ columnField: 'village', operatorValue: 'isAnyOf', value: villages });
        }
        if (serviceTypes.length !== 0) {
            filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        }
        const stats = await apiClient.getTreesCountForVillages(page * pageSize, pageSize, filtersData, orderBy);
        
        setTotal(Number(stats.total));
        const newData = { ...villageTreeCountData };
        for (let i = 0; i < stats.results.length; i++) {
            newData[i + stats.offset] = stats.results[i];
        }
        setVillageTreeCountData(newData);
        setLoading(false);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    useEffect(() => {
        const rows: any[] = []
        for (let i = 0; i < pageSize; i++) {
            if (i + page * pageSize >= total) break;
            const data = villageTreeCountData[i + page * pageSize]
            if (!data) {
                getVillages();
                return;
            }
            rows.push(data);
        }

        setTableRows(rows);
    }, [page, pageSize, total, villageTreeCountData])

    useEffect(() => {
        getVillages();
    }, [filters, orderBy, villages, categories, serviceTypes])

    return (
        <GeneralStats 
            field="village"
            loading={loading}
            total={total}
            pageSize={pageSize}
            tableRows={tableRows}
            onPageChange={handlePageChange}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
            filters={filters}
            onFiltersChange={handleSetFilters}
        />
    )
}

export default VillageStats;