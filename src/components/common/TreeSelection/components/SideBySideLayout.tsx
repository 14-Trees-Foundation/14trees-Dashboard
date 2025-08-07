import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import TreeSelectionComponent from '../TreeSelectionComponent';
import { createTreeSelectionProps } from '../utils/presets';
import { Tree } from '../types';
import AssociatedTreesList from './AssociatedTreesList';

interface SideBySideLayoutProps {
  loading: boolean;
  associatedTrees: Tree[];
  selectedTrees: Tree[];
  onTreesChange: (trees: Tree[]) => Promise<void>;
  onDissociateTree: (treeId: number) => Promise<void>;
  treeScope?: 'giftable' | 'all';
  presetType?: keyof typeof import('../utils/presets').TREE_SELECTION_PRESETS;
  associatedTreesTitle?: string;
  emptyMessage?: string;
}

const SideBySideLayout: React.FC<SideBySideLayoutProps> = ({
  loading,
  associatedTrees,
  selectedTrees,
  onTreesChange,
  onDissociateTree,
  treeScope = 'all',
  presetType = 'EVENT_ASSOCIATION',
  associatedTreesTitle = 'Associated Trees',
  emptyMessage = 'No trees associated yet. Use the tree selection panel to associate trees.',
}) => {
  const theme = useTheme();

  return (
    <Grid container sx={{ height: '100%' }}>
      {/* Associated Trees Panel */}
      <Grid item xs={12} md={4} sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>
        <AssociatedTreesList
          loading={loading}
          associatedTrees={associatedTrees}
          onDissociateTree={onDissociateTree}
          title={associatedTreesTitle}
          emptyMessage={emptyMessage}
        />
      </Grid>

      {/* Tree Selection Panel */}
      <Grid item xs={12} md={8}>
        <Box sx={{ height: '100%', p: 2 }}>
          <TreeSelectionComponent
            {...createTreeSelectionProps(presetType)}
            treeScope={treeScope}
            open={true}
            onClose={() => {}}
            selectedTrees={selectedTrees}
            onSelectedTreesChange={onTreesChange}
            associatedTrees={associatedTrees}
            title=""
            layout="dialog"
            showSelectedTable={false}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SideBySideLayout;