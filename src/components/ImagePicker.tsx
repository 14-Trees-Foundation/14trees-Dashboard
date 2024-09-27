import React, { useState, useRef } from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImagePickerProps {
    onChange: (file: File | null) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onChange }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            handleImageUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleReuploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%',
        }}>
            {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '90%' }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '40vh' }} />
                        <IconButton
                            aria-label="remove image"
                            onClick={handleRemoveImage}
                            size='small'
                            style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <Button variant="outlined" onClick={handleReuploadClick} style={{ marginTop: '10px' }}>
                            Reupload Image
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        width: '300px',
                        height: '200px',
                        border: '2px dashed #aaa',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <p>Drag and drop an image or</p>
                    <Button variant="outlined" onClick={handleReuploadClick}>
                        Upload Image
                    </Button>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImagePicker;
