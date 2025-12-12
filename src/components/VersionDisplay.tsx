import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { getVersionInfo } from '../config/version';
import InfoIcon from '@mui/icons-material/Info';

const useStyles = makeStyles((theme: any) =>
  createStyles({
    versionContainer: {
      position: 'sticky',
      bottom: 0,
      marginTop: 'auto',
      margin: '10px',
      padding: '8px 12px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(4px)',
    },
    versionText: {
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      justifyContent: 'center',
    },
    infoIcon: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.7)',
      cursor: 'help',
    },
  })
);

interface VersionDisplayProps {
  compact?: boolean;
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({ compact = false }) => {
  const classes = useStyles();
  const versionInfo = getVersionInfo();

  const tooltipContent = (
    <Box>
      <Typography variant="caption" display="block">
        <strong>Version:</strong> v{versionInfo.version}
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Last Updated:</strong> {versionInfo.buildDate}
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="right">
      <Box className={classes.versionContainer}>
        <Box className={classes.versionText}>
          <InfoIcon className={classes.infoIcon} />
          <span>v{versionInfo.version}</span>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default VersionDisplay;