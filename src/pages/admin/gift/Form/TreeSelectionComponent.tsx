import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter"
import { useEffect, useState } from "react"
import { GridFilterItem } from "@mui/x-data-grid"
import ApiClient from "../../../../api/apiClient/apiClient"
import { toast } from "react-toastify"
import GeneralTable from "../../../../components/GenTable"

interface TreeSelectionComponentProps {
    max: number
    includeNonGiftable: boolean
    plotIds: number[]
    plantTypes: string[]
    open: boolean
    onClose: () => void
    onSubmit: (trees: any[]) => void
    selectedTrees: any[]
    onSelectedTreesChange: (trees: any[]) => void
}

const TreeSelectionComponent: React.FC<TreeSelectionComponentProps> = ({ plotIds, includeNonGiftable, max, open, plantTypes, onClose, onSubmit, selectedTrees, onSelectedTreesChange }) => {

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
    const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getTrees = async (plotIds: number[], includeNonGiftable: boolean) => {
        const apiClient = new ApiClient();
        setLoading(true);
        if (plotIds.length > 0) {
            const filtersData: any[] = [{
                columnField: 'plot_id',
                operatorValue: 'isAnyOf',
                value: plotIds
            }]

            filtersData.push(...Object.values(filters));
            const treesResp = await apiClient.getGiftAbleTrees(page * pageSize, pageSize, filtersData, includeNonGiftable);
            setTotal(Number(treesResp.total));

            setTreesData(prev => {

                const newTrees = { ...prev };
                for (let i = 0; i < treesResp.results.length; i++) {
                    newTrees[treesResp.offset + i] = treesResp.results[i];
                }

                return newTrees;
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            let newFilters = { ...filters }
            if (selectedPlantTypes.length === 0) {
                Reflect.deleteProperty(newFilters, "plant_type");
            } else {
                newFilters["plant_type"] = {
                    columnField: "plant_type",
                    operatorValue: 'isAnyOf',
                    value: selectedPlantTypes,
                }
            }
    
            handleSetFilters(newFilters);
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [selectedPlantTypes]);

    useEffect(() => {
        setTreesData({});
        setPage(0);
    }, [filters, plotIds, includeNonGiftable]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const records: any[] = [];
            const maxLength = Math.min((page + 1) * pageSize, total);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(treesData, i)) {
                    const record = treesData[i];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getTrees(plotIds, includeNonGiftable);
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [pageSize, page, treesData, total, plotIds, includeNonGiftable]);

    useEffect(() => {
        const handler = setTimeout(() => {
            getTrees(plotIds, includeNonGiftable);
        }, 300)

        return () => {
            clearTimeout(handler);
        }

    }, [plotIds, includeNonGiftable, filters])

    useEffect(() => {
        const getPTTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getPlantTypeTags();
                setTags(tagsResp.results)
            } catch (error: any) {
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

    const handlePlantTypeSelect = (plantType: string) => {
        const idx = selectedPlantTypes.findIndex(item => item === plantType);
        if (idx === -1) {
            setSelectedPlantTypes(prev => [...prev, plantType]);
        } else {
            setSelectedPlantTypes(prev => prev.filter(item => item !== plantType));
        }
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
                        onClick={() => {
                            if (selectedTrees.length === max) {
                                toast.error("You have already selected maximum number of trees in the request!");
                                return;
                            }

                            onSelectedTreesChange([...selectedTrees, record])
                        }}
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
                        onClick={() => { onSelectedTreesChange(selectedTrees.filter(item => item.id !== record.id)) }}
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
                    <Box sx={{ mb: 3 }}>
                        <Typography mb={1}>You can select tree(s) from the table below. Select plant type(s) or use filters to search for specific tree(s).</Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}>
                            {plantTypes.map((plantType, index) => (
                                <Chip
                                    key={index}
                                    label={plantType}
                                    color="success"
                                    variant={selectedPlantTypes.includes(plantType) ? 'filled' : "outlined"}
                                    onClick={() => { handlePlantTypeSelect(plantType) }}
                                    sx={{ margin: '2px' }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                            <Button variant="outlined" color="success" onClick={() => { setSelectedPlantTypes([]); }} sx={{ ml: 1 }}>Reset</Button>
                        </Box>
                    </Box>
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