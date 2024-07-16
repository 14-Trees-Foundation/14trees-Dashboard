import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Parser } from 'json2csv';
import { Group, GroupMappingState } from '../../../types/Group';
import React from 'react';
import { Divider } from 'rc-menu';

interface FailedRecordsListProps {
  open: boolean;
  handleClose: () => void;
  groupsMap: Record<number, Group>;
  failedRecords: GroupMappingState;
}

const FailedRecordsList = ( { open, handleClose, groupsMap, failedRecords }: FailedRecordsListProps ) => {

  failedRecords = Object.entries(failedRecords).reduce((acc, [key, value]) => {
    const group = groupsMap[parseInt(key)];
    if (group) {
      acc[group.id] = value;
    }
    return acc;
  }, {} as GroupMappingState);

  const handleDownload = (id: number) => {
    const data = failedRecords[id].failed_records;
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Download Failed Records</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(failedRecords).map(([id, data]) => (
            <ListItem key={id}>
              <ListItemText primary={`${groupsMap[parseInt(id)].name}`} />
              <Button variant="outlined" color="primary" style={{ marginLeft: 10 }} onClick={() => handleDownload(parseInt(id))}>
                <FileDownloadIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="success">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FailedRecordsList;
