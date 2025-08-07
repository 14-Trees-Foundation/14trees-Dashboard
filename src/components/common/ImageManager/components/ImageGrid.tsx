import React from 'react';
import {
  Grid,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { ImageItem, ViewMode, PhotoSize } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: ImageItem[];
  loading: boolean;
  viewMode: ViewMode;
  photoSize: PhotoSize;
  onPreview: (imageUrl: string) => void;
  onRemove: (imageId: number) => void;
  onMove: (imageId: number, direction: 'up' | 'down') => void;
  onDragEnd: (result: DropResult) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  viewMode,
  photoSize,
  onPreview,
  onRemove,
  onMove,
  onDragEnd,
}) => {
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle1" gutterBottom>
        Current Images ({images.length})
      </Typography>
      
      {images.length === 0 ? (
        <Alert severity="info">No images associated yet.</Alert>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction={viewMode === 'horizontal' ? 'horizontal' : 'vertical'}>
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  display: 'flex',
                  flexDirection: viewMode === 'horizontal' ? 'row' : 'column',
                  flexWrap: viewMode === 'horizontal' ? 'wrap' : 'nowrap',
                  gap: 2,
                  minHeight: 200,
                  ...(viewMode === 'vertical' && {
                    maxHeight: '60vh',
                    overflowY: 'auto',
                  }),
                }}
              >
                {images.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === images.length - 1}
                    loading={loading}
                    onPreview={onPreview}
                    onRemove={onRemove}
                    onMove={onMove}
                    viewMode={viewMode}
                    photoSize={photoSize}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Grid>
  );
};

export default ImageGrid;