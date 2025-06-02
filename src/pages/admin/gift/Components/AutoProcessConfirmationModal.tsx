import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import ApiClient from '../../../../api/apiClient/apiClient';

interface AutoProcessConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    giftId: number;
    treesToBook: number;
}

interface PlotTreeCount {
    plot_id: number;
    trees_count: number;
    plot_name: string;
}

const AutoProcessConfirmationModal: React.FC<AutoProcessConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    giftId,
    treesToBook
}) => {
    const [plotDetails, setPlotDetails] = useState<PlotTreeCount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlotDetails = async () => {
            if (!open || !giftId) return;

            setIsLoading(true);
            setError(null);
            try {
                const apiClient = new ApiClient();
                const details = await apiClient.getPlotTreesCountForAutoProcessGiftRequest(giftId);
                setPlotDetails(details);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch plot details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlotDetails();
    }, [open, giftId]);

    const totalTrees = plotDetails.reduce((sum, plot) => sum + plot.trees_count, 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Auto Process Confirmation</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        This request will be automatically processed with the following steps:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2" gutterBottom>
                            Trees will be picked from pre-defined plots
                        </Typography>
                        <Typography component="li" variant="body2" gutterBottom>
                            Trees will only be assigned to recipients
                        </Typography>
                    </Box>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : error ? (
                    <DialogContentText color="error">
                        {error}
                    </DialogContentText>
                ) : plotDetails.length === 0 && treesToBook > 0 ? (
                    <DialogContentText color="warning.main">
                        No plots available for auto-processing. Please select plots manually.
                    </DialogContentText>
                ) : plotDetails.length > 0 && treesToBook > 0 ? (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Trees will be reserved from the following plots:
                        </Typography>
                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: '300px',
                                overflow: 'auto',
                                mb: 2
                            }}
                        >
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Plot Name</TableCell>
                                        <TableCell align="right">Trees Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plotDetails.map((plot) => (
                                        <TableRow key={plot.plot_id}>
                                            <TableCell>{plot.plot_name}</TableCell>
                                            <TableCell align="right">{plot.trees_count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="subtitle1">
                            Total trees to be reserved: <strong>{totalTrees}</strong>
                        </Typography>
                    </Box>
                ) : treesToBook === 0 && (
                    <DialogContentText color="success">
                        No trees to be reserved.
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="error"
                    variant="outlined"
                    disabled={loading}
                    style={{ textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color="success"
                    variant="contained"
                    disabled={loading || isLoading || (plotDetails.length === 0 && treesToBook > 0)}
                    style={{ textTransform: 'none' }}
                >
                    {loading ? 'Processing...' : 'Confirm Auto Process'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AutoProcessConfirmationModal;