import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

import Axios from "../../../../api/local";
import { Spinner } from "../../../../components/Spinner";

export const AddMemories = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(new Date());
  const [memories, setMemories] = useState([]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleAdditionalPicUpload = async (e) => {
    if (Array.from(e.target.files).length > 10) {
      return;
    }
    setMemories(e.target.files);
  };

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
    setLoading(true);
    const formData = new FormData();
    formData.append("date", value);
    const extraImages = [];

    for (const key of Object.keys(memories)) {
      let image = await compressImageList(memories[key]);
      formData.append("files", image);
      extraImages.push(memories[key].name);
    }

    formData.append("memoryimages", extraImages);
    try {
      let res = await Axios.post("/images/addmemories", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setLoading(false);
        toast.success("Memories Added!");
      } else {
        setLoading(false);
        toast.error(res.status.error);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409 || error.response.status === 404) {
        toast.error(error.response.data.error);
      }
    }
  };

  if (loading) {
    return <Spinner text={"Adding Images to profiles"} />;
  } else {
    return (
      <Box
        sx={{
          color: "#2D1B08",
          ml: "auto",
          mr: "auto",
          mt: 4,
          width: "800px",
          minHeight: "400px",
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
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ p: 2, pl: 0 }}>
            Add memories to site plantation profiles
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Select Date of Plantation (on-site)"
              inputFormat="dd/MM/yyyy"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <div>
            <div
              style={{ overflowX: "auto", display: "flex", marginTop: "16px" }}
            >
              {memories.length > 0 &&
                [...memories].map((img, i) => {
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
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="additional-image-file"
              multiple
              type="file"
              onChange={handleAdditionalPicUpload}
            />
            <label
              htmlFor="additional-image-file"
              style={{ display: "block", marginTop: "5px" }}
            >
              <Button component="span" variant="contained" color="secondary">
                Add Memories
              </Button>
            </label>
          </div>
        </Box>
        <Button
          style={{ marginTop: "36px" }}
          disabled={memories.length === 0}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </Box>
    );
  }
};
