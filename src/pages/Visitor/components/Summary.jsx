import { Box, Typography, Avatar, Button } from "@mui/material";

export const Summary = ({ values, setValues }) => {
  console.log(values);
  return (
    <Box>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box sx={{ textAlign: "center", pt: 3 }}>
          <div style={{ display: "flex" }}>
            <div>
              {values.croppedImage ? (
                <img
                  src={
                    values.croppedImage
                      ? URL.createObjectURL(values.croppedImage)
                      : null
                  }
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "65px",
                  }}
                  alt=""
                />
              ) : (
                <Avatar
                  src={null}
                  sx={{
                    width: "135px",
                    height: "135px",
                    ml: "auto",
                    mr: "auto",
                    mt: 2,
                    mb: 2,
                  }}
                />
              )}
            </div>
            <div
              style={{
                paddingLeft: "24px",
                textAlign: "initial",
                alignSelf: "center",
              }}
            >
              <Typography variant="body1">{values.name}</Typography>
              <Typography variant="body1">{values.email}</Typography>
              <Typography variant="body1">Tree: #{values.saplingId}</Typography>
            </div>
          </div>
          <Typography sx={{ textAlign: "start", mt: 2, fontSize: "18px" }}>
            Memories
          </Typography>
          <div
            style={{ overflowX: "auto", display: "flex", marginTop: "16px" }}
          >
            {values.additionalImages.length > 0 &&
              [...values.additionalImages].map((img, i) => {
                return (
                  <img
                    key={i}
                    style={{
                      width: "auto",
                      height: "200px",
                      margin: "16px",
                      borderRadius: "15px",
                      objectFit: "cover",
                    }}
                    src={URL.createObjectURL(img)}
                    alt=""
                  />
                );
              })}
          </div>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "row",
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
          disabled={values.saplingId === ""}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          onClick={() => console.log("submit")}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};
