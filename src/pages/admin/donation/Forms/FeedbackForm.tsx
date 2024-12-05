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
                <Typography variant="body1">
                    Thank you for your generous donation! We truly appreciate your support. You will shortly receive an acknowledgment from our back-office team.
                </Typography>
                <Box mt={3}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Do you have any feedback or comments you'd like to share with us?
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
                        We'd love to know—how did you hear about 14 Trees?
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