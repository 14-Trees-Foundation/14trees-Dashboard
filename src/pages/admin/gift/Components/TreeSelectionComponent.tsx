import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import ApiClient from "../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import GeneralTable from "../../../../components/GenTable";

// Import our new components
import TreeSelectionModal from "./TreeSelection/TreeSelectionModal";
import TreePlantTypeFilter from "./TreeSelection/TreePlantTypeFilter";
import { createTreeSelectionColumns, createSelectedTreeColumns } from "./TreeSelection/TreeTableColumns";

interface TreeSelectionComponentProps {
    max: number
    includeNonGiftable: boolean
    includeAllHabitats: boolean
    plotIds: number[]
    plantTypes: string[]
    open: boolean
    onClose: () => void
    onSubmit: (trees: any[]) => void
    selectedTrees: any[]
    onSelectedTreesChange: (trees: any[]) => void
}

const TreeSelectionComponent: React.FC<TreeSelectionComponentProps> = ({
    plotIds,
    includeNonGiftable,
    includeAllHabitats,
    max,
    open,
    plantTypes,
    onClose,
    onSubmit,
    selectedTrees,
    onSelectedTreesChange
}) => {
    const isMountedRef = useRef(true);
    const [treesData, setTreesData] = useState<Record<number, any>>({});
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);
    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [tags, setTags] = useState<string[]>([]);
    const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);

    // Cleanup function to set mounted ref to false when component unmounts
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const getTrees = async (plotIds: number[], includeNonGiftable: boolean) => {
        const apiClient = new ApiClient();
        if (!isMountedRef.current) return;
        setLoading(true);
        
        if (plotIds.length > 0) {
            const filtersData: any[] = [{
                columnField: 'plot_id',
                operatorValue: 'isAnyOf',
                value: plotIds
            }];

            filtersData.push(...Object.values(filters));
            
            try {
                const treesResp = await apiClient.getGiftAbleTrees(
                    page * pageSize,
                    pageSize,
                    filtersData,
                    includeNonGiftable,
                    includeAllHabitats
                );
                
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
    };

    // Handle plant type filter changes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!isMountedRef.current) return;
            
            let newFilters = { ...filters };
            if (selectedPlantTypes.length === 0) {
                Reflect.deleteProperty(newFilters, "plant_type");
            } else {
                newFilters["plant_type"] = {
                    columnField: "plant_type",
                    operatorValue: 'isAnyOf',
                    value: selectedPlantTypes,
                };
            }
            handleSetFilters(newFilters);
        }, 300);

        return () => clearTimeout(handler);
    }, [selectedPlantTypes]);

    // Reset data when filters or plot selection changes
    useEffect(() => {
        setTreesData({});
        setPage(0);
    }, [filters, plotIds, includeNonGiftable]);

    // Handle table rows updates
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
                    getTrees(plotIds, includeNonGiftable);
                    break;
                }
            }
            setTableRows(records);
        }, 300);

        return () => clearTimeout(handler);
    }, [pageSize, page, treesData, total, plotIds, includeNonGiftable]);

    // Fetch trees when dependencies change
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!isMountedRef.current) return;
            getTrees(plotIds, includeNonGiftable);
        }, 300);

        return () => clearTimeout(handler);
    }, [plotIds, includeNonGiftable, filters]);

    // Get plant type tags
    useEffect(() => {
        const getPTTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getPlantTypeTags();
                if (!isMountedRef.current) return;
                setTags(tagsResp.results);
            } catch (error: any) {
                if (!isMountedRef.current) return;
                toast.error(error.message);
            }
        };

        getPTTags();
    }, []);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    };

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    };

    const handleSubmit = () => {
        onSubmit(selectedTrees);
    };

    const handlePlantTypeSelect = (plantType: string) => {
        const idx = selectedPlantTypes.findIndex(item => item === plantType);
        if (idx === -1) {
            setSelectedPlantTypes(prev => [...prev, plantType]);
        } else {
            setSelectedPlantTypes(prev => prev.filter(item => item !== plantType));
        }
    };

    // Create columns using extracted functions
    const treeColumns = createTreeSelectionColumns(
        filters,
        handleSetFilters,
        tags,
        selectedTrees,
        max,
        onSelectedTreesChange
    );

    const selectedColumns = createSelectedTreeColumns(
        filters,
        handleSetFilters,
        tags,
        selectedTrees,
        onSelectedTreesChange
    );

    const modalContent = (
        <>
            <Box mt={2}>
                <TreePlantTypeFilter
                    plantTypes={plantTypes}
                    selectedPlantTypes={selectedPlantTypes}
                    onPlantTypeSelect={handlePlantTypeSelect}
                    onReset={() => setSelectedPlantTypes([])}
                />
                
                <GeneralTable
                    loading={loading}
                    rows={tableRows}
                    columns={treeColumns}
                    totalRecords={total}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={handlePaginationChange}
                    onDownload={async () => Object.values(treesData)}
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
                    onDownload={async () => Object.values(selectedTrees)}
                    tableName="Selected Trees"
                />
            </Box>
        </>
    );

    return (
        <TreeSelectionModal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            {modalContent}
        </TreeSelectionModal>
    );
};

export default TreeSelectionComponent;