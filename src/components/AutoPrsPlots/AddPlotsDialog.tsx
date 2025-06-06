import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Plot } from "../../types/plot";
import GeneralTable from "../GenTable";
import ApiClient from "../../api/apiClient/apiClient";
import getColumnSearchProps, { getSortableHeader } from "../Filter";
import DeleteIcon from '@mui/icons-material/Delete';

interface AddPlotsDialogProps {
    open: boolean;
    onClose: () => void;
    type: "donate" | "gift-trees";
    onAddPlots: (plotIds: string[]) => Promise<void>;
}

interface SelectedPlot {
    id: number;
    name: string;
    label: string;
    site_name: string;
    available: number;
}

const AddPlotsDialog = ({ open, onClose, type, onAddPlots }: AddPlotsDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<{ column: string; order: "ASC" | "DESC" }[]>([]);
    const [selectedPlots, setSelectedPlots] = useState<SelectedPlot[]>([]);

    const fetchPlots = async () => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const response = await apiClient.getPlots(
                page * pageSize,
                pageSize,
                Object.values(filters),
                orderBy
            );
            setPlots(response.results);
            setTotalRecords(response.total);
        } catch (error) {
            console.error("Failed to fetch plots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchPlots();
        }
    }, [open, page, pageSize, filters, orderBy]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const handleAdd = async () => {
        if (selectedPlots.length > 0) {
            await onAddPlots(selectedPlots.map(plot => String(plot.id)));
            onClose();
            setSelectedPlots([]);
        }
    };

    const handleSelectPlot = (plot: Plot) => {
        if (!selectedPlots.some(p => p.id === plot.id)) {
            setSelectedPlots(prev => [
                ...prev,
                {
                    id: plot.id,
                    name: plot.name || '',
                    label: plot.label || '',
                    site_name: plot.site_name || '',
                    available: plot.available || 0,
                }
            ]);
        }
    };

    const handleRemovePlot = (plotId: number) => {
        setSelectedPlots(prev => prev.filter(plot => plot.id !== plotId));
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = (item: { column: string; order: "ASC" | "DESC" }) => {
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

    const columns: any[] = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps("name", filters, handleSetFilters),
        },
        {
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 100,
            ...getColumnSearchProps("label", filters, handleSetFilters),
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps("site_name", filters, handleSetFilters),
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader("Total Trees", "total", orderBy, handleSortingChange),
            align: "right",
            width: 100,
        },
        {
            dataIndex: "tree_count",
            key: "Trees",
            title: getSortableHeader("Trees", "tree_count", orderBy, handleSortingChange),
            align: "right",
            width: 100,
        },
        {
            dataIndex: "booked",
            key: "Booked Trees",
            title: getSortableHeader("Booked Trees", "booked", orderBy, handleSortingChange),
            align: "right",
            width: 100,
        },
        {
            dataIndex: "assigned",
            key: "Assigned Trees",
            title: getSortableHeader("Assigned Trees", "assigned", orderBy, handleSortingChange),
            align: "right",
            width: 100,
        },
        {
            dataIndex: "unbooked_assigned",
            key: "Unfunded Inventory (Assigned)",
            title: getSortableHeader("Unfunded Inventory (Assigned)", "unbooked_assigned", orderBy, handleSortingChange),
            align: "right",
            width: 120,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory (Unassigned)",
            title: getSortableHeader("Unfunded Inventory (Unassigned)", "available", orderBy, handleSortingChange),
            align: "right",
            width: 120,
        },
        {
            dataIndex: "card_available",
            key: "Giftable Inventory",
            title: getSortableHeader("Giftable Inventory", "card_available", orderBy, handleSortingChange),
            align: "right",
            width: 100,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Action",
            align: "center",
            width: 120,
            render: (_: any, record: Plot) => (
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={selectedPlots.some(p => p.id === record.id)}
                    onClick={() => handleSelectPlot(record)}
                >
                    {selectedPlots.some(p => p.id === record.id) ? "Selected" : "Select"}
                </Button>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth
            sx={{ "& .MuiDialog-paper": { width: "90%", maxWidth: "none", maxHeight: "80vh" } }}>
            <DialogTitle>Add Plots to {type === "donate" ? "Donations" : "Gift Requests"}</DialogTitle>
            <DialogContent dividers>
                <GeneralTable
                    loading={loading}
                    rows={plots}
                    columns={columns}
                    totalRecords={totalRecords}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(newPage, newSize) => {
                        setPage(newPage - 1);
                        setPageSize(newSize);
                    }}
                    footer
                    tableName="available-plots"
                    onDownload={async () => []}
                />

                {selectedPlots.length > 0 && (
                    <Paper elevation={1} sx={{ p: 3, mt: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" color="success">
                                Selected Plots
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Plots Selected: {selectedPlots.length}
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Plot Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Site Name</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Available Trees</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedPlots.map((plot) => (
                                        <TableRow key={plot.id}>
                                            <TableCell>{plot.name}</TableCell>
                                            <TableCell>{plot.label}</TableCell>
                                            <TableCell>{plot.site_name}</TableCell>
                                            <TableCell align="right">{plot.available}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemovePlot(plot.id)}
                                                    aria-label="remove"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="error"
                    variant="outlined"
                    size="medium"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAdd}
                    color="success"
                    variant="contained"
                    disabled={selectedPlots.length === 0}
                    size="medium"
                >
                    Add Selected
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPlotsDialog;