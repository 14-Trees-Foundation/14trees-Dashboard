import { useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import { Field, Form } from "react-final-form";
import TextField from "@mui/material/TextField";
import { Paper } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import tree from "../../../../assets/dark_logo.png";
import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";

const intitialFValues = {
  loading: false,
  uploaded: false,
  backdropOpen: false,
};

export const AddOrg = () => {
  const [values, setValues] = useState(intitialFValues);
  const classes = UseStyle();

  const formSubmit = async (formValues) => {
    const params = JSON.stringify({
      name: formValues.name,
      type: formValues.type,
      desc: formValues.desc,
    });

    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    try {
      let res = await Axios.post("/organizations/add", params, {
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
      }
    } catch (error) {
      if (error.response.status === 500) {
        setValues({
          ...values,
          loading: false,
          uploaded: false,
        });
        toast.error(error.response.data.error);
      }
    }
  };

  if (values.loading) {
    return <Spinner />;
  } else {
    if (values.uploaded) {
      return (
        <>
          <Card className={classes.maincard}>
            <CardContent style={{ marginTop: "1%" }}>
              <Alert severity="success">
                Your data has been uploaded successfuly!
              </Alert>
              <CardMedia className={classes.media} image={tree} title="tree" />
            </CardContent>
          </Card>
        </>
      );
    } else {
      return (
        <>
          <div className={classes.inputbox}>
            <Paper className={classes.paper}>
              <Backdrop className={classes.backdrop} open={values.backdropOpen}>
                <Spinner text={"Sending your data..."} />
              </Backdrop>
              <ToastContainer />
              <h1 className={classes.formheader}>Organization information</h1>
              <Form
                onSubmit={formSubmit}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = "Name of the oorganzation";
                  }
                  if (!values.type) {
                    errors.type = "Type of organization.";
                  }
                  if (!values.desc) {
                    errors.desc = "A small description";
                  }
                  return errors;
                }}
                render={({ handleSubmit, form, submitting, pristine }) => (
                  <form
                    onSubmit={handleSubmit}
                    className={classes.root}
                    autoComplete="off"
                  >
                    <Grid container>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field name="name">
                          {({ input, meta }) => (
                            <TextField
                              error={meta.error && meta.touched ? true : false}
                              {...input}
                              variant="outlined"
                              label="Organization Name *"
                              name="name"
                              helperText={
                                meta.error && meta.touched ? meta.error : ""
                              }
                            />
                          )}
                        </Field>
                        <Field name="type">
                          {({ input, meta }) => (
                            <TextField
                              variant="outlined"
                              label="Type *"
                              name="email"
                              error={meta.error && meta.touched ? true : false}
                              {...input}
                              helperText={
                                meta.error && meta.touched ? meta.error : ""
                              }
                            />
                          )}
                        </Field>
                        <Field name="desc">
                          {({ input, meta }) => (
                            <TextField
                              variant="outlined"
                              label="Description *"
                              name="desc"
                              error={meta.error && meta.touched ? true : false}
                              {...input}
                              helperText={
                                meta.error && meta.touched ? meta.error : ""
                              }
                            />
                          )}
                        </Field>
                        {!values.uimageerror && !values.addimageerror && (
                          <div className={classes.submitbtn}>
                            <Button
                              size="large"
                              variant="contained"
                              color="primary"
                              disabled={submitting || pristine}
                              type="submit"
                            >
                              Submit
                            </Button>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </form>
                )}
              />
            </Paper>
          </div>
        </>
      );
    }
  }
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiFormControl-root": {
        width: "90%",
        margin: theme.spacing(1),
      },
      [theme.breakpoints.down("md")]: {
        "& .MuiFormControl-root": {
          width: "93%",
          margin: "12px",
        },
      },
    },
    maincard: {
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("md")]: {
        width: "90%",
        padding: "0px",
      },
    },
    media: {
      width: "30%",
      height: "330px",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("md")]: {
        width: "90%",
      },
    },
    formheader: {
      paddingLeft: "1%",
      fontWeight: "500",
      [theme.breakpoints.down("md")]: {
        paddingLeft: "5%",
        paddingTop: "5%",
      },
    },
    inputbox: {
      maxWidth: "720px",
      paddingTop: "32px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    paper: {
      padding: theme.spacing(3),
      [theme.breakpoints.down("md")]: {
        margin: theme.spacing(0),
        padding: "0px",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
    span: {
      flexGrow: "0.89",
    },
    input: {
      display: "none",
    },
    submitbtn: {
      paddingTop: "20px",
      marginLeft: "12px",
      marginRight: "auto",
      marginBottom: "10px",
      display: "block",
    },
  })
);
