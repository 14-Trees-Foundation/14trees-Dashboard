import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    Typography,
    Card,
    CardMedia,
    IconButton,
    Box,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const FileUploadSection = ({ 
    formData, 
    updateFormData, 
    isSubmitting 
}) => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [posterPreview, setPosterPreview] = useState(null);
    const [landingPreview, setLandingPreview] = useState(null);

    // Utility function to format file sizes
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handlePosterUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Clean up old preview URL
        if (posterPreview && posterPreview.url && !posterPreview.isExisting) {
            URL.revokeObjectURL(posterPreview.url);
        }

        // Create preview
        const preview = {
            file: file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            isExisting: false
        };

        setPosterPreview(preview);
        updateFormData({ event_poster: file });
    };

    const removePoster = () => {
        if (posterPreview && posterPreview.url && !posterPreview.isExisting) {
            URL.revokeObjectURL(posterPreview.url);
        }
        setPosterPreview(null);
        updateFormData({ event_poster: null });
    };

    const handleLandingUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Clean up old preview URL
        if (landingPreview && landingPreview.url && !landingPreview.isExisting) {
            URL.revokeObjectURL(landingPreview.url);
        }

        const preview = {
            file: file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            isExisting: false
        };

        setLandingPreview(preview);
        // Store File object for upload and clear any existing s3 path
        updateFormData({ landing_image: file, landing_image_s3_path: null });
    };

    const removeLanding = () => {
        if (landingPreview && landingPreview.url && !landingPreview.isExisting) {
            URL.revokeObjectURL(landingPreview.url);
        }
        setLandingPreview(null);
        updateFormData({ landing_image: null, landing_image_s3_path: null });
    };

    const handleFileUpload = (event, fieldName) => {
        const files = Array.from(event.target.files);
        
        // Clean up old preview URLs to avoid memory leaks (only for new uploads)
        imagePreviews.forEach(preview => {
            if (preview.url && !preview.isExisting) {
                URL.revokeObjectURL(preview.url);
            }
        });
        
        // Keep existing images and add new ones
        const existingImages = imagePreviews.filter(preview => preview.isExisting);
        
        // Generate new preview URLs for uploaded files
        const newPreviews = files.map((file, index) => ({
            id: `${fieldName}-${index}-${Date.now()}`,
            file: file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            isExisting: false
        }));
        
        // Combine existing and new images
        const allPreviews = [...existingImages, ...newPreviews];
        setImagePreviews(allPreviews);
        
        // Update form data with both existing URLs and new File objects
        const allData = allPreviews.map(preview => {
            if (preview.isExisting) {
                return preview.url; // URL string for existing images
            }
            return preview.file; // File object for new uploads
        });
        
        updateFormData({
            [fieldName]: allData,
        });
    };

    const removeImage = (imageId) => {
        const updatedPreviews = imagePreviews.filter(preview => {
            if (preview.id === imageId) {
                // Clean up URL only for new uploads (not existing images)
                if (preview.url && !preview.isExisting) {
                    URL.revokeObjectURL(preview.url);
                }
                return false;
            }
            return true;
        });
        
        setImagePreviews(updatedPreviews);
        
        // Update form data based on remaining images
        const fieldName = formData.type === '2' ? 'memories' : 'images';
        const remainingData = updatedPreviews.map(preview => {
            // For existing images, return the URL string
            if (preview.isExisting) {
                return preview.url;
            }
            // For new uploads, return the File object
            return preview.file;
        });
        
        updateFormData({
            [fieldName]: remainingData,
        });
    };

    // Clear image previews when event type changes
    useEffect(() => {
        if (imagePreviews.length > 0) {
            // Clean up old previews when event type changes (only for new uploads)
            imagePreviews.forEach(preview => {
                if (preview.url && !preview.isExisting) {
                    URL.revokeObjectURL(preview.url);
                }
            });
            setImagePreviews([]);
            updateFormData({
                images: [],
                memories: []
            });
        }
    }, [formData.type]);

    // Initialize existing images when form data changes (for edit mode)
    useEffect(() => {
        const fieldName = formData.type === '2' ? 'memories' : 'images';
        const existingImages = formData[fieldName];
        
        // Only initialize if we have existing images and no current previews
        if (existingImages && existingImages.length > 0 && imagePreviews.length === 0) {
            // Check if these are URL strings (existing images) or File objects (new uploads)
            const areUrlStrings = existingImages.every(item => typeof item === 'string');
            
            if (areUrlStrings) {
                // These are existing images (URL strings)
                const existingPreviews = existingImages.map((imageUrl, index) => ({
                    id: `existing-${fieldName}-${index}`,
                    url: imageUrl,
                    name: `Existing Image ${index + 1}`,
                    isExisting: true, // Flag to identify existing images
                }));
                setImagePreviews(existingPreviews);
            }
        }
    }, [formData.images, formData.memories, formData.type]);

    // Initialize poster preview from existing data (for edit mode)
    useEffect(() => {
        if (formData.event_poster && typeof formData.event_poster === 'string' && !posterPreview) {
            setPosterPreview({
                url: formData.event_poster,
                name: 'Existing Poster',
                isExisting: true
            });
        }
    }, [formData.event_poster]);

    // Initialize landing preview from existing data (for edit mode)
    useEffect(() => {
        if (formData.landing_image_s3_path && !landingPreview) {
            setLandingPreview({
                url: formData.landing_image_s3_path,
                name: 'Existing Landing Image',
                isExisting: true
            });
        }
    }, [formData.landing_image_s3_path]);

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            // Clean up all preview URLs when component unmounts (only for new uploads)
            imagePreviews.forEach(preview => {
                if (preview.url && !preview.isExisting) {
                    URL.revokeObjectURL(preview.url);
                }
            });
            // Clean up poster preview
            if (posterPreview && posterPreview.url && !posterPreview.isExisting) {
                URL.revokeObjectURL(posterPreview.url);
            }
            // Clean up landing preview
            if (landingPreview && landingPreview.url && !landingPreview.isExisting) {
                URL.revokeObjectURL(landingPreview.url);
            }
        };
    }, [imagePreviews, posterPreview, landingPreview]);

    return (
        <>
            {/* Event Poster Upload Section */}
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Event Poster (Optional)
                </Typography>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                >
                    Upload Event Poster
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePosterUpload}
                    />
                </Button>

                {/* Poster Preview */}
                {posterPreview && (
                    <Card sx={{ position: 'relative', mb: 2 }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={posterPreview.url}
                            alt={posterPreview.name}
                            sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                        />
                        <IconButton
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                            onClick={removePoster}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                        <Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                            <Typography variant="caption" noWrap>
                                {posterPreview.name}
                            </Typography>
                            {posterPreview.size && (
                                <Typography variant="caption" display="block">
                                    {formatFileSize(posterPreview.size)}
                                </Typography>
                            )}
                        </Box>
                    </Card>
                )}
            </Grid>

            {/* Landing Image Upload Section */}
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Landing Image (Optional) — used on event landing page
                </Typography>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                >
                    Upload Landing Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLandingUpload}
                    />
                </Button>

                {/* Landing Preview */}
                {landingPreview && (
                    <Card sx={{ position: 'relative', mb: 2 }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={landingPreview.url}
                            alt={landingPreview.name}
                            sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }}
                        />
                        <IconButton
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                            onClick={removeLanding}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                        <Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                            <Typography variant="caption" noWrap>
                                {landingPreview.name}
                            </Typography>
                            {landingPreview.size && (
                                <Typography variant="caption" display="block">
                                    {formatFileSize(landingPreview.size)}
                                </Typography>
                            )}
                        </Box>
                    </Card>
                )}
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {formData.type === '2' ? 'Memory Photos' : 'Event Descriptive Image(s)'}
                </Typography>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                >
                    Upload {formData.type === '2' ? 'Memory Photos' : 'Event Descriptive Image(s)'}
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, formData.type === '2' ? 'memories' : 'images')}
                    />
                </Button>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        {imagePreviews.map((preview) => (
                            <Grid item xs={4} key={preview.id}>
                                <Card sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={preview.url}
                                        alt={preview.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 2,
                                            right: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                                        }}
                                        onClick={() => removeImage(preview.id)}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                                        <Typography variant="caption" noWrap>
                                            {preview.name}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            {formatFileSize(preview.size)}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default FileUploadSection;