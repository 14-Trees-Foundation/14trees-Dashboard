import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter"
import { useEffect, useState, useRef } from "react"
import { GridFilterItem } from "@mui/x-data-grid"
import ApiClient from "../../../../api/apiClient/apiClient"
import { toast } from "react-toastify"
import GeneralTable from "../../../../components/GenTable"

interface TreeSelectionComponentProps {
    max: number
    plotIds: number[]
    open: boolean
    onClose: () => void
    onSubmit: (trees: any[]) => void
}

const TreeSelectionComponent: React.FC<TreeSelectionComponentProps> = ({ plotIds, max, open, onClose, onSubmit }) => {

    const isMountedRef = useRef(true);
    const [treesData, setTreesData] = useState<Record<number, any>>({})
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([])

    // Cleanup function to set mounted ref to false when component unmounts
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getTrees = async (plotIds: number[]) => {
        const apiClient = new ApiClient();
        if (!isMountedRef.current) return;
        setLoading(true);
        if (plotIds.length > 0) {
            const filtersData: any[] = [{
                columnField: 'plot_id',
                operatorValue: 'isAnyOf',
                value: plotIds
            }]

            filtersData.push(...Object.values(filters));
            try {
                const treesResp = await apiClient.getGiftAbleTrees(page * pageSize, pageSize, filtersData);
                
                if (!isMountedRef.current) return;
                
                setTotal(Number(treesResp.total));

                setTreesData(prev => {

                    const newTrees = { ...prev };
                    for (let i = 0; i < treesResp.results.length; i++) {
                        newTrees[treesResp.offset + i] = treesResp.results[i];
                    }

                    return newTrees;
                });
            } catch (error) {
                if (!isMountedRef.current) return;
                // Handle error if needed
            }
        }
        if (!isMountedRef.current) return;
        setLoading(false);
    }

    useEffect(() => {
        setTreesData({});
        setPage(0);
    }, [filters, plotIds]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!isMountedRef.current) return;
            
            const records: any[] = [];
            const maxLength = Math.min((page + 1) * pageSize, total);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(treesData, i)) {
                    const record = treesData[i];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getTrees(plotIds);
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [pageSize, page, treesData, total, plotIds]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!isMountedRef.current) return;
            getTrees(plotIds);
        }, 300)

        return () => {
            clearTimeout(handler);
        }

    }, [plotIds, filters])

    useEffect(() => {
        const getPTTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getPlantTypeTags();
                if (!isMountedRef.current) return;
                setTags(tagsResp.results)
            } catch (error: any) {
                if (!isMountedRef.current) return;
                toast.error(error.message);
            }
        }

        getPTTags();
    }, [])


    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    }

    const handleSubmit = () => {
        onSubmit(selectedTrees);
    }

    const columns: any[] = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling Id",
            align: "center",
            width: 100,
            ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            align: "center",
            width: 200,
            ...getColumnSearchProps('plant_type', filters, handleSetFilters)
        },
        {
            dataIndex: "plot",
            key: "plot",
            title: "Plot Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 200,
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
        },
    ]

    const treeColumn = [
        ...columns,
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        disabled={selectedTrees.findIndex(item => item.id === record.id) !== -1}
                        onClick={() => { setSelectedTrees(prev => {
                            if (prev.length === max) {
                                toast.error("Maxing number of trees selected!");
                                return prev;
                            }

                            return [...prev, {...record, tree_id: record.id}];
                        })}}
                    >
                        Select
                    </Button>
                </div>
            ),
        },
    ]

    const selectedColumns = [
        ...columns,
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='error'
                        style={{ margin: "0 5px" }}
                        onClick={() => { setSelectedTrees(prev => prev.filter(item => item.id !== record.id)) }}
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ]

    return (

        <Dialog open={open} fullWidth maxWidth="xl">
            <DialogTitle>Tree Selection</DialogTitle>
            <DialogContent dividers>
                <Box mt={2}>
                    <Typography variant="h6" mb={1}>You can select trees from below list. Use filters to search for specific tree.</Typography>
                    <GeneralTable
                        loading={loading}
                        rows={tableRows}
                        columns={treeColumn}
                        totalRecords={total}
                        page={page}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        onDownload={async () => { return Object.values(treesData) }}
                        tableName="Trees"
                    />
                </Box>
                <Box mt={2}>
                    <Typography variant="h6">List of selected trees.</Typography>
                    <GeneralTable
                        rows={selectedTrees}
                        columns={selectedColumns}
                        totalRecords={selectedTrees.length}
                        page={page2}
                        pageSize={pageSize2}
                        onPaginationChange={handlePaginationChange2}
                        onDownload={async () => { return Object.values(selectedTrees) }}
                        tableName="Selected Trees"
                    />

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default TreeSelectionComponent;