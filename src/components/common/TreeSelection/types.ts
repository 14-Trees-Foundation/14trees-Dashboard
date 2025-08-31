import { GridFilterItem } from "@mui/x-data-grid";

export interface Tree {
  id: number;
  sapling_id: string;
  plant_type: string;
  plot: string;
  plot_name: string;
  plot_id: number;
  status: string;
  tags: string[];
  assigned_to?: string;
  planted_date?: string;
  tree_id?: number;
  [key: string]: any;
}

export type LayoutType = 'sideBySide' | 'vertical';

export interface TreeSelectionProps {
  // Core Props
  open: boolean;
  onClose: () => void;
  
  // Selection Configuration
  mode?: 'batch' | 'immediate';
  maxSelection?: number;
  allowMultiSelect?: boolean;
  
  // Data Configuration
  treeScope: 'giftable' | 'all';
  plotIds?: number[];
  plantTypes?: string[];
  includeNonGiftable?: boolean;
  includeAllHabitats?: boolean;
  customFilters?: GridFilterItem[];
  
  // External State Management (Required)
  selectedTrees: Tree[];
  onSelectedTreesChange: (trees: Tree[]) => void;
  
  // Callbacks
  onSubmit?: (trees: Tree[]) => void;
  onTreeSelect?: (tree: Tree, selected: boolean) => void;
  onTreeAssociate?: (treeId: number) => Promise<void>;
  onTreeDissociate?: (treeId: number) => Promise<void>;
  
  // UI Configuration
  layout?: 'modal' | 'dialog';
  title?: string;
  showSelectedTable?: boolean;
  showPlantTypeFilter?: boolean;
  showAssociationStatus?: boolean;
  sideLayout?: boolean;
  hideTableTitle?: boolean;
  
  // Association Mode (for events)
  associatedTrees?: Tree[];
  associationMode?: boolean;
  refreshTrigger?: number; // Increment this to trigger data refresh
  
  // Advanced Filtering
  enableAdvancedFilters?: boolean;
  filterableColumns?: string[];
  
  // Customization
  customColumns?: any[];
  customActions?: (tree: Tree) => React.ReactNode;
  hideDefaultActions?: boolean;
  
  // Button Labels
  selectButtonLabel?: string;
  selectAllButtonLabel?: string;
  selectAllPageButtonLabel?: string;
  removeButtonLabel?: string;
  removeAllButtonLabel?: string;
}

export interface TreeApiConfig {
  scope: 'giftable' | 'all';
  includeNonGiftable?: boolean;
  includeAllHabitats?: boolean;
}

export interface TreeApiResponse {
  results: Tree[];
  total: number;
  offset: number;
}

export interface TreeFilters {
  plotId?: number;
  plantType?: string;
  status?: string;
  searchText?: string;
  tags?: string[];
  [key: string]: any;
}

export interface UseTreeDataProps {
  plotIds?: number[];
  treeScope: 'giftable' | 'all';
  includeNonGiftable?: boolean;
  includeAllHabitats?: boolean;
  filters: Record<string, GridFilterItem>;
  pageSize: number;
  refreshTrigger?: number;
}

export interface UseTreeSelectionProps {
  maxSelection?: number;
  selectedTrees: Tree[];
  onSelectedTreesChange: (trees: Tree[]) => void;
  mode?: 'batch' | 'immediate';
}

// Preset configurations
export const TREE_SELECTION_PRESETS = {
  DONATION: {
    mode: 'batch' as const,
    treeScope: 'all' as const,
    layout: 'modal' as const,
    showSelectedTable: true,
    showPlantTypeFilter: false,
    sideLayout: true,
    enableAdvancedFilters: true,
  },
  GIFTING: {
    mode: 'batch' as const,
    treeScope: 'giftable' as const,
    layout: 'modal' as const,
    showSelectedTable: true,
    showPlantTypeFilter: true,
    sideLayout: true,
    enableAdvancedFilters: true,
  },
  EVENT_ASSOCIATION: {
    mode: 'immediate' as const,
    treeScope: 'all' as const,
    layout: 'dialog' as const,
    showSelectedTable: false,
    showAssociationStatus: true,
    associationMode: true,
    sideLayout: true,
    enableAdvancedFilters: true,
  },
} as const;