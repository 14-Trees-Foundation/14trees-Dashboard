import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Nature as TreeIcon,
} from '@mui/icons-material';

import { EventTreeAssociationProps } from './types';
import { LayoutType } from '../../../../../components/common/TreeSelection/types';
import LayoutToggle from '../../../../../components/common/TreeSelection/components/LayoutToggle';
import SideBySideLayout from '../../../../../components/common/TreeSelection/components/SideBySideLayout';
import VerticalLayout from '../../../../../components/common/TreeSelection/components/VerticalLayout';
import { useEventTreeAssociation } from './useEventTreeAssociation';
import { convertToUnifiedTree } from './helpers';

const EventTreeAssociation: React.FC<EventTreeAssociationProps> = ({
  eventId,
  eventName,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const [layout, setLayout] = useState<LayoutType>('sideBySide');
  
  const {
    loading,
    associatedTrees,
    selectedTrees,
    handleTreesChange,
    handleDissociateTree,
  } = useEventTreeAssociation({ eventId, open });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TreeIcon color="primary" />
          <Typography variant="h5" component="div" fontWeight="bold">
            Tree Association - {eventName}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <LayoutToggle layout={layout} onLayoutChange={setLayout} />
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {layout === 'sideBySide' ? (
          <SideBySideLayout
            loading={loading}
            associatedTrees={associatedTrees.map(convertToUnifiedTree)}
            selectedTrees={selectedTrees}
            onTreesChange={handleTreesChange}
            onDissociateTree={handleDissociateTree}
            associatedTreesTitle="Associated Trees"
            emptyMessage="No trees associated with this event yet. Use the tree selection panel to associate trees."
          />
        ) : (
          <VerticalLayout
            loading={loading}
            associatedTrees={associatedTrees.map(convertToUnifiedTree)}
            selectedTrees={selectedTrees}
            onTreesChange={handleTreesChange}
            onDissociateTree={handleDissociateTree}
            associatedTreesTitle="Associated Trees"
            availableTreesTitle="Available Trees"
            emptyMessage="No trees associated with this event yet. Use the tree selection section below to associate trees."
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" component="span" color="text.secondary">
          {associatedTrees.length} tree{associatedTrees.length !== 1 ? 's' : ''} currently associated with this event
        </Typography>
        
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          size="large"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventTreeAssociation;