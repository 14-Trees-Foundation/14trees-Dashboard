import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MAX_CHARS = 1000;

interface FeedbackFormProps {
    open: boolean
    onClose: () => void
    onSubmit: (feedback: string, sourceInfo: string) => void
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ open, onClose, onSubmit }) => {

    const [feedback, setFeedback] = useState('');
    const [sourceInfo, setSourceInfo] = useState('');

    useEffect(() => {
        setFeedback('');
        setSourceInfo('');
    }, [open])

    const handleSubmit = () => {
        onSubmit(feedback, sourceInfo);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        if (value.length <= MAX_CHARS) {
            if (name === 'feedback') setFeedback(value);
            else setSourceInfo(value)
        }
    };

    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Feedback & Comments</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Would you like to provide any comments or feedback?
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        variant="outlined"
                        placeholder='Feedback...'
                        value={feedback}
                        type='text'
                        name="feedback"
                        onChange={handleChange}
                        sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right' }}>
                        {MAX_CHARS - feedback.length} characters remaining
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        How did you hear about 14 trees?
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        value={sourceInfo}
                        type='text'
                        name="sourceInfo"
                        onChange={handleChange}
                        sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right' }}>
                        {MAX_CHARS - sourceInfo.length} characters remaining
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Skip
                </Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default FeedbackForm;