# UserLookup Component

A reusable user lookup component with autocomplete functionality, debounced search, and support for both add and edit modes.

## Features

- **Debounced Search**: Configurable debounce delay to prevent excessive API calls
- **Autocomplete**: Rich autocomplete interface with user details
- **Edit Mode Support**: Automatically loads user data when editing existing records
- **Customizable**: Flexible configuration options and custom rendering support
- **Error Handling**: Built-in error handling and loading states
- **TypeScript**: Full TypeScript support with comprehensive type definitions

## Basic Usage

```tsx
import UserLookupComponent from '@/components/common/UserLookup/UserLookupComponent';

function MyComponent() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <UserLookupComponent
      value={selectedUser}
      onChange={setSelectedUser}
      label="Select User"
      placeholder="Search by name or email..."
      required
    />
  );
}
```

## Advanced Usage

```tsx
import UserLookupComponent from '@/components/common/UserLookup/UserLookupComponent';
import { USER_LOOKUP_PRESETS } from '@/components/common/UserLookup/types';

function EventForm() {
  const [organizer, setOrganizer] = useState(null);

  const handleCustomSearch = async (searchTerm: string) => {
    // Custom search logic
    const results = await myCustomUserSearch(searchTerm);
    return results;
  };

  return (
    <UserLookupComponent
      {...USER_LOOKUP_PRESETS.EVENT_ORGANIZER}
      value={organizer}
      onChange={setOrganizer}
      onSearch={handleCustomSearch}
      mode="edit"
      initialUserId={existingEvent?.assigned_by}
    />
  );
}
```

## Props

### UserLookupComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `User \| null` | `undefined` | Currently selected user |
| `onChange` | `(user: User \| null) => void` | `undefined` | Callback when user selection changes |
| `label` | `string` | `'User'` | Input field label |
| `placeholder` | `string` | `'Search users...'` | Input placeholder text |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `minSearchLength` | `number` | `3` | Minimum characters before search triggers |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds |
| `onSearch` | `(searchTerm: string) => Promise<User[]>` | `undefined` | Custom search function |
| `onUserSelect` | `(user: User \| null) => void` | `undefined` | Additional callback on user selection |
| `loading` | `boolean` | `false` | External loading state |
| `error` | `string` | `undefined` | External error message |
| `helperText` | `string` | `undefined` | Helper text below input |
| `clearOnBlur` | `boolean` | `false` | Clear input when focus is lost |
| `selectOnFocus` | `boolean` | `true` | Select input text when focused |
| `handleHomeEndKeys` | `boolean` | `true` | Handle Home/End key navigation |
| `getOptionLabel` | `(option: User) => string` | `undefined` | Custom option label function |
| `renderOption` | `(props: any, option: User) => React.ReactNode` | `undefined` | Custom option rendering |
| `mode` | `'add' \| 'edit'` | `'add'` | Component mode |
| `initialUserId` | `number \| string` | `undefined` | Initial user ID for edit mode |

## Presets

The component includes predefined configurations for common use cases:

```tsx
import { USER_LOOKUP_PRESETS } from '@/components/common/UserLookup/types';

// Available presets:
USER_LOOKUP_PRESETS.EVENT_ORGANIZER  // For event organizer selection
USER_LOOKUP_PRESETS.ASSIGNEE         // For task/item assignment
USER_LOOKUP_PRESETS.BASIC            // Basic user lookup
```

## Hooks

### useUserLookup

The core hook that powers the user lookup functionality:

```tsx
import { useUserLookup } from '@/components/common/UserLookup/hooks/useUserLookup';

function MyComponent() {
  const {
    users,
    selectedUser,
    userLookupLoading,
    error,
    searchUsers,
    handleUserSelection,
    resetUserLookup,
    setSelectedUser,
  } = useUserLookup({
    minSearchLength: 3,
    debounceMs: 300,
    onSearch: customSearchFunction, // optional
    mode: 'edit',
    initialUserId: 123,
  });

  // Use the hook values in your component
}
```

## Types

```tsx
interface User {
  id: number | string;
  name: string;
  email: string;
  [key: string]: any;
}

interface UserLookupProps {
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

interface UseUserLookupProps {
  minSearchLength?: number;
  debounceMs?: number;
  onSearch?: (searchTerm: string) => Promise<User[]>;
  initialUserId?: number | string;
  mode?: 'add' | 'edit';
}
```

## API Integration

The component uses the following API functions by default:

- `searchUsersApi(searchTerm: string)`: Search for users using ApiClient.searchUsers()
- `getUserByIdApi(userId: number | string)`: Get user by ID using ApiClient.getUserRoles() for edit mode

You can override the search behavior by providing a custom `onSearch` function.

## File Structure

```
UserLookup/
├── UserLookupComponent.tsx     # Main component
├── components/
│   └── UserLookupField.tsx     # Autocomplete field component
├── hooks/
│   └── useUserLookup.ts        # Core lookup hook
├── utils/
│   └── userApi.ts             # API utility functions
├── types.ts                   # TypeScript definitions and presets
└── README.md                  # This file
```

## Migration from AddUpdateEventModal

If you're migrating from the old implementation in AddUpdateEventModal:

### Before:
```tsx
// In AddUpdateEventModal
import { useUserSearch } from './hooks/useUserSearch';
import UserSearchField from './components/UserSearchField';

const {
  users,
  selectedUser,
  userSearchLoading,
  searchUsers,
  handleUserSelection,
  resetUserSearch,
} = useUserSearch(mode, existingEvent);

<UserSearchField
  users={users}
  selectedUser={selectedUser}
  userSearchLoading={userSearchLoading}
  searchUsers={searchUsers}
  handleUserSelection={handleUserSelectionWrapper}
  isEditMode={isEditMode}
/>
```

### After:
```tsx
// Using the common component
import UserLookupComponent from '@/components/common/UserLookup/UserLookupComponent';
import { USER_LOOKUP_PRESETS } from '@/components/common/UserLookup/types';

const [selectedUser, setSelectedUser] = useState(null);

const handleUserChange = (user) => {
  setSelectedUser(user);
  updateFormData({
    assigned_by: user ? user.id : ''
  });
};

<UserLookupComponent
  {...USER_LOOKUP_PRESETS.EVENT_ORGANIZER}
  value={selectedUser}
  onChange={handleUserChange}
  mode={mode}
  initialUserId={existingEvent?.assigned_by}
  required={!isEditMode}
/>
```

## Key Benefits

- **Consistent UI**: Standardized user lookup experience across the application
- **Performance**: Built-in debouncing and efficient search handling
- **Flexibility**: Supports both controlled and uncontrolled usage patterns
- **Accessibility**: Full keyboard navigation and screen reader support
- **Error Handling**: Graceful error handling with user feedback
- **TypeScript**: Complete type safety and IntelliSense support