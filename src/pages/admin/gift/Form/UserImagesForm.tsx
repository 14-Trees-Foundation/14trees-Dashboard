import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Typography } from '@mui/material';
import { AWSUtils } from '../../../../helpers/aws';
import { toast } from 'react-toastify';

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
            setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
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
            await awsUtils.uploadFileToS3(requestId, file, setUploadProgress);
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
            <Typography sx={{ mb: 1 }}>Upload images of the user if you wish to create more personalized profile dashboard for user.</Typography>
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
                <p>Drag and drop some user images here, or click to select.</p>
            </div>

            {selectedFiles.length > 0 && (
                <div>
                    <h4>Selected Files:</h4>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <Button
                variant='contained'
                color='success'
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
            >
                {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>

            {uploading && uploadProgress !== null && (
                <div>Upload Progress: {uploadProgress}%</div>
            )}
        </div>
    );
};

export default UserImagesForm;
