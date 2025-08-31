export const useEventValidation = () => {
    const validateForm = (formData, mode) => {
        // Basic validation for required fields
        const requiredFields = mode === 'add' 
            ? ['name', 'type', 'event_date', 'event_location', 'assigned_by']
            : ['name', 'type', 'event_date', 'event_location']; // Less strict for edit
        
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            // Map field names to user-friendly names for the error message
            const fieldNames = {
                'name': 'Event Name',
                'type': 'Event Type',
                'event_date': 'Event Date',
                'event_location': 'Event Location',
                'assigned_by': 'Organiser/Point of Contact'
            };
            const friendlyFieldNames = missingFields.map(field => fieldNames[field] || field);
            return {
                isValid: false,
                error: `Please fill in the following required fields: ${friendlyFieldNames.join(', ')}`
            };
        }

        return { isValid: true, error: null };
    };

    const shouldShowPostCreationTips = (formData, mode) => {
        if (mode !== 'add') return false;
        
        const imageField = formData.type === '2' ? 'memories' : 'images';
        const optionalFields = ['message', imageField];
        const emptyOptionalFields = optionalFields.filter(field => 
            !formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)
        );
        
        return emptyOptionalFields.length > 0;
    };

    return {
        validateForm,
        shouldShowPostCreationTips,
    };
};