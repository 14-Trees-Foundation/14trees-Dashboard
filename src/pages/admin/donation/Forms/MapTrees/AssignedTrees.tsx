import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Tree } from "../../../../../types/tree";
import { GridFilterItem } from "@mui/x-data-grid";
import { TableColumnsType } from "antd";
import getColumnSearchProps from "../../../../../components/Filter";
import ApiClient from "../../../../../api/apiClient/apiClient";
import GeneralTable from "../../../../../components/GenTable";

interface Props {
    selectedTrees: number[]
    onSelect: (tree: Tree) => void
    disableSelect?: boolean
    remainingCount: number
}

const AssignedTrees: React.FC<Props> = ({
    selectedTrees,
    onSelect,
    disableSelect = false,
    remainingCount
}) => {
    const [loading, setLoading] = useState(false);
    const [treesData, setTreesData] = useState<Record<number, Tree>>({});
    const [totalRecords, setTotalRecords] = useState(10);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getTrees = async (offset: number, limit: number) => {
        const apiClient = new ApiClient();
        setLoading(true);

        const filtersData = Object.values(filters);
        filtersData.push(...[
            { columnField: 'donation_id', operatorValue: 'isEmpty', value: null },
            { columnField: 'assigned_to', operatorValue: 'isNotEmpty', value: null },
        ]);

        const treesResp = await apiClient.getTrees(offset, limit, filtersData);
        setTotalRecords(Number(treesResp.total));

        setTreesData(prev => {
            const newTrees = { ...prev };
            for (let i = 0; i < treesResp.results.length; i++) {
                newTrees[treesResp.offset + i] = treesResp.results[i];
            }
            return newTrees;
        });
        setLoading(false);
    }

    useEffect(() => {
        setTreesData({});
        setPage(0);
    }, [filters]);

    useEffect(() => {
        const handler = setTimeout(() => {

            if (loading) return;

            const records: any[] = [];
            const maxLength = Math.min((page + 1) * pageSize, totalRecords);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(treesData, i)) {
                    const record = treesData[i];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getTrees(page * pageSize, pageSize);
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [loading, pageSize, page, treesData, totalRecords]);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const columns: TableColumnsType<Tree> = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            width: 150,
            align: 'center',
            ...getColumnSearchProps('sapling_id', filters, handleSetFilters, true)
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
            dataIndex: "plot",
            key: "plot",
            title: "Plot",
            width: 350,
            align: 'center',
            render: (value, record) => record?.plot || 'N/A',
            ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        // {
        //     dataIndex: "sponsor_user_name",
        //     key: "sponsor_user_name",
        //     title: "Sponsored By (Individual)",
        //     width: 250,
        //     align: 'center',
        //     ...getColumnSearchProps('sponsor_user_name', filters, handleSetFilters)
        // },
        // {
        //     dataIndex: "sponsor_group_name",
        //     key: "sponsor_group_name",
        //     title: "Sponsored By (Group)",
        //     width: 250,
        //     align: 'center',
        //     ...getColumnSearchProps('sponsor_group_name', filters, handleSetFilters)
        // },
        {
            dataIndex: "assigned_to_name",
            key: "assigned_to_name",
            title: "Assigned To",
            width: 250,
            align: 'center',
            ...getColumnSearchProps('assigned_to_name', filters, handleSetFilters)
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 300,
            align: "center",
            render: (value, record) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        disabled={selectedTrees.includes(record.id) || disableSelect}
                        style={{ margin: "0 5px", textTransform: 'none' }}
                        onClick={() => onSelect(record)}
                    >
                        Select
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Box>
            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={async () => Object.values(treesData)}
                tableName="Trees"
            />
        </Box>
    )
}

export default AssignedTrees;