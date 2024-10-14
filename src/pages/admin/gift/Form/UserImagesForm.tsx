import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { uploadFileToS3 } from '../../../../helpers/aws';

const UserImagesForm: React.FC = () => {
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
        if (selectedFiles.length === 0) return;

        setUploading(true);
        for (const file of selectedFiles) {
            await uploadFileToS3(file, setUploadProgress);
        }
        setUploading(false);
        setSelectedFiles([]);
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
                <p>Drag and drop some files here, or click to select files</p>
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
