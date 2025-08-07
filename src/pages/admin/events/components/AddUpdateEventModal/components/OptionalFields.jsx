import React from 'react';
import {
    Grid,
    TextField,
    Typography,
    Divider,
} from '@mui/material';

const OptionalFields = ({ formData, handleChange }) => {
    return (
        <>
            {/* Optional Fields Section */}
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Optional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="message"
                    label="Event Message"
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Welcome message or event details for participants"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="tags"
                    label="Tags"
                    value={formData.tags}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Comma-separated tags (e.g., memorial, family, corporate)"
                />
            </Grid>
        </>
    );
};

export default OptionalFields;