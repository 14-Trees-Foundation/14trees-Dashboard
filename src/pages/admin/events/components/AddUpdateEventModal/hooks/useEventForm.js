import { useState, useEffect } from 'react';

export const useEventForm = (mode, existingEvent) => {
    // Helper function to format date for HTML date input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    };

    // Sanitize tags for text input display
    const sanitizeTagsForInput = (raw) => {
        if (!raw) return '';
        if (Array.isArray(raw)) return raw.join(', ');
        return String(raw)
            .replace(/[\{\}\[\]\"\']/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .join(', ');
    };

    // Initialize form data based on mode
    const getInitialFormData = () => {
        if (mode === 'edit' && existingEvent) {
            return {
                id: existingEvent.id || '',
                type: existingEvent.type || '',
                name: existingEvent.name || '',
                event_date: formatDateForInput(existingEvent.event_date) || '',
                event_location: existingEvent.event_location || '',
                location: existingEvent.location || null,
                theme_color: existingEvent.theme_color || '',
                assigned_by: existingEvent.assigned_by || '',
                site_id: existingEvent.site_id || '',
                message: existingEvent.message || '',
                tags: sanitizeTagsForInput(existingEvent.tags || ''),
                default_tree_view_mode: existingEvent.default_tree_view_mode || 'profile',
                // Load existing images and memories from the event
                images: existingEvent.images || [],
                memories: existingEvent.memories || [],
                event_poster: existingEvent.event_poster || null,
                landing_image: null,
                landing_image_s3_path: existingEvent.landing_image_s3_path || null,
                landing_image_mobile: null,
                landing_image_mobile_s3_path: existingEvent.landing_image_mobile_s3_path || null,
                blessings_cta_text: existingEvent.blessings_cta_text || '',
            };
        }
        return {
            type: '',
            name: '',
            event_date: '',
            event_location: '',
            location: null,
            theme_color: '',
            assigned_by: '',
            site_id: '',
            message: '',
            tags: '',
            default_tree_view_mode: 'profile',
            images: [],
            memories: [],
            event_poster: null,
            landing_image: null,
            landing_image_s3_path: null,
            landing_image_mobile: null,
            landing_image_mobile_s3_path: null,
            blessings_cta_text: '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form data when mode or existingEvent changes
    useEffect(() => {
        setFormData(getInitialFormData());
    }, [mode, existingEvent]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const resetForm = () => {
        setFormData(getInitialFormData());
        setIsSubmitting(false);
    };

    return {
        formData,
        isSubmitting,
        setIsSubmitting,
        handleChange,
        updateFormData,
        resetForm,
    };
};