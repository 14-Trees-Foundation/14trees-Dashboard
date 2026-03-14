import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Chip
} from '@mui/material';
import { TrendingUp, BarChart as BarChartIcon, ShowChart } from '@mui/icons-material';
import { UserPlotTreesAuditRow } from '../../types/onsiteReports';

interface DailyAuditChartProps {
  data: UserPlotTreesAuditRow[];
  loading?: boolean;
}

interface ChartDataPoint {
  date: string;
  displayDate: string;
  treesAudited: number;
  treesAdded: number;
  auditCount: number;
}

const DailyAuditChart: React.FC<DailyAuditChartProps> = ({
  data,
  loading = false
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    try {
      // Aggregate data by date
      const dailyStats = data.reduce((acc, row) => {
        // Handle null/undefined audit_date
        if (!row.audit_date) return acc;
        
        const date = row.audit_date.split('T')[0]; // Extract date part
        
        if (!acc[date]) {
          acc[date] = {
            date,
            treesAudited: 0,
            treesAdded: 0,
            auditCount: 0
          };
        }
        
        acc[date].treesAudited += parseInt(row.trees_audited?.toString() || '0');
        acc[date].treesAdded += parseInt(row.trees_added?.toString() || '0');
        acc[date].auditCount += 1;
        
        return acc;
      }, {} as Record<string, Omit<ChartDataPoint, 'displayDate'>>);

      // Convert to array and sort by date (last 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const sortedData = Object.values(dailyStats)
        .map(item => ({
          ...item,
          displayDate: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        }))
        .filter(item => {
          const itemDate = new Date(item.date);
          return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(sortedData);
    } catch (error) {
      console.error('Error processing chart data:', error);
      setChartData([]);
    }
  }, [data]);

  const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: 'line' | 'bar') => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const totalTrees = chartData.reduce((sum, item) => sum + item.treesAudited, 0);
  const avgDaily = chartData.length > 0 ? Math.round(totalTrees / chartData.length) : 0;

  if (loading) {
    return (
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: 'linear-gradient(145deg, #9faca3, #bdccc2)',
          boxShadow: '7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9',
          borderRadius: '15px',
          border: 'none',
          minHeight: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress sx={{ color: '#9BC53D' }} />
      </Paper>
    );
  }

  if (chartData.length === 0 && !loading) {
    return (
      <Paper 
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          background: 'linear-gradient(145deg, #9faca3, #bdccc2)',
          boxShadow: '7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9',
          borderRadius: '15px',
          border: 'none',
          minHeight: '150px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="body1" sx={{ color: '#1F3625', textAlign: 'center' }}>
          📊 No audit data available for chart visualization
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        background: 'linear-gradient(145deg, #9faca3, #bdccc2)',
        boxShadow: '7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9',
        borderRadius: '15px',
        border: 'none'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ color: '#9BC53D' }} />
          <Typography 
            variant="h6" 
            sx={{ color: '#1F3625', fontWeight: 600 }}
          >
            Daily Audit Trends (Last 30 Days)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              size="small" 
              label={`${totalTrees} Total Trees`}
              sx={{ backgroundColor: '#9BC53D', color: 'white' }}
            />
            <Chip 
              size="small" 
              label={`${avgDaily} Daily Avg`}
              sx={{ backgroundColor: '#1F3625', color: 'white' }}
            />
          </Box>
          
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
          >
            <ToggleButton value="line" sx={{ px: 1.5 }}>
              <ShowChart fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bar" sx={{ px: 1.5 }}>
              <BarChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 54, 37, 0.2)" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11, fill: '#1F3625' }}
                stroke="#1F3625"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#1F3625' }}
                stroke="#1F3625"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #9BC53D',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any, name: string) => {
                  const formatName = name === 'treesAudited' ? 'Trees Audited' : 
                                   name === 'treesAdded' ? 'Trees Added' : 'Audit Records';
                  return [value, formatName];
                }}
              />
              <Line
                type="monotone"
                dataKey="treesAudited"
                stroke="#9BC53D"
                strokeWidth={3}
                dot={{ fill: '#9BC53D', strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: '#1F3625'
                }}
              />
              <Line
                type="monotone"
                dataKey="treesAdded"
                stroke="#1F3625"
                strokeWidth={2}
                dot={{ fill: '#1F3625', strokeWidth: 2, r: 3 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 54, 37, 0.2)" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11, fill: '#1F3625' }}
                stroke="#1F3625"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#1F3625' }}
                stroke="#1F3625"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #9BC53D',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any, name: string) => {
                  const formatName = name === 'treesAudited' ? 'Trees Audited' : 
                                   name === 'treesAdded' ? 'Trees Added' : 'Audit Records';
                  return [value, formatName];
                }}
              />
              <Bar
                dataKey="treesAudited"
                fill="#9BC53D"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DailyAuditChart;