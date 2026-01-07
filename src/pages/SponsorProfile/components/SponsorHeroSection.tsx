import React from 'react';
import { Box, Grid, Typography, Skeleton, useTheme, alpha } from '@mui/material';
import { Park, Co2, Event, Landscape } from '@mui/icons-material';

interface SponsorHeroSectionProps {
  totalTrees: number;
  totalRequests: number;
  co2Offset?: number;
  areaRestored?: number;
  loading?: boolean;
  isGroupView?: boolean;
  yearlyGrowth?: number;
}

const SkeletonHeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#E8F5E9',
        borderRadius: '12px',
        padding: 3,
        marginBottom: 4,
      }}
    >
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} key={item}>
            <Box display="flex" alignItems="center">
              <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="80%" height={24} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const SponsorHeroSection: React.FC<SponsorHeroSectionProps> = ({
  totalTrees,
  totalRequests,
  co2Offset,
  areaRestored,
  loading = false,
  isGroupView = false,
  yearlyGrowth
}) => {
  const theme = useTheme();

  // Calculate CO2 if not provided: totalTrees * 0.2 tons/tree (10-year average)
  const calculatedCO2 = co2Offset !== undefined ? co2Offset : (totalTrees * 0.2);
  const calculatedArea = areaRestored !== undefined ? areaRestored : (totalTrees * 0.002);

  if (loading) {
    return <SkeletonHeroSection />;
  }

  const backgroundColor = isGroupView
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`
    : alpha(theme.palette.success.main, 0.1);

  return (
    <Box
      data-testid="hero-section"
      sx={{
        background: backgroundColor,
        borderRadius: theme.shape.borderRadius,
        padding: 3,
        marginBottom: 4,
        '@media (max-width: 768px)': {
          padding: 2,
          marginBottom: 3,
        }
      }}
    >
      <Grid container spacing={3}>
        {/* Total Trees */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Park sx={{ fontSize: 48, color: theme.palette.success.main, mr: 2 }} />
            <Box>
              <Typography
                variant="h3"
                fontWeight={700}
                color={theme.palette.success.main}
                data-testid="total-trees"
                sx={{
                  '@media (max-width: 768px)': {
                    fontSize: '2rem',
                  }
                }}
              >
                {totalTrees.toLocaleString()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Trees Sponsored
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* CO2 Offset */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Co2 sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                fontWeight={600}
                color={theme.palette.text.primary}
                sx={{
                  '@media (max-width: 768px)': {
                    fontSize: '1.75rem',
                  }
                }}
              >
                {calculatedCO2.toFixed(1)} tons
              </Typography>
              <Typography variant="body1" color="text.secondary">
                CO2 Offset (est.)
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Total Requests */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Event sx={{ fontSize: 48, color: theme.palette.warning?.main || '#FF9800', mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                fontWeight={600}
                color={theme.palette.text.primary}
                sx={{
                  '@media (max-width: 768px)': {
                    fontSize: '1.75rem',
                  }
                }}
              >
                {totalRequests}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Requests
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Area Restored */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Landscape sx={{ fontSize: 48, color: theme.palette.success.light, mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                fontWeight={600}
                color={theme.palette.text.primary}
                sx={{
                  '@media (max-width: 768px)': {
                    fontSize: '1.75rem',
                  }
                }}
              >
                {calculatedArea.toFixed(2)} acres
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Area Restored (est.)
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Year-over-Year Growth (Corporate Only) */}
        {isGroupView && yearlyGrowth !== undefined && (
          <Grid item xs={12}>
            <Typography variant="h6" textAlign="center" color="primary">
              {yearlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(yearlyGrowth).toFixed(1)}% Year-over-Year Growth
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SponsorHeroSection;
