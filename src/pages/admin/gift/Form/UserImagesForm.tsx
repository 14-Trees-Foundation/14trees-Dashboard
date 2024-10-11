import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AWS from 'aws-sdk';
import { Button } from '@mui/material';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
});

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
            await uploadFileToS3(file);
        }
        setUploading(false);
        setSelectedFiles([]);
    };

    console.log(process.env.REACT_APP_S3_BUCKET);
    const uploadFileToS3 = (file: File) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: process.env.REACT_APP_S3_BUCKET || '',
            Key: `users/${file.name}`, // You can structure the S3 folder path as needed
        };

        return new Promise((resolve, reject) => {
            myBucket.putObject(params)
                .on('httpUploadProgress', (evt) => {
                    setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
                })
                .send((err) => {
                    if (err) {
                        console.error('Error uploading file:', err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
        });
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
