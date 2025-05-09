import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { GridFilterItem } from "@mui/x-data-grid"
import GeneralStats from "./GeneralStats"

interface DistrictStatsProps {
    habits: string[]
    landTypes: string[]
    districts: string[]
    talukas: string[]
    villages: string[]
    categories: (string | null)[]
    serviceTypes: (string | null)[]
}

const DistrictStats: FC<DistrictStatsProps> = ({ habits, landTypes, districts, talukas, villages, categories, serviceTypes }) => {

    const [districtTreeCountData, setDistrictTreeCountData] = useState<Record<number, any>>({});
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setFilters(filters);
    }
    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const getFilters = () => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'category' && item.value.includes('Unknown')) {
                item.value = (item.value as string[]).filter(item => item !== 'Unknown');
                item.value.push(null);
            }
        })

        if (categories.length !== 0 && !filters['category']) filtersData.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        if (serviceTypes.length !== 0) filtersData.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        if (talukas.length !== 0) filtersData.push({ columnField: 'taluka', operatorValue: 'isAnyOf', value: talukas });
        if (districts.length !== 0) filtersData.push({ columnField: 'district', operatorValue: 'isAnyOf', value: districts });
        if (villages.length !== 0) filtersData.push({ columnField: 'village', operatorValue: 'isAnyOf', value: villages });
        if (habits.length !== 0) filtersData.push({ columnField: 'habit', operatorValue: 'isAnyOf', value: habits });
        if (landTypes.length !== 0) filtersData.push({ columnField: 'land_type', operatorValue: 'isAnyOf', value: landTypes });

        return filtersData;
    }

    const getDistricts = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        const filtersData = getFilters();
        const stats = await apiClient.getTreesCountForDistricts(page * pageSize, pageSize, filtersData, orderBy);

        setTotal(Number(stats.total));
        const newData = { ...districtTreeCountData };
        for (let i = 0; i < stats.results.length; i++) {
            newData[i + stats.offset] = newData[i + stats.offset] = {
                ...stats.results[i],
                key: `${stats.results[i].district}_${stats.results[i].category}`
            }
        }
        setDistrictTreeCountData(newData);
        setLoading(false);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const rows: any[] = []
            for (let i = 0; i < pageSize; i++) {
                if (i + page * pageSize >= total) break;
                const data = districtTreeCountData[i + page * pageSize]
                if (!data) {
                    getDistricts();
                    return;
                }
                rows.push(data);
            }

            setTableRows(rows);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [page, pageSize, total, districtTreeCountData])

    useEffect(() => {
        const handler = setTimeout(() => {
            getDistricts();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, orderBy, villages, talukas, districts, categories, serviceTypes])

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const filtersList = getFilters();
        const resp = await apiClient.getTreesCountForDistricts(0, total, filtersList, orderBy);
        return resp.results;
    }

    return (
        <GeneralStats
            field="district"
            loading={loading}
            total={total}
            page={page}
            pageSize={pageSize}
            tableRows={tableRows}
            onPageChange={handlePageChange}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
            filters={filters}
            onFiltersChange={handleSetFilters}
            onDownload={handleDownload}
        />
    )
}

export default DistrictStats;