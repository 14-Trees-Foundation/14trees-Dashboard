import { useEffect, useState } from "react";
import { Box, Typography, Grid, TextField, Button, Autocomplete, ToggleButtonGroup, ToggleButton, Select, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from "../../../../redux/actions/userActions";
import * as groupActionCreators from "../../../../redux/actions/groupActions";
import { organizationTypes } from "../../organization/organizationType";

const defaultHanlperText = 'Email already exists in the system for a different user. You can use the same email in new user as communication address.';
const intitialFValues = {
  name: "",
  email: "",
  contact: "",
  saplingid: "",
  uploaded: false,
  loading: false,
  backdropOpen: false,
};

export const UserDetails = ({ selectedPlot }) => {
  const dispatch = useAppDispatch();
  const { searchUsers } =
    bindActionCreators(userActionCreators, dispatch);
  const { searchGroups } =
    bindActionCreators(groupActionCreators, dispatch);

  const [values, setValues] = useState(intitialFValues);
  const [treeCount, setTreeCount] = useState(0);
  const [mapTo, setMapTo] = useState('user');

  const [helpersText, setHelpersText] = useState(undefined);
  const [formData, setFormData] = useState({
    'user_id': 0,
    'user_name': '',
    'user_email': '',
    'user_contact': '',
    'group_id': 0,
    'group_name': '',
    'group_type': 'corporate',
    'group_description': '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  let usersList = [];
  const usersData = useAppSelector((state) => state.searchUsersData);
  if (usersData) {
    usersList = Object.values(usersData.users);
  }

  let groupsList = [];
  const groupsData = useAppSelector((state) => state.searchGroupsData);
  if (groupsData) {
    groupsList = Object.values(groupsData.groups);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const item = usersList.find((user) => user.email === formData.email);
      if (item && item.name !== formData.name) {
        setHelpersText(defaultHanlperText);
      } else {
        setHelpersText(undefined);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    }
  }, [usersList, formData]);

  const handleEmailChange = (event, value) => {
    let isSet = false;
    usersList.forEach((user) => {
      if (user.email === value.trim()) {
        isSet = true;
        setFormData({
          'user_id': user.id,
          'user_email': user.email,
          'user_name': user.name,
          'user_contact': user.phone ?? '',
        })
      }
    })

    if (!isSet) {
      setFormData({
        ...formData,
        'user_email': value,
      })
      if (value.length >= 3) searchUsers(value);
    }
  }

  const handleGroupNameChange = (event, value) => {
    let isSet = false;
    groupsList.forEach((group) => {
      if (group.name === value) {
        isSet = true;
        setFormData({
          'group_id': group.id,
          'group_name': group.name,
          'group_type': group.type,
          'group_description': group.description ?? '',
        })
      }
    })

    if (!isSet) {
      setFormData({
        ...formData,
        'user_name': value,
      })
      if (value.length >= 3) searchGroups(0, 10, value);
    }
  }

  const handleGroupTypeChange = (e) => {
    setFormData(prev => {
      return {
        ...prev,
        group_type: e.target.value,
      }
    })
  }

  const formSubmit = async () => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    const params = JSON.stringify({
      mapped_to: mapTo,
      id: mapTo === 'user' ? formData.user_id : formData.group_id,
      name: mapTo === 'user' ? formData.user_name : formData.group_name,
      email: formData.user_email,
      phone: formData.user_contact,
      type: formData.group_type,
      description: formData.group_description,
      plot_id: selectedPlot.id,
      count: treeCount,
    });

    try {
      let res = await Axios.post("/mapping/map-plot-trees", params, {
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.status === 200) {
        setValues({
          ...values,
          loading: false,
          uploaded: true,
        });
        toast.success("Data uploaded successfully!");
      } else if (
        res.status === 204 ||
        res.status === 400 ||
        res.status === 409 ||
        res.status === 404
      ) {
        setValues({
          ...values,
          loading: false,
          backdropOpen: false,
        });
        toast.error(res.status.error);
      }
    } catch (error) {
      if (
        error.response.status === 409 ||
        error.response.status === 404 ||
        error.response.status === 400 ||
        error.response.status === 500
      ) {
        setValues({
          ...values,
          loading: false,
          backdropOpen: false,
        });
        toast.error(error.response.data.error);
      }
    }
  };

  if (values.loading) {
    return <Spinner />;
  } else {
    return (
      <Box
        sx={{
          color: "#2D1B08",
          mt: 4,
          width: "90%",
          minHeight: "700px",
          background: "linear-gradient(145deg, #9faca3, #bdccc2)",
          p: 2,
          borderRadius: 3,
          boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
          "& .MuiFormControl-root": {
            width: "100%",
          },
        }}
      >
        <ToastContainer />
        <Box
          sx={{
            bottom: 0,
            width: "100%",
            "& .MuiTextField-root": {
              borderRadius: "20px",
              background: "#b1bfb5",
              boxShadow:
                "inset 12px 12px 20px #96a29a,inset -12px -12px 20px #ccdcd0",
            },
            "& .MuiInputBase-root": {
              borderRadius: "20px",
              background: "#b1bfb5",
              boxShadow:
                "inset 12px 12px 20px #96a29a,inset -12px -12px 20px #ccdcd0",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <Typography variant="body1" gutterBottom sx={{ p: 0 }}>
            Step - 2
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ pb: 2 }}>
            Enter User details
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            sx={{ ml: 3, mr: 2 }}
          >
            <Typography mr={10}>Reserve trees for:</Typography>
            <ToggleButtonGroup
              color="success"
              value={mapTo}
              exclusive
              onChange={(e, value) => { setMapTo(value); }}
              aria-label="Platform"
              size="small"
            >
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="group">Group</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <form
            onSubmit={(e) => { e.preventDefault(); formSubmit(); }}
          >
            {mapTo === 'user' ?
              (
                <Grid container sx={{ p: 2, pl: 0 }}>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <Autocomplete
                      fullWidth
                      options={usersList}
                      name='user_email'
                      noOptionsText="No Users"
                      value={formData.email}
                      onInputChange={handleEmailChange}
                      getOptionLabel={option => option.email ? option.email : option}
                      isOptionEqualToValue={(option, value) => option.email ? option.email === value.email : option === value}
                      renderOption={(props, option) => {
                        return (
                          <Box
                            {...props}
                          >
                            {option.email ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant='body1'>{option.name}</Typography>
                                <Typography variant='body2' color={'#494b4b'}>Email: {option.email}</Typography>
                                {option.communication_email && <Typography variant='subtitle2' color={'GrayText'}>Comm. Email: {option.communication_email}</Typography>}
                              </Box>
                            ) : (
                              <Typography>{option}</Typography>
                            )}
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Email"
                          variant="outlined"
                          helperText={helpersText}
                        />
                      )}>
                    </Autocomplete>
                  </Grid>
                  <Grid sx={{ m: 2 }} item xs={12}>
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                      fullWidth
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                      label="Full Name"
                      name="user_name"
                    />
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                      fullWidth
                      value={formData.user_contact}
                      onChange={handleChange}
                      variant="outlined"
                      label="Contact"
                      name="user_contact"
                    />
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                      required
                      type="number"
                      onChange={(e) => { e.target.value > 0 ? setTreeCount(e.target.value) : setTreeCount(0) }}
                      value={treeCount}
                      fullWidth
                      label="Sapling Count"
                      name="saplingid"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container sx={{ p: 2, pl: 0 }}>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <Autocomplete
                      fullWidth
                      options={groupsList}
                      name='group_name'
                      noOptionsText="No Users"
                      value={formData.group_name}
                      onInputChange={handleGroupNameChange}
                      getOptionLabel={(option) => option.name ? option.name : option}
                      isOptionEqualToValue={(option, value) => true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Enter group name to search"
                          variant="outlined"
                          name='group_name'
                        />
                      )}>
                    </Autocomplete>
                  </Grid>
                  <Grid sx={{ m: 2 }} item xs={12}>
                    <Select
                      fullWidth
                      required
                      onChange={handleGroupTypeChange}
                      defaultValue="corporate"
                      value={formData.group_type}
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                    >
                      {organizationTypes.map((option) => {
                        return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                      fullWidth
                      value={formData.group_description}
                      onChange={handleChange}
                      label="Description"
                      name="group_description"
                    />
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          display: "none",
                        },
                        "& legend": {
                          display: "none",
                        },
                      }}
                      required
                      type="number"
                      onChange={(e) => { e.target.value > 0 ? setTreeCount(e.target.value) : setTreeCount(0) }}
                      value={treeCount}
                      fullWidth
                      label="Sapling Count"
                      name="saplingid"
                    />
                  </Grid>
                </Grid>
              )}
            {
              <Button
                sx={{ ml: 2 }}
                size="large"
                variant="contained"
                color="primary"
                disabled={treeCount === 0 || selectedPlot === null}
                type="submit"
              >
                Submit
              </Button>
            }
          </form>
        </Box>
      </Box >
    );
  }
};
