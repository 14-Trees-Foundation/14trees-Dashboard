import { useState, useEffect } from 'react';
import { Tree } from '../../../../../types/tree';
import { Tree as UnifiedTree } from '../../../../../components/common/TreeSelection/types';
import ApiClient from '../../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';

interface UseEventTreeAssociationProps {
  eventId: number;
  open: boolean;
}

export const useEventTreeAssociation = ({ eventId, open }: UseEventTreeAssociationProps) => {
  const [loading, setLoading] = useState(false);
  const [associatedTrees, setAssociatedTrees] = useState<Tree[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<UnifiedTree[]>([]);
  const apiClient = new ApiClient();

  // Load associated trees when dialog opens
  useEffect(() => {
    if (open && eventId) {
      loadAssociatedTrees();
    }
  }, [open, eventId]);

  const loadAssociatedTrees = async () => {
    if (!eventId) {
      console.warn('Cannot load associated trees: eventId is undefined');
      return;
    }
    
    setLoading(true);
    try {
      // First get the basic tree associations
      const associated = await apiClient.events.getEventTrees(eventId);
      
      if (associated && associated.length > 0) {
        // Get complete tree details with joined data using the regular getTrees API
        const treeIds = associated.map(tree => tree.id);
        const completeTreesResponse = await apiClient.getTrees(0, treeIds.length, [
          {
            columnField: 'id',
            operatorValue: 'isAnyOf',
            value: treeIds
          }
        ]);
        
        setAssociatedTrees(completeTreesResponse.results || []);
      } else {
        setAssociatedTrees([]);
      }
    } catch (error: any) {
      console.error('Failed to load associated trees:', error);
      toast.error(`Failed to load associated trees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTreesChange = async (trees: UnifiedTree[]) => {
    if (!eventId) {
      toast.error('Cannot associate trees: Event ID is missing');
      return;
    }

    // Find newly selected trees (not previously selected)
    const previouslySelected = new Set(selectedTrees.map(t => t.id));
    const currentlySelected = new Set(trees.map(t => t.id));
    
    const newlySelected = trees.filter(t => !previouslySelected.has(t.id));
    const deselected = selectedTrees.filter(t => !currentlySelected.has(t.id));

    // Update local state immediately for better UX
    setSelectedTrees(trees);

    try {
      // Associate newly selected trees
      if (newlySelected.length > 0) {
        await apiClient.events.associateTreesToEvent(
          eventId, 
          newlySelected.map(t => t.id)
        );
        toast.success(`${newlySelected.length} tree${newlySelected.length !== 1 ? 's' : ''} associated successfully!`);
      }

      // Dissociate deselected trees
      if (deselected.length > 0) {
        await apiClient.events.dissociateTreesFromEvent(
          eventId, 
          deselected.map(t => t.id)
        );
        toast.success(`${deselected.length} tree${deselected.length !== 1 ? 's' : ''} dissociated successfully!`);
      }

      // Refresh associated trees
      await loadAssociatedTrees();
    } catch (error: any) {
      console.error('Failed to update tree associations:', error);
      toast.error(`Failed to update tree associations: ${error.message}`);
      // Revert local state on error
      setSelectedTrees(selectedTrees);
    }
  };

  const handleDissociateTree = async (treeId: number) => {
    if (!eventId) {
      toast.error('Cannot dissociate tree: Event ID is missing');
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.events.dissociateTreesFromEvent(eventId, [treeId]);
      toast.success('Tree dissociated successfully!');
      
      // Remove from selected trees if it was selected
      setSelectedTrees(prev => prev.filter(t => t.id !== treeId));
      
      // Refresh associated trees
      await loadAssociatedTrees();
    } catch (error: any) {
      console.error('Failed to dissociate tree:', error);
      toast.error(`Failed to dissociate tree: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    associatedTrees,
    selectedTrees,
    handleTreesChange,
    handleDissociateTree,
    loadAssociatedTrees
  };
};