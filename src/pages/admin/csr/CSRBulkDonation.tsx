import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";
import CSVUploadSection from "./components/DonationCSV";
import ApiClient from "../../../api/apiClient/apiClient";

type CSRBulkDonationProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (recipients: any[]) => void;
    groupId: number; // <-- changed from totalTreesSelected
};

const CSRBulkDonation: React.FC<CSRBulkDonationProps> = ({
    open,
    onClose,
    onSubmit,
    groupId
}) => {
    const [isValid, setIsValid] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [recipients, setRecipients] = useState<any[]>([]);
    const [remainingTrees, setRemainingTrees] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRemainingTrees = async () => {
        try {
            const apiClient = new ApiClient();
            setLoading(true);
            const data = await apiClient.getMappedDonationTreesAnalytics("group", groupId);
            setRemainingTrees(data.remaining_trees);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch remaining trees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchRemainingTrees();
        }
    }, [open]);

    const handleValidationChange = (valid: boolean, uploaded: boolean, _error: string) => {
        setIsValid(valid);
        setIsUploaded(uploaded);
    };

    const handleRecipientsChange = (recipients: any[]) => {
        setRecipients(recipients);
    };

    const handleSubmit = () => {
        if (isValid && isUploaded && recipients.length > 0) {
            onSubmit(recipients);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Assign Trees</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : remainingTrees !== null ? (
                    <CSVUploadSection
                        onValidationChange={handleValidationChange}
                        onRecipientsChange={handleRecipientsChange}
                        totalTreesSelected={remainingTrees}
                    />
                ) : null}
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button onClick={onClose} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        disabled={!isValid || !isUploaded}
                    >
                        Submit
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CSRBulkDonation;
