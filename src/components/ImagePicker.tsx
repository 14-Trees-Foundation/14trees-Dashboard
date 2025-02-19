import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImagePickerProps {
    image: File | string | null;
    onChange: (file: File | null) => void;
    width?: number;
    height?: number;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ image, onChange, width, height }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: width || 50, aspect: width && height ? width / height : 1, x: 0, y: 0, height: height || 50 });
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (image) {
            if (typeof image === 'string') {
                setImagePreview(image);
            } else {
                handleImageUpload(image);
            }
        }
    }, [image]);

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
        setCompletedCrop(null);
        onChange(null);
    };

    const onCropComplete = (crop: Crop) => {
        setCompletedCrop(crop);
    };

    const getCroppedImage = useCallback(() => {
        if (completedCrop?.width && completedCrop?.height && imageRef.current && canvasRef.current) {
            const image = imageRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = width || completedCrop.width;
            canvas.height = height || completedCrop.height;

            ctx?.drawImage(
                image,
                (completedCrop.x ?? 0) * scaleX,
                (completedCrop.y ?? 0) * scaleY,
                (completedCrop.width ?? 0) * scaleX,
                (completedCrop.height ?? 0) * scaleY,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }, [completedCrop, width, height]);

    const handleCropAndResize = () => {
        getCroppedImage();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '90%' }}>
                        {/* show image */}
                        <img
                            src={imagePreview}
                            alt="cropped"
                            ref={imageRef}
                            style={{
                                maxWidth: 400,
                                maxHeight: 200,
                                borderRadius: '10px',
                                objectFit: 'cover',
                                marginBottom: '10px',
                            }}
                        />
                        {/* <ReactCrop
                            src={imagePreview}
                            crop={crop}
                            onImageLoaded={(img) => (imageRef.current = img)}
                            onChange={(newCrop) => setCrop(newCrop)}
                            onComplete={onCropComplete}
                        /> */}
                        <IconButton
                            aria-label="remove image"
                            onClick={handleRemoveImage}
                            size="small"
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
                        <Button variant="outlined" onClick={handleReuploadClick}>
                            Reupload Image
                        </Button>
                        {/* <Button variant="contained" onClick={handleCropAndResize} style={{ marginLeft: '10px', marginTop: '10px' }}>
                            Crop & Resize
                        </Button> */}
                    </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
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
