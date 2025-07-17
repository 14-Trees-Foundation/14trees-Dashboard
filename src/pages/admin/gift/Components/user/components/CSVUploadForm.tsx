import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UserImagesForm from '../UserImagesForm';

interface CSVUploadFormProps {
  requestId: string | null;
  onFileChange: (file: File) => void;
}

const CSVUploadForm: FC<CSVUploadFormProps> = ({ requestId, onFileChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const downloadGoogleSheet = () => {
    const url = "https://docs.google.com/spreadsheets/d/1DDM5nyrvP9YZ09B60cwWICa_AvbgThUx-yeDVzT4Kw4/gviz/tq?tqx=out:csv&sheet=Sheet1";
    const fileName = "UserDetails.csv";

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error("Download failed:", error));
  };

  return (
    <Box>
      <Typography>
        You can upload recipient details by using a CSV file. To get started, download the sample CSV file from{' '}
        <a 
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} 
          onClick={downloadGoogleSheet}
        >
          this
        </a>{' '}
        link, fill in the required recipient details, and then upload the completed CSV file.
      </Typography>
      <Typography mt={2}>
        You can optionally upload recipient or assignee images below to personalize the dashboard. 
        If you upload images, ensure that the exact file name of each image is specified in the 
        'Image Name' column in the CSV file. If no image is uploaded, leave the 'Image Name' column blank.
      </Typography>
      <Box mt={3} display="flex" alignItems="flex-start" justifyContent='space-evenly'>
        <UserImagesForm requestId={requestId} />
        <Box>
          <Typography>Upload completed csv file below:</Typography>
          <Button
            variant="contained"
            component="label"
            color="success"
            sx={{ mt: 1 }}
          >
            Select CSV File
            <input
              value=''
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CSVUploadForm;