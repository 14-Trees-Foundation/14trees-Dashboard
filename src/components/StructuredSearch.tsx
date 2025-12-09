
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Typography,
  Paper,
  Divider,
  IconButton,
  Autocomplete
} from '@mui/material';
import { Search, Clear, FilterList, CalendarToday } from '@mui/icons-material';
import { GridFilterItem } from '@mui/x-data-grid';
import { UserPlotTreesAuditRow } from '../../../types/onsiteReports';

interface StructuredSearchProps {
  onSearch: (filters: GridFilterItem[]) => void;
  onClear: () => void;
  loading?: boolean;
  // Options for dropdowns - these would come from API calls
  staffOptions?: { id: number; name: string; label: string }[];
  siteOptions?: { id: number; name: string; label: string }[];
  plotOptions?: { id: number; name: string; label: string; site_name?: string }[];
}

interface SearchCriteria {
  dateType: 'single' | 'range' | 'preset' | '';
  singleDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  datePreset: string;
  staff: any;
  site: any;
  plot: any;
}

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisweek', label: 'This Week' },
  { value: 'lastweek', label: 'Last Week' },
  { value: 'thismonth', label: 'This Month' },
  { value: 'lastmonth', label: 'Last Month' }
];

const StructuredSearchComponent: React.FC<StructuredSearchProps> = ({
  onSearch,
  onClear,
  loading = false,
  staffOptions = [],
  siteOptions = [],
  plotOptions = []
}) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    dateType: '',
    singleDate: null,
    startDate: null,
    endDate: null,
    datePreset: '',
    staff: null,
    site: null,
    plot: null
  });

  const [activeFilters, setActiveFilters] = useState<GridFilterItem[]>([]);
  const [filteredPlotOptions, setFilteredPlotOptions] = useState(plotOptions);

  // Debug logging
  React.useEffect(() => {
    console.log('StructuredSearch mounted with options:', {
      staffCount: staffOptions.length,
      sitesCount: siteOptions.length,
      plotsCount: plotOptions.length
    });
  }, [staffOptions, siteOptions, plotOptions]);

  // Filter plots based on selected site
  useEffect(() => {
    if (searchCriteria.site) {
      const filtered = plotOptions.filter(plot => 
        plot.site_name === searchCriteria.site.name
      );
      setFilteredPlotOptions(filtered);
      // Clear plot selection if it's not in the filtered list
      if (searchCriteria.plot && !filtered.find(p => p.id === searchCriteria.plot.id)) {
        setSearchCriteria(prev => ({ ...prev, plot: null }));
      }
    } else {
      setFilteredPlotOptions(plotOptions);
    }
  }, [searchCriteria.site, plotOptions]);

  const getDateFromPreset = (preset: string): { start: Date; end: Date } | Date => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    switch (preset) {
      case 'today':
        return today;
      case 'yesterday':
        return yesterday;
      case 'last7days':
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        return { start: last7, end: today };
      case 'last30days':
        const last30 = new Date();
        last30.setDate(today.getDate() - 30);
        return { start: last30, end: today };
      case 'thisweek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { start: startOfWeek, end: today };
      case 'lastweek':
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(today);
        endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
        return { start: startOfLastWeek, end: endOfLastWeek };
      case 'thismonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: startOfMonth, end: today };
      case 'lastmonth':
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: startOfLastMonth, end: endOfLastMonth };
      default:
        return today;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const buildFilters = (): GridFilterItem[] => {
    const filters: GridFilterItem[] = [];

    // Date filters
    if (searchCriteria.dateType === 'single' && searchCriteria.singleDate) {
      filters.push({
        columnField: 'audit_date',
        operatorValue: 'equals',
        value: formatDate(searchCriteria.singleDate)
      });
    } else if (searchCriteria.dateType === 'range' && searchCriteria.startDate && searchCriteria.endDate) {
      filters.push({
        columnField: 'audit_date',
        operatorValue: 'between',
        value: [formatDate(searchCriteria.startDate), formatDate(searchCriteria.endDate)]
      });
    } else if (searchCriteria.dateType === 'preset' && searchCriteria.datePreset) {
      const dateRange = getDateFromPreset(searchCriteria.datePreset);
      if (dateRange instanceof Date) {
        filters.push({
          columnField: 'audit_date',
          operatorValue: 'equals',
          value: formatDate(dateRange)
        });
      } else {
        filters.push({
          columnField: 'audit_date',
          operatorValue: 'between',
          value: [formatDate(dateRange.start), formatDate(dateRange.end)]
        });
      }
    }

    // Staff filter
    if (searchCriteria.staff) {
      filters.push({
        columnField: 'user_name',
        operatorValue: 'equals',
        value: searchCriteria.staff.name
      });
    }

    // Site filter
    if (searchCriteria.site) {
      filters.push({
        columnField: 'site_name',
        operatorValue: 'equals',
        value: searchCriteria.site.name
      });
    }

    // Plot filter
    if (searchCriteria.plot) {
      filters.push({
        columnField: 'plot_name',
        operatorValue: 'equals',
        value: searchCriteria.plot.name
      });
    }

    return filters;
  };

  const handleSearch = () => {
    const filters = buildFilters();
    setActiveFilters(filters);
    onSearch(filters);
  };

  const handleClear = () => {
    setSearchCriteria({
      dateType: '',
      singleDate: null,
      startDate: null,
      endDate: null,
      datePreset: '',
      staff: null,
      site: null,
      plot: null
    });
    setActiveFilters([]);
    onClear();
  };

  const removeFilter = (filterToRemove: GridFilterItem) => {
    const newFilters = activeFilters.filter(filter => 
      filter.columnField !== filterToRemove.columnField
    );
    setActiveFilters(newFilters);
    onSearch(newFilters);

    // Also update the search criteria to reflect the removal
    if (filterToRemove.columnField === 'audit_date') {
      setSearchCriteria(prev => ({
        ...prev,
        dateType: '',
        singleDate: null,
        startDate: null,
        endDate: null,
        datePreset: ''
      }));
    } else if (filterToRemove.columnField === 'user_name') {
      setSearchCriteria(prev => ({ ...prev, staff: null }));
    } else if (filterToRemove.columnField === 'site_name') {
      setSearchCriteria(prev => ({ ...prev, site: null }));
    } else if (filterToRemove.columnField === 'plot_name') {
      setSearchCriteria(prev => ({ ...prev, plot: null }));
    }
  };

  const getFilterDisplayText = (filter: GridFilterItem): string => {
    const fieldLabels: Record<string, string> = {
      'audit_date': 'Date',
      'user_name': 'Staff',
      'site_name': 'Site',
      'plot_name': 'Plot',
      'trees_audited': 'Trees Audited',
      'trees_added': 'Trees Added'
    };

    const field = fieldLabels[filter.columnField] || filter.columnField;
    
    if (Array.isArray(filter.value)) {
      return `${field}: ${filter.value.join(' - ')}`;
    }
    
    return `${field}: ${filter.value}`;
  };

  return (
    <>
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
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: '#1F3625',
            fontWeight: 600,
            mb: 1.5
          }}
        >
          <FilterList sx={{ color: '#9BC53D' }} />
          Advanced Search
        </Typography>
        
        <Grid container spacing={2}>
          {/* Date Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1F3625', mb: 1 }}>
              📅 Date Criteria
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>Date Type</InputLabel>
                  <Select
                    value={searchCriteria.dateType}
                    label="Date Type"
                    onChange={(e) => setSearchCriteria(prev => ({ 
                      ...prev, 
                      dateType: e.target.value as any,
                      singleDate: null,
                      startDate: null,
                      endDate: null,
                      datePreset: ''
                    }))}
                  >
                    <MenuItem value="single">Single Date</MenuItem>
                    <MenuItem value="range">Date Range</MenuItem>
                    <MenuItem value="preset">Quick Select</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {searchCriteria.dateType === 'single' && (
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Select Date"
                    type="date"
                    size="small"
                    fullWidth
                    value={searchCriteria.singleDate ? searchCriteria.singleDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setSearchCriteria(prev => ({ ...prev, singleDate: date }));
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              )}

              {searchCriteria.dateType === 'range' && (
                <>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Start Date"
                      type="date"
                      size="small"
                      fullWidth
                      value={searchCriteria.startDate ? searchCriteria.startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        setSearchCriteria(prev => ({ ...prev, startDate: date }));
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="End Date"
                      type="date"
                      size="small"
                      fullWidth
                      value={searchCriteria.endDate ? searchCriteria.endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        setSearchCriteria(prev => ({ ...prev, endDate: date }));
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </>
              )}

              {searchCriteria.dateType === 'preset' && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Quick Select</InputLabel>
                    <Select
                      value={searchCriteria.datePreset}
                      label="Quick Select"
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, datePreset: e.target.value }))}
                    >
                      {DATE_PRESETS.map(preset => (
                        <MenuItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Location & Staff Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1F3625', mb: 1 }}>
              👥 Staff & Location
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={staffOptions}
                  value={searchCriteria.staff}
                  onChange={(_, value) => setSearchCriteria(prev => ({ ...prev, staff: value }))}
                  getOptionLabel={(option) => option.label || option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField {...params} label="Staff Member" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={siteOptions}
                  value={searchCriteria.site}
                  onChange={(_, value) => setSearchCriteria(prev => ({ ...prev, site: value, plot: null }))}
                  getOptionLabel={(option) => option.label || option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField {...params} label="Site" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={filteredPlotOptions}
                  value={searchCriteria.plot}
                  onChange={(_, value) => setSearchCriteria(prev => ({ ...prev, plot: value }))}
                  getOptionLabel={(option) => option.label || option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={!searchCriteria.site}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Plot" 
                      size="small"
                      helperText={!searchCriteria.site ? "Select site first" : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>


        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<Clear />}
            disabled={loading}
            sx={{
              borderColor: '#1F3625',
              color: '#1F3625',
              '&:hover': {
                borderColor: '#9BC53D',
                backgroundColor: 'rgba(155, 197, 61, 0.1)'
              }
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<Search />}
            disabled={loading}
            sx={{
              backgroundColor: '#9BC53D',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1F3625'
              }
            }}
          >
            Search
          </Button>
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#1F3625', fontWeight: 600 }}>Active Filters:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={`${filter.columnField}-${index}`}
                  label={getFilterDisplayText(filter)}
                  onDelete={() => removeFilter(filter)}
                  size="small"
                  sx={{
                    backgroundColor: '#9BC53D',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default StructuredSearchComponent;