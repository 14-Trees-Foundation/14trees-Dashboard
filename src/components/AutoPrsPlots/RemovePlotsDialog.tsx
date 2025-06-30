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
    Checkbox,
    Alert,
} from "@mui/material";
import { useState } from "react";
import { Plot } from "../../types/plot";

interface RemovePlotsDialogProps {
    open: boolean;
    onClose: () => void;
    type: "donate" | "gift-trees";
    currentPlots: Plot[];
    onRemovePlots: (plotIds: string[]) => Promise<void>;
}

const RemovePlotsDialog = ({ open, onClose, type, currentPlots, onRemovePlots }: RemovePlotsDialogProps) => {
    const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSelectPlot = (plotId: number, checked: boolean) => {
        if (checked) {
            setSelectedPlotIds(prev => [...prev, plotId]);
        } else {
            setSelectedPlotIds(prev => prev.filter(id => id !== plotId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedPlotIds(currentPlots.map(plot => plot.id));
        } else {
            setSelectedPlotIds([]);
        }
    };

    const handleRemove = async () => {
        if (selectedPlotIds.length > 0) {
            setLoading(true);
            try {
                await onRemovePlots(selectedPlotIds.map(id => String(id)));
                onClose();
                setSelectedPlotIds([]);
            } catch (error) {
                console.error("Failed to remove plots:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setSelectedPlotIds([]);
        onClose();
    };

    const isAllSelected = selectedPlotIds.length === currentPlots.length && currentPlots.length > 0;
    const isIndeterminate = selectedPlotIds.length > 0 && selectedPlotIds.length < currentPlots.length;

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="lg" 
            fullWidth
            sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "none", maxHeight: "80vh" } }}
        >
            <DialogTitle>
                Remove Plots from {type === "donate" ? "Donations" : "Gift Requests"} Auto-Processing
            </DialogTitle>
            <DialogContent dividers>
                {currentPlots.length === 0 ? (
                    <Alert severity="info">
                        No plots are currently configured for {type === "donate" ? "donation" : "gift request"} auto-processing.
                    </Alert>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Select the plots you want to remove from auto-processing configuration.
                            </Typography>
                        </Box>
                        
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" color="error">
                                    Current Auto-Processing Plots
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedPlotIds.length} of {currentPlots.length} selected
                                </Typography>
                            </Box>
                            
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={isIndeterminate}
                                                    checked={isAllSelected}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Plot Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Site Name</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Trees</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Available Trees</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Booked Trees</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentPlots.map((plot) => (
                                            <TableRow 
                                                key={plot.id}
                                                selected={selectedPlotIds.includes(plot.id)}
                                                hover
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedPlotIds.includes(plot.id)}
                                                        onChange={(e) => handleSelectPlot(plot.id, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>{plot.name || 'N/A'}</TableCell>
                                                <TableCell>{plot.label || 'N/A'}</TableCell>
                                                <TableCell>{plot.site_name || 'N/A'}</TableCell>
                                                <TableCell align="right">{plot.total || 0}</TableCell>
                                                <TableCell align="right">{plot.available || 0}</TableCell>
                                                <TableCell align="right">{plot.booked || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {selectedPlotIds.length > 0 && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Warning:</strong> Removing these plots will prevent them from being used for automatic processing of {type === "donate" ? "donations" : "gift requests"}. 
                                    This action cannot be undone, but you can re-add the plots later if needed.
                                </Typography>
                            </Alert>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="primary"
                    variant="outlined"
                    size="medium"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleRemove}
                    color="error"
                    variant="contained"
                    disabled={selectedPlotIds.length === 0 || loading}
                    size="medium"
                >
                    {loading ? "Removing..." : `Remove Selected (${selectedPlotIds.length})`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemovePlotsDialog;