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
    FormControlLabel,
    Checkbox,
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

            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="show_blessings"
                            checked={formData.show_blessings !== false}
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'show_blessings',
                                    value: e.target.checked
                                }
                            })}
                        />
                    }
                    label="Show Blessings Section"
                />
                <FormHelperText>
                    When enabled, visitors will see the "Add Blessings" section on the event dashboard.
                </FormHelperText>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="blessings_cta_text"
                    label="Blessings Button Text"
                    value={formData.blessings_cta_text || ''}
                    onChange={handleChange}
                    fullWidth
                    placeholder='Bless the bride and groom!'
                    inputProps={{ maxLength: 100 }}
                />
                <FormHelperText>
                    Custom label for the blessings CTA button. Leave blank to use the default text.
                </FormHelperText>
            </Grid>
        </>
    );
};

export default OptionalFields;