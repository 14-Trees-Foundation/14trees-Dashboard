import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Alert
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import CSVUploadSection from "./components/DonationCSV";
import ApiClient from "../../../api/apiClient/apiClient";

interface CSRBulkDonationProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (recipients: any[]) => void;
    groupId: number;
    isSubmitting?: boolean;
    error?: string | null;
}

const CSRBulkDonation: React.FC<CSRBulkDonationProps> = ({
    open,
    onClose,
    onSubmit,
    groupId,
    isSubmitting = false,
    error = null
}) => {
    const [isValid, setIsValid] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [recipients, setRecipients] = useState<any[]>([]);
    const [remainingTrees, setRemainingTrees] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchRemainingTrees = async () => {
        try {
            const apiClient = new ApiClient();
            setLoading(true);
            const data = await apiClient.getMappedDonationTreesAnalytics("group", groupId);
            setRemainingTrees(data.remaining_trees);
        } catch (err: any) {
            console.error("Failed to fetch remaining trees:", err.message || "Failed to fetch remaining trees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchRemainingTrees();
        }
    }, [open]);

    const handleValidationChange = (valid: boolean, uploaded: boolean, error: string) => {
        setIsValid(valid);
        setIsUploaded(uploaded);
        setValidationError(error);
    };

    const handleRecipientsChange = (newRecipients: any[]) => {
        setRecipients(newRecipients);
    };

    const handleSubmit = () => {
        if (isValid && recipients.length > 0) {
            onSubmit(recipients.map(r => ({
                recipient_name: r.name,
                recipient_email: r.email,
                recipient_phone: r.phone,
                assignee_name: r.assigneeName || r.name,
                assignee_email: r.assigneeEmail || r.email,
                assignee_phone: r.assigneePhone || r.email,
                trees_count: r.trees_count ||  1,
                image_url: r.image_url,
              })));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Bulk Donate Trees
            </DialogTitle>
            <DialogContent dividers>
                {(error || validationError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error || validationError}
                    </Alert>
                )}
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : remainingTrees !== null ? (
                    <CSVUploadSection
                        onValidationChange={handleValidationChange}
                        onRecipientsChange={handleRecipientsChange}
                        groupId={groupId}
                        totalTreesSelected={remainingTrees}
                    />
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="error"
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <LoadingButton
                    onClick={handleSubmit}
                    color="success"
                    variant="contained"
                    disabled={!isValid || !isUploaded || recipients.length === 0}
                    loading={isSubmitting}
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CSRBulkDonation;
