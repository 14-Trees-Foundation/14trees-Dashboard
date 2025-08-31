import React from 'react';
import { Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import TreeSelectionComponent from '../TreeSelectionComponent';
import TreeTable from './TreeTable';
import { createTreeSelectionProps } from '../utils/presets';
import { Tree } from '../types';

interface VerticalLayoutProps {
  loading: boolean;
  associatedTrees: Tree[];
  selectedTrees: Tree[];
  onTreesChange: (trees: Tree[]) => Promise<void>;
  onDissociateTree: (treeId: number) => Promise<void>;
  onRemoveAll?: () => Promise<void>;
  treeScope?: 'giftable' | 'all';
  presetType?: keyof typeof import('../utils/presets').TREE_SELECTION_PRESETS;
  associatedTreesTitle?: string;
  availableTreesTitle?: string;
  emptyMessage?: string;
  removeButtonLabel?: string;
  removeAllButtonLabel?: string;
}

const VerticalLayout: React.FC<VerticalLayoutProps> = ({
  loading,
  associatedTrees,
  selectedTrees,
  onTreesChange,
  onDissociateTree,
  onRemoveAll,
  treeScope = 'all',
  presetType = 'EVENT_ASSOCIATION',
  associatedTreesTitle = 'Associated Trees',
  availableTreesTitle = 'Available Trees',
  emptyMessage = 'No trees associated yet. Use the tree selection section below to associate trees.',
  removeButtonLabel = 'Remove',
  removeAllButtonLabel = 'Remove All',
}) => {
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Associated Trees Section */}
      <Box sx={{ 
        minHeight: '300px',
        maxHeight: '50%',
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : associatedTrees.length === 0 ? (
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              {associatedTreesTitle} (0)
            </Typography>
            <Alert severity="info">
              {emptyMessage}
            </Alert>
          </Box>
        ) : (
          <TreeTable
            title={associatedTreesTitle}
            trees={associatedTrees}
            selectedTrees={[]} // Not applicable for associated trees view
            loading={false}
            total={associatedTrees.length}
            page={0}
            pageSize={associatedTrees.length}
            mode="immediate"
            emptyMessage={emptyMessage}
            tags={[]}
            filters={{}}
            onFiltersChange={() => {}}
            showBulkActions={true}
            isSelectedTable={true}
            hideTitle={false}
            onRemoveAll={onRemoveAll}
            scrollHeight="auto"
            removeAllButtonLabel={removeAllButtonLabel}
            customActions={(tree) => (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => onDissociateTree(tree.id)}
                disabled={loading}
              >
                {removeButtonLabel}
              </Button>
            )}
          />
        )}
      </Box>

      {/* Available Trees Section */}
      <Box sx={{ 
        flex: 1,
        minHeight: '300px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          flex: 1,
          overflow: 'hidden',
          '& .MuiDataGrid-root': {
            border: 'none',
          }
        }}>
          <TreeSelectionComponent
            {...createTreeSelectionProps(presetType)}
            treeScope={treeScope}
            open={true}
            onClose={() => {}}
            selectedTrees={selectedTrees}
            onSelectedTreesChange={onTreesChange}
            associatedTrees={associatedTrees}
            title={availableTreesTitle}
            layout="dialog"
            showSelectedTable={false} // Don't show selected table
            sideLayout={false} // Show only the main tree grid
            showAssociationStatus={true} // Show association status in the grid
            hideTableTitle={false} // Show the table title with buttons
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VerticalLayout;