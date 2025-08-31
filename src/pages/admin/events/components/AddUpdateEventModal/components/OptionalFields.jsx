import React from 'react';
import {
    Grid,
    TextField,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
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

            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="default-tree-view-mode-label">Default Tree View Mode</InputLabel>
                    <Select
                        labelId="default-tree-view-mode-label"
                        name="default_tree_view_mode"
                        value={formData.default_tree_view_mode || 'profile'}
                        onChange={handleChange}
                        label="Default Tree View Mode"
                    >
                        <MenuItem value="profile">Profile Images</MenuItem>
                        <MenuItem value="illustrations">Illustrations</MenuItem>
                    </Select>
                    <FormHelperText>
                        Choose the default view mode for trees in the event dashboard. 
                        Visitors can still switch between modes manually.
                    </FormHelperText>
                </FormControl>
            </Grid>
        </>
    );
};

export default OptionalFields;