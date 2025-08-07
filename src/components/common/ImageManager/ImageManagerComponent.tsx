import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';

import { ImageManagerProps } from './types';
import { useImageManager } from './hooks/useImageManager';
import ImagePreviewModal from './components/ImagePreviewModal';

// Components
import ImageManagerHeader from './components/ImageManagerHeader';
import ImageManagerFooter from './components/ImageManagerFooter';
import ImageUploadSection from './components/ImageUploadSection';
import ImageGrid from './components/ImageGrid';

const ImageManagerComponent: React.FC<ImageManagerProps> = ({
  entityId,
  entityName,
  open,
  onClose,
  apiMethods,
  title = 'Image Manager',
  layout = 'modal',
  maxWidth = 'lg',
  fullWidth = true,
  height = '90vh',
  acceptedFileTypes = 'image/*',
  supportedFormats = 'JPG, PNG, GIF, WebP',
  showEntityName = true,
}) => {
  const {
    loading,
    uploading,
    uploadProgress,
    images,
    selectedFiles,
    previewImage,
    dragOver,
    viewMode,
    photoSize,
    setPreviewImage,
    setDragOver,
    setViewMode,
    setPhotoSize,
    handleFileSelect,
    handleFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeSelectedFile,
    uploadImages,
    removeImage,
    handleDragEnd,
    moveImage,
  } = useImageManager({ entityId, open, apiMethods });

  const content = (
    <>
      <ImageManagerHeader 
        title={title}
        entityName={entityName} 
        viewMode={viewMode}
        photoSize={photoSize}
        onViewModeChange={setViewMode}
        onPhotoSizeChange={setPhotoSize}
        onClose={onClose}
        showEntityName={showEntityName}
      />
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {loading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
          <Grid container spacing={3}>
            <ImageUploadSection
              selectedFiles={selectedFiles}
              uploading={uploading}
              uploadProgress={uploadProgress}
              dragOver={dragOver}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleFileSelect={handleFileSelect}
              removeSelectedFile={removeSelectedFile}
              uploadImages={uploadImages}
              acceptedFileTypes={acceptedFileTypes}
              supportedFormats={supportedFormats}
            />

            <ImageGrid
              images={images}
              loading={loading}
              viewMode={viewMode}
              photoSize={photoSize}
              onPreview={setPreviewImage}
              onRemove={removeImage}
              onMove={moveImage}
              onDragEnd={handleDragEnd}
            />
          </Grid>
        </Box>
      </DialogContent>

      <ImageManagerFooter
        imageCount={images.length}
        uploading={uploading}
        onClose={onClose}
        entityType={title.toLowerCase().includes('event') ? 'event' : 'entity'}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={!!previewImage}
        imageUrl={previewImage || ''}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );

  if (layout === 'dialog') {
    // For dialog layout, return content without wrapping Dialog
    // This allows parent components to wrap it in their own dialog
    return <>{content}</>;
  }

  // Default modal layout
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          height: height,
          maxHeight: height,
        },
      }}
    >
      {content}
    </Dialog>
  );
};

export default ImageManagerComponent;