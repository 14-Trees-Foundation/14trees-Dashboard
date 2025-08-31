import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface TreeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  children: React.ReactNode;
  selectedCount?: number;
  maxSelection?: number;
  submitDisabled?: boolean;
  submitText?: string;
  cancelText?: string;
  showSubmit?: boolean;
}

const TreeSelectionModal: React.FC<TreeSelectionModalProps> = ({
  open,
  onClose,
  onSubmit,
  title = 'Tree Selection',
  children,
  selectedCount = 0,
  maxSelection,
  submitDisabled = false,
  submitText = 'Confirm Selection',
  cancelText = 'Cancel',
  showSubmit = true,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getSubmitText = () => {
    if (selectedCount > 0) {
      return `${submitText} (${selectedCount})`;
    }
    return submitText;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          height: fullScreen ? '100vh' : '90vh',
          maxHeight: fullScreen ? '100vh' : '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="h5" component="div" fontWeight="bold">
            {title}
          </Typography>
          {maxSelection && (
            <Typography variant="caption" component="span" color="text.secondary">
              Select up to {maxSelection} trees
            </Typography>
          )}
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {children}
        </Box>
      </DialogContent>

      {/* Actions */}
      {showSubmit && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {selectedCount > 0 && (
              <Typography variant="body2" component="span" color="text.secondary">
                {selectedCount} tree{selectedCount !== 1 ? 's' : ''} selected
                {maxSelection && ` of ${maxSelection} maximum`}
              </Typography>
            )}
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              onClick={onClose}
              color="inherit"
              variant="outlined"
              size="large"
            >
              {cancelText}
            </Button>
            {onSubmit && (
              <Button
                onClick={onSubmit}
                color="primary"
                variant="contained"
                size="large"
                disabled={submitDisabled || selectedCount === 0}
                startIcon={<CheckIcon />}
              >
                {getSubmitText()}
              </Button>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TreeSelectionModal;