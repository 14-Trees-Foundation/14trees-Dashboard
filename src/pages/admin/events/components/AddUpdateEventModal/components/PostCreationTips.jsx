import React from 'react';
import { Alert, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

const PostCreationTips = ({ formData, isEditMode }) => {
    if (isEditMode) return null;

    return (
        <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            icon={<Info />}
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Post-Creation Action Items:
            </Typography>
            <Typography variant="body2" component="div">
                • Add event message and {formData.type === '2' ? 'memory photos' : 'event images'} via "Edit Event"<br/>
                • Associate trees with this event<br/>
                • Enable user messages for the event<br/>
                • Configure event settings and permissions
            </Typography>
        </Alert>
    );
};

export default PostCreationTips;