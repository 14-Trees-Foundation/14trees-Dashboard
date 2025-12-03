import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Grid, 
    Modal, 
    Typography, 
    Stack,
    CircularProgress
} from '@mui/material';

// Hooks
import { useEventForm } from './hooks/useEventForm';
import { useEventValidation } from './hooks/useEventValidation';

// Components
import EventFormFields from './components/EventFormFields';
import OptionalFields from './components/OptionalFields';
import FileUploadSection from './components/FileUploadSection';
import PostCreationTips from './components/PostCreationTips';

// Common Components
import UserLookupComponent from '../../../../../components/common/UserLookup/UserLookupComponent';
import { USER_LOOKUP_PRESETS } from '../../../../../components/common/UserLookup/types';

const AddUpdateEventModal = ({ 
    open, 
    handleClose, 
    mode = 'add', // 'add' or 'edit'
    existingEvent = null,
    onSubmit // Callback function for form submission
}) => {
    const [showPostCreationTips, setShowPostCreationTips] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Custom hooks
    const {
        formData,
        isSubmitting,
        setIsSubmitting,
        handleChange,
        updateFormData,
        resetForm,
    } = useEventForm(mode, existingEvent);

    const { validateForm, shouldShowPostCreationTips } = useEventValidation();

    // Constants
    const eventTypes = [
        { value: '1', label: 'Regular Event' },
        { value: '2', label: 'Memorial Event' },
        { value: '3', label: 'Corporate Event' },
        { value: '4', label: 'Community Event' },
        { value: '5', label: 'Wedding Event' }
    ];

    const themeColorOptions = [
        { value: 'yellow', label: 'Yellow' },
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'pink', label: 'Pink' },
    ];

    const locationOptions = [
        { value: 'onsite', label: 'Onsite' },
        { value: 'offsite', label: 'Offsite' }
    ];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: '80vh',
        maxHeight: 650,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form
        const validation = validateForm(formData, mode);
        if (!validation.isValid) {
            alert(validation.error);
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Show post-creation tips for add mode if optional fields are empty
            if (mode === 'add' && shouldShowPostCreationTips(formData, mode)) {
                setShowPostCreationTips(true);
            }

            // Prepare form data for submission - convert empty site_id to null
            // Normalize tags: accept comma-separated string or array, trim and dedupe
            const normalizeTags = (tagsVal) => {
                if (!tagsVal) return [];
                if (Array.isArray(tagsVal)) {
                    return Array.from(new Set(tagsVal.map(t => String(t).trim()).filter(Boolean)));
                }
                const cleaned = String(tagsVal)
                    // remove any surrounding or inline braces/brackets and quotes
                    .replace(/[\{\}\[\]\"\']/g, '')
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean);
                return Array.from(new Set(cleaned));
            };

            const submissionData = {
                ...formData,
                site_id: formData.site_id === '' ? null : formData.site_id,
                tags: normalizeTags(formData.tags)
            };

            // Call the callback function with prepared form data
            await onSubmit(submissionData);
            
        } catch (error) {
            console.error(`Error in ${mode} form submission:`, error);
            // Parent function will handle the error display
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose_Custom = () => {
        resetForm();
        setSelectedUser(null);
        setShowPostCreationTips(false);
        handleClose();
    };

    const handleUserChange = (user) => {
        setSelectedUser(user);
        updateFormData({
            assigned_by: user ? user.id : ''
        });
    };

    const isEditMode = mode === 'edit';
    const modalTitle = isEditMode 
        ? `Edit Event ${existingEvent?.id ? `(ID: ${existingEvent.id})` : ''}` 
        : 'Create New Event';
    const submitButtonText = isEditMode ? 'Update Event' : 'Create Event';

    return (
        <div>
            <Modal
                open={open}
                onClose={isSubmitting ? undefined : handleClose_Custom}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" align="center" sx={{ marginBottom: '16px' }}>
                        {modalTitle}
                    </Typography>
                    
                    {showPostCreationTips && (
                        <PostCreationTips formData={formData} isEditMode={isEditMode} />
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1}>
                            
                            <EventFormFields
                                formData={formData}
                                handleChange={handleChange}
                                isEditMode={isEditMode}
                                eventTypes={eventTypes}
                                locationOptions={locationOptions}
                                themeColorOptions={themeColorOptions}
                            />

                            <Grid item xs={12}>
                                <UserLookupComponent
                                    {...USER_LOOKUP_PRESETS.EVENT_ORGANIZER}
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                    mode={mode}
                                    initialUserId={existingEvent?.assigned_by}
                                    required={!isEditMode}
                                />
                            </Grid>

                            <OptionalFields
                                formData={formData}
                                handleChange={handleChange}
                            />

                            <FileUploadSection
                                formData={formData}
                                updateFormData={updateFormData}
                                isSubmitting={isSubmitting}
                            />

                            {/* Action Buttons */}
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose_Custom}
                                        disabled={isSubmitting}
                                        size="large"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        size="large"
                                        startIcon={isSubmitting && <CircularProgress size={20} />}
                                    >
                                        {isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : submitButtonText}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddUpdateEventModal;