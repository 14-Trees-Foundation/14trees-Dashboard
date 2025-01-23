import { useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { Order } from "../../../types/common";
import { Box, Typography } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import { Segmented, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import CSRTreesCards from "./CSRTreeCards";
import { GridView, TableView } from "@mui/icons-material";

interface CSRTreesProps {
    groupId?: number
}

const CSRTrees: React.FC<CSRTreesProps> = ({ groupId }) => {

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<Tree[]>([]);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [totalRecords, setTotalRecords] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [viewType, setViewType] = useState('Table');

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
        setTrees({});
        setTotalRecords(10);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    useEffect(() => {
        setPage(0);
        if (groupId) {
            setFilters(prev => (
                {
                    ...prev,
                    "mapped_to_group": {
                        columnField: "mapped_to_group",
                        operatorValue: "equals",
                        value: groupId,
                    }
                }
            ))
        } else {
            setFilters(prev => {
                const newFilters = { ...prev }
                Reflect.deleteProperty(newFilters, "mapped_to_group");

                return newFilters
            })
        }
        setTrees({});
        setTotalRecords(10);

    }, [groupId]);

    const getTrees = async (offset: number, limit: number, filters: any[]) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getTrees(offset, limit, filters);
            
            setTrees(prev => {
                const treesData = {...prev};
                for (let i = 0; i < treesResp.results.length; i++) {
                    treesData[treesResp.offset + i] = treesResp.results[i];
                }

                return treesData;
            })
            setTotalRecords(Number(treesResp.total));

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    const getFiltersData = (filters: any) => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters)));
        filtersData.push({
            columnField: 'mapped_to_group',
            operatorValue: 'isNotEmpty',
        })

        return filtersData;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtersData = getFiltersData(filters);
            const currentPageTrees: Tree[] = [];
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    getTrees(page*pageSize, pageSize, filtersData);
                    return;
                }

                currentPageTrees.push(trees[i]);
            }
            setTableRows(currentPageTrees);
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, filters, totalRecords])

    const handleDownload = async () => {
        setLoading(true);
        const filtersData = getFiltersData(filters);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getTrees(0, totalRecords, filtersData);
            
            setTrees(prev => {
                const treesData = {...prev};
                for (let i = 0; i < treesResp.results.length; i++) {
                    treesData[treesResp.offset + i] = treesResp.results[i];
                }

                return treesData;
            })
            setTotalRecords(Number(treesResp.total));
            setLoading(false);
            return treesResp.results;
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
            return [];
        }
    }

    const columns: TableColumnsType<Tree> = [
        {
            dataIndex: "srNo",
            key: "srNo",
            title: "Sr. No.",
            width: 100,
            align: 'center',
            hidden: true,
            render: (value, record, index) => `${index + 1 + page * pageSize}.`,
        },
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            width: 150,
            align: 'center',
            ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            width: 250,
            align: 'center',
            ...getColumnSearchProps('plant_type', filters, handleSetFilters)
        },
        {
            dataIndex: "habit",
            key: "habit",
            title: "habitat",
            width: 250,
            align: 'center',
            hidden: true,
            ...getColumnSelectedItemFilter({ dataIndex: 'habit', filters, handleSetFilters, options: ['Tree', 'Herb', 'Shrub', 'Climber'] })
        },
        {
            dataIndex: "plot",
            key: "plot",
            title: "Plot",
            width: 350,
            align: 'center',
            render: (value, record, index) => record?.plot,
            ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        {
            dataIndex: "site_name",
            key: "Site name",
            title: "Site name",
            width: 350,
            align: 'center',
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
        {
            dataIndex: "mapped_user_name",
            key: "mapped_user_name",
            title: "Reserved for (Individual)",
            width: 250,
            align: 'center',
            hidden: true,
            ...getColumnSearchProps('mapped_user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "mapped_group_name",
            key: "mapped_group_name",
            title: "Reserved for (Group)",
            width: 250,
            align: 'center',
            hidden: true,
            ...getColumnSearchProps('mapped_group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "sponsor_user_name",
            key: "sponsor_user_name",
            title: "Sponsored By (Individual)",
            width: 250,
            align: 'center',
            ...getColumnSearchProps('sponsor_user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "sponsor_group_name",
            key: "sponsor_group_name",
            title: "Sponsored By (Group)",
            width: 250,
            align: 'center',
            ...getColumnSearchProps('sponsor_group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "assigned_to_name",
            key: "assigned_to_name",
            title: "Assigned To",
            width: 250,
            align: 'center',
            ...getColumnSearchProps('assigned_to_name', filters, handleSetFilters)
        },
    ];

    return (
        <Box mt={5}>
            <Box mb={1} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" ml={1} mr={2}>Tree Sponsorship Details</Typography>
                <Segmented
                    value={viewType}
                    onChange={(value) => {
                        if (value === 'Table') setPage(0);
                        else setPage(Math.ceil(Object.values(trees).length/pageSize) - 1);

                        setViewType(value);
                    }}
                    options={[
                        { value: 'Table', label: 'Table' },
                        { value: 'Grid', label: 'Cards' },
                    ]}
                />
            </Box>
            <Typography variant="subtitle1" ml={1} mb={1}>View a detailed breakdown of the trees you’ve sponsored.</Typography>
            {viewType === 'Table' && <GeneralTable
                loading={loading}
                columns={columns}
                rows={tableRows}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}              
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                tableName="Tree Sponsorship Details"
                footer
            />}
            {viewType === 'Grid' && <CSRTreesCards 
                trees={Object.values(trees)}
                loading={loading}
                hasMore={Object.values(trees).length < totalRecords}
                loadMoreTrees={() => { setPage(page + 1); }}
            />}
        </Box>
    );
}

export default CSRTrees;