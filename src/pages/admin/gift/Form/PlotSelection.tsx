
import { FC, useEffect, useState } from "react";
import { Box, Button, Chip, Divider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Plot } from "../../../../types/plot";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as tagActionCreators from "../../../../redux/actions/tagActions";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import { RootState } from "../../../../redux/store/store";
import TreeSelectionComponent from "./TreeSelectionComponent";
import BookedTrees from "../Components/BookedTrees";

const calculateUnion = (plantTypes: (string[] | undefined)[]) => {
    const allTypes = plantTypes.flat().filter((type): type is string => type !== undefined);
    return Array.from(new Set(allTypes));
}

const TableSummary = (plots: Plot[], selectedPlotIds: number[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={2} colSpan={2}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={3} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={4} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.card_available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={6} colSpan={1}>{calculateUnion(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.distinct_plants)).length}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={7} colSpan={totalColumns - 6}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface PlotSelectionProps {
    giftCardRequestId: number
    requiredTrees: number
    plots: Plot[]
    onPlotsChange: (plots: Plot[]) => void
    onTreeSelection: (trees: any[]) => void
    bookNonGiftable: boolean
    onBookNonGiftableChange: (value: boolean) => void
    diversify: boolean
    onDiversifyChange: (value: boolean) => void

}

const PlotSelection: FC<PlotSelectionProps> = ({ giftCardRequestId, requiredTrees, plots, onPlotsChange, onTreeSelection, bookNonGiftable, onBookNonGiftableChange, diversify, onDiversifyChange }) => {

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

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const dispatch = useAppDispatch();
    const { getPlots }
        = bindActionCreators(plotActionCreators, dispatch);
    const { getTags } = bindActionCreators(tagActionCreators, dispatch);

    useEffect(() => {
        getTags(0, 100);
    }, []);

    let tags: string[] = [];
    const tagsData = useAppSelector((state: RootState) => state.tagsData);
    if (tagsData) {
        tags = Object.values(tagsData.tags)
            .filter(item => item.type === 'SYSTEM_DEFINED')
            .map(item => item.tag)
            .sort((a, b) => {
                if (a > b) return 1;
                else return - 1;
            });
    }

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
            })
        }
    }, [selectedTags])

    useEffect(() => {
        getPlotData();
    }, [filters, orderBy]);

    let plotsList: Plot[] = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
        plotsList = plotsList.sort((a, b) => b.id - a.id)
    }

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
            })
        }

        getPlots(page * pageSize, pageSize, filtersData, orderBy);
    };


    const accessibilityList = [
        { value: "accessible", label: "Accessible" },
        { value: "inaccessible", label: "Inaccessible" },
        { value: "moderately_accessible", label: "Moderately Accessible" },
    ];

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
        }

        if (sorter.field) {
            setPage(0);
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    }

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    const columns: TableColumnsType<Plot> = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "total",
            key: "total",
            title: getSortableHeader("Total Trees", 'total'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available",
            key: "available",
            title: getSortableHeader("Available (Unfunded Inventory)", 'available'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "card_available",
            key: "card_available",
            title: getSortableHeader("Giftable Inventory", 'card_available'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "distinct_plants",
            key: "distinct_plants",
            title: "Unique Plant Types",
            align: "right",
            width: 100,
            render: (value) => value?.length || 0
        },
        {
            dataIndex: "accessibility_status",
            key: "accessibility_status",
            title: "Accessibility",
            align: "center",
            width: 200,
            render: (value) => value ? accessibilityList.find((item) => item.value === value)?.label : "Unknown",
            ...getColumnSelectedItemFilter({ dataIndex: 'accessibility_status', filters, handleSetFilters, options: accessibilityList.map((item) => item.label).concat("Unknown") })
        },
        {
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 150,
            ...getColumnSearchProps('label', filters, handleSetFilters)
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            align: "center",
            width: 150,
            render: (tags) => tags ? tags.join(", ") : '',
        },
        {
            dataIndex: "gat",
            key: "gat",
            title: "Gat No.",
            align: "center",
            width: 150,
        },
    ];

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleDownload = async () => {

        const apiClient = new ApiClient();
        const filtersList = Object.values(filters);
        const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList, orderBy);
        return resp.results;
    }

    const handleSelectionChanges = (plotIds: number[]) => {
        setSelectedPlotIds(plotIds);
        const selectedPlots: Plot[] = [];
        plotIds.forEach(plotId => {
            const plot = plotsList.find(plot => plot.id === plotId);
            if (plot) selectedPlots.push(plot);
        })
        onPlotsChange(selectedPlots);
    }

    const handleTagSelect = (tag: string) => {
        const idx = selectedTags.findIndex(item => item === tag);
        if (idx === -1) {
            setSelectedTags(prev => [...prev, tag]);
        } else {
            setSelectedTags(prev => prev.filter(item => item !== tag));
        }
    }

    ///*** tree selection for booking ***/
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([]);

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    }

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

            <Box style={{
                marginBottom: 20
            }}>
                <Typography variant='subtitle1'>Total Trees Requested: <strong>{treesCount}</strong></Typography>
                {selectedTrees.length === 0 && <Box>
                    <Typography variant='subtitle1'>Remaining tree count for plot selection: <strong>{
                        Math.max(treesCount - plots
                            .map(pt => pt.card_available ?? 0)
                            .reduce((prev, current) => prev + current, 0), 0)
                    }</strong></Typography>
                    <Typography variant='subtitle1'>Tree distribution across the plots:</Typography>
                    {plots.map((plot, idx) => {
                        const treesAllocated = plots
                            .slice(0, idx)
                            .map(pt => pt.card_available ?? 0)
                            .reduce((prev, current) => prev + current, 0);

                        const treesForCurrentPlot = Math.min(plot.card_available ?? 0, treesCount - treesAllocated);

                        return (
                            <Typography variant="body1" key={idx}>
                                {plot.name} <strong>[ Trees: {Math.max(treesForCurrentPlot, 0)} ]</strong>
                            </Typography>
                        );
                    })}
                </Box>}
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
                <Typography>Select tags to filter plots</Typography>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            color="success"
                            variant={selectedTags.includes(tag) ? 'filled' : "outlined"}
                            onClick={() => { handleTagSelect(tag) }}
                            sx={{ margin: '2px' }}
                        />
                    ))}
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" color="success" onClick={() => { setSelectedTags(tags); }}>All</Button>
                    <Button variant="outlined" color="success" onClick={() => { setSelectedTags([]); }} sx={{ ml: 1 }}>Reset</Button>
                </Box>
            </Box>

            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={plotsData.totalPlots}
                page={page}
                onSelectionChanges={handleSelectionChanges}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                summary={(totalColumns: number) => {
                    if (totalColumns < 5) return undefined;
                    return TableSummary(tableRows, selectedPlotIds, totalColumns)
                }}
                footer
                tableName="Plots selection"
            />
            {plots.length > 0 && <Box sx={{ marginBottom: '20px' }}>
                <Divider />
                <Typography mb={1} mt={2}><strong>List of unique plant types for selected plots:</strong></Typography>
                <Typography mb={2}>{calculateUnion(plots.map(plot => plot.distinct_plants)).join(", ")}</Typography>
                <Divider />
            </Box>}

            <Box
                mt={3}
                display="flex"
                alignItems="center"
            >
                <Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography mr={10}>Do you want to manually select trees for each recipient?</Typography>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => { setTreeSelectionModal(true); }}
                        >Select Manually</Button>
                    </Box>
                    {selectedTrees.length === 0 && <Box
                        mt={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography mr={10}>Do you want to book non giftable trees?</Typography>
                        <ToggleButtonGroup
                            color="success"
                            value={bookNonGiftable ? "yes" : "no"}
                            exclusive
                            onChange={(e, value) => { onBookNonGiftableChange(value === "yes" ? true : false); }}
                            aria-label="Platform"
                            size="small"
                        >
                            <ToggleButton value="yes">Yes</ToggleButton>
                            <ToggleButton value="no">No</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>}
                    {selectedTrees.length === 0 && <Box
                        mt={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography mr={10}>Do you want diversify plant types?</Typography>
                        <ToggleButtonGroup
                            color="success"
                            value={diversify ? "yes" : "no"}
                            exclusive
                            onChange={(e, value) => { onDiversifyChange(value === "yes" ? true : false); }}
                            aria-label="Platform"
                            size="small"
                        >
                            <ToggleButton value="yes">Yes</ToggleButton>
                            <ToggleButton value="no">No</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>}
                </Box>
                <Box display="flex" flexGrow={1}></Box>
            </Box>

            {!treeSelectionModal && selectedTrees.length > 0 && <Box mt={5}>
                <Typography variant="h6" mb={1}>Below trees will be reserved for gift request after submission:</Typography>
                <GeneralTable
                    rows={selectedTrees.slice(page2*pageSize, (page2 + 1)*pageSize2)}
                    columns={treeColumns}
                    totalRecords={selectedTrees.length}
                    page={page2}
                    pageSize={pageSize2}
                    onPaginationChange={handlePaginationChange2}
                    onDownload={async () => { return selectedTrees; }}
                    tableName="Tree selection"
                />
            </Box>}

            <Box mt={5}>
                <BookedTrees
                    giftCardRequestId={giftCardRequestId}
                    visible={false}
                    onUnMap={count => { setTreesCount(prev => prev + count); }}
                />
            </Box>

            <TreeSelectionComponent
                open={treeSelectionModal}
                max={treesCount}
                plotIds={plots.map(plot => plot.id)}
                plantTypes={calculateUnion(plots.map(plot => plot.distinct_plants))}
                onClose={() => { setTreeSelectionModal(false); }}
                selectedTrees={selectedTrees}
                onSelectedTreesChange={(trees: any) => { setSelectedTrees(trees) }}
                onSubmit={(trees: any[]) => {
                    const data = trees.map(tree => ({
                        tree_id: tree.id,
                        sapling_id: tree.sapling_id,
                        plant_type: tree.plant_type,
                    }))
                    onTreeSelection(data);
                    setTreeSelectionModal(false);
                }}
            />
        </div>
    );
}

export default PlotSelection;