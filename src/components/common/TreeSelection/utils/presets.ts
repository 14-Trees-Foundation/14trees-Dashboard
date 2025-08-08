import { TreeSelectionProps } from '../types';

// Preset configurations for common use cases
export const TREE_SELECTION_PRESETS = {
  DONATION: {
    mode: 'batch' as const,
    treeScope: 'all' as const, // Fixed: Use getTrees() API
    layout: 'modal' as const,
    showSelectedTable: true,
    showPlantTypeFilter: false,
    sideLayout: true,
    enableAdvancedFilters: true,
    title: 'Select Trees for Donation',
  },
  GIFTING: {
    mode: 'batch' as const,
    treeScope: 'giftable' as const, // Use getGiftAbleTrees() API
    layout: 'modal' as const,
    showSelectedTable: true,
    showPlantTypeFilter: true,
    sideLayout: true,
    enableAdvancedFilters: true,
    title: 'Select Trees for Gifting',
  },
  EVENT_ASSOCIATION: {
    mode: 'immediate' as const,
    treeScope: 'all' as const, // Use getTrees() API
    layout: 'dialog' as const,
    showSelectedTable: false,
    showAssociationStatus: true,
    associationMode: true,
    sideLayout: true,
    enableAdvancedFilters: true,
    title: 'Associate Trees with Event',
    selectButtonLabel: 'Associate',
    selectAllButtonLabel: 'Associate All',
    selectAllPageButtonLabel: 'Associate All on Page',
    removeButtonLabel: 'Dissociate',
    removeAllButtonLabel: 'Dissociate All',
  },
} as const;

// Helper function to create tree selection props with preset
export const createTreeSelectionProps = (
  preset: keyof typeof TREE_SELECTION_PRESETS,
  overrides: Partial<TreeSelectionProps> = {}
): Partial<TreeSelectionProps> => {
  return {
    ...TREE_SELECTION_PRESETS[preset],
    ...overrides,
  };
};

// Type-safe preset keys
export type TreeSelectionPreset = keyof typeof TREE_SELECTION_PRESETS;