import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  ViewModule as SideBySideIcon,
  ViewStream as VerticalIcon,
} from '@mui/icons-material';
import { LayoutType } from '../types';

interface LayoutToggleProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutToggle: React.FC<LayoutToggleProps> = ({ layout, onLayoutChange }) => {
  return (
    <ToggleButtonGroup
      value={layout}
      exclusive
      onChange={(_, newLayout) => newLayout && onLayoutChange(newLayout)}
      size="small"
    >
      <ToggleButton value="sideBySide">
        <Tooltip title="Side by Side View">
          <SideBySideIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="vertical">
        <Tooltip title="Vertical View">
          <VerticalIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LayoutToggle;