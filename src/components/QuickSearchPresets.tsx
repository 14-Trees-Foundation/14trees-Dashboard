import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import {
  Today,
  CalendarMonth,
  Person,
  LocationOn,
  TrendingUp,
  Search
} from '@mui/icons-material';
import { GridFilterItem } from '@mui/x-data-grid';

interface QuickSearchProps {
  onSearch: (filters: GridFilterItem[], description: string) => void;
  staffOptions: { id: number; name: string; label: string }[];
  siteOptions: { id: number; name: string; label: string }[];
}

interface QuickSearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  filters: () => GridFilterItem[];
}

const QuickSearchPresets: React.FC<QuickSearchProps> = ({
  onSearch,
  staffOptions,
  siteOptions
}) => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return { start: formatDate(start), end: formatDate(end) };
  };

  const quickSearches: QuickSearchItem[] = [
    {
      id: 'today',
      title: 'Today\'s Audits',
      description: 'All audit activity for today',
      icon: <Today />,
      color: 'primary',
      filters: () => [{
        columnField: 'audit_date',
        operatorValue: 'equals',
        value: formatDate(new Date())
      }]
    },
    {
      id: 'last7days',
      title: 'Last 7 Days',
      description: 'Audit activity in the past week',
      icon: <CalendarMonth />,
      color: 'primary',
      filters: () => {
        const range = getDateRange(7);
        return [{
          columnField: 'audit_date',
          operatorValue: 'between',
          value: [range.start, range.end]
        }];
      }
    },
    {
      id: 'high_productivity',
      title: 'High Productivity',
      description: 'Staff who added 10+ trees',
      icon: <TrendingUp />,
      color: 'success',
      filters: () => [{
        columnField: 'trees_added',
        operatorValue: 'greaterThanOrEqual',
        value: 10
      }]
    }
  ];

  const allSearches = [...quickSearches];

  const handleQuickSearch = (search: QuickSearchItem) => {
    const filters = search.filters();
    onSearch(filters, search.description);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Search fontSize="small" />
        Quick Search
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click on any option below for instant results:
      </Typography>
      
      <Grid container spacing={2}>
        {allSearches.map((search) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={search.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                background: 'linear-gradient(145deg, #9faca3, #bdccc2)',
                boxShadow: '7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9',
                borderRadius: '15px',
                border: 'none',
                '&:hover': {
                  transform: 'scale(1.02)',
                  background: 'linear-gradient(145deg, #a5b2a9, #c3d2c8)',
                }
              }}
              onClick={() => handleQuickSearch(search)}
            >
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      mr: 2, 
                      color: search.id === 'high_productivity' ? '#9BC53D' : '#1F3625',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {search.icon}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1F3625' }}>
                    {search.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#573D1C' }}>
                  {search.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    size="small" 
                    label="Click to search" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      height: 20,
                      backgroundColor: '#9BC53D',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1F3625'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickSearchPresets;