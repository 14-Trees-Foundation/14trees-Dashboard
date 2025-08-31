import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { DropResult } from 'react-beautiful-dnd';
import { UseImageManagerProps, UseImageManagerReturn, ViewMode, PhotoSize, ImageItem } from '../types';

export const useImageManager = ({ 
  entityId, 
  open,
  apiMethods
}: UseImageManagerProps): UseImageManagerReturn => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('horizontal');
  const [photoSize, setPhotoSize] = useState<PhotoSize>('small');

  useEffect(() => {
    if (open && entityId) {
      loadImages();
    }
  }, [open, entityId]);

  // Update photo size defaults when view mode changes
  useEffect(() => {
    if (viewMode === 'horizontal') {
      setPhotoSize('small');
    } else {
      setPhotoSize('large');
    }
  }, [viewMode]);

  const loadImages = async () => {
    if (!entityId) {
      console.warn('Cannot load images: entityId is undefined');
      return;
    }
    
    setLoading(true);
    try {
      const imageList = await apiMethods.getImages(entityId);
      setImages(imageList.sort((a, b) => a.sequence - b.sequence));
    } catch (error: any) {
      toast.error(`Failed to load images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      toast.warning('Only image files are allowed');
    }
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (!entityId) {
      toast.error('Cannot upload images: Entity ID is missing');
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast.warning('Please select images to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const uploadedImages = await apiMethods.uploadImages(entityId, selectedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(`${uploadedImages.length} images uploaded successfully!`);
      setSelectedFiles([]);
      await loadImages();
    } catch (error: any) {
      toast.error(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (imageId: number) => {
    if (!entityId) {
      toast.error('Cannot remove image: Entity ID is missing');
      return;
    }
    
    setLoading(true);
    try {
      await apiMethods.removeImages(entityId, [imageId]);
      toast.success('Image removed successfully!');
      await loadImages();
    } catch (error: any) {
      toast.error(`Failed to remove image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !entityId) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setImages(items);

    // Update sequences
    const imageSequences = items.map((image, index) => ({
      id: image.id,
      sequence: index,
    }));

    try {
      await apiMethods.reorderImages(entityId, imageSequences);
      toast.success('Images reordered successfully!');
    } catch (error: any) {
      toast.error(`Failed to reorder images: ${error.message}`);
      // Reload images to revert changes
      await loadImages();
    }
  };

  const moveImage = async (imageId: number, direction: 'up' | 'down') => {
    if (!entityId) return;
    
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const items = Array.from(images);
    const [movedItem] = items.splice(currentIndex, 1);
    items.splice(newIndex, 0, movedItem);

    setImages(items);

    const imageSequences = items.map((image, index) => ({
      id: image.id,
      sequence: index,
    }));

    try {
      await apiMethods.reorderImages(entityId, imageSequences);
      toast.success('Image moved successfully!');
    } catch (error: any) {
      toast.error(`Failed to move image: ${error.message}`);
      await loadImages();
    }
  };

  return {
    // State
    loading,
    uploading,
    uploadProgress,
    images,
    selectedFiles,
    previewImage,
    dragOver,
    viewMode,
    photoSize,
    
    // Setters
    setPreviewImage,
    setDragOver,
    setViewMode,
    setPhotoSize,
    
    // Actions
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
  };
};