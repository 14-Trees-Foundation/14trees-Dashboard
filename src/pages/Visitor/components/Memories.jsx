import { Box, Button, Typography } from "@mui/material";

export const Memories = ({ values, setValues }) => {
  const handleAdditionalPicUpload = async (e) => {
    if (Array.from(e.target.files).length > 10) {
      return;
    }
    setValues({
      ...values,
      additionalImages: e.target.files,
    });
  };

  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      <Box>
        <div style={{ marginTop: "15px" }}>
          <div style={{ overflowX: "auto", display: "flex" }}>
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
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ pl: "16px", pt: "16px" }}
          >
            Feel free to share the photographs from your visit (max: 10)
          </Typography>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="additional-image-file"
            multiple
            type="file"
            onChange={handleAdditionalPicUpload}
          />
        </div>
        <>
          <label
            htmlFor="additional-image-file"
            style={{ display: "block", marginTop: "5px" }}
          >
            <Button component="span" variant="contained" color="secondary">
              Add Memories
            </Button>
          </label>
        </>
      </Box>
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
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          onClick={() =>
            setValues({ ...values, activeStep: values.activeStep + 1 })
          }
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
