# Sidebar Sub-sections Implementation

This document explains how to add sub-sections to pages in the admin sidebar navigation.

## Overview

The implementation provides:
1. Hierarchical navigation with expandable sub-sections
2. Automatic scroll-based highlighting of active sub-sections
3. Smooth scrolling to sub-sections when clicked
4. Auto-expansion of menus when on a page with sub-sections
5. Collapsing of other sub-sections when switching pages

## How to Add Sub-sections to a Page

### Step 1: Configure Sub-sections

Edit `/src/config/pageSubSections.ts` and add your page configuration:

```typescript
{
  path: 'your-page-path', // Must match the route path
  sections: [
    {
      displayName: "Section 1 Name",
      sectionId: "section-1-id", // Must match HTML element ID
      icon: YourIcon, // Material-UI icon component
    },
    {
      displayName: "Section 2 Name",
      sectionId: "section-2-id",
      icon: AnotherIcon,
    }
  ]
}
```

### Step 2: Add Section IDs to Your Page Components

In your page component, add `id` attributes to the sections you want to navigate to:

```jsx
// Example from Donation.tsx
<Box id="donations-table" sx={{ scrollMarginTop: '20px' }}>
  {/* Your table content */}
</Box>

<Box id="auto-processing-config" sx={{ scrollMarginTop: '20px' }}>
  {/* Your config content */}
</Box>
```

**Important**: 
- The `id` values must exactly match the `sectionId` in your configuration
- Add `scrollMarginTop: '20px'` to ensure proper scroll positioning
- Make sure sections have sufficient height to be detectable

### Step 3: Verify Implementation

1. Navigate to your page - the menu should auto-expand showing sub-sections
2. Click on sub-sections - should smoothly scroll to the section
3. Scroll through the page - active sub-section should highlight
4. Navigate to another page - sub-sections should collapse

## Current Implementation

### Donations Page
- **All Donations**: Shows the main donations data table
- **Auto Processing Config**: Shows the auto-plot processing configuration

## Adding Icons

Import your desired Material-UI icons in the pageSubSections.ts file:

```typescript
import { 
  TableChart, 
  Settings, 
  Analytics, 
  People, 
  Inventory 
} from "@mui/icons-material";
```

## Customization

### Scroll Detection Threshold
The scroll detection threshold can be adjusted in the LeftDrawer.jsx file:

```javascript
// Check if section is in the viewport (30% visible by default)
if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
```

### Styling
Sub-section styles can be customized in the `useStyles` function:
- `subSectionList`: Container for sub-sections
- `subItem`: Individual sub-section item
- `subItembtn`: Normal sub-section button style
- `subSelected`: Active sub-section style
- `subItemtext`: Sub-section text style

## Best Practices

1. **Section Naming**: Use descriptive names that clearly indicate the content
2. **Section IDs**: Use kebab-case for consistent naming (e.g., `donations-table`)
3. **Minimum Height**: Ensure sections have enough height to be easily detectable
4. **Logical Order**: Order sub-sections in the same sequence as they appear on the page
5. **Icon Selection**: Choose intuitive icons that represent the section content

## Troubleshooting

### Sub-sections not appearing
- Check that the page path in config matches the route exactly
- Ensure the page is properly configured in the main pages array

### Scroll detection not working
- Verify section IDs match exactly between config and HTML elements
- Check that sections have sufficient height
- Ensure `scrollMarginTop` is added to section elements

### Auto-expansion not working
- Confirm the page path matches the route in your application
- Check that the configuration is properly loaded

## Future Enhancements

Potential improvements that could be added:
1. Support for nested sub-sections (3+ levels)
2. Customizable scroll thresholds per page
3. Animation controls for expand/collapse
4. Keyboard navigation support
5. Remember expanded state across sessions