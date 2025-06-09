import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    IconButton,
    Paper,
    Stack,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Description as FileIcon,
    Image as ImageIcon,
} from '@mui/icons-material';

interface FileUploadFieldProps {
    value: File | null;
    onChange: (file: File | null) => void;
    onUploadProgress?: (progress: number) => void;
    uploadedFileUrl?: string;
    disabled?: boolean;
    accept?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
    value,
    onChange,
    onUploadProgress,
    uploadedFileUrl,
    disabled = false,
    accept = 'image/*,.pdf',
}) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
            onChange(file);
            if (onUploadProgress) {
                onUploadProgress(0);
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setUploadProgress(0);
        if (onUploadProgress) {
            onUploadProgress(0);
        }
    };

    const getFileIcon = () => {
        if (!value) return null;
        return value.type.startsWith('image/') ? (
            <ImageIcon color="primary" />
        ) : (
            <FileIcon color="primary" />
        );
    };

    const getFilePreview = () => {
        if (!value) return null;
        if (value.type.startsWith('image/')) {
            return (
                <Box
                    component="img"
                    src={URL.createObjectURL(value)}
                    alt="Preview"
                    sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 1,
                    }}
                />
            );
        }
        return null;
    };

    return (
        <Box>
            <input
                accept={accept}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                disabled={disabled}
            />
            {!value && !uploadedFileUrl && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        border: '2px dashed',
                        borderColor: dragActive ? 'primary.main' : 'divider',
                        backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.7 : 1,
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <label htmlFor="file-upload">
                        <Stack
                            direction="column"
                            alignItems="center"
                            spacing={1}
                            sx={{ pointerEvents: disabled ? 'none' : 'auto' }}
                        >
                            <UploadIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="body1" color="textSecondary">
                                Drag and drop your file here or
                            </Typography>
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                                disabled={disabled}
                            >
                                Choose File
                            </Button>
                            <Typography variant="caption" color="textSecondary">
                                Supported formats: PDF, Images
                            </Typography>
                        </Stack>
                    </label>
                </Paper>
            )}
            {(value || uploadedFileUrl) && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {getFileIcon()}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" noWrap>
                                {value?.name || 'Uploaded file'}
                            </Typography>
                            {uploadProgress > 0 && (
                                <Box sx={{ width: '100%', mt: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress}
                                        sx={{ height: 4, borderRadius: 2 }}
                                    />
                                    <Typography variant="caption" color="textSecondary">
                                        Uploading: {uploadProgress}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        {uploadedFileUrl && (
                            <IconButton
                                size="small"
                                onClick={() => window.open(uploadedFileUrl, '_blank')}
                                title="Download file"
                            >
                                <DownloadIcon />
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            onClick={handleRemove}
                            disabled={disabled}
                            title="Remove file"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Paper>
            )}
            {getFilePreview()}
        </Box>
    );
};

export default FileUploadField; 