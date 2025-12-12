import { useEffect, useCallback, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Typography, Box, Grid, Card, CardContent, LinearProgress, Tooltip, Fade, Grow } from "@mui/material";
import ParkTwoToneIcon from "@mui/icons-material/ParkTwoTone";
import GrassTwoToneIcon from "@mui/icons-material/GrassTwoTone";
import PermIdentityTwoToneIcon from "@mui/icons-material/PermIdentityTwoTone";
import TerrainTwoToneIcon from "@mui/icons-material/TerrainTwoTone";
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import NatureIcon from '@mui/icons-material/Nature';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { summary, treeLoggedByDate } from "../../../store/adminAtoms";
import { TreeLogCumulative } from "./TreeLogCumulative";
import { Apartment, Flag, HolidayVillage, HowToReg, LocationCity, OpacityTwoTone } from "@mui/icons-material";
import { Spinner } from "../../../components/Spinner";
import * as Axios from "../../../api/local";

export const AdminHome = () => {
  const adminSummary = useRecoilValue(summary);
  const setSummary = useSetRecoilState(summary);
  const setTreeLoggedByDate = useSetRecoilState(treeLoggedByDate);
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const classes = useStyles();
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    // Check if data already exists to avoid unnecessary API calls
    if (adminSummary && Object.keys(adminSummary).length !== 0) return;

    setLoading(true);
    try {
      // Fetch summary data
      const summaryResponse = await Axios.default.get(`/analytics/summary`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      });
      if (summaryResponse.status === 200) {
        setSummary(summaryResponse.data);
      }

      // Fetch tree data
      const treesResponse = await Axios.default.get(`/trees/loggedbydate`);
      if (treesResponse.status === 200) {
        // Check if the response data is an array
        if (Array.isArray(treesResponse.data)) {
          const formattedData = treesResponse.data.map(element => ({
            ...element,
            _id: element._id.substring(0, 10)
          }));
          setTreeLoggedByDate(formattedData);
        } else {
          // Handle case where data is not an array
          console.warn("Tree logged by date data is not an array:", treesResponse.data);
          setTreeLoggedByDate([]); // Set to empty array as fallback
        }
      }
    } catch (error) {
      if (error.response?.status === 500) {
        navigate("/login");
      }
      console.error("Error fetching admin home data:", error);
    } finally {
      setLoading(false);
    }
  }, [adminSummary, setSummary, setTreeLoggedByDate, token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Spinner />;
  }
  // Animated counter component
  const AnimatedCounter = ({ value, duration = 2000, suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!value) return;
      
      let start = 0;
      const end = parseInt(value) || 0;
      const increment = end / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [value, duration]);
    
    return `${displayValue.toLocaleString()}${suffix}`;
  };
  
  // Enhanced metric card component
  const MetricCard = ({ icon, value, label, color, progress, progressLabel, trend, delay = 0 }) => (
    <Grow in={true} timeout={1000 + delay}>
      <Card className={classes.enhancedCard} 
           style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)`, borderRadius: '20px' }}>
        <CardContent className={classes.cardContent}>
          <Box className={classes.iconContainer} style={{ color }}>
            {icon}
          </Box>
          <Typography variant="h3" className={classes.metricValue}>
            <AnimatedCounter value={value} />
          </Typography>
          <Typography variant="subtitle2" className={classes.metricLabel}>
            {label}
          </Typography>
          {progress !== undefined && (
            <>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                className={classes.progressBar}
                sx={{ 
                  backgroundColor: `${color}30`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color
                  }
                }}
              />
              {progressLabel && (
                <Typography variant="caption" className={classes.progressLabel}>
                  {progressLabel}
                </Typography>
              )}
            </>
          )}
          {trend && (
            <Typography variant="caption" className={classes.trendIndicator} style={{ color }}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <div>
      <Grid container spacing={3} sx={{ p: 2 }}>
        {/* Main Metrics Row */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, color: '#2E7D32', fontWeight: 600 }}>
            📊 {t('adminHome.summary')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricCard
                icon={<ParkTwoToneIcon fontSize="large" />}
                value={adminSummary.treeCount}
                label={t('adminHome.totalTrees')}
                color="#1F3625"
                delay={0}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <MetricCard
                icon={<GrassTwoToneIcon fontSize="large" />}
                value={adminSummary.plantTypeCount}
                label={t('adminHome.plantTypes')}
                color="#F94F25"
                delay={200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricCard
                icon={<HowToReg fontSize="large" />}
                value={adminSummary.bookedTreeCount}
                label={t('adminHome.bookedTrees')}
                color="#6166B8"
                progress={adminSummary.treeCount ? Math.round((adminSummary.bookedTreeCount / adminSummary.treeCount) * 100) : 0}
                progressLabel={adminSummary.treeCount ? `${Math.round((adminSummary.bookedTreeCount / adminSummary.treeCount) * 100)}% ${t('adminHome.ofTotalTrees')}` : undefined}
                delay={400}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricCard
                icon={<AssignmentIndTwoToneIcon fontSize="large" />}
                value={adminSummary.assignedTreeCount}
                label={t('adminHome.assignedTrees')}
                color="#9C27B0"
                progress={adminSummary.treeCount ? Math.round((adminSummary.assignedTreeCount / adminSummary.treeCount) * 100) : 0}
                progressLabel={adminSummary.treeCount ? `${Math.round((adminSummary.assignedTreeCount / adminSummary.treeCount) * 100)}% ${t('adminHome.ofTotalTrees')}` : undefined}
                delay={600}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricCard
                icon={<PermIdentityTwoToneIcon fontSize="large" />}
                value={adminSummary.userCount}
                label={t('adminHome.uniqueProfiles')}
                color="#C72542"
                delay={800}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Gift & Donation Metrics */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, color: '#2E7D32', fontWeight: 600 }}>
            🎁 {t('adminHome.giftDonationTracking')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<CardGiftcardIcon fontSize="large" />}
                value={adminSummary.personalGiftRequestsCount || "0"}
                label={t('adminHome.personalGiftRequests')}
                color="#E91E63"
                delay={1000}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<PersonIcon fontSize="large" />}
                value={adminSummary.personalGiftedTreesCount || "0"}
                label={t('adminHome.personalGiftedTrees')}
                color="#00ACC1"
                delay={1200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<CardGiftcardIcon fontSize="large" />}
                value={adminSummary.corporateGiftRequestsCount || "0"}
                label={t('adminHome.corporateGiftRequests')}
                color="#FF5722"
                delay={1400}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<BusinessIcon fontSize="large" />}
                value={adminSummary.corporateGiftedTreesCount || "0"}
                label={t('adminHome.corporateGiftedTrees')}
                color="#3F51B5"
                delay={1600}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<CardGiftcardIcon fontSize="large" />}
                value={adminSummary.totalGiftRequests || "0"}
                label={t('adminHome.totalGiftRequests')}
                color="#9C27B0"
                delay={1800}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<NatureIcon fontSize="large" />}
                value={adminSummary.totalGiftedTrees || "0"}
                label={t('adminHome.totalGiftedTrees')}
                color="#4CAF50"
                delay={2000}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Geographic Coverage */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, color: '#1565C0', fontWeight: 600 }}>
            🌍 {t('adminHome.geographicCoverage')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<Flag fontSize="large" />}
                value={adminSummary.sitesCount}
                label={t('adminHome.sites')}
                color="#53ad7a"
                delay={2200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<TerrainTwoToneIcon fontSize="large" />}
                value={adminSummary.plotCount}
                label={t('adminHome.totalPlots')}
                color="#573D1C"
                delay={2400}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<OpacityTwoTone fontSize="large" />}
                value={adminSummary.pondCount}
                label={t('adminHome.totalPonds')}
                color="#3C79BC"
                delay={2600}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<LocationCity fontSize="large" />}
                value={adminSummary.districtsCount}
                label={t('adminHome.districts')}
                color="#078085"
                delay={2800}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<Apartment fontSize="large" />}
                value={adminSummary.talukasCount}
                label={t('adminHome.talukas')}
                color="#607D8B"
                delay={3000}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MetricCard
                icon={<HolidayVillage fontSize="large" />}
                value={adminSummary.villagesCount}
                label={t('adminHome.villages')}
                color="#795548"
                delay={3200}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Land Type Distribution */}
        {adminSummary?.landTypeCounts && Object.keys(adminSummary.landTypeCounts).length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2, color: '#388E3C', fontWeight: 600 }}>
              🌱 {t('adminHome.landTypeDistribution')}
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(adminSummary.landTypeCounts).map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={3} lg={2} key={key}>
                  <MetricCard
                    icon={<ParkTwoToneIcon fontSize="large" />}
                    value={value}
                    label={t(`adminHome.landTypes.${key}`, key)}
                    color={['#1F3625', '#2E7D32', '#388E3C', '#4CAF50', '#66BB6A', '#81C784'][index % 6]}
                    delay={3400 + (index * 200)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
        
        {/* Tree Growth Analytics */}
        <Grid item xs={12}>
          <Card className={classes.chartContainer}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, color: '#1565C0', fontWeight: 600 }}>
                📈 {t('adminHome.treeGrowthAnalytics')}
              </Typography>
              <TreeLogCumulative />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    pageTitle: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
      textAlign: 'center'
    },
    enhancedCard: {
      minHeight: '180px',
      height: 'auto',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: 'inset 7px 7px 14px rgba(0,0,0,0.1), inset -7px -7px 14px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        borderRadius: '18px',
        zIndex: 1
      },
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)',
        '& $iconContainer': {
          transform: 'scale(1.1) rotate(5deg)'
        }
      }
    },
    cardContent: {
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '14px !important',
      paddingBottom: '18px !important',
      position: 'relative',
      zIndex: 2
    },
    iconContainer: {
      marginBottom: '8px',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
    },
    metricValue: {
      fontSize: '2.2rem !important',
      fontWeight: '700 !important',
      color: '#2c3e50 !important',
      marginBottom: '6px !important',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    metricLabel: {
      fontSize: '0.9rem !important',
      fontWeight: '600 !important',
      color: '#34495e !important',
      textAlign: 'center',
      marginBottom: '6px !important'
    },
    progressBar: {
      width: '100%',
      height: '6px !important',
      borderRadius: '3px',
      marginBottom: '8px'
    },
    progressLabel: {
      fontSize: '0.7rem !important',
      fontWeight: '500 !important',
      color: '#666 !important',
      textAlign: 'center',
      marginTop: '2px',
      lineHeight: '1.2 !important'
    },
    trendIndicator: {
      fontSize: '0.75rem !important',
      fontWeight: '600 !important',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    chartContainer: {
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    // Legacy card style for compatibility
    card: {
      width: "100%",
      maxWidth: "180px",
      minHeight: "170px",
      maxHeight: "260px",
      borderRadius: "15px",
      textAlign: "center",
      padding: "16px",
      margin: "15px",
      background: "linear-gradient(145deg, #9faca3, #bdccc2)",
      boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
    },
  })
);
