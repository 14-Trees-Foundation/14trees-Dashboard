import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';

interface RelationshipSelectorProps {
  relation: string;
  recipientName: string;
  assigneeName: string;
  disabled?: boolean;
  onRelationChange: (relation: string) => void;
}

const relationOptions = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'wife', label: 'Wife' },
  { value: 'husband', label: 'Husband' },
  { value: 'grandson', label: 'Grandson' },
  { value: 'granddaughter', label: 'Granddaughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'cousin', label: 'Cousin' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' },
];

const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  relation,
  recipientName,
  assigneeName,
  disabled = false,
  onRelationChange,
}) => {
  return (
    <Grid item xs={12}>
      <FormControl fullWidth>
        <InputLabel id="relation-label">Relation with recipient</InputLabel>
        <Select
          disabled={disabled}
          labelId="relation-label"
          value={relation}
          label="Relation with recipient"
          onChange={(e) => onRelationChange(e.target.value)}
        >
          {relationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {relation && relation !== 'other' && (
        <Typography>
          Tree(s) will be assigned in the name of {recipientName}'s {relation}, {assigneeName}
        </Typography>
      )}
      {relation && relation === 'other' && (
        <Typography>
          Tree(s) will be assigned in the name of {assigneeName}
        </Typography>
      )}
    </Grid>
  );
};

export default RelationshipSelector;