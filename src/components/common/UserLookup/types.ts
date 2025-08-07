export interface User {
  id: number | string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface UserLookupProps {
  // Core Props
  value?: User | null;
  onChange?: (user: User | null) => void;
  
  // Configuration
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  
  // Search Configuration
  minSearchLength?: number;
  debounceMs?: number;
  
  // Callbacks
  onSearch?: (searchTerm: string) => Promise<User[]>;
  onUserSelect?: (user: User | null) => void;
  
  // UI Configuration
  loading?: boolean;
  error?: string;
  helperText?: string;
  
  // Autocomplete Configuration
  clearOnBlur?: boolean;
  selectOnFocus?: boolean;
  handleHomeEndKeys?: boolean;
  
  // Custom Rendering
  getOptionLabel?: (option: User) => string;
  renderOption?: (props: any, option: User) => React.ReactNode;
  
  // Initial Data (for edit mode)
  initialUserId?: number | string;
  mode?: 'add' | 'edit';
}

export interface UseUserLookupProps {
  minSearchLength?: number;
  debounceMs?: number;
  onSearch?: (searchTerm: string) => Promise<User[]>;
  initialUserId?: number | string;
  mode?: 'add' | 'edit';
}

export interface UserLookupFieldProps extends Omit<UserLookupProps, 'onSearch'> {
  users: User[];
  userLookupLoading: boolean;
  searchUsers: (searchTerm: string) => void;
  handleUserSelection: (event: any, newValue: User | null) => void;
}

// Preset configurations
export const USER_LOOKUP_PRESETS = {
  EVENT_ORGANIZER: {
    label: 'Organiser/Point of Contact',
    placeholder: 'Search by name or email...',
    required: true,
    minSearchLength: 3,
    debounceMs: 300,
  },
  ASSIGNEE: {
    label: 'Assign To',
    placeholder: 'Search for user...',
    required: false,
    minSearchLength: 2,
    debounceMs: 300,
  },
  BASIC: {
    label: 'User',
    placeholder: 'Search users...',
    required: false,
    minSearchLength: 3,
    debounceMs: 300,
  },
} as const;