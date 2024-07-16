import { useState } from "react";
import { Box, Typography, Grid, TextField, Button, Autocomplete } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from "../../../../redux/actions/userActions";

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

  const [values, setValues] = useState(intitialFValues);
  const [treeCount, setTreeCount] = useState(0);

  const [formData, setFormData] = useState({
    'id': 0,
    'name': '',
    'email': '',
    'contact': '',
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

  const handleEmailChange = (event, value) => {
    let isSet = false;
    usersList.forEach((user) => {
      if (`${user.name} (${user.email})` === value) {
        isSet = true;
        setFormData({
          'id': user.id,
          'email': user.email,
          'name': user.name,
          'contact': user.phone ?? '',
        })
      }
    })

    if (!isSet) {
      setFormData({
        ...formData,
        'email': value,
      })
      if (value.length >= 3) searchUsers(value);
    }
  }

  const formSubmit = async () => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    const params = JSON.stringify({
      mapped_to: 'user',
      id: formData.id,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
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
          <form
            onSubmit={(e) => { e.preventDefault(); formSubmit(); }}
          >
            <Grid container sx={{ p: 2, pl: 0 }}>
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
                  value={formData.name}
                  onChange={handleChange}
                  label="Full Name"
                  name="name"
                />
              </Grid>
              <Grid item sx={{ m: 2 }} xs={12}>
                <Autocomplete
                  fullWidth
                  options={usersList}
                  name='email'
                  noOptionsText="No Users"
                  value={formData.email}
                  onInputChange={handleEmailChange}
                  getOptionLabel={(option) => option.email ? `${option.name} (${option.email})` : option}
                  isOptionEqualToValue={(option, value) => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Email"
                      variant="outlined"
                    />
                  )}>
                </Autocomplete>
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
                  fullWidth
                  value={formData.contact}
                  onChange={handleChange}
                  variant="outlined"
                  label="Contact"
                  name="contact"
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
              {
                <Button
                  sx={{ m: 2 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={treeCount === 0 || selectedPlot === null}
                  type="submit"
                >
                  Submit
                </Button>
              }
            </Grid>
          </form>
        </Box>
      </Box>
    );
  }
};
