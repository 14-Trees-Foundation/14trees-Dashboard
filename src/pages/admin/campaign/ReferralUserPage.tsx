import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
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
import { Spinner } from '../../../components/Spinner';
import { ReferralUserCards } from "./component/referraluser";
import ApiClient from '../../../api/apiClient/apiClient';
import { useParams } from 'react-router-dom';
import { NotFound } from '../../notfound/NotFound';

export const ReferralUserPage = () => {
    const { rfr } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState({
        totalRaised: 0,
        totalTrees: 0,
        donations: [],
        gifts: []
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
        if (rfr) {
            url += `?rfr=${rfr}`;
        }
        window.open(url, '_blank');
    };

    useEffect(() => {
        const fetchData = async () => {
            const apiClient = new ApiClient();
            try {
                if (!rfr) throw new Error('Referral code is required');

                // Fetch user name first
                const nameResponse = await apiClient.getUserNameByReferral(rfr);
                if (!nameResponse.name) throw new Error('User not found');
                setUserName(nameResponse.name);

                // Then fetch dashboard data
                const dashboardResponse = await apiClient.getReferralDashboard(rfr);
                setDashboardData(dashboardResponse);

            } catch (err: unknown) {
                console.error('Error fetching referral data:', err);
                if (err instanceof Error && (err.message.includes('No user found'))) {
                    setError('404');
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to load referral data');
                }
                // Set empty state
                setDashboardData({
                    totalRaised: 0,
                    totalTrees: 0,
                    donations: [],
                    gifts: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [rfr]);

    const pageContainerStyle = {
        p: 2,
        background: 'rgb(114 143 121 / 48%)',
        minHeight: '100vh'
    };

    if (loading) {
        return <Spinner text={""} />;
    }

    if (error === '404') {
        return <NotFound text="This referral page seems to have wandered off the trail!" />;
    }

    return (
        <Box sx={{ ...pageContainerStyle, p: 0, m: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'space-between', px: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            component="img"
                            src="/dark_logo.png"
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
                            {userName ? `${userName}'s Referral Contributions` : 'Referral Contributions'}
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

            <Container maxWidth="lg" sx={{ backgroundColor: 'transparent', mt: 3 }}>
                {error && error !== '404' && (
                    <Alert severity="error" sx={{
                        mb: 3,
                        backgroundColor: '#9BC53D',
                        color: '#3F5344'
                    }}>
                        {error}
                    </Alert>
                )}

                <ReferralUserCards data={dashboardData} />
            </Container>
        </Box>
    );
};