import { Box, Button, TextField, Typography } from "@mui/material";

export const EmailForm = ({ values, handleNameAndEmail, setValues }) => {
  return (
    <Box sx={{ minHeight: "350px", position: "relative" }}>
      <Typography
        sx={{ fontSize: { xs: "20px", md: "28px" }, letterSpacing: "0.1px" }}
      >
        Please enter your full name and email
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          variant="outlined"
          label="Full Name"
          name="name"
          required
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />

        <TextField
          variant="outlined"
          label="Email"
          name="email"
          required
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
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
            size="large"
            variant="contained"
            color="primary"
            disabled={values.name === "" || values.email === ""}
            onClick={() => handleNameAndEmail()}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
