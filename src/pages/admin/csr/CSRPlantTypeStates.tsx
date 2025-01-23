import { useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { plantTypeHabitList } from "../plantType/habitList";

const TableSummary = (data: any[], selectedKeys: any[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={1} colSpan={2}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={2} colSpan={1}>{calculateSum(data.filter((item) => selectedKeys.includes(item.key)).map((item) => item.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={3} colSpan={totalColumns - 2}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface CSRPlantTypeStatsProps {
    groupId?: number
}

const CSRPlantTypeStats: React.FC<CSRPlantTypeStatsProps> = ({ groupId }) => {

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [plantTypes, setPlantTypes] = useState<Record<number, any>>({});
    const [totalRecords, setTotalRecords] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
        setPlantTypes({});
        setTotalRecords(10);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleSelectionChanges = (keys: any[]) => {
        setSelectedRows(keys);
    }

    useEffect(() => {
        setPage(0);
        setPlantTypes({});
        setTotalRecords(10);
    }, [groupId])

    const getCSRPlantTypeStats = async (offset: number, limit: number, filters: any[], group_id?: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const plantTypesResp = await apiClient.getPlantTypeStatsForCorporate(offset, limit, group_id, filters);

            setPlantTypes(prev => {
                const plantTypesData = { ...prev };
                for (let i = 0; i < plantTypesResp.results.length; i++) {
                    plantTypesData[plantTypesResp.offset + i] = {...plantTypesResp.results[i], key: plantTypesResp.results[i].id }
                }

                return plantTypesData;
            })
            setTotalRecords(Number(plantTypesResp.total));

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    const getFiltersData = (filters: any) => {
        let filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        
        const accessibilityIdx = filtersData.findIndex(item => item.columnField === 'accessibility_status');
        if (accessibilityIdx > -1) {
            filtersData[accessibilityIdx].value = filtersData[accessibilityIdx].value.map((item: string) => {
            switch (item) {
                case "Accessible":
                return "accessible";
                case "Inaccessible":
                return "inaccessible";
                case "Moderately Accessible":
                return "moderately_accessible";
                default:
                return null;
            }
            })
        }

        return filtersData;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtersData = getFiltersData(filters);
            const currentPageTrees: Tree[] = [];
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!plantTypes[i]) {
                    getCSRPlantTypeStats(page * pageSize, pageSize, filtersData, groupId);
                    return;
                }

                currentPageTrees.push(plantTypes[i]);
            }
            setTableRows(currentPageTrees);
        }, 300);

        return () => { clearTimeout(handler); }
    }, [groupId, plantTypes, page, pageSize, filters, totalRecords])

    const handleDownload = async () => {
        setLoading(true);
        const filtersData = getFiltersData(filters);
        try {
            const apiClient = new ApiClient();
            const plantTypesResp = await apiClient.getPlantTypeStatsForCorporate(0, totalRecords, groupId, filtersData);

            setPlantTypes(prev => {
                const plantTypesData = { ...prev };
                for (let i = 0; i < plantTypesResp.results.length; i++) {
                    plantTypesData[plantTypesResp.offset + i] = {...plantTypesResp.results[i], key: plantTypesResp.results[i].id }
                }

                return plantTypesData;
            })
            setTotalRecords(Number(plantTypesResp.total));
            setLoading(false);
            return plantTypesResp.results;
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
            return [];
        }
    }

    const columns: TableColumnsType<any> = [
        {
            dataIndex: "name",
            key: "Plant Type name",
            title: "Plant Type name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "booked",
            key: "Sponsored Trees Count",
            title: "Sponsored Trees Count",
            align: "right",
            width: 150,
        },
        {
            dataIndex: "scientific_name",
            key: "Scientific name",
            title: "Scientific name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
        {
            dataIndex: "known_as",
            key: "known_as",
            title: "Known As",
            width: 250,
            align: "center",
            ...getColumnSearchProps('known_as', filters, handleSetFilters)
        },
        {
            dataIndex: "category",
            key: "category",
            title: "Category",
            width: 250,
            align: "center",
            hidden: true,
            ...getColumnSelectedItemFilter({ dataIndex: 'category', filters, handleSetFilters, options: ['Native', 'Non Native', 'Cultivated'] })
        },
        {
            dataIndex: "habit",
            key: "habit",
            title: "Habit",
            width: 200,
            align: "center",
            hidden: true,
            ...getColumnSelectedItemFilter({ dataIndex: 'habit', filters, handleSetFilters, options: plantTypeHabitList })
        },
    ];

    return (
        <Box mt={5}>
            <Typography variant="h4" ml={1}>Biodiversity Supported</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>Discover the variety of plant species supported by your sponsorship.</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                tableName="Biodiversity Supported"
                onSelectionChanges={handleSelectionChanges}
                    summary={(totalColumns: number) => {
                        if (totalColumns < 2) return undefined;
                        return TableSummary(tableRows, selectedRows, totalColumns)
                    }}
                footer
            />
        </Box>
    );
}

export default CSRPlantTypeStats;