import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface ImageItemProps {
  file: File | string;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  removeImage: (index: number) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ file, index, moveImage, removeImage }) => {
  const [, ref] = useDrag({
    type: 'IMAGE',
    item: { index },
  });
  
  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <Paper
      ref={(node) => ref(drop(node))}
      elevation={3}
      sx={{ display: 'flex', alignItems: 'center', p: 1, mb: 1 }}
    >
      <img
        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
        alt="Preview"
        width={60}
        height={60}
        style={{ marginRight: '10px', borderRadius: 4 }}
      />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {typeof file === 'string' ? file.split("/").slice(-1)[0] :file.name}
      </Typography>
      <IconButton color="error" onClick={() => removeImage(index)}>
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
};

interface AlbumImageInputProps {
  onSave: (images: (File | string)[]) => void;
  onClose: () => void;
  onDeleteAlbum?: () => void
  open: boolean;
  imageUrls?: string[]
}

const AlbumImageInput: React.FC<AlbumImageInputProps> = ({ onSave, onClose, open, imageUrls, onDeleteAlbum }) => {
  const [images, setImages] = useState<(File | string)[]>([]);

  useEffect(() => {
    setImages([]);
  }, [])

  useEffect(() => {
    if (imageUrls) {
      setImages(imageUrls);
    } else {
      setImages([]);
    }
  }, [imageUrls])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.slice(0, 10 - images.length);
      if (images.length + newImages.length > 10) {
        alert('You can only upload a maximum of 10 images.');
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    },
    [images]
  );

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      const [movedImage] = updatedImages.splice(fromIndex, 1);
      updatedImages.splice(toIndex, 0, movedImage);
      return updatedImages;
    });
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(images);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Modal open={open}>
      <Box sx={{ p: 3, maxWidth: 600, m: 'auto', mt: '5vh', mb: '5vh', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upload Images
        </Typography>
        <DndProvider backend={HTML5Backend}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              mb: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <input {...getInputProps()} />
            <UploadFileIcon color="primary" fontSize="large" />
            <Typography variant="body2">Drag & drop or click to select images (max 10)</Typography>
          </Box>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 2 }}>
            {images.map((file, index) => (
              <ImageItem
                key={index}
                file={file}
                index={index}
                moveImage={moveImage}
                removeImage={removeImage}
              />
            ))}
          </Box>
        </DndProvider>
        <Grid container spacing={1} justifyContent="flex-end">
          {onDeleteAlbum && imageUrls && imageUrls.length > 0 && <Grid item>
            <Button variant="contained" onClick={onDeleteAlbum} color="error">
              Delete
          </Button>
          </Grid>}
          <Grid item>
            <Button variant="outlined" onClick={onClose} color="error">
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSave} color="success">
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AlbumImageInput;
