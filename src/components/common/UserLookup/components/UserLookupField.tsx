import React from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';
import { User, UserLookupFieldProps } from '../types';

const UserLookupField: React.FC<UserLookupFieldProps> = ({
  users,
  userLookupLoading,
  searchUsers,
  handleUserSelection,
  value,
  label = 'User',
  placeholder = 'Search users...',
  required = false,
  disabled = false,
  error,
  helperText,
  clearOnBlur = false,
  selectOnFocus = true,
  handleHomeEndKeys = true,
  getOptionLabel,
  renderOption,
  minSearchLength = 3,
}) => {
  const defaultGetOptionLabel = (option: User | null): string => {
    if (!option) return '';
    return `${option.name || ''} (${option.email || ''})`;
  };

  const defaultRenderOption = (props: any, option: User) => (
    <Box component="li" {...props} key={option.id}>
      <Box>
        <Typography variant="body1">{option.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {option.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Autocomplete
        options={users}
        value={value}
        onChange={handleUserSelection}
        onInputChange={(event, newInputValue) => {
          searchUsers(newInputValue);
        }}
        getOptionLabel={getOptionLabel || defaultGetOptionLabel}
        isOptionEqualToValue={(option, value) => {
          return option && value && option.id === value.id;
        }}
        loading={userLookupLoading}
        loadingText="Searching users..."
        noOptionsText={`Type at least ${minSearchLength} characters to search`}
        clearOnBlur={clearOnBlur}
        selectOnFocus={selectOnFocus}
        handleHomeEndKeys={handleHomeEndKeys}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            error={!!error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {userLookupLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={renderOption || defaultRenderOption}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default UserLookupField;