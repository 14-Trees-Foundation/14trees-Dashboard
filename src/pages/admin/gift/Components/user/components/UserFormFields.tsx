import React from 'react';
import { Autocomplete, TextField, Grid, Box, Typography } from '@mui/material';

interface UserFormFieldsProps {
  userEmail: string;
  userName: string;
  userPhone: string;
  userCommEmail: string;
  usersList: any[];
  disabled?: boolean;
  fieldPrefix: 'recipient' | 'assignee';
  onEmailChange: (event: React.SyntheticEvent, value: string) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  userEmail,
  userName,
  userPhone,
  userCommEmail,
  usersList,
  disabled = false,
  fieldPrefix,
  onEmailChange,
  onInputChange,
}) => {
  const isRecipient = fieldPrefix === 'recipient';
  const fieldLabel = isRecipient ? 'Recipient' : 'Assignee';

  return (
    <>
      <Grid item xs={12}>
        <Autocomplete
          fullWidth
          freeSolo
          options={usersList}
          disabled={disabled}
          value={userEmail || null}
          onInputChange={onEmailChange}
          getOptionLabel={(option: any) => option.email ? `${option.name} (${option.email})` : option}
          isOptionEqualToValue={(option, value) => {
            if (!value || value === '') return false;
            if (typeof value === 'string' && option?.email) {
              return option.email === value || 
                     option.name === value ||
                     `${option.name} (${option.email})` === value;
            }
            if (option?.email && value?.email) {
              return option.email === value.email;
            }
            return false;
          }}
          renderOption={(props: any, option) => (
            <Box {...props}>
              {option.email ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='body1'>{option.name}</Typography>
                  <Typography variant='body2' color={'#494b4b'}>Email: {option.email}</Typography>
                  {option.communication_email && (
                    <Typography variant='subtitle2' color={'GrayText'}>
                      Comm. Email: {option.communication_email}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography>{option}</Typography>
              )}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${fieldLabel} Email id`}
              variant="outlined"
              name={`${fieldPrefix}_email`}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled={disabled}
          name={`${fieldPrefix}_name`}
          label={`${fieldLabel} Name`}
          value={userName}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled={disabled}
          name={`${fieldPrefix}_phone`}
          label={`${fieldLabel} Phone (Optional)`}
          value={userPhone}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled={disabled}
          name={`${fieldPrefix}_communication_email`}
          label={`${fieldLabel}'s Communication Email (Optional)`}
          value={userCommEmail}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
    </>
  );
};

export default UserFormFields;