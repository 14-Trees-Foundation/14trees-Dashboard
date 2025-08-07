# Events Module - Modular Architecture

This module has been refactored into a clean, maintainable structure with separation of concerns using custom hooks and modular components.

## 🏗️ Architecture

### Main Component
- **`EventsPage.tsx`** - Main orchestrator component that coordinates all hooks and components

### Custom Hooks (`/hooks`)
- **`/api/useEventsApi.ts`** - Manages API calls for event CRUD operations
- **`/modals/useEventsModals.ts`** - Handles all modal states and their open/close logic

### Components (`/components`)
- **`EventHeader.tsx`** - Page header with title and "Add Event" button
- **`AddUpdateEventModal.jsx`** - Modal for creating and editing events
- **`DeleteEventDialog.tsx`** - Confirmation dialog for event deletion

### EventsTable Module (`/components/EventsTable`)
- **`EventsTable.tsx`** - Main data table with filtering and pagination
- **`EventTableActions.tsx`** - Table row action buttons (hamburger menu trigger)
- **`EventActionMenu.tsx`** - Context menu with edit/delete/association options
- **`useEventsTable.ts`** - Custom hook for table state management and data handling

### Association Modules
Each association type (Trees, Messages, Images) is organized as a self-contained module:

#### EventTreeAssociation (`/components/EventTreeAssociation`)
- **`EventTreeAssociation.tsx`** - Main tree association dialog component
- **`useEventTreeAssociation.ts`** - Hook for tree association business logic
- **`types.ts`** - TypeScript type definitions
- **`helpers.ts`** - Utility functions for tree operations

#### EventMessageAssociation (`/components/EventMessageAssociation`)
- **`EventMessageAssociation.tsx`** - Main message association dialog component
- **`useEventMessageAssociation.ts`** - Hook for message association business logic
- **`MessageList.tsx`** - Component for displaying message lists
- **`MessageItem.tsx`** - Individual message item component
- **`MessengerSelector.tsx`** - Dropdown for selecting messengers
- **`types.ts`** - TypeScript type definitions

#### EventImageAssociation (`/components/EventImageAssociation`)
- **`EventImageAssociation.tsx`** - Main image association dialog component
- **`useEventImageAssociation.ts`** - Hook for image association business logic
- **`ImagePreviewModal.tsx`** - Modal for previewing images
- **`types.ts`** - TypeScript type definitions

## 🎯 Key Features

### State Management
- **API Operations**: Centralized in `useEventsApi` hook for consistent data handling
- **Modal States**: Managed by `useEventsModals` for clean UI state coordination
- **Table Logic**: Isolated in `useEventsTable` for pagination, filtering, and data display

### User Interface
- **Responsive Design**: Table adapts to different screen sizes
- **Interactive Actions**: Context menus, modals, and confirmation dialogs
- **Data Associations**: Seamless linking of events with trees, messages, and images

### Data Flow
1. **EventsPage** orchestrates all components and hooks
2. **API Hook** handles server communication and data mutations
3. **Table Hook** manages local state for pagination and filtering
4. **Modal Hook** coordinates UI state for all dialogs and menus

## 📝 Usage Examples

### Using the API hook independently:
```typescript
import { useEventsApi } from './hooks/api/useEventsApi';

const MyComponent = () => {
  const { createEvent, updateEvent, getEventsData } = useEventsApi();
  
  const handleCreateEvent = async (eventData) => {
    await createEvent(eventData);
    // Event created with automatic toast notification
  };
};
```

### Using table components independently:
```typescript
import { EventsTable } from './components/EventsTable/EventsTable';
import { useEventsTable } from './components/EventsTable/useEventsTable';

const MyEventsPage = () => {
  const tableHook = useEventsTable();
  
  return (
    <EventsTable
      loading={tableHook.eventsData.loading}
      rows={tableHook.tableRows}
      totalRecords={tableHook.eventsData.totalEvents}
      // ... other props
    />
  );
};
```

## 🧪 Testing Strategy

The modular structure enables comprehensive testing:
- **Unit Tests**: Individual hooks can be tested with React Testing Library
- **Component Tests**: UI components can be tested in isolation with mock props
- **Integration Tests**: Full page functionality with all hooks working together
- **API Tests**: Mock API responses to test data flow and error handling

## 🚀 Future Enhancements

The current architecture supports easy extension:
- **New Association Types**: Follow the existing pattern for new entity associations
- **Enhanced Filtering**: Add more sophisticated search and filter capabilities
- **Real-time Updates**: WebSocket integration for live data updates
- **Performance Optimization**: Implement virtualization for large datasets
- **Accessibility**: Enhanced keyboard navigation and screen reader support

## 📁 File Structure

```
events/
├── README.md                           # This documentation
├── EventsPage.tsx                      # Main orchestrator component
├── hooks/
│   ├── api/
│   │   └── useEventsApi.ts            # API operations and data management
│   └── modals/
│       └── useEventsModals.ts         # Modal state management
├── components/
│   ├── EventHeader.tsx                 # Page header with add button
│   ├── AddUpdateEventModal.jsx         # Add/Edit event modal
│   ├── DeleteEventDialog.tsx          # Delete confirmation dialog
│   ├── EventsTable/                   # Table module
│   │   ├── EventsTable.tsx            # Main data table component
│   │   ├── EventTableActions.tsx      # Table row action buttons
│   │   ├── EventActionMenu.tsx        # Context menu component
│   │   └── useEventsTable.ts          # Table state management hook
│   ├── EventTreeAssociation/          # Trees association module
│   │   ├── EventTreeAssociation.tsx   # Main tree association dialog
│   │   ├── useEventTreeAssociation.ts # Tree association business logic
│   │   ├── types.ts                   # Tree-related type definitions
│   │   └── helpers.ts                 # Tree utility functions
│   ├── EventMessageAssociation/       # Messages association module
│   │   ├── EventMessageAssociation.tsx # Main message association dialog
│   │   ├── useEventMessageAssociation.ts # Message association logic
│   │   ├── MessageList.tsx            # Message list display component
│   │   ├── MessageItem.tsx            # Individual message item
│   │   ├── MessengerSelector.tsx      # Messenger selection dropdown
│   │   └── types.ts                   # Message-related type definitions
│   └── EventImageAssociation/         # Images association module
│       ├── EventImageAssociation.tsx  # Main image association dialog
│       ├── useEventImageAssociation.ts # Image association business logic
│       ├── ImagePreviewModal.tsx      # Image preview modal
│       └── types.ts                   # Image-related type definitions
```

## 📊 Architecture Benefits

This modular architecture provides:
- **Clean Separation**: Each concern is isolated in its own module
- **Reusable Components**: Hooks and components can be used independently
- **Maintainable Code**: Easy to locate, modify, and test specific functionality
- **Scalable Structure**: Simple to add new features or association types
- **Type Safety**: Comprehensive TypeScript support throughout all modules