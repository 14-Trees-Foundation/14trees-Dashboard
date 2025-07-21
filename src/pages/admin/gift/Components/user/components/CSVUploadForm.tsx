import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UserImagesForm from '../UserImagesForm';

interface CSVUploadFormProps {
  requestId: string | null;
  onFileChange: (file: File) => void;
  requestType?: 'Gift Request' | 'Visit'; // New prop for request type
}

const CSVUploadForm: FC<CSVUploadFormProps> = ({ requestId, onFileChange, requestType = 'Gift Request' }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  // Different CSV templates based on request type
  const csvTemplates = {
    'Gift Request': {
      url: "https://docs.google.com/spreadsheets/d/1DDM5nyrvP9YZ09B60cwWICa_AvbgThUx-yeDVzT4Kw4/gviz/tq?tqx=out:csv&sheet=Sheet1",
      fileName: "GiftRequest_UserDetails.csv"
    },
    'Visit': {
      url: "https://docs.google.com/spreadsheets/d/1DDM5nyrvP9YZ09B60cwWICa_AvbgThUx-yeDVzT4Kw4/gviz/tq?tqx=out:csv&sheet=VisitSheet", // TODO: Create separate sheet for Visit type
      fileName: "Visit_UserDetails.csv"
    }
  };

  const downloadGoogleSheet = () => {
    const template = csvTemplates[requestType];
    
    fetch(template.url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = template.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error("Download failed:", error));
  };

  // Dynamic instructions based on request type
  const getInstructions = () => {
    if (requestType === 'Visit') {
      return {
        primary: `You can upload visitor details by using a CSV file. For Visit requests, you need to include specific Tree IDs for each visitor. To get started, download the sample CSV file from`,
        secondary: `For Visit requests, the 'Tree ID' column is required and must contain valid tree identifiers. Each visitor will be assigned to the specific tree mentioned in their row. You can optionally upload visitor images below to personalize the dashboard.`
      };
    } else {
      return {
        primary: `You can upload recipient details by using a CSV file. To get started, download the sample CSV file from`,
        secondary: `You can optionally upload recipient or assignee images below to personalize the dashboard. If you upload images, ensure that the exact file name of each image is specified in the 'Image Name' column in the CSV file. If no image is uploaded, leave the 'Image Name' column blank.`
      };
    }
  };

  const instructions = getInstructions();

  return (
    <Box>
      <Typography>
        {instructions.primary}{' '}
        <a 
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} 
          onClick={downloadGoogleSheet}
        >
          this
        </a>{' '}
        link, fill in the required {requestType === 'Visit' ? 'visitor' : 'recipient'} details, and then upload the completed CSV file.
      </Typography>
      <Typography mt={2}>
        {instructions.secondary}
      </Typography>
      {requestType === 'Visit' && (
        <Typography mt={1} sx={{ color: 'warning.main', fontWeight: 'bold' }}>
          ⚠️ Important: For Visit requests, ensure all Tree IDs are valid and available for assignment.
        </Typography>
      )}
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