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
  useMediaQuery,
  Card,
  CardContent,
  Fade,
  Slide
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
    background: 'linear-gradient(135deg, rgba(155, 197, 61, 0.1) 0%, rgba(114, 143, 121, 0.2) 50%, rgba(63, 83, 68, 0.15) 100%)',
    minHeight: '100vh',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(155, 197, 61, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(63, 83, 68, 0.06) 0%, transparent 50%)',
      pointerEvents: 'none'
    }
  };

  if (loading) {
    return <Spinner text={""} />
  }

  if (error === '404') {
    return <NotFound text="This campaign seems to have wandered off the trail!" />
  }

  return (
    <Box sx={{ ...pageContainerStyle, p: 0, m: 0 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #3F5344 0%, #2C3A2F 50%, #1A2319 100%)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(155, 197, 61, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(155, 197, 61, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #9BC53D 0%, #7A9E2F 50%, #9BC53D 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite'
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' }
          }
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 1, sm: 1.5 }, position: 'relative', zIndex: 1, minHeight: { xs: '64px', sm: '72px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 }, flex: 1, minWidth: 0 }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: { xs: 35, sm: 45, md: 50 },
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: { xs: 'scale(1.05)', sm: 'scale(1.08) rotate(-2deg)' },
                  filter: 'drop-shadow(0 4px 12px rgba(155, 197, 61, 0.4))'
                }
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '0.95rem', sm: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'nowrap', sm: 'normal' }
                }}
              >
                {campaign?.name || 'Campaign Dashboard'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(155, 197, 61, 0.9)',
                  fontWeight: 500,
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Growing Together
              </Typography>
            </Box>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(155, 197, 61, 0.25)',
                  border: '1px solid rgba(155, 197, 61, 0.3)',
                  flexShrink: 0,
                  ml: 1,
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  '&:hover': {
                    backgroundColor: 'rgba(155, 197, 61, 0.4)',
                    border: '1px solid rgba(155, 197, 61, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundColor: 'rgba(63, 83, 68, 0.98)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(155, 197, 61, 0.3)'
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleOpenForm('donate');
                  }}
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 500,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(155, 197, 61, 0.15)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease'
                    }
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
                    color: '#FFFFFF',
                    fontWeight: 500,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(155, 197, 61, 0.15)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Plant a Memory
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: { sm: 1.5, md: 2.5 }, flexShrink: 0 }}>
              <Button
                variant="contained"
                onClick={() => handleOpenForm('donate')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  },
                  textTransform: 'none',
                  px: { sm: 2.5, md: 3.5 },
                  py: { sm: 1, md: 1.2 },
                  fontSize: { sm: '0.85rem', md: '0.95rem' },
                  fontWeight: 700,
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                Donate
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenForm('plant-memory')}
                sx={{
                  backgroundColor: '#9BC53D',
                  color: '#2C3A2F',
                  border: '2px solid rgba(155, 197, 61, 0.3)',
                  '&:hover': {
                    backgroundColor: '#B5D954',
                    border: '2px solid rgba(155, 197, 61, 0.5)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(155, 197, 61, 0.5)'
                  },
                  textTransform: 'none',
                  px: { sm: 2, md: 3.5 },
                  py: { sm: 1, md: 1.2 },
                  fontSize: { sm: '0.85rem', md: '0.95rem' },
                  fontWeight: 700,
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(155, 197, 61, 0.4)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap'
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
        mt: { xs: 3, sm: 5 },
        mb: 6,
        px: { xs: 2, sm: 3, md: '10%', lg: '15%' },
        position: 'relative',
        zIndex: 1
      }}>
        {error && (
          <Fade in timeout={600}>
            <Alert
              severity="error"
              sx={{
                mb: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#3F5344',
                borderRadius: '16px',
                border: '2px solid rgba(220, 53, 69, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 6px 24px rgba(220, 53, 69, 0.2)',
                py: 2
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {campaign?.c_key === 'glowback' && (
          <Fade in timeout={800}>
            <Box sx={{
              mb: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: { xs: 3, sm: 3.5, md: 4 },
              animation: 'fadeInDown 0.8s ease-out',
              '@keyframes fadeInDown': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-20px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}>
              <Box
                component="img"
                src="https://14treesplants.s3.ap-south-1.amazonaws.com/campaigns/glowback-logo.png"
                alt="Glowback Campaign Logo"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '200px', sm: '280px', md: '340px', lg: '380px' },
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 16px rgba(63, 83, 68, 0.2))',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', sm: 'scale(1.05)' },
                    filter: 'drop-shadow(0 8px 24px rgba(155, 197, 61, 0.3))'
                  }
                }}
              />
            </Box>
          </Fade>
        )}

        {campaign?.description && (
          <Fade in timeout={1000}>
            <Card sx={{
              mb: { xs: 4, sm: 5, md: 6 },
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(25px)',
              borderRadius: { xs: '16px', sm: '18px', md: '20px' },
              boxShadow: '0 10px 40px rgba(63, 83, 68, 0.15)',
              border: '2px solid rgba(155, 197, 61, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: { xs: '3px', sm: '4px' },
                background: 'linear-gradient(90deg, #9BC53D 0%, #7A9E2F 50%, #9BC53D 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite'
              },
              '&:hover': {
                boxShadow: { xs: '0 12px 48px rgba(63, 83, 68, 0.2)', sm: '0 16px 56px rgba(63, 83, 68, 0.22)' },
                transform: { xs: 'translateY(-3px)', sm: 'translateY(-6px)' },
                border: '2px solid rgba(155, 197, 61, 0.35)'
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' }
              }
            }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5, lg: 5 }, pt: { xs: 3.5, sm: 4.5, md: 5 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-line',
                    color: '#2C3A2F',
                    lineHeight: { xs: 1.7, sm: 1.8, md: 1.9 },
                    fontSize: { xs: '0.92rem', sm: '1.02rem', md: '1.08rem', lg: '1.12rem' },
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    textAlign: { xs: 'left', sm: 'justify' }
                  }}
                >
                  {campaign.description}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        )}

        <Slide direction="up" in timeout={1200}>
          <Box sx={{
            '& > *': {
              animation: 'fadeIn 0.6s ease-out'
            },
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 }
            }
          }}>
            <CampaignCards data={campaignData} />
          </Box>
        </Slide>
      </Container>
    </Box>
  );
};