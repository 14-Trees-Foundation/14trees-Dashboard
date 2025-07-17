
import { FC, useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { Plot } from "../../../../types/plot";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as tagActionCreators from "../../../../redux/actions/tagActions";
import { TableColumnsType } from "antd";
import { GridFilterItem } from "@mui/x-data-grid";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import { RootState } from "../../../../redux/store/store";
import TreeSelectionComponent from "./TreeSelectionComponent";
import BookedTrees from "./BookedTrees";

// Import our new components
import { createPlotTableColumns } from "./PlotSelection/PlotTableColumns";
import { PlotTableSummary, calculateUnion } from "./PlotSelection/PlotTableSummary";
import PlotTagSelector from "./PlotSelection/PlotTagSelector";
import PlotBookingOptions from "./PlotSelection/PlotBookingOptions";
import PlotTreeDistribution from "./PlotSelection/PlotTreeDistribution";

interface PlotSelectionProps {
    giftCardRequestId: number
    totalTrees: number
    requiredTrees: number
    plots: Plot[]
    onPlotsChange: (plots: Plot[]) => void
    onTreeSelection: (trees: any[]) => void
    bookNonGiftable: boolean
    onBookNonGiftableChange: (value: boolean) => void
    diversify: boolean
    onDiversifyChange: (value: boolean) => void
    bookAllHabits: boolean
    onBookAllHabitsChange: (value: boolean) => void

}

const PlotSelection: FC<PlotSelectionProps> = ({
    giftCardRequestId,
    totalTrees,
    requiredTrees,
    plots,
    onPlotsChange,
    onTreeSelection,
    bookNonGiftable,
    onBookNonGiftableChange,
    diversify,
    onDiversifyChange,
    bookAllHabits,
    onBookAllHabitsChange
}) => {
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<Plot[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [treesCount, setTreesCount] = useState<number>(requiredTrees);
    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);
    const [treeSelectionModal, setTreeSelectionModal] = useState(false);
    
    // Tree selection states
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([]);

    const dispatch = useAppDispatch();
    const { getPlots } = bindActionCreators(plotActionCreators, dispatch);
    const { getTags } = bindActionCreators(tagActionCreators, dispatch);

    useEffect(() => {
        getTags(0, 100);
    }, []);

    // Get tags data
    let tags: string[] = [];
    const tagsData = useAppSelector((state: RootState) => state.tagsData);
    if (tagsData) {
        tags = Object.values(tagsData.tags)
            .filter(item => item.type === 'SYSTEM_DEFINED')
            .map(item => item.tag)
            .sort((a, b) => a > b ? 1 : -1);
    }

    // Get plots data
    let plotsList: Plot[] = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
        plotsList = plotsList.sort((a, b) => b.id - a.id);
    }

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        };

        if (sorter.field) {
            setPage(0);
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    };

    // Tag selection effects
    useEffect(() => {
        setPage(0);
        if (selectedTags.length > 0) {
            setFilters(prev => ({
                ...prev,
                "tags": { columnField: "tags", value: selectedTags, operatorValue: 'isAnyOf' }
            }));
        } else {
            setFilters(prev => {
                const newFilters = { ...prev };
                Reflect.deleteProperty(newFilters, "tags");
                return newFilters;
            });
        }
    }, [selectedTags]);

    useEffect(() => {
        getPlotData();
    }, [filters, orderBy]);

    useEffect(() => {
        setLoading(true);
        const records: Plot[] = [];
        const maxLength = Math.min((page + 1) * pageSize, plotsData.totalPlots);
        for (let i = page * pageSize; i < maxLength; i++) {
            if (Object.hasOwn(plotsData.paginationMapping, i)) {
                const id = plotsData.paginationMapping[i];
                const record = plotsData.plots[id];
                if (record) {
                    records.push(record);
                }
            } else {
                getPlotData();
                break;
            }
        }
        setLoading(false);
        setTableRows(records);
    }, [pageSize, page, plotsData]);

    const getPlotData = async () => {
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
            });
        }

        getPlots(page * pageSize, pageSize, filtersData, orderBy);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    };

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    };

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const filtersList = Object.values(filters);
        const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList, orderBy);
        return resp.results;
    };

    const handleSelectionChanges = (plotIds: number[]) => {
        setSelectedPlotIds(plotIds);
        const selectedPlots: Plot[] = [];
        plotIds.forEach(plotId => {
            const plot = plotsList.find(plot => plot.id === plotId);
            if (plot) selectedPlots.push(plot);
        });
        onPlotsChange(selectedPlots);
    };

    const handleTagSelect = (tag: string) => {
        const idx = selectedTags.findIndex(item => item === tag);
        if (idx === -1) {
            setSelectedTags(prev => [...prev, tag]);
        } else {
            setSelectedTags(prev => prev.filter(item => item !== tag));
        }
    };

    // Create columns using the extracted function
    const columns: TableColumnsType<Plot> = createPlotTableColumns(
        filters,
        handleSetFilters,
        orderBy,
        handleSortingChange
    );

    const treeColumns: TableColumnsType<any> = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            align: "center",
            width: 120,
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "scientific_name",
            key: "scientific_name",
            title: "Scientific Name",
            align: "center",
            width: 200,
        },
    ];

    return (
        <div>
            <PlotTreeDistribution
                totalTrees={totalTrees}
                plots={plots}
                treesCount={treesCount}
                bookAllHabits={bookAllHabits}
                bookNonGiftable={bookNonGiftable}
                selectedTrees={selectedTrees}
            />

            <PlotTagSelector
                tags={tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onSelectAll={() => setSelectedTags(tags)}
                onReset={() => setSelectedTags([])}
            />

            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={plotsData.totalPlots}
                page={page}
                pageSize={pageSize}
                onSelectionChanges={handleSelectionChanges}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                summary={(totalColumns: number) => {
                    if (totalColumns < 5) return undefined;
                    return PlotTableSummary(tableRows, selectedPlotIds, totalColumns);
                }}
                footer
                tableName="Plots selection"
            />

            {plots.length > 0 && (
                <Box sx={{ marginBottom: '20px' }}>
                    <Divider />
                    <Typography mb={1} mt={2}>
                        <strong>List of unique plant types for selected plots:</strong>
                    </Typography>
                    <Typography mb={2}>
                        {calculateUnion(plots.map(plot => plot.distinct_plants)).join(", ")}
                    </Typography>
                    <Divider />
                </Box>
            )}

            <PlotBookingOptions
                bookNonGiftable={bookNonGiftable}
                bookAllHabits={bookAllHabits}
                diversify={diversify}
                onBookNonGiftableChange={onBookNonGiftableChange}
                onBookAllHabitsChange={onBookAllHabitsChange}
                onDiversifyChange={onDiversifyChange}
                onManualSelection={() => setTreeSelectionModal(true)}
                showOptions={selectedTrees.length === 0}
            />

            {!treeSelectionModal && selectedTrees.length > 0 && (
                <Box mt={5}>
                    <Typography variant="h6" mb={1}>
                        Below trees will be reserved for gift request after submission:
                    </Typography>
                    <GeneralTable
                        rows={selectedTrees.slice(page2 * pageSize, (page2 + 1) * pageSize2)}
                        columns={treeColumns}
                        totalRecords={selectedTrees.length}
                        page={page2}
                        pageSize={pageSize2}
                        onPaginationChange={handlePaginationChange2}
                        onDownload={async () => selectedTrees}
                        tableName="Tree selection"
                    />
                </Box>
            )}

            <Box mt={5}>
                <BookedTrees
                    giftCardRequestId={giftCardRequestId}
                    visible={false}
                    onUnMap={count => setTreesCount(prev => prev + count)}
                />
            </Box>

            <TreeSelectionComponent
                open={treeSelectionModal}
                max={treesCount}
                includeNonGiftable={bookNonGiftable}
                includeAllHabitats={bookAllHabits}
                plotIds={plots.map(plot => plot.id)}
                plantTypes={calculateUnion(plots.map(plot => plot.distinct_plants))}
                onClose={() => setTreeSelectionModal(false)}
                selectedTrees={selectedTrees}
                onSelectedTreesChange={setSelectedTrees}
                onSubmit={(trees: any[]) => {
                    const data = trees.map(tree => ({
                        tree_id: tree.id,
                        sapling_id: tree.sapling_id,
                        plant_type: tree.plant_type,
                    }));
                    onTreeSelection(data);
                    setTreeSelectionModal(false);
                }}
            />
        </div>
    );
};

export default PlotSelection;