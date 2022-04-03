import { useState } from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { Field, Form } from "react-final-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";

const intitialFValues = {
  name: "",
  email: "",
  contact: "",
  saplingid: "",
  uploaded: false,
  loading: false,
  backdropOpen: false,
};

export const AssignTree = ({ selTrees, onTreesChanged }) => {
  const [values, setValues] = useState(intitialFValues);

  const formSubmit = async (formValues) => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    const params = JSON.stringify({
      name: formValues.name,
      email: formValues.email,
      contact: formValues.contact,
      sapling_id: selTrees,
    });

    try {
      let res = await Axios.post("/mytrees/assign", params, {
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
            Assigners Form
          </Typography>
          <Form
            onSubmit={formSubmit}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "Name required.";
              }
              if (!values.email) {
                errors.email = "Email required.";
              }
              if (!values.contact) {
                errors.contact = "Contact required.";
              }
              return errors;
            }}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <Grid container sx={{ p: 2, pl: 0 }}>
                  <Grid sx={{ m: 2 }} item xs={12}>
                    <Field name="name">
                      {({ input, meta }) => (
                        <TextField
                          sx={{
                            "& label.Mui-focused": {
                              display: "none",
                            },
                            "& legend": {
                              display: "none",
                            },
                          }}
                          hiddenLabel
                          fullWidth
                          error={meta.error && meta.touched ? true : false}
                          {...input}
                          label="Full Name *"
                          name="name"
                          helperText={
                            meta.error && meta.touched ? meta.error : ""
                          }
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <Field name="email">
                      {({ input, meta }) => (
                        <TextField
                          sx={{
                            "& label.Mui-focused": {
                              display: "none",
                            },
                            "& legend": {
                              display: "none",
                            },
                          }}
                          hiddenLabel
                          fullWidth
                          label="Email *"
                          name="email"
                          error={meta.error && meta.touched ? true : false}
                          {...input}
                          helperText={
                            meta.error && meta.touched ? meta.error : ""
                          }
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <Field name="contact">
                      {({ input, meta }) => (
                        <TextField
                          sx={{
                            "& label.Mui-focused": {
                              display: "none",
                            },
                            "& legend": {
                              display: "none",
                            },
                          }}
                          hiddenLabel
                          fullWidth
                          variant="outlined"
                          label="Contact *"
                          name="contact"
                          error={meta.error && meta.touched ? true : false}
                          {...input}
                          helperText={
                            meta.error && meta.touched ? meta.error : ""
                          }
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item sx={{ m: 2 }} xs={12}>
                    <Typography
                      sx={{ color: "#C72542",textAlign:'end' }}
                    >
                      Total selected trees :
                      {selTrees === "" ? 0 : selTrees.split(",").length}
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
                      hiddenLabel
                      onChange={(e) => onTreesChanged(e.target.value)}
                      value={selTrees}
                      fullWidth
                      label="Sapling ID *"
                      name="saplingid"
                    />
                  </Grid>
                  {
                    <Button
                      sx={{ m: 2 }}
                      size="large"
                      variant="contained"
                      color="primary"
                      disabled={submitting || pristine || selTrees === ""}
                      type="submit"
                    >
                      Submit
                    </Button>
                  }
                </Grid>
              </form>
            )}
          />
        </Box>
      </Box>
    );
  }
};
