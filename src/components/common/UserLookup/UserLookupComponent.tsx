import React, { useEffect } from 'react';
import { UserLookupProps } from './types';
import { useUserLookup } from './hooks/useUserLookup';
import UserLookupField from './components/UserLookupField';

const UserLookupComponent: React.FC<UserLookupProps> = ({
  value,
  onChange,
  label = 'User',
  placeholder = 'Search users...',
  required = false,
  disabled = false,
  minSearchLength = 3,
  debounceMs = 300,
  onSearch,
  onUserSelect,
  loading: externalLoading = false,
  error: externalError,
  helperText,
  clearOnBlur = false,
  selectOnFocus = true,
  handleHomeEndKeys = true,
  getOptionLabel,
  renderOption,
  initialUserId,
  mode = 'add',
}) => {
  const {
    users,
    selectedUser,
    userLookupLoading,
    error: internalError,
    searchUsers,
    handleUserSelection,
    setSelectedUser,
  } = useUserLookup({
    minSearchLength,
    debounceMs,
    onSearch,
    initialUserId,
    mode,
  });

  // Sync external value with internal state
  useEffect(() => {
    if (value !== selectedUser) {
      setSelectedUser(value);
    }
  }, [value, selectedUser, setSelectedUser]);

  // Handle user selection and notify parent
  const handleUserSelectionWrapper = (event: any, newValue: any) => {
    handleUserSelection(event, newValue);
    
    // Notify parent components
    if (onChange) {
      onChange(newValue);
    }
    if (onUserSelect) {
      onUserSelect(newValue);
    }
  };

  const isLoading = externalLoading || userLookupLoading;
  const displayError = externalError || internalError;

  return (
    <UserLookupField
      users={users}
      userLookupLoading={isLoading}
      searchUsers={searchUsers}
      handleUserSelection={handleUserSelectionWrapper}
      value={selectedUser}
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={displayError}
      helperText={helperText}
      clearOnBlur={clearOnBlur}
      selectOnFocus={selectOnFocus}
      handleHomeEndKeys={handleHomeEndKeys}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      minSearchLength={minSearchLength}
    />
  );
};

export default UserLookupComponent;