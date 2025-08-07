import React from 'react';
import {
  DialogTitle,
  Typography,
  Box,
  IconButton,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  ViewModule as HorizontalIcon,
  ViewList as VerticalIcon,
} from '@mui/icons-material';
import { ViewMode, PhotoSize } from '../types';

interface ImageManagerHeaderProps {
  title: string;
  entityName?: string;
  viewMode: ViewMode;
  photoSize: PhotoSize;
  onViewModeChange: (mode: ViewMode) => void;
  onPhotoSizeChange: (size: PhotoSize) => void;
  onClose: () => void;
  showEntityName?: boolean;
}

const ImageManagerHeader: React.FC<ImageManagerHeaderProps> = ({ 
  title,
  entityName, 
  viewMode, 
  photoSize,
  onViewModeChange, 
  onPhotoSizeChange,
  onClose,
  showEntityName = true,
}) => {
  const theme = useTheme();

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  const handlePhotoSizeChange = (event: any) => {
    onPhotoSizeChange(event.target.value as PhotoSize);
  };

  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <ImageIcon color="primary" />
        <Typography variant="h5" component="div" fontWeight="bold">
          {title}{showEntityName && entityName ? ` - ${entityName}` : ''}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={photoSize}
            onChange={handlePhotoSizeChange}
            displayEmpty
            sx={{ 
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                py: 0.5,
              }
            }}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Switch view mode">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="horizontal" aria-label="horizontal view">
              <HorizontalIcon />
            </ToggleButton>
            <ToggleButton value="vertical" aria-label="vertical view">
              <VerticalIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>
        
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
};

export default ImageManagerHeader;