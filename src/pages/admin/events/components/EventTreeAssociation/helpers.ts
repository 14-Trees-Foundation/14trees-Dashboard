import { Tree } from '../../../../../types/tree';
import { Tree as UnifiedTree } from '../../../../../components/common/TreeSelection/types';

// Convert Tree to UnifiedTree format
export const convertToUnifiedTree = (tree: Tree): UnifiedTree => ({
  id: tree.id,
  sapling_id: tree.sapling_id,
  plant_type: tree.plant_type || '',
  plot: tree.plot || '',
  plot_name: tree.site_name || tree.plot || '',
  plot_id: tree.plot_id,
  status: tree.tree_status || 'Unknown',
  tags: tree.tags || [],
  assigned_to: tree.assigned_to_name,
  planted_date: tree.created_at?.toString(),
  tree_id: tree.id,
});

// Convert UnifiedTree to Tree format (for API calls)
export const convertFromUnifiedTree = (unifiedTree: UnifiedTree): Tree => ({
  key: unifiedTree.id,
  id: unifiedTree.id,
  sapling_id: unifiedTree.sapling_id,
  plant_type_id: 0, // Will be filled by API
  plot_id: unifiedTree.plot_id,
  image: '',
  tags: unifiedTree.tags,
  location: { lat: 0, lng: 0 },
  planted_by: '',
  mapped_to_user: 0,
  mapped_to_group: 0,
  mapped_at: new Date(),
  sponsored_by_user: 0,
  sponsored_by_group: 0,
  gifted_by: 0,
  gifted_to: 0,
  assigned_to: 0,
  assigned_at: new Date(),
  user_tree_image: '',
  memory_images: [],
  event_id: 0,
  created_at: new Date(),
  updated_at: new Date(),
  tree_status: unifiedTree.status,
  deleted_at: null,
  plant_type: unifiedTree.plant_type,
  plot: unifiedTree.plot,
  site_name: unifiedTree.plot_name,
  assigned_to_name: unifiedTree.assigned_to,
});