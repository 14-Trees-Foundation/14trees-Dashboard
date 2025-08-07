import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import { Tree } from '../types';

interface AssociatedTreesListProps {
  loading: boolean;
  associatedTrees: Tree[];
  onDissociateTree: (treeId: number) => Promise<void>;
  title?: string;
  emptyMessage?: string;
}

const AssociatedTreesList: React.FC<AssociatedTreesListProps> = ({
  loading,
  associatedTrees,
  onDissociateTree,
  title = 'Associated Trees',
  emptyMessage = 'No trees associated yet. Use the tree selection panel to associate trees.',
}) => {
  const theme = useTheme();

  return (
    <Box p={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {title} ({associatedTrees.length})
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : associatedTrees.length === 0 ? (
        <Alert severity="info">
          {emptyMessage}
        </Alert>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List dense>
            {associatedTrees.map((tree) => (
              <ListItem 
                key={tree.id}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold">
                      {tree.sapling_id}
                    </Typography>
                  }
                  secondary={
                    <Box component="div">
                      <Typography variant="caption" component="div">
                        Plot: {tree.plot_name || tree.plot || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" component="div">
                        Type: {tree.plant_type || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" component="div">
                        Status: {tree.status || 'Unknown'}
                      </Typography>
                      {tree.assigned_to && (
                        <Typography variant="caption" component="div">
                          Assigned to: {tree.assigned_to}
                        </Typography>
                      )}
                      {tree.tags && tree.tags.length > 0 && (
                        <Typography variant="caption" component="div">
                          Tags: {tree.tags.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => onDissociateTree(tree.id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default AssociatedTreesList;