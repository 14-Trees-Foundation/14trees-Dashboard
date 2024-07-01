import { Box, Button, Typography , TextField , MenuItem } from "@mui/material";

export const OtherDetails = ({ values, setValues }) => {



  const SampatiPatraOptions = [
    { value: '14T - ग्राम पंचायत पत्र ', label: '14T - ग्राम पंचायत पत्र' },
    { value: '14T - संस्था पत्र', label: '14T - संस्था पत्र' },
    { value: 'वन विभाग सहकार्य पत्र', label: 'वन विभाग सहकार्य पत्र' },
    { value: '14T - MoU with owner', label: '14T - MoU with owner' },
    
  ];


  // const handleAdditionalPicUpload = async (e) => {
  //   if (Array.from(e.target.files).length > 10) {
  //     return;
  //   }
  //   setValues({
  //     ...values,
  //     additionalImages: e.target.files,
  //   });
  // };

  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      {/* <Box>
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
      </Box> */}


                <TextField
                        margin="dense"
                        name="area_acres"
                        label="Area (Acres)"
                        type="text"
                        fullWidth
                        // value={area}
                        onChange={(e) => setValues({ ...values, area_acres: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        name="length_km"
                        label="Length (Km)"
                        type="text"
                        fullWidth
                        // value={length}
                        onChange={(e) => setValues({ ...values, length_km: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        name="sampati patra"
                        label="Sampati Patra"
                        type="text"
                        fullWidth
                        // value={sampatiPatra}
                        onChange={(e) => setValues({ ...values, sampatiPatra: e.target.value })}
                    >
                        {SampatiPatraOptions.map((item)=> 
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>)}
                    
                    </TextField>

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
