import { Box, Button } from "@mui/material";

export const MoreInfo = ({ values, setValues }) => {
const buttons = () => {
    return (
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
    )
}
  if (values.userFound) {
    return (
      <Box sx={{position:'relative', minHeight: '350px'}}>
          {buttons()}
      </Box>
    );
  } else {
    return (
      <div>
          <div>{values.name}</div>
          {buttons()}
      </div>
    );
  }
};
