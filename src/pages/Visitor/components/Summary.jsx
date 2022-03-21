import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";

import Axios from "../../../api/local";
import { Spinner } from "../../../components/Spinner";

export const Summary = ({ values, setValues, initialize }) => {
  const compressImageList = async (file) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    };

    let compressedFile;
    try {
      compressedFile = await imageCompression(file, options);
    } catch (error) {
      console.log(error);
    }
    return new File([compressedFile], file.name);
  };

  const handleSubmit = async () => {
    setValues({
      ...values,
      loading: true,
    });
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("org", values.orgid);
    formData.append("contact", values.contact);
    formData.append("sapling_id", values.saplingId);
    const extraImages = [];
    if (values.croppedImage) {
      let userImages = [];
      let image = await compressImageList(values.croppedImage);
      formData.append("files", image);
      userImages.push(values.croppedImage.name);
      formData.append("userimages", userImages);
    }

    if (values.additionalImages) {
      for (const key of Object.keys(values.additionalImages)) {
        let image = await compressImageList(values.additionalImages[key]);
        formData.append("files", image);
        extraImages.push(values.additionalImages[key].name);
      }
    }

    formData.append("memoryimages", extraImages);
    setValues({
      ...values,
      uploaded: true,
    });
    try {
      let res = await Axios.post("/profile/usertreereg", formData, {
        headers: {
          "Content-type": "multipart/form-data",
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
        });
        toast.error(res.status.error);
      }
    } catch (error) {
      setValues({
        ...values,
        loading: false,
      });
      if (error.response.status === 409 || error.response.status === 404) {
        toast.error(error.response.data.error);
      }
    }
  };

  if (values.loading) {
    return <Spinner />;
  } else if (values.uploaded) {
    return (
      <Card>
        <CardContent style={{ marginTop: "1%" }}>
          <Alert severity="success">
            Your data has been uploaded successfuly!
          </Alert>
          <CardActions>
            <Button
              style={{ marginLeft: "auto", marginRight: "auto" }}
              size="large"
              variant="contained"
              color="secondary"
              onClick={() => initialize()}
            >
              Add more
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Box sx={{ p: { xs: "0px", md: "24px" } }}>
        <ToastContainer />
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
                <Typography variant="body1">
                  Tree: #{values.saplingId}
                </Typography>
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
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    );
  }
};
