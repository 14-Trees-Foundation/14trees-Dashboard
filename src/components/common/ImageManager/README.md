# ImageManager Component

A reusable, modular image management component that provides comprehensive functionality for uploading, viewing, reordering, and deleting images associated with any entity.

## Features

- **Drag & Drop Upload**: Support for drag and drop file uploads with visual feedback
- **File Selection**: Click to select multiple image files with validation
- **Image Preview**: Full-screen image preview modal with navigation
- **Drag & Drop Reordering**: Reorder images using react-beautiful-dnd
- **Manual Reordering**: Move images up/down with arrow buttons
- **View Modes**: Horizontal and vertical layout options
- **Photo Sizes**: Small, medium, and large display sizes
- **Progress Tracking**: Real-time upload progress indication
- **File Validation**: Built-in file type and size validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modular Architecture**: Composable components and hooks

## Architecture

The ImageManager follows a modular architecture with clear separation of concerns:

```
ImageManager/
├── ImageManagerComponent.tsx     # Main component
├── types.ts                     # TypeScript interfaces
├── hooks/
│   └── useImageManager.ts       # Main business logic hook
├── components/                  # UI components
│   ├── ImageCard.tsx
│   ├── ImageGrid.tsx
│   ├── ImageManagerHeader.tsx
│   ├── ImageManagerFooter.tsx
│   ├── ImagePreviewModal.tsx
│   └── ImageUploadSection.tsx
├── adapters/                    # API adapters
│   └── eventImageAdapter.ts
└── utils/
    └── imageUtils.ts           # Utility functions
```

## Usage

### Basic Usage

```tsx
import ImageManagerComponent from '@/components/common/ImageManager/ImageManagerComponent';
import { ImageApiMethods } from '@/components/common/ImageManager/types';

// Define your API methods
const apiMethods: ImageApiMethods = {
  getImages: async (entityId: number) => {
    return await apiClient.getImages(entityId);
  },
  uploadImages: async (entityId: number, files: File[]) => {
    return await apiClient.uploadImages(entityId, files);
  },
  removeImages: async (entityId: number, imageIds: number[]) => {
    await apiClient.removeImages(entityId, imageIds);
  },
  reorderImages: async (entityId: number, sequences: ImageSequenceUpdate[]) => {
    await apiClient.reorderImages(entityId, sequences);
  },
};

// Use the component
<ImageManagerComponent
  entityId={123}
  entityName="My Event"
  open={isOpen}
  onClose={() => setIsOpen(false)}
  apiMethods={apiMethods}
  title="Event Images"
/>
```

### Using Pre-built Adapters

For common use cases, use the provided adapters:

```tsx
import { createEventImageApiMethods } from '@/components/common/ImageManager/adapters/eventImageAdapter';

const eventImageApiMethods = createEventImageApiMethods();

<ImageManagerComponent
  entityId={eventId}
  entityName={eventName}
  open={open}
  onClose={onClose}
  apiMethods={eventImageApiMethods}
  title="Event Images"
/>
```

### Advanced Configuration

```tsx
<ImageManagerComponent
  entityId={123}
  entityName="My Event"
  open={isOpen}
  onClose={() => setIsOpen(false)}
  apiMethods={apiMethods}
  title="Event Images"
  layout="dialog" // or "modal" (default)
  maxWidth="xl"
  fullWidth={true}
  height="95vh"
  acceptedFileTypes="image/jpeg,image/png"
  supportedFormats="JPG, PNG only"
  showEntityName={false}
/>
```

### Dialog Layout

When using `layout="dialog"`, wrap the component in your own dialog:

```tsx
<Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
  <ImageManagerComponent
    entityId={123}
    entityName="My Event"
    open={open}
    onClose={onClose}
    apiMethods={apiMethods}
    layout="dialog"
  />
</Dialog>
```

## API Reference

### ImageManagerProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entityId` | `number` | - | **Required.** ID of the entity to manage images for |
| `entityName` | `string` | - | **Required.** Name of the entity (displayed in header) |
| `open` | `boolean` | - | **Required.** Whether the component is open |
| `onClose` | `() => void` | - | **Required.** Callback when component should close |
| `apiMethods` | `ImageApiMethods` | - | **Required.** API methods for image operations |
| `title` | `string` | `"Image Manager"` | Title displayed in header |
| `layout` | `"modal" \| "dialog"` | `"modal"` | Layout mode - modal includes dialog wrapper |
| `maxWidth` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Maximum width of modal |
| `fullWidth` | `boolean` | `true` | Whether modal takes full width |
| `height` | `string` | `"90vh"` | Height of the modal |
| `acceptedFileTypes` | `string` | `"image/*"` | Accepted file types for upload |
| `supportedFormats` | `string` | `"JPG, PNG, GIF, WebP"` | Text shown for supported formats |
| `showEntityName` | `boolean` | `true` | Whether to show entity name in header |

### ImageApiMethods

```tsx
interface ImageApiMethods {
  getImages: (entityId: number) => Promise<ImageItem[]>;
  uploadImages: (entityId: number, files: File[]) => Promise<ImageItem[]>;
  removeImages: (entityId: number, imageIds: number[]) => Promise<void>;
  reorderImages: (entityId: number, sequences: ImageSequenceUpdate[]) => Promise<void>;
}
```

### ImageItem

```tsx
interface ImageItem {
  id: number;
  entity_id: number;
  image_url: string;
  sequence: number;
  created_at: string;
  updated_at: string;
}
```

### ImageSequenceUpdate

```tsx
interface ImageSequenceUpdate {
  id: number;
  sequence: number;
}
```

## Hooks

### useImageManager

The main business logic hook that manages state and operations:

```tsx
const {
  loading,
  uploading,
  uploadProgress,
  images,
  selectedFiles,
  previewImage,
  dragOver,
  viewMode,
  photoSize,
  // ... other methods
} = useImageManager({ entityId, open, apiMethods });
```

## Utilities

### Image Validation

```tsx
import { validateImageFile, validateImageFiles } from './utils/imageUtils';

// Validate single file
const { isValid, error } = validateImageFile(file);

// Validate multiple files
const { validFiles, errors } = validateImageFiles(files);
```

### File Utilities

```tsx
import { 
  formatFileSize, 
  getImageDimensions, 
  createImagePreview 
} from './utils/imageUtils';

// Format file size
const sizeText = formatFileSize(file.size); // "2.5 MB"

// Get image dimensions
const { width, height } = await getImageDimensions(file);

// Create preview URL
const previewUrl = await createImagePreview(file);
```

## Migration Guide

### From EventImageAssociation

If migrating from the legacy EventImageAssociation component:

1. **Use the pre-built adapter**:
```tsx
import { createEventImageApiMethods } from '@/components/common/ImageManager/adapters/eventImageAdapter';

const eventImageApiMethods = createEventImageApiMethods();
```

2. **Replace component usage**:
```tsx
// Old
<EventImageAssociation
  eventId={eventId}
  eventName={eventName}
  open={open}
  onClose={onClose}
/>

// New
<ImageManagerComponent
  entityId={eventId}
  entityName={eventName}
  open={open}
  onClose={onClose}
  apiMethods={eventImageApiMethods}
  title="Event Images"
/>
```

### Creating Custom Adapters

For other entity types, create your own adapter:

```tsx
import { ImageApiMethods } from '@/components/common/ImageManager/types';

export const createCustomEntityApiMethods = (): ImageApiMethods => {
  const apiClient = new ApiClient();

  return {
    getImages: async (entityId: number) => {
      const data = await apiClient.customEntity.getImages(entityId);
      return data.map(item => ({
        id: item.id,
        entity_id: item.entity_id,
        image_url: item.image_url,
        sequence: item.sequence,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    // ... implement other methods
  };
};
```

## Customization

### Styling

The component uses Material-UI components and can be customized through:

- Material-UI theme customization
- CSS-in-JS styling with `sx` props
- Custom component variants

### Extending Functionality

- Create custom hooks based on `useImageManager`
- Extend the `ImageApiMethods` interface for additional operations
- Add custom validation logic in your API methods
- Create custom UI components using the existing building blocks

## Dependencies

- **React** (^18.0.0)
- **@mui/material** (^5.0.0) - UI components
- **react-beautiful-dnd** (^13.0.0) - Drag and drop functionality
- **react-toastify** (^9.0.0) - Toast notifications

## File Validation Rules

- **Supported formats**: JPEG, JPG, PNG, GIF, WebP
- **Maximum file size**: 10MB per file
- **Multiple file upload**: Supported
- **Drag & drop**: Supported with visual feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Images are loaded lazily in the grid
- File validation happens client-side before upload
- Drag and drop operations are optimized with react-beautiful-dnd
- Upload progress is tracked and displayed in real-time