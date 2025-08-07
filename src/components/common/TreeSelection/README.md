# Unified Tree Selection Component

A modular, flexible, and reusable tree selection component built with React hooks and TypeScript that can be used across all features (Gifting, Donations, Events, etc.) in the 14Trees application.

## ✨ Features

- 🎨 **Modern UI Design** - Clean table-based interface with responsive layouts
- 🔍 **Advanced Filtering** - Multi-column filtering with search, plot, status, tags, and plant types
- 📱 **Responsive Design** - Adapts to mobile and desktop with side-by-side or vertical layouts
- ⚡ **External State Management** - Full control over selection state from parent components
- 🔧 **Highly Configurable** - Preset configurations for common use cases with full customization
- 🚀 **Performance Optimized** - Efficient data loading, caching, and pagination with custom hooks
- ♿ **Accessible** - Full keyboard navigation and screen reader support
- 🏗️ **Modular Architecture** - Separated concerns with custom hooks and reusable components

## Quick Start

### Basic Usage

```tsx
import TreeSelectionComponent from '@/components/common/TreeSelection/TreeSelectionComponent';
import { createTreeSelectionProps } from '@/components/common/TreeSelection/utils/presets';

const MyComponent = () => {
  const [selectedTrees, setSelectedTrees] = useState([]);
  const [open, setOpen] = useState(false);

  return (
    <TreeSelectionComponent
      {...createTreeSelectionProps('DONATION')}
      open={open}
      onClose={() => setOpen(false)}
      selectedTrees={selectedTrees}
      onSelectedTreesChange={setSelectedTrees}
      onSubmit={(trees) => console.log('Selected:', trees)}
      maxSelection={10}
    />
  );
};
```

### Preset Configurations

The component comes with three preset configurations:

#### 1. Donation (`DONATION`)
```tsx
<TreeSelectionComponent
  {...createTreeSelectionProps('DONATION')}
  // Uses getTrees() API (treeScope: 'all')
  // Modal layout with batch selection
  // Advanced filters enabled, no plant type filter
  // Side-by-side layout on desktop
/>
```

#### 2. Gifting (`GIFTING`)
```tsx
<TreeSelectionComponent
  {...createTreeSelectionProps('GIFTING')}
  // Uses getGiftAbleTrees() API (treeScope: 'giftable')
  // Modal layout with plant type filters
  // Batch selection mode with selected trees panel
/>
```

#### 3. Event Association (`EVENT_ASSOCIATION`)
```tsx
<TreeSelectionComponent
  {...createTreeSelectionProps('EVENT_ASSOCIATION')}
  // Uses getTrees() API (treeScope: 'all')
  // Dialog layout with immediate selection
  // Association mode with status indicators
  // No selected trees panel (showSelectedTable: false)
/>
```

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls modal/dialog visibility |
| `onClose` | `() => void` | - | Called when modal is closed |
| `selectedTrees` | `Tree[]` | - | Currently selected trees (external state) |
| `onSelectedTreesChange` | `(trees: Tree[]) => void` | - | Called when selection changes |

### Selection Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'batch' \| 'immediate'` | `'batch'` | Selection behavior |
| `maxSelection` | `number` | - | Maximum trees that can be selected |
| `allowMultiSelect` | `boolean` | `true` | Allow multiple tree selection |

### Data Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeScope` | `'giftable' \| 'all'` | - | Which API to use for fetching trees |
| `plotIds` | `number[]` | `[]` | Filter trees by specific plots |
| `plantTypes` | `string[]` | `[]` | Filter trees by plant types |
| `includeNonGiftable` | `boolean` | `false` | Include non-giftable trees (for giftable scope) |
| `includeAllHabitats` | `boolean` | `false` | Include all habitats (for giftable scope) |

### UI Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'modal' \| 'dialog'` | `'modal'` | UI layout type |
| `title` | `string` | `'Tree Selection'` | Modal/dialog title |
| `showSelectedTable` | `boolean` | `true` | Show selected trees panel |
| `showPlantTypeFilter` | `boolean` | `true` | Show plant type filter chips |
| `showAssociationStatus` | `boolean` | `false` | Show association status indicators |
| `sideLayout` | `boolean` | `true` | Use side-by-side layout on desktop |
| `hideTableTitle` | `boolean` | `false` | Hide the table title header |
| `enableAdvancedFilters` | `boolean` | `true` | Show advanced filter panel |
| `associationMode` | `boolean` | `false` | Enable association mode for events |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(trees: Tree[]) => void` | Called when user submits selection (batch mode) |
| `onTreeSelect` | `(tree: Tree, selected: boolean) => void` | Called when individual tree is selected |
| `onTreeAssociate` | `(treeId: number) => Promise<void>` | Called for immediate association (association mode) |
| `onTreeDissociate` | `(treeId: number) => Promise<void>` | Called for immediate dissociation (association mode) |
| `customActions` | `(tree: Tree) => React.ReactNode` | Custom action buttons for each tree row |

## Advanced Usage

### Custom Configuration

```tsx
<TreeSelectionComponent
  open={open}
  onClose={onClose}
  selectedTrees={selectedTrees}
  onSelectedTreesChange={setSelectedTrees}
  
  // Custom configuration
  treeScope="all"
  mode="batch"
  layout="modal"
  maxSelection={20}
  plotIds={[1, 2, 3]}
  
  // UI customization
  title="Select Trees for Special Project"
  sideLayout={true}
  enableAdvancedFilters={true}
  showPlantTypeFilter={true}
  
  // Callbacks
  onSubmit={handleSubmit}
  onTreeSelect={handleTreeSelect}
/>
```

### Using with Form Libraries

```tsx
import { useForm, Controller } from 'react-hook-form';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="selectedTrees"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <TreeSelectionComponent
            {...createTreeSelectionProps('DONATION')}
            open={open}
            onClose={() => setOpen(false)}
            selectedTrees={field.value}
            onSelectedTreesChange={field.onChange}
            maxSelection={10}
          />
        )}
      />
    </form>
  );
};
```

### Event Association Example

```tsx
const EventTreeAssociation = ({ eventId, eventName }) => {
  const [selectedTrees, setSelectedTrees] = useState([]);
  const [associatedTrees, setAssociatedTrees] = useState([]);

  const handleTreesChange = async (trees) => {
    setSelectedTrees(trees);
    // Immediately associate with event
    try {
      await apiClient.events.associateTreesToEvent(eventId, trees.map(t => t.id));
      toast.success('Trees associated successfully!');
      // Refresh associated trees
      loadAssociatedTrees();
    } catch (error) {
      toast.error('Failed to associate trees');
    }
  };

  return (
    <TreeSelectionComponent
      {...createTreeSelectionProps('EVENT_ASSOCIATION')}
      open={open}
      onClose={onClose}
      selectedTrees={selectedTrees}
      onSelectedTreesChange={handleTreesChange}
      associatedTrees={associatedTrees}
      title={`Associate Trees - ${eventName}`}
    />
  );
};
```

## Customization

### Custom Tree Actions

```tsx
const customActions = (tree: Tree) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button size="small" onClick={() => viewTreeDetails(tree)}>
      Details
    </Button>
    <Button size="small" onClick={() => markAsFavorite(tree)}>
      Favorite
    </Button>
  </Box>
);

<TreeSelectionComponent
  // ... other props
  customActions={customActions}
  hideDefaultActions={false} // Show both custom and default actions
/>
```

### Custom Styling

The component uses Material-UI's theming system. You can customize the appearance by providing a custom theme:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Custom green for tree theme
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          // Custom card styling
        },
      },
    },
  },
});

<ThemeProvider theme={customTheme}>
  <TreeSelectionComponent {...props} />
</ThemeProvider>
```

## API Integration

The component automatically handles different APIs based on the `treeScope` prop:

- `treeScope="giftable"` → Uses `getGiftAbleTrees()` API
- `treeScope="all"` → Uses `getTrees()` API

### Custom API Filters

```tsx
const customFilters = [
  {
    columnField: 'planted_date',
    operatorValue: 'greaterThan',
    value: '2023-01-01',
  },
  {
    columnField: 'assigned_to',
    operatorValue: 'equals',
    value: 'user123',
  },
];

<TreeSelectionComponent
  // ... other props
  customFilters={customFilters}
/>
```

## Performance Considerations

- **Pagination**: Large datasets are automatically paginated
- **Debounced Filtering**: Filter changes are debounced to reduce API calls
- **Memoization**: Components use React.memo and useMemo for optimization
- **Virtual Scrolling**: Consider implementing for very large datasets

## Migration Guide

### From Donation TreeSelectionComponent

```tsx
// Before
<TreeSelectionComponent
  max={donation.tree_count}
  plotIds={selectedPlots.map(p => p.id)}
  open={treeSelectionOpen}
  onClose={() => setTreeSelectionOpen(false)}
  onSubmit={handleTreeSelection}
/>

// After
<TreeSelectionComponent
  {...createTreeSelectionProps('DONATION')}
  maxSelection={donation.tree_count}
  plotIds={selectedPlots.map(p => p.id)}
  open={treeSelectionOpen}
  onClose={() => setTreeSelectionOpen(false)}
  selectedTrees={selectedTrees}
  onSelectedTreesChange={setSelectedTrees}
  onSubmit={handleTreeSelection}
/>
```

### From Gifting TreeSelectionComponent

```tsx
// Before
<TreeSelectionComponent
  max={max}
  includeNonGiftable={includeNonGiftable}
  includeAllHabitats={includeAllHabitats}
  plotIds={plotIds}
  plantTypes={plantTypes}
  open={open}
  onClose={onClose}
  onSubmit={onSubmit}
  selectedTrees={selectedTrees}
  onSelectedTreesChange={onSelectedTreesChange}
/>

// After
<TreeSelectionComponent
  {...createTreeSelectionProps('GIFTING')}
  maxSelection={max}
  includeNonGiftable={includeNonGiftable}
  includeAllHabitats={includeAllHabitats}
  plotIds={plotIds}
  plantTypes={plantTypes}
  open={open}
  onClose={onClose}
  selectedTrees={selectedTrees}
  onSelectedTreesChange={onSelectedTreesChange}
  onSubmit={onSubmit}
/>
```

## Troubleshooting

### Common Issues

1. **Trees not loading**: Check `treeScope` prop and API permissions
2. **Filters not working**: Ensure filter format matches API expectations
3. **Selection not updating**: Verify `onSelectedTreesChange` is properly implemented
4. **Performance issues**: Consider reducing `pageSize` or implementing virtual scrolling

### Debug Mode

Enable debug logging:

```tsx
// Add to your component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('TreeSelection Debug:', {
      selectedTrees,
      filters,
      loading,
      total,
    });
  }
}, [selectedTrees, filters, loading, total]);
```

## 🏗️ Architecture

### Component Structure
The TreeSelection component follows a modular architecture with clear separation of concerns:

- **Main Component**: `TreeSelectionComponent.tsx` - Orchestrates all hooks and renders the UI
- **Custom Hooks**: Isolated business logic for data, filters, and selection management
- **UI Components**: Reusable components for different layout patterns and interactions
- **Utilities**: API services and preset configurations for common use cases

### Data Flow
1. **TreeSelectionComponent** coordinates all hooks and manages the overall state
2. **useTreeData** handles API calls, pagination, and data caching
3. **useTreeFilters** manages filter state and plant type selections
4. **useTreeSelection** handles selection logic and external state synchronization
5. **UI Components** render the interface and handle user interactions

## 📁 File Structure

```
TreeSelection/
├── README.md                           # This documentation file
├── TreeSelectionComponent.tsx          # Main component implementation
├── types.ts                           # TypeScript interfaces and types
├── components/                        # UI Components
│   ├── TreeSelectionModal.tsx         # Modal/dialog wrapper component
│   ├── TreeTable.tsx                  # Main data table with filtering
│   ├── SideBySideLayout.tsx           # Side-by-side layout component
│   ├── VerticalLayout.tsx             # Vertical stacked layout component
│   ├── LayoutToggle.tsx               # Layout switching component
│   └── AssociatedTreesList.tsx        # Associated trees display component
├── hooks/                             # Custom React hooks
│   ├── useTreeData.ts                 # Data fetching and pagination management
│   ├── useTreeFilters.ts              # Filter state and plant type management
│   └── useTreeSelection.ts            # Selection logic and state management
└── utils/                             # Utility functions and services
    ├── treeApi.ts                     # API service wrapper for tree endpoints
    └── presets.ts                     # Preset configurations for common use cases
```

## 🔧 Hook Documentation

### useTreeData Hook

**Purpose**: Manages tree data fetching, pagination, and caching with optimized performance.

**Core Functionality**:
- **API Integration**: Fetches trees from appropriate API based on scope (giftable/all)
- **Pagination Management**: Handles page-based data loading with efficient caching
- **Performance Optimization**: Uses debounced fetching (300ms) to reduce API calls
- **Memory Management**: Maintains component mount state to prevent memory leaks
- **Filter Integration**: Automatically refetches data when filters or plotIds change

**Key Features**:
- Automatic data refresh when dependencies change
- Debounced API calls to prevent excessive requests
- Efficient data caching in record format
- Component unmount cleanup to prevent memory leaks
- Refresh functionality for manual data reloading

**Returns**:
```typescript
{
  trees: Tree[],                    // Current page of trees
  total: number,                    // Total count of available trees
  page: number,                     // Current page (0-based)
  loading: boolean,                 // Loading state indicator
  treesData: Record<number, Tree>,  // All cached tree data
  tableRows: Tree[],                // Formatted data for table display
  setPage: (page: number) => void,  // Function to change page
  refresh: () => void,              // Function to refresh data
}
```

### useTreeFilters Hook

**Purpose**: Manages filter state, plant type selections, and filter operations.

**Core Functionality**:
- **Filter State Management**: Handles DataGrid filter state and operations
- **Plant Type Filtering**: Manages plant type chip selections with multi-select support
- **Metadata Loading**: Loads available plant types, plots, and tags for filter options
- **State Synchronization**: Keeps filter state synchronized with component props

**Key Features**:
- Multi-select plant type filtering with chip-based UI
- Advanced filter support for all tree properties
- Automatic loading of filter metadata (plots, plant types, tags)
- Filter reset and clear functionality
- Seamless integration with DataGrid filter model

**Returns**:
```typescript
{
  filters: Record<string, GridFilterItem>,     // Current filter state
  selectedPlantTypes: string[],                // Selected plant type filters
  tags: string[],                              // Available tags for filtering
  plots: Plot[],                               // Available plots for filtering
  plantTypes: string[],                        // Available plant types
  handleSetFilters: (filters) => void,         // Update filter state
  handlePlantTypeSelect: (type: string) => void, // Add plant type filter
  handlePlantTypeReset: () => void,            // Clear plant type filters
  addFilter: (filter: GridFilterItem) => void, // Add individual filter
  removeFilter: (field: string) => void,       // Remove specific filter
  clearFilters: () => void,                    // Clear all filters
}
```

### useTreeSelection Hook

**Purpose**: Manages tree selection logic and synchronization with external state.

**Core Functionality**:
- **Selection State Management**: Handles individual and batch tree selection
- **External State Synchronization**: Maintains sync with parent component's state
- **Validation Logic**: Enforces maximum selection limits and business rules
- **Mode Support**: Handles both batch and immediate selection modes

**Key Features**:
- Controlled selection state with external state management
- Maximum selection limit enforcement with user feedback
- Support for batch and immediate selection modes
- Selection validation and error handling
- Association mode support for event tree linking

**Returns**:
```typescript
{
  selectedTrees: Tree[],                       // Currently selected trees
  isSelected: (tree: Tree) => boolean,         // Check if tree is selected
  handleTreeSelect: (tree: Tree) => void,      // Toggle tree selection
  handleSelectAll: (trees: Tree[]) => void,    // Select all visible trees
  handleClearSelection: () => void,            // Clear all selections
  canSelectMore: boolean,                      // Whether more trees can be selected
  selectionCount: number,                      // Current selection count
}
```

## 📦 Component Documentation

### Core Components

**TreeSelectionModal.tsx**: Main wrapper component that handles modal/dialog layout, responsive design, and provides the container for all tree selection functionality.

**TreeTable.tsx**: Main data table component that displays trees with filtering, pagination, selection controls, and action buttons.

**SideBySideLayout.tsx**: Layout component that arranges the tree table and selected trees panel side by side on desktop screens.

**VerticalLayout.tsx**: Layout component that stacks the tree table and selected trees panel vertically on mobile screens.

**LayoutToggle.tsx**: Component that allows users to switch between different layout modes.

**AssociatedTreesList.tsx**: Component that displays trees already associated with an event (used in association mode).

### API Service

**treeApi.ts**: Centralized API service that abstracts tree-related API calls and handles different tree scopes (giftable vs all).

**Key Methods**:
- `fetchTrees()`: Fetches trees based on scope and filters
- `getPlantTypeTags()`: Fetches available plant type tags
- `getPlots()`: Fetches available plots for filtering
- `getPlantTypes()`: Fetches available plant types

### Preset Configurations

**presets.ts**: Provides pre-configured settings for common use cases:
- `DONATION`: Optimized for donation workflows
- `GIFTING`: Configured for gift tree selection
- `EVENT_ASSOCIATION`: Set up for event tree association

## 🚀 Performance Considerations

- **Pagination**: Large datasets are automatically paginated (20 items per page)
- **Debounced Filtering**: Filter changes are debounced (300ms) to reduce API calls
- **Memoization**: Components use React.memo and useMemo for optimization
- **Efficient Caching**: Tree data is cached in record format for fast lookups
- **Memory Management**: Proper cleanup prevents memory leaks

## 🧪 Testing Strategy

The modular architecture enables comprehensive testing:
- **Hook Testing**: Individual hooks can be tested with React Testing Library
- **Component Testing**: UI components can be tested in isolation
- **Integration Testing**: Full component functionality with all hooks
- **API Testing**: Mock API responses to test data flow

## 🤝 Contributing

When adding new features or modifying the component:

1. Update TypeScript interfaces in `types.ts`
2. Add new props to the main component interface
3. Update preset configurations if needed
4. Add comprehensive tests for new functionality
5. Update this README with new documentation

## 📄 License

This component is part of the 14Trees project and follows the same license terms.