import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { AWSUtils } from '../../../../helpers/aws';
import { toast } from 'react-toastify';
import { List } from '@mui/icons-material';

interface UserImagesFormProps {
    requestId: string | null
}

const UserImagesForm: React.FC<UserImagesFormProps> = ({ requestId }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setSelectedFiles(acceptedFiles);
        },
    });

    const handleUpload = async () => {
        if (!requestId) {
            toast.error("Something went wrong. Please try again later!");
            return;
        }

        if (selectedFiles.length === 0) return;
        const awsUtils = new AWSUtils();

        setUploading(true);
        for (const file of selectedFiles) {
            await awsUtils.uploadFileToS3('gift-request', file, requestId, setUploadProgress);
        }
        setUploading(false);
        setSelectedFiles([]);
        toast.success('User images uploaded successfully!');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #cccccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                <input {...getInputProps()} />
                <p>Drag and drop some recipient images here, or click to select.</p>
            </div>

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Selected Files:
                    <Tooltip title={<ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>}>
                        <Button sx={{ ml: -2 }} color="success"><List fontSize="small" /></Button>
                    </Tooltip>
                </Typography>
                <Button
                    variant='contained'
                    color='success'
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
            </Box>


            {uploading && uploadProgress !== null && (
                <div>Upload Progress: {uploadProgress}%</div>
            )}
        </div>
    );
};

export default UserImagesForm;
