import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
});

const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
});

export const uploadFileToS3 = (file: File, setUploadProgress: any) => {
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

export const checkIfObjectKeyExists = (key: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        myBucket
            .headObject({ 
                Key: key,
                Bucket: process.env.REACT_APP_S3_BUCKET || '',
            })
            .promise()
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(false);
            });
    });
};