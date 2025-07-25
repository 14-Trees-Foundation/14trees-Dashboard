import { Box, Typography, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import getColumnSearchProps, { getSortableHeader } from "../Filter";
import { useState, useEffect } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Plot } from "../../types/plot";
import GeneralTable from "../GenTable";
import ApiClient from "../../api/apiClient/apiClient";
import AddPlotsDialog from "./AddPlotsDialog";
import RemovePlotsDialog from "./RemovePlotsDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { toast } from 'react-toastify';

interface Props {
    type: "donate" | "gift-trees";
}

const AutoPrsPlots: React.FC<Props> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<Plot[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [orderBy, setOrderBy] = useState<
        { column: string; order: "ASC" | "DESC" }[]
    >([]);
    const [sequenceOrderingEnabled, setSequenceOrderingEnabled] = useState(false);
    const [hasSequenceChanges, setHasSequenceChanges] = useState(false);
    const [originalSequence, setOriginalSequence] = useState<Plot[]>([]);
    const [savingSequence, setSavingSequence] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        plotToRemove?: Plot;
    }>({
        open: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const fetchPlotData = async () => {
        setLoading(true);
        try {
            const apiType = type === "donate" ? "donation" : "gift";

            const filtersData = Object.values(filters);
            const apiClient = new ApiClient();
            const response = await apiClient.getPlotsByType(apiType, filtersData, orderBy);

            setTableRows(response.results);
            setOriginalSequence([...response.results]);
            setTotalRecords(response.total);
            setHasSequenceChanges(false);
        } catch (error) {
            console.error("Failed to fetch plot data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlotData();
    }, [type, page, pageSize, filters, orderBy]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    };

    const handleDownload = async () => {
        const apiClient = new ApiClient();

        const filtersData = Object.values(filters);
        const resp = await apiClient.getPlotsByType(
            type === "donate" ? "donation" : "gift",
            filtersData,
            orderBy,
        );
        return resp.results;
    };

    const handleAddPlots = async (plotIds: string[]) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.addAutoProcessPlot({
                plot_ids: plotIds.map(id => Number(id)),
                type: type === "donate" ? "donation" : "gift"
            });
            fetchPlotData();
        } catch (error) {
            console.error("Failed to add plots:", error);
            throw error;
        }
    };

    const handleRemovePlots = async (plotIds: string[]) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.removeAutoProcessPlots({
                plot_ids: plotIds.map(id => Number(id)),
                type: type === "donate" ? "donation" : "gift"
            });
            fetchPlotData();
        } catch (error) {
            console.error("Failed to remove plots:", error);
            throw error;
        }
    };

    const showRemovePlotConfirmation = (plot: Plot) => {
        setConfirmDialog({
            open: true,
            title: 'Remove Plot',
            message: `Are you sure you want to remove plot "${plot.name}" from auto-processing? This action cannot be undone.`,
            onConfirm: () => {
                handleRemovePlots([String(plot.id)]);
                setConfirmDialog(prev => ({ ...prev, open: false }));
            },
            plotToRemove: plot
        });
    };

    const showRemovePlotsConfirmation = () => {
        setConfirmDialog({
            open: true,
            title: 'Remove Multiple Plots',
            message: 'Are you sure you want to remove all the plots from auto-processing? This action cannot be undone.',
            onConfirm: () => {
                setRemoveDialogOpen(true);
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = (item: { column: string; order: "ASC" | "DESC" }) => {
            const index = newOrder.findIndex(
                (item) => item.column === sorter.field
            );
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else
                    newOrder = newOrder.filter(
                        (item) => item.column !== sorter.field
                    );
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

    const handleMoveUp = async (record: Plot, index: number) => {
        if (index === 0) return;
        
        const newRows = [...tableRows];
        [newRows[index - 1], newRows[index]] = [newRows[index], newRows[index - 1]];
        setTableRows(newRows);
        setHasSequenceChanges(true);
    };

    const handleMoveDown = async (record: Plot, index: number) => {
        if (index === tableRows.length - 1) return;
        
        const newRows = [...tableRows];
        [newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]];
        setTableRows(newRows);
        setHasSequenceChanges(true);
    };

    const handleSaveSequence = async () => {
        setSavingSequence(true);
        try {
            const apiClient = new ApiClient();
            const plotSequences = tableRows.map((plot, index) => ({
                id: plot.id,
                sequence: index + 1
            }));
            
            const apiType = type === "donate" ? "donation" : "gift";
            await apiClient.updateAutoProcessPlotSequences({
                plot_sequences: plotSequences,
                type: apiType
            });
            
            setOriginalSequence([...tableRows]);
            setHasSequenceChanges(false);
            setSequenceOrderingEnabled(false);
            toast.success('Plot sequence updated successfully!');
        } catch (error) {
            console.error('Failed to save sequence:', error);
            toast.error('Failed to update plot sequence. Please try again.');
        } finally {
            setSavingSequence(false);
        }
    };

    const handleCancelSequence = () => {
        setTableRows([...originalSequence]);
        setHasSequenceChanges(false);
        setSequenceOrderingEnabled(false);
    };

    const columns: any[] = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 300,
            fixed: 'left',
            ...getColumnSearchProps("name", filters, handleSetFilters),
        },
        {
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 150,
            ...getColumnSearchProps("label", filters, handleSetFilters),
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps("site_name", filters, handleSetFilters),
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader(
                "Total Trees",
                "total",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "tree_count",
            key: "Trees",
            title: getSortableHeader(
                "Trees",
                "tree_count",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "booked",
            key: "Booked Trees",
            title: getSortableHeader(
                "Booked Trees",
                "booked",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
            hidden: true,
        },
        {
            dataIndex: "assigned",
            key: "Assigned Trees",
            title: getSortableHeader(
                "Assigned Trees",
                "assigned",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
            hidden: true,
        },
        {
            dataIndex: "unbooked_assigned",
            key: "Unfunded Inventory (Assigned)",
            title: getSortableHeader(
                "Unfunded Inventory (Assigned)",
                "unbooked_assigned",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 180,
            hidden: true,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory (Unassigned)",
            title: getSortableHeader(
                "Unfunded Inventory (Unassigned)",
                "available",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 180,
        },
        {
            dataIndex: "card_available",
            key: "Giftable Inventory",
            title: getSortableHeader(
                "Giftable Inventory",
                "card_available",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            align: "center",
            width: 120,
            render: (_: any, record: Plot) => (
                <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Remove this plot">
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => showRemovePlotConfirmation(record)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const titleText =
        type === "donate"
            ? "Plots for Auto-Processing Donations"
            : "Plots for Auto-Processing Gift Requests";

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {titleText}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {!sequenceOrderingEnabled ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<SwapVertIcon />}
                            onClick={() => setSequenceOrderingEnabled(true)}
                            size="small"
                        >
                            Change Sequence
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveSequence}
                                disabled={!hasSequenceChanges || savingSequence}
                                size="small"
                            >
                                {savingSequence ? 'Saving...' : 'Save Sequence'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelSequence}
                                disabled={savingSequence}
                                size="small"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => setDialogOpen(true)}
                        disabled={sequenceOrderingEnabled}
                    >
                        Add Plots
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={showRemovePlotsConfirmation}
                        disabled={tableRows.length === 0 || sequenceOrderingEnabled}
                    >
                        Remove Plots
                    </Button>
                </Box>
            </Box>
            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                footer
                tableName="Plots"
                sequenceOrdering={{
                    enabled: sequenceOrderingEnabled,
                    onMoveUp: handleMoveUp,
                    onMoveDown: handleMoveDown,
                    sequenceField: 'sequence'
                }}
            />
            <AddPlotsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                type={type}
                onAddPlots={handleAddPlots}
            />
            <RemovePlotsDialog
                open={removeDialogOpen}
                onClose={() => setRemoveDialogOpen(false)}
                type={type}
                currentPlots={tableRows}
                onRemovePlots={handleRemovePlots}
            />

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleConfirmDialogClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    {confirmDialog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {confirmDialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDialog.onConfirm} 
                        color="error" 
                        variant="contained"
                        autoFocus
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AutoPrsPlots;
