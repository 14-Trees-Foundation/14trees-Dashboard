import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, startOfMonth, endOfMonth, addDays, isSameDay } from 'date-fns';
import { VisitTypeList } from "../../../types/visits";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import ApiClient from "../../../api/apiClient/apiClient";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 1000,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 3,
};

const VisitForm = ({ mode, open, handleClose, onSubmit, visit = null }) => {

  const dispatch = useAppDispatch();
  const { getGroups } = bindActionCreators(groupActionCreators, dispatch);
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);
  const [searchStr, setSearchStr] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sitePageNo, setSitePageNo] = useState(0);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [sitesLoading, setSitesLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  
  // Calendar-related state
  const [calendarVisits, setCalendarVisits] = useState([]);
  const [calendarSiteFilter, setCalendarSiteFilter] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [formData, setFormData] = useState({
    visit_name: '',
    visit_date: new Date(),
    visit_type: null,
    group_id: null,
    site_id: null,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      getSitesData();
    }, 300);

    return () => {
      clearTimeout(handler);
    }
  }, [sitePageNo, siteNameInput]);

  const getSitesData = async () => {
    const siteNameFilter = {
      columnField: "name_english",
      value: siteNameInput,
      operatorValue: "contains",
    };

    setSitesLoading(true);
    getSites(sitePageNo * 10, 10, [siteNameFilter]);
    setTimeout(async () => {
      setSitesLoading(false);
    }, 1000);
  };

  const getGroup = async (groupId) => {
    const apiClient = new ApiClient();
    const response = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: groupId }]);
    if (response.results.length === 1) {
      setSelectedGroup(response.results[0]);
    }
  }

  const getSite = async (siteId) => {
    const apiClient = new ApiClient();
    const response = await apiClient.getSites(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: siteId }]);
    if (response.results.length === 1) {
      setSelectedSite(response.results[0]);
    }
  }

  // Calendar-specific functions
  const getCalendarVisits = async (startDate, endDate, siteFilter = null) => {
    setCalendarLoading(true);
    const apiClient = new ApiClient();
    try {
      const filters = [
        { columnField: 'visit_date', operatorValue: 'greaterThanOrEqual', value: format(startDate, 'yyyy-MM-dd') },
        { columnField: 'visit_date', operatorValue: 'lessThanOrEqual', value: format(endDate, 'yyyy-MM-dd') }
      ];
      
      if (siteFilter) {
        filters.push({ columnField: 'site_id', operatorValue: 'equals', value: siteFilter.id });
      }
      
      const response = await apiClient.getVisits(0, -1, filters);
      setCalendarVisits(response.results || []);
    } catch (error) {
      console.error('Error fetching calendar visits:', error);
      setCalendarVisits([]);
    } finally {
      setCalendarLoading(false);
    }
  };



  useEffect(() => {
    if (visit) {
      setFormData({
        visit_name: visit.visit_name,
        visit_date: visit.visit_date ? parseISO(visit.visit_date) : new Date(),
        visit_type: VisitTypeList.find((visitType) => visitType.id === visit.visit_type),
        group_id: visit.group_id,
        site_id: visit.site_id,
      });

      if (visit.group_id) getGroup(visit.group_id);
      else setSelectedGroup(null);

      if (visit.site_id) getSite(visit.site_id);
      else setSelectedSite(null);
    }
  }, [visit])

  useEffect(() => {
    getGroups(0, 20);
  }, [])

  useEffect(() => {
    if (searchStr.length > 2) getGroups(0, 20, [{ columnField: 'name', operatorValue: 'contains', value: searchStr }]);
  }, [searchStr])

  // Load calendar visits when modal opens or calendar date changes
  useEffect(() => {
    if (open) {
      const startDate = startOfMonth(calendarDate);
      const endDate = addDays(endOfMonth(calendarDate), 30); // Show next 30 days beyond month end
      getCalendarVisits(startDate, endDate, calendarSiteFilter);
    }
  }, [open, calendarDate, calendarSiteFilter])

  // Reset calendar state when modal closes
  useEffect(() => {
    if (!open) {
      setCalendarVisits([]);
      setCalendarSiteFilter(null);
      setCalendarDate(new Date());
    }
  }, [open])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = visit ? { ...visit } : {};
    data = {
      ...data,
      visit_name: formData.visit_name,
      visit_date: format(formData.visit_date, 'yyyy-MM-dd'),
      visit_type: formData.visit_type.id,
      group_id: formData.visit_type.id === 'corporate' ? formData.group_id : null,
      site_id: formData.site_id
    }

    onSubmit(data);
    setFormData({
      visit_name: '',
      visit_date: new Date(),
      visit_type: null,
      group_id: null,
      site_id: null,
    });
    setSelectedGroup(null);
    setSelectedSite(null);

    handleClose();
  };

  let groupList = [];
  const groupsData = useAppSelector(
    (state) => state.groupsData
  );
  if (groupsData) {
    groupList = Object.values(groupsData.groups);
    const idx = groupList.findIndex(group => group.id === formData.group_id);
    if (idx < 0 && selectedGroup) groupList.push(selectedGroup);
  }

  let sitesList = [];
  const siteData = useAppSelector((state) => state.sitesData);
  if (siteData) {
    sitesList = Object.values(siteData.sites);
    const idx = sitesList.findIndex(site => site.id === formData.site_id);
    if (idx < 0 && selectedSite) sitesList.push(selectedSite);
    sitesList = sitesList.sort((a, b) => {
      return b.id - a.id;
    });
  }


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
            {mode === 'add' ? 'Add Visit' : 'Edit Visit'}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Left side - Calendar */}
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 2, height: 'fit-content' }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Select Visit Date
                </Typography>
                
                {/* Site Filter for Calendar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <AutocompleteWithPagination
                      label="Filter by Site (Optional)"
                      options={sitesList}
                      getOptionLabel={(option) => option.name_english}
                      onChange={(event, newValue) => {
                        setCalendarSiteFilter(newValue);
                      }}
                      onInputChange={(event) => {
                        const { value } = event.target;
                        setSitePageNo(0);
                        setSiteNameInput(value);
                      }}
                      setPage={setSitePageNo}
                      loading={sitesLoading}
                      value={calendarSiteFilter}
                      fullWidth
                      size="small"
                    />
                    {calendarSiteFilter && (
                      <Button
                        size="small"
                        onClick={() => setCalendarSiteFilter(null)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Legend */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Chip
                    size="small"
                    label="Has Visits"
                    color="primary"
                    variant="filled"
                    sx={{ fontSize: '0.7rem' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Hover dates to see visit details
                  </Typography>
                </Box>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formData.visit_date}
                    onChange={(newValue) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        visit_date: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Select Visit Date"
                        margin="normal"
                      />
                    )}
                  />
                </LocalizationProvider>
                
                {/* Scheduled Visits Display */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Scheduled Visits This Month
                  </Typography>
                  {calendarLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {calendarVisits.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                          {calendarSiteFilter ? 
                            `No visits scheduled for ${calendarSiteFilter.name_english}` : 
                            'No visits scheduled this month'
                          }
                        </Typography>
                      ) : (
                        calendarVisits.map((visit, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              p: 1.5, 
                              mb: 1, 
                              border: '1px solid #e0e0e0', 
                              borderRadius: 1,
                              backgroundColor: isSameDay(parseISO(visit.visit_date), formData.visit_date) ? 'primary.light' : 'background.paper'
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {visit.visit_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(parseISO(visit.visit_date), 'MMM dd, yyyy')} • {visit.site_name}
                            </Typography>
                            {visit.group_name && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Group: {visit.group_name}
                              </Typography>
                            )}
                          </Box>
                        ))
                      )}
                    </Box>
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  Selected: {format(formData.visit_date, 'MMMM dd, yyyy')}
                </Typography>
                
                {calendarSiteFilter && (
                  <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'primary.main', display: 'block' }}>
                    Showing visits for: {calendarSiteFilter.name_english}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Right side - Form Fields */}
            <Grid item xs={12} md={7}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      name="visit_name"
                      label="Visit Name"
                      value={formData.visit_name}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Autocomplete
                      fullWidth
                      name="visit_type"
                      disablePortal
                      options={VisitTypeList}
                      value={formData.visit_type}
                      renderInput={(params) => (
                        <TextField {...params} label="Visit Type" required size="medium" />
                      )}
                      onChange={(event, value) => {
                        if (VisitTypeList.includes(value))
                          setFormData((prevState) => ({
                            ...prevState,
                            visit_type: value,
                          }));
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <AutocompleteWithPagination
                      required
                      label="Select a Site"
                      options={sitesList}
                      getOptionLabel={(option) => option.name_english}
                      onChange={(event, newValue) => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            ["site_id"]: newValue?.id || null,
                          };
                        });
                        setSelectedSite(newValue);
                      }}
                      onInputChange={(event) => {
                        const { value } = event.target;
                        setSitePageNo(0);
                        setSiteNameInput(value);
                        handleChange(event);
                      }}
                      setPage={setSitePageNo}
                      loading={sitesLoading}
                      value={selectedSite}
                      fullWidth
                      size="medium"
                    />
                  </Grid>
                  
                  {(formData.visit_type && formData.visit_type.id === 'corporate') && (
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        name="group_id"
                        disablePortal
                        options={groupList}
                        getOptionLabel={(option) => option.name}
                        value={selectedGroup}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select Group" 
                            onChange={(e) => setSearchStr(e.target.value)} 
                            required 
                            size="medium"
                          />
                        )}
                        onChange={(event, value) => {
                          if (value) {
                            setFormData((prevState) => ({
                              ...prevState,
                              group_id: value.id,
                            }));
                            setSelectedGroup(value);
                          }
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                  >
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={handleClose} 
                      size="large"
                      sx={{ minWidth: 120 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      type="submit" 
                      color="success"
                      size="large"
                      sx={{ minWidth: 120 }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default VisitForm;
