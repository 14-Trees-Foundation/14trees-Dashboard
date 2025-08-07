import React from 'react';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { TreeSelectionProps } from './types';
import { useTreeData } from './hooks/useTreeData';
import { useTreeFilters } from './hooks/useTreeFilters';
import { useTreeSelection } from './hooks/useTreeSelection';
import TreeSelectionModal from './components/TreeSelectionModal';
import TreeTable from './components/TreeTable';

const TreeSelectionComponent: React.FC<TreeSelectionProps> = ({
  open,
  onClose,
  mode = 'batch',
  maxSelection,
  treeScope,
  plotIds = [],
  plantTypes = [],
  includeNonGiftable = false,
  includeAllHabitats = false,
  customFilters = [],
  selectedTrees,
  onSelectedTreesChange,
  onSubmit,
  layout = 'modal',
  title = 'Tree Selection',
  showSelectedTable = true,
  showPlantTypeFilter = true,
  sideLayout = true,
  enableAdvancedFilters = true,
  associatedTrees = [],
  associationMode = false,
  hideTableTitle = false,
  customActions,
  hideDefaultActions = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pageSize = 20;

  // Hooks
  const {
    filters,
    selectedPlantTypes,
    tags,
    plots,
    plantTypes: availablePlantTypes,
    handleSetFilters,
    handlePlantTypeSelect,
    handlePlantTypeReset,
    addFilter,
    clearAllFilters,
    getActiveFilterCount,
  } = useTreeFilters();

  const {
    trees,
    total,
    page,
    loading,
    treesData,
    handlePaginationChange,
    refreshData,
  } = useTreeData({
    plotIds,
    treeScope,
    includeNonGiftable,
    includeAllHabitats,
    filters,
    pageSize,
  });

  const {
    isTreeSelected,
    canSelectMore,
    handleTreeSelect,
    handleTreeRemove,
    handleSelectAll,
    handleDeselectAll,
    getSelectionStats,
  } = useTreeSelection({
    maxSelection,
    selectedTrees,
    onSelectedTreesChange,
    mode,
  });

  // Event handlers
  const handleTreeSelectWrapper = (tree: any) => {
    handleTreeSelect(tree);
  };

  const handleTreeRemoveWrapper = (tree: any) => {
    handleTreeRemove(tree);
  };

  const handleSelectAllWrapper = () => {
    handleSelectAll(trees);
  };

  const handleSubmit = () => {
    onSubmit?.(selectedTrees);
  };

  const handleViewDetails = (tree: any) => {
    // TODO: Implement tree details modal
    console.log('View details for tree:', tree);
  };

  // Apply custom filters if provided
  const applyCustomFilters = (treesToFilter: any[]) => {
    if (!customFilters || customFilters.length === 0) {
      return treesToFilter;
    }

    return treesToFilter.filter(tree => {
      return customFilters.every(filter => {
        const fieldValue = tree[filter.columnField];
        
        switch (filter.operatorValue) {
          case 'isAnyOf':
            return Array.isArray(filter.value) && filter.value.includes(fieldValue);
          case 'equals':
            return fieldValue === filter.value;
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          default:
            return true;
        }
      });
    });
  };

  // Filter available trees (exclude already associated ones in association mode, then apply custom filters)
  let availableTrees = associationMode 
    ? trees.filter(tree => !associatedTrees.some(assoc => assoc.id === tree.id))
    : trees;
  
  // Apply custom filters
  availableTrees = applyCustomFilters(availableTrees);

  // Convert filters to the format expected by the table columns
  const filtersRecord = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value])
  );

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tree Tables */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {sideLayout && !isMobile ? (
          // Side-by-side layout for desktop
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Available Trees */}
            <Grid item xs={showSelectedTable ? 7 : 12} sx={{ height: '100%' }}>
              <TreeTable
                title="Available Trees"
                trees={availableTrees}
                selectedTrees={selectedTrees}
                associatedTrees={associatedTrees}
                loading={loading}
                total={total}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onTreeSelect={handleTreeSelectWrapper}
                onTreeRemove={handleTreeRemoveWrapper}
                onSelectAll={handleSelectAllWrapper}
                onDeselectAll={handleDeselectAll}
                onViewDetails={handleViewDetails}
                mode={mode}
                maxSelection={maxSelection}
                emptyMessage="No trees found. Try adjusting your filters."
                tags={tags}
                filters={filtersRecord}
                onFiltersChange={handleSetFilters}
                showBulkActions={true}
                isSelectedTable={false}
                hideTitle={hideTableTitle}
                customActions={customActions}
                hideDefaultActions={hideDefaultActions}
              />
            </Grid>

            {/* Selected Trees */}
            {showSelectedTable && (
              <Grid item xs={5} sx={{ height: '100%' }}>
                <TreeTable
                  title="Selected Trees"
                  trees={selectedTrees}
                  selectedTrees={selectedTrees}
                  loading={false}
                  total={selectedTrees.length}
                  page={0}
                  pageSize={selectedTrees.length || 10}
                  onTreeRemove={handleTreeRemoveWrapper}
                  onDeselectAll={handleDeselectAll}
                  onViewDetails={handleViewDetails}
                  mode={mode}
                  emptyMessage="No trees selected yet."
                  tags={tags}
                  filters={{}}
                  onFiltersChange={() => {}}
                  showBulkActions={true}
                  isSelectedTable={true}
                  hideTitle={hideTableTitle}
                  customActions={customActions}
                  hideDefaultActions={hideDefaultActions}
                />
              </Grid>
            )}
          </Grid>
        ) : (
          // Stacked layout for mobile or when sideLayout is false
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <TreeTable
              title="Available Trees"
              trees={availableTrees}
              selectedTrees={selectedTrees}
              associatedTrees={associatedTrees}
              loading={loading}
              total={total}
              page={page}
              pageSize={pageSize}
              onPaginationChange={handlePaginationChange}
              onTreeSelect={handleTreeSelectWrapper}
              onTreeRemove={handleTreeRemoveWrapper}
              onSelectAll={handleSelectAllWrapper}
              onDeselectAll={handleDeselectAll}
              onViewDetails={handleViewDetails}
              mode={mode}
              maxSelection={maxSelection}
              emptyMessage="No trees found. Try adjusting your filters."
              tags={tags}
              filters={filtersRecord}
              onFiltersChange={handleSetFilters}
              showBulkActions={true}
              isSelectedTable={false}
              hideTitle={hideTableTitle}
              customActions={customActions}
              hideDefaultActions={hideDefaultActions}
            />

            {showSelectedTable && selectedTrees.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <TreeTable
                  title="Selected Trees"
                  trees={selectedTrees}
                  selectedTrees={selectedTrees}
                  loading={false}
                  total={selectedTrees.length}
                  page={0}
                  pageSize={selectedTrees.length || 10}
                  onTreeRemove={handleTreeRemoveWrapper}
                  onDeselectAll={handleDeselectAll}
                  onViewDetails={handleViewDetails}
                  mode={mode}
                  emptyMessage="No trees selected yet."
                  tags={tags}
                  filters={{}}
                  onFiltersChange={() => {}}
                  showBulkActions={true}
                  isSelectedTable={true}
                  hideTitle={hideTableTitle}
                  customActions={customActions}
                  hideDefaultActions={hideDefaultActions}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (layout === 'modal') {
    return (
      <TreeSelectionModal
        open={open}
        onClose={onClose}
        onSubmit={mode === 'batch' ? handleSubmit : undefined}
        title={title}
        selectedCount={selectedTrees.length}
        maxSelection={maxSelection}
        showSubmit={mode === 'batch'}
      >
        {content}
      </TreeSelectionModal>
    );
  }

  // For dialog layout (events), render content directly
  // This would be wrapped by the parent component's dialog
  return content;
};

export default TreeSelectionComponent;