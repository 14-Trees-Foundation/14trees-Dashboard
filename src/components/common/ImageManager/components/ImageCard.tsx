import React from 'react';
import {
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import {
  Delete,
  Visibility,
  DragIndicator,
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';
import { getImageUrl } from '../utils/imageUtils';
import { ImageItem, ViewMode, PhotoSize } from '../types';

interface ImageCardProps {
  image: ImageItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  loading: boolean;
  viewMode: ViewMode;
  photoSize: PhotoSize;
  onPreview: (imageUrl: string) => void;
  onRemove: (imageId: number) => void;
  onMove: (imageId: number, direction: 'up' | 'down') => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  isFirst,
  isLast,
  loading,
  viewMode,
  photoSize,
  onPreview,
  onRemove,
  onMove,
}) => {
  // Get dimensions based on photo size and view mode
  const getDimensions = () => {
    if (viewMode === 'horizontal') {
      switch (photoSize) {
        case 'small':
          return { width: 200, height: 150 };
        case 'medium':
          return { width: 280, height: 210 };
        case 'large':
          return { width: 360, height: 270 };
        default:
          return { width: 200, height: 150 };
      }
    } else {
      // Vertical view
      switch (photoSize) {
        case 'small':
          return { width: 120, height: 90, cardHeight: 90 };
        case 'medium':
          return { width: 160, height: 120, cardHeight: 120 };
        case 'large':
          return { width: 200, height: 150, cardHeight: 150 };
        default:
          return { width: 200, height: 150, cardHeight: 150 };
      }
    }
  };

  const dimensions = getDimensions();

  return (
    <Draggable
      key={image.id}
      draggableId={image.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            width: viewMode === 'horizontal' ? dimensions.width : '100%',
            position: 'relative',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging ? 4 : 1,
            ...(viewMode === 'vertical' && {
              display: 'flex',
              flexDirection: 'row',
              height: dimensions.cardHeight || dimensions.height,
            }),
          }}
        >
          <Box
            {...provided.dragHandleProps}
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 1,
              p: 0.5,
            }}
          >
            <DragIndicator sx={{ color: 'white', fontSize: 16 }} />
          </Box>
          
          <Chip
            label={`#${image.sequence + 1}`}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
            }}
          />
          
          <CardMedia
            component="img"
            height={dimensions.height}
            image={getImageUrl(image.image_url)}
            alt={`Image ${index + 1}`}
            sx={{ 
              objectFit: 'cover',
              ...(viewMode === 'vertical' && {
                width: dimensions.width,
                flexShrink: 0,
              }),
            }}
          />
          
          <CardActions sx={{ 
            justifyContent: 'space-between', 
            p: 1,
            ...(viewMode === 'vertical' && {
              flexDirection: 'column',
              alignItems: 'stretch',
              flex: 1,
            }),
          }}>
            <Box sx={{
              ...(viewMode === 'vertical' && {
                display: 'flex',
                justifyContent: 'center',
                mb: 1,
              }),
            }}>
              <IconButton
                size="small"
                onClick={() => onMove(image.id, 'up')}
                disabled={isFirst || loading}
                title={viewMode === 'horizontal' ? 'Move left' : 'Move up'}
              >
                {viewMode === 'horizontal' ? <ArrowBack fontSize="small" /> : <ArrowUpward fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onMove(image.id, 'down')}
                disabled={isLast || loading}
                title={viewMode === 'horizontal' ? 'Move right' : 'Move down'}
              >
                {viewMode === 'horizontal' ? <ArrowForward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              </IconButton>
            </Box>
            
            <Box sx={{
              ...(viewMode === 'vertical' && {
                display: 'flex',
                justifyContent: 'center',
              }),
            }}>
              <IconButton
                size="small"
                onClick={() => onPreview(getImageUrl(image.image_url))}
              >
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemove(image.id)}
                disabled={loading}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      )}
    </Draggable>
  );
};

export default ImageCard;