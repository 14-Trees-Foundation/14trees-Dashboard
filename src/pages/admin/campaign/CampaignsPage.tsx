import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { CampaignCards } from "./component/summary";
import ApiClient from '../../../api/apiClient/apiClient';
import { useParams } from 'react-router-dom';
import logo from '../../../assets/logo_light.png'
import { Spinner } from '../../../components/Spinner';
import { Campaign } from '../../../types/campaign';
import { NotFound } from '../../notfound/NotFound';

export const CampaignsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { c_key } = useParams<{ c_key: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenForm = (type: 'plant-memory' | 'donate') => {
    let url = `https://www.14trees.org/${type}`;
    let params = new URLSearchParams();
    if (campaign?.c_key) {
      params.append('c', campaign.c_key)
    }

    if (params.toString()) url += "?" + params.toString();
    window.open(url, '_blank');
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      const apiClient = new ApiClient();
      try {
        if (!c_key) throw new Error('Campaign key is required');

        const data = await apiClient.getCampaignAnalytics(c_key);
        setCampaign(data.campaign);
        setCampaignData({
          ...(data.summary || {
            donationCount: 0,
            giftRequestCount: 0,
            totalAmount: 0,
            treesCount: 0
          }),
          champions: data.champion || null
        });
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof Error && err.message.includes('not found')) {
          setError('404');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load campaign data');
        }
        setCampaignData({
          donationCount: 0,
          giftRequestCount: 0,
          totalAmount: 0,
          treesCount: 0,
          champions: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [c_key]);

  const pageContainerStyle = {
    p: 2,
    background: 'rgb(114 143 121 / 48%)',
    minHeight: '100vh'
  };

  if (loading) {
    return <Spinner text={""} />
  }

  if (error === '404') {
    return <NotFound text="This campaign seems to have wandered off the trail!" />
  }

  return (
    <Box sx={{ ...pageContainerStyle, p: 0, m: 0 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: { xs: 30, sm: 40 },
                mr: 1.2,
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#000000',
                fontWeight: 600,
                textShadow: '1px 1px 1.5px rgba(0,0,0,0.05)',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {campaign?.name || 'Campaign Dashboard'}
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{ color: '#3F5344', mr: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleOpenForm('donate');
                  }}
                  sx={{
                    color: '#3F5344',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  Donate
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleOpenForm('plant-memory');
                  }}
                  sx={{
                    color: '#3F5344',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  Plant a Memory
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleOpenForm('donate')}
                sx={{
                  backgroundColor: '#3F5344',
                  '&:hover': {
                    backgroundColor: '#2C3A2F',
                  },
                  textTransform: 'none',
                  px: 3
                }}
              >
                Donate
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenForm('plant-memory')}
                sx={{
                  backgroundColor: '#9BC53D',
                  '&:hover': {
                    backgroundColor: '#7A9E2F',
                  },
                  textTransform: 'none',
                  px: 3
                }}
              >
                Plant a Memory
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{
        backgroundColor: 'transparent',
        mt: 3,
        px: { xs: '2%', md: '15%' }
      }}>
        {error && (
          <Alert severity="error" sx={{
            mb: 3,
            backgroundColor: '#9BC53D',
            color: '#3F5344'
          }}>
            {error}
          </Alert>
        )}

        {campaign?.description && (
          <Box sx={{
            mb: 4,
            width: '100%'
          }}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-line',
                color: '#3F5344',
                lineHeight: 1.6
              }}
            >
              {campaign.description}
            </Typography>
          </Box>
        )}

        <CampaignCards data={campaignData} />
      </Container>
    </Box>
  );
};