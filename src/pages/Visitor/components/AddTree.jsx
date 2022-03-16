import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  TextField,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

import { GetCroppedImg } from "../../../helpers/imageCrop";
import { useState } from "react";

export const AddTree = ({ values, setValues }) => {
  console.log(values);
  const [cropImgsrc, setCropImgsrc] = useState(null);
  const [imageRef, setImageRef] = useState();
  const [crop, setCrop] = useState(
    // default crop config
    {
      unit: "%",
      width: 40,
      aspect: 9 / 11,
    }
  );
  async function cropImage(crop) {
    let random = Math.random().toString(36).substr(2, 5);
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await GetCroppedImg(
        imageRef,
        crop,
        "croppedImage" + random + ".jpeg" // destination filename
      );

      // calling the props function to expose
      setValues({
        ...values,
        croppedImage: croppedImage,
      });
      setCropImgsrc(croppedImage ? URL.createObjectURL(croppedImage) : null);
    }
  }
  const handleProfilePicUpload = (e) => {
    setValues({
      ...values,
      userImages: e.target.files,
      userImage1: e.target.files[0] ? e.target.files[0] : null,
      userImage1src: e.target.files[0]
        ? URL.createObjectURL(e.target.files[0])
        : null,
      dlgOpen: true,
    });
  };
  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      <Box>
        {values.userImage1src !== null && (
          <Dialog onClose={() => {}} disableEscapeKeyDown open={values.dlgOpen}>
            <ReactCrop
              src={values.userImage1src}
              crop={crop}
              onImageLoaded={(imageRef) => setImageRef(imageRef)}
              onComplete={(cropConfig) => cropImage(cropConfig)}
              onChange={(c) => setCrop(c)}
            />
            <DialogActions
              onClick={() => setValues({ ...values, dlgOpen: false })}
            >
              I'm Done
            </DialogActions>
          </Dialog>
        )}
        <Card
          sx={{
            maxWidth: "380px",
            textAlign: "center",
            boxShadow: "#e5e5e5 0px 0px 8px 8px;",
          }}
        >
          <CardContent>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
              onChange={handleProfilePicUpload}
            />
            <label
              htmlFor="contained-button-file"
              style={{ display: "block", marginTop: "5px" }}
            >
              {cropImgsrc ? (
                <img
                  src={cropImgsrc}
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "90px",
                  }}
                  alt=""
                />
              ) : (
                <AccountCircle sx={{ width: "170px", height: "170px" }} />
              )}
            </label>
            <TextField
              variant="outlined"
              label="Tree ID"
              name="saplingid"
              value={values.saplingId}
              required
              onChange={(e) => {
                setValues({
                  ...values,
                  saplingId: e.target.value,
                });
              }}
            />
          </CardContent>
        </Card>
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
          disabled={values.saplingId === ""}
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
