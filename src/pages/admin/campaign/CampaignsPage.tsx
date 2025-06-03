import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Avatar
} from "@mui/material";
import { CampaignCards } from "./component/summary";
import ApiClient from '../../../api/apiClient/apiClient';
import { useParams } from 'react-router-dom';

export const CampaignsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const { c_key } = useParams<{ c_key: string }>(); // Fixed type definition

  useEffect(() => {
    const fetchCampaignData = async () => {
      const apiClient = new ApiClient();
      try {
        if (!c_key) throw new Error('Campaign key is required');

        const data = await apiClient.getCampaignAnalytics(c_key);
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
        setError(err instanceof Error ? err.message : 'Failed to load campaign data');
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
  }, [c_key]); // Added c_key to dependency array

  const pageContainerStyle = {
    p: 3,
    background: 'rgb(114 143 121 / 48%)',
    minHeight: '100vh'
  };

  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        backgroundColor: 'rgb(114 143 121 / 48%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#3F5344' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ ...pageContainerStyle, p: 0, m: 0 }}>
      {/* Added Header */}
      <Box
        sx={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #3F5344',
          padding: '8px 24px',
          backgroundColor: '#BBC9BC',
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="img"
          src="/dark_logo.png"
          alt="Logo"
          sx={{
            height: 40,
            mr: 1.2,
            objectFit: 'contain',
          }}
        />
        <Typography variant="h6" sx={{
          color: '#000000',
          fontWeight: 600,
          textShadow: '1px 1px 1.5px rgba(0,0,0,0.05)'
        }}>
          Campaign Analytics Dashboard
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ backgroundColor: 'transparent', mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{
            mb: 3,
            backgroundColor: '#9BC53D',
            color: '#3F5344'
          }}>
            {error}
          </Alert>
        )}

        <CampaignCards data={campaignData} />
      </Container>
    </Box>
  );
};