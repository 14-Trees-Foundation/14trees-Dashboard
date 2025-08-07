import React from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    Divider,
} from '@mui/material';

const EventFormFields = ({ 
    formData, 
    handleChange, 
    isEditMode,
    eventTypes,
    locationOptions 
}) => {
    return (
        <>
            {/* Required Fields Section */}
            <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {isEditMode ? 'Event Information' : 'Required Information *'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="name"
                    label="Event Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required={!isEditMode}
                    placeholder="e.g., John's Memorial Tree Planting"
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth required={!isEditMode}>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="Event Type"
                    >
                        {eventTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        Memorial events show "Memorial Trees" and "Messages of Love"
                    </FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="event_date"
                    label="Event Date"
                    type="date"
                    value={formData.event_date}
                    onChange={handleChange}
                    fullWidth
                    required={!isEditMode}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth required={!isEditMode}>
                    <InputLabel>Event Location</InputLabel>
                    <Select
                        name="event_location"
                        value={formData.event_location}
                        onChange={handleChange}
                        label="Event Location"
                    >
                        {locationOptions.map((location) => (
                            <MenuItem key={location.value} value={location.value}>
                                {location.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Show site_id field in edit mode */}
            {isEditMode && (
                <Grid item xs={12}>
                    <TextField
                        name="site_id"
                        label="Site ID"
                        value={formData.site_id}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Site identifier"
                    />
                </Grid>
            )}
        </>
    );
};

export default EventFormFields;