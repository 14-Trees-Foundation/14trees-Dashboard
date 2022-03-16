import { Box, Button, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";

export const EmailForm = ({ values, handleNameAndEmail, setValues }) => {
  return (
    <Box sx={{ minHeight: "350px", position: 'relative' }}>
      <Typography sx={{ fontSize: "28px", letterSpacing: "0.1px" }}>
        Please enter your full name and email
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Form
          onSubmit={handleNameAndEmail}
          initialValues={{ name: values.name, email: values.email }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Full name required.";
            }
            if (!values.email) {
              errors.email = "Email required.";
            }
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
              <Field name="name">
                {({ input, meta }) => (
                  <TextField
                    error={meta.error && meta.touched ? true : false}
                    {...input}
                    variant="outlined"
                    label="Full Name *"
                    name="name"
                    helperText={meta.error && meta.touched ? meta.error : ""}
                  />
                )}
              </Field>
              <Field name="email">
                {({ input, meta }) => (
                  <TextField
                    variant="outlined"
                    label="Email *"
                    name="email"
                    error={meta.error && meta.touched ? true : false}
                    {...input}
                    helperText={meta.error && meta.touched ? meta.error : ""}
                  />
                )}
              </Field>
              <Box sx={{ display: "flex", flexDirection: "row", position: 'absolute', bottom: 0, width: '100%'}}>
                <Button
                  color="inherit"
                  disabled={values.activeStep === 0}
                  onClick={() =>
                    setValues({ ...values, activeStep: values.activeStep - 1 })
                  }
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                >
                  {values.activeStep === 4 ? "Finish" : "Next"}
                </Button>
              </Box>
            </form>
          )}
        />
      </Box>
    </Box>
  );
};
