import { useState } from "react";
import { Box, Typography, Grid, TextField, Button, Autocomplete } from "@mui/material";
import { Field, Form } from "react-final-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";

const intitialFValues = {
  id: 0,
  name: "",
  email: "",
  contact: "",
  sapling_ids: [],
  uploaded: false,
  loading: false,
  backdropOpen: false,
};

export const AssignTree = ({ selTrees, onTreesChanged }) => {
  const dispatch = useAppDispatch();
  const { searchUsers } =
    bindActionCreators(userActionCreators, dispatch);

  const [values, setValues] = useState(intitialFValues);

  const handleChange = (event) => {
    setValues({
      ...values,
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
        setValues({
          ...values,
          'id': user.id,
          'email': user.email,
          'name': user.name,
          'contact': user.phone ?? '',
        })
      }
    })

    if (!isSet) {
      setValues({
        ...values,
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
      id: values.id,
      name: values.name,
      email: values.email,
      phone: values.contact,
      sapling_ids: selTrees.split(","),
    });

    try {
      let res = await Axios.post("/mapping/map", params, {
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.status === 201) {
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
            Enter User Details and number of saplings
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
                  value={values.name}
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
                  value={values.email}
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
                  value={values.contact}
                  onChange={handleChange}
                  variant="outlined"
                  label="Contact"
                  name="contact"
                />
              </Grid>
              <Grid item sx={{ m: 2 }} xs={12}>
                <Typography
                  sx={{ color: "#C72542",textAlign:'end' }}
                >
                  Total selected trees: {selTrees === "" ? 0 : selTrees.split(",").length}
                </Typography>
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
                  onChange={(e) => onTreesChanged(e.target.value)}
                  value={selTrees}
                  fullWidth
                  label="Sapling IDs"
                  name="saplingid"
                />
              </Grid>
              {
                <Button
                  sx={{ m: 2 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={selTrees === ""}
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
