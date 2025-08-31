import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { Tree, UseTreeSelectionProps } from '../types';

export const useTreeSelection = ({
  maxSelection,
  selectedTrees,
  onSelectedTreesChange,
  mode = 'batch',
}: UseTreeSelectionProps) => {

  const isTreeSelected = useCallback((tree: Tree) => {
    return selectedTrees.some(selected => selected.id === tree.id);
  }, [selectedTrees]);

  const canSelectMore = useCallback(() => {
    if (!maxSelection) return true;
    return selectedTrees.length < maxSelection;
  }, [selectedTrees.length, maxSelection]);

  const handleTreeSelect = useCallback((tree: Tree) => {
    if (isTreeSelected(tree)) {
      // Remove tree from selection
      const newSelection = selectedTrees.filter(selected => selected.id !== tree.id);
      onSelectedTreesChange(newSelection);
      return;
    }

    // Add tree to selection
    if (!canSelectMore()) {
      toast.error(`Maximum ${maxSelection} trees can be selected!`);
      return;
    }

    const treeToAdd = { ...tree, tree_id: tree.id };
    const newSelection = [...selectedTrees, treeToAdd];
    onSelectedTreesChange(newSelection);
  }, [selectedTrees, onSelectedTreesChange, isTreeSelected, canSelectMore, maxSelection]);

  const handleTreeRemove = useCallback((tree: Tree) => {
    const newSelection = selectedTrees.filter(selected => selected.id !== tree.id);
    onSelectedTreesChange(newSelection);
  }, [selectedTrees, onSelectedTreesChange]);

  const handleSelectAll = useCallback((availableTrees: Tree[]) => {
    if (!maxSelection) {
      // No limit, select all available trees
      const newSelection = [...selectedTrees];
      availableTrees.forEach(tree => {
        if (!isTreeSelected(tree)) {
          newSelection.push({ ...tree, tree_id: tree.id });
        }
      });
      onSelectedTreesChange(newSelection);
      return;
    }

    // With limit, select up to the maximum
    const remainingSlots = maxSelection - selectedTrees.length;
    if (remainingSlots <= 0) {
      toast.warning(`Already selected maximum ${maxSelection} trees`);
      return;
    }

    const treesToAdd = availableTrees
      .filter(tree => !isTreeSelected(tree))
      .slice(0, remainingSlots)
      .map(tree => ({ ...tree, tree_id: tree.id }));

    const newSelection = [...selectedTrees, ...treesToAdd];
    onSelectedTreesChange(newSelection);

    if (treesToAdd.length < availableTrees.filter(tree => !isTreeSelected(tree)).length) {
      toast.info(`Selected ${treesToAdd.length} trees (maximum ${maxSelection} reached)`);
    }
  }, [selectedTrees, onSelectedTreesChange, maxSelection, isTreeSelected]);

  const handleSelectAllFiltered = useCallback((allFilteredTrees: Tree[]) => {
    if (!maxSelection) {
      // No limit, select all filtered trees
      const newSelection = [...selectedTrees];
      allFilteredTrees.forEach(tree => {
        if (!isTreeSelected(tree)) {
          newSelection.push({ ...tree, tree_id: tree.id });
        }
      });
      onSelectedTreesChange(newSelection);
      toast.success(`Selected ${allFilteredTrees.filter(tree => !isTreeSelected(tree)).length} trees`);
      return;
    }

    // With limit, select up to the maximum
    const remainingSlots = maxSelection - selectedTrees.length;
    if (remainingSlots <= 0) {
      toast.warning(`Already selected maximum ${maxSelection} trees`);
      return;
    }

    const treesToAdd = allFilteredTrees
      .filter(tree => !isTreeSelected(tree))
      .slice(0, remainingSlots)
      .map(tree => ({ ...tree, tree_id: tree.id }));

    const newSelection = [...selectedTrees, ...treesToAdd];
    onSelectedTreesChange(newSelection);

    if (treesToAdd.length < allFilteredTrees.filter(tree => !isTreeSelected(tree)).length) {
      toast.info(`Selected ${treesToAdd.length} trees (maximum ${maxSelection} reached)`);
    } else {
      toast.success(`Selected ${treesToAdd.length} trees`);
    }
  }, [selectedTrees, onSelectedTreesChange, maxSelection, isTreeSelected]);

  const handleDeselectAll = useCallback(() => {
    onSelectedTreesChange([]);
  }, [onSelectedTreesChange]);

  const handleBulkSelect = useCallback((trees: Tree[], selected: boolean) => {
    if (selected) {
      // Add trees
      const treesToAdd = trees.filter(tree => !isTreeSelected(tree));
      
      if (maxSelection) {
        const remainingSlots = maxSelection - selectedTrees.length;
        if (remainingSlots <= 0) {
          toast.warning(`Already selected maximum ${maxSelection} trees`);
          return;
        }
        treesToAdd.splice(remainingSlots);
      }

      const newSelection = [
        ...selectedTrees,
        ...treesToAdd.map(tree => ({ ...tree, tree_id: tree.id }))
      ];
      onSelectedTreesChange(newSelection);
    } else {
      // Remove trees
      const treeIds = new Set(trees.map(tree => tree.id));
      const newSelection = selectedTrees.filter(selected => !treeIds.has(selected.id));
      onSelectedTreesChange(newSelection);
    }
  }, [selectedTrees, onSelectedTreesChange, maxSelection, isTreeSelected]);

  const getSelectionStats = useCallback(() => {
    return {
      selectedCount: selectedTrees.length,
      maxSelection: maxSelection || 'unlimited',
      canSelectMore: canSelectMore(),
      selectionPercentage: maxSelection ? (selectedTrees.length / maxSelection) * 100 : 0,
    };
  }, [selectedTrees.length, maxSelection, canSelectMore]);

  return {
    isTreeSelected,
    canSelectMore,
    handleTreeSelect,
    handleTreeRemove,
    handleSelectAll,
    handleSelectAllFiltered,
    handleDeselectAll,
    handleBulkSelect,
    getSelectionStats,
  };
};