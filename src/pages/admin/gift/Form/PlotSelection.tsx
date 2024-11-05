
import { FC, useEffect, useState } from "react";
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, Typography } from "@mui/material";
import { Plot } from "../../../../types/plot";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as tagActionCreators from "../../../../redux/actions/tagActions";
import UserTreeMappingModal from "./UserTreeMapping";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import { RootState } from "../../../../redux/store/store";

const TableSummary = (plots: Plot[], selectedPlotIds: number[], totalColumns: number) => {

    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    const calculateUnion = (plantTypes: (string[] | undefined)[]) => {
        const allTypes = plantTypes.flat().filter((type): type is string => type !== undefined);
        return Array.from(new Set(allTypes)).length;
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={totalColumns - 7} colSpan={totalColumns - 6}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.total))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.booked))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 4} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.assigned))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 3} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.unbooked_assigned))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 2} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns - 1} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.card_available))}</Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={totalColumns} colSpan={1}>{calculateUnion(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.distinct_plants))}</Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

interface PlotSelectionProps {
    requiredTrees: number
    plots: Plot[]
    onPlotsChange: (plots: Plot[]) => void
    users: any[]
    onUsersChange: (users: any[]) => void
    manualPlotSelection: boolean
    onPlotSelectionMethodChange: (value: boolean) => void
}

const PlotSelection: FC<PlotSelectionProps> = ({ requiredTrees, plots, onPlotsChange, users, onUsersChange, manualPlotSelection, onPlotSelectionMethodChange }) => {

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [tableRows, setTableRows] = useState<Plot[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);

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
            .sort((a,b) => {
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
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 150,
            ...getColumnSearchProps('label', filters, handleSetFilters)
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
            dataIndex: "gat",
            key: "gat",
            title: "Gat No.",
            align: "center",
            width: 150,
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
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps('site_name', filters, handleSetFilters)
        },
        {
            dataIndex: "total",
            key: "total",
            title: getSortableHeader("Total Trees", 'total'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "booked",
            key: "booked",
            title: getSortableHeader("Booked Trees", 'booked'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "assigned",
            key: "assigned",
            title: getSortableHeader("Assigned Trees", 'assigned'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "unbooked_assigned",
            key: "unbooked_assigned",
            title: getSortableHeader("Unfunded Inventory (Assigned)", 'unbooked_assigned'),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "available",
            key: "available",
            title: getSortableHeader("Unfunded Inventory (Unassigned)", 'available'),
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


    return (
        <div>

            <Box style={{
                marginBottom: 20
            }}>
                <Typography variant='subtitle1'>Total Trees Requested: <strong>{requiredTrees}</strong></Typography>
                {!manualPlotSelection && <Box>
                    <Typography variant='subtitle1'>Remaining tree count for plot selection: <strong>{
                        Math.max(requiredTrees - plots
                            .map(pt => pt.card_available ?? 0)
                            .reduce((prev, current) => prev + current, 0), 0)
                    }</strong></Typography>
                    <Typography variant='subtitle1'>Tree distribution across the plots:</Typography>
                    {plots.map((plot, idx) => {
                        const treesAllocated = plots
                            .slice(0, idx)
                            .map(pt => pt.card_available ?? 0)
                            .reduce((prev, current) => prev + current, 0);

                        const treesForCurrentPlot = Math.min(plot.card_available ?? 0, requiredTrees - treesAllocated);

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
            />

            <FormControl component="fieldset" sx={{ mt: 3 }}>
                <FormControlLabel
                    control={
                        <Checkbox checked={manualPlotSelection} onChange={(e) => { onPlotSelectionMethodChange(e.target.checked) }} name="manual" />
                    }
                    label="Do you want to manually select trees for each user?"
                />
            </FormControl>
            {manualPlotSelection && <UserTreeMappingModal
                plotIds={plots.map(plot => plot.id)}
                users={users}
                onUsersChange={onUsersChange}
            />}
        </div>
    );
}

export default PlotSelection;