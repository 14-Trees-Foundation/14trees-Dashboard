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
import LocationPicker from '../../../../../../components/LocationPicker';

const EventFormFields = ({ 
    formData, 
    handleChange, 
    isEditMode,
    eventTypes,
    locationOptions,
    themeColorOptions
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
                    <InputLabel>Location Type</InputLabel>
                    <Select
                        name="event_location"
                        value={formData.event_location}
                        onChange={handleChange}
                        label="Location Type"
                    >
                        {locationOptions.map((location) => (
                            <MenuItem key={location.value} value={location.value}>
                                {location.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        Choose whether the event is onsite or offsite
                    </FormHelperText>
                </FormControl>
            </Grid>

            {/* Optional: detailed location search + map (not required) */}
            <Grid item xs={12}>
                <LocationPicker
                    value={formData.location ? [formData.location] : []}
                    onChange={(locations) => {
                        // store single selected location object (or null)
                        const locationObj = Array.isArray(locations) && locations.length > 0 ? locations[0] : null;
                        handleChange({
                            target: {
                                name: 'location',
                                value: locationObj
                            }
                        });
                    }}
                    label="Location (optional)"
                    helperText="Search area and pick a point on the map (optional)"
                    required={false}
                    maxLocations={1}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Event Theme Color</InputLabel>
                    <Select
                        name="theme_color"
                        value={formData.theme_color || ''}
                        onChange={handleChange}
                        label="Event Theme Color"
                    >
                        {themeColorOptions.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                                {color.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        Optional: Choose a theme color for the event page
                    </FormHelperText>
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