import { React, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { plantTypeCategories, plantTypeHabitList } from "./habitList";
import { makeStyles } from "@mui/styles";
import { useDropzone } from "react-dropzone";
import TagSelector from "../../../components/TagSelector";

const AddTreeType = ({ open, handleClose, createPlantType }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    maxHeight: "90vh",
    overflow: "auto",
    scrollbarWidth: "thin",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
  };

  const [formData, setFormData] = useState({
    name: "",
    english_name: "",
    scientific_name: "",
    common_name_in_english: "",
    common_name_in_marathi: "",
    known_as: "",
    family: "",
    habit: "",
    category: "",
    tags: [],
    images: [],
  });

  const [files, setFiles] = useState([]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      if (name === 'common_name_in_english') {
        return {
          ...prevState,
          [name]: value,
          name: value.trim() + " (" + (prevState.common_name_in_marathi?.trim() || '') + ")",
        };
      } else if (name === 'common_name_in_marathi') {
        return {
          ...prevState,
          [name]: value,
          name: (prevState.common_name_in_english?.trim() || '') + " (" + value.trim() + ")",
        };
      } else {
        return {
          ...prevState,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("data of form: ", formData);
    createPlantType(formData, files);
    handleClose();
  };

  const classes = useStyles();

  const thumbs = files.map((file) => (
    <div stye={{ display: "inline-flex" }} key={file.name}>
      <div style={{ display: "flex", minWidth: 0, overflow: "hidden" }}>
        <img className={classes.preview} src={file.preview} alt="thumb" />
      </div>
    </div>
  ));

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    onDropRejected: (rejectedFiles) => {
      // toast.error("Only 10 images allowed!");
    },
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" align="center" sx={{ marginBottom: "8px" }}>
            Add Plant Type
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container rowSpacing={2} columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  name="name"
                  label="Name"
                  disabled
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="english_name"
                  label="Name (English)"
                  value={formData.english_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="common_name_in_english"
                  label="Common Name in English"
                  value={formData.common_name_in_english}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="common_name_in_marathi"
                  label="Common Name in Marathi"
                  value={formData.common_name_in_marathi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="scientific_name"
                  label="Scientific Name"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="known_as"
                  label="Known As"
                  value={formData.known_as}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  name="category"
                  disablePortal
                  options={plantTypeCategories}
                  value={
                    formData.category
                      ? plantTypeCategories.find(
                        (item) => item === formData.category
                      )
                      : undefined
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                  onChange={(event, value) => {
                    if (value !== null)
                      setFormData((prevState) => ({
                        ...prevState,
                        category: value,
                      }));
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  name="habit"
                  disablePortal
                  options={plantTypeHabitList}
                  value={
                    formData.habit
                      ? plantTypeHabitList.find(
                        (item) => item === formData.habit
                      )
                      : undefined
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Habit" />
                  )}
                  onChange={(event, value) => {
                    if (value !== null)
                      setFormData((prevState) => ({
                        ...prevState,
                        habit: value,
                      }));
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="use"
                  label="Use"
                  value={formData.use}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="family"
                  label="Family"
                  value={formData.family}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TagSelector
                  value={formData.tags}
                  handleChange={(tags) =>
                    setFormData({ ...formData, tags: tags })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.imgdiv}>
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p style={{ cursor: "pointer" }}>
                        Upload Plant Type images. Click or Drag!
                      </p>
                    </div>
                  </section>
                </div>
                <div className={classes.prevcontainer}>{thumbs}</div>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="outlined" color="error" onClick={handleClose} style={{ marginRight: "8px" }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" color="success">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  imgdiv: {
    padding: "8px",
    marginTop: "8px",
    marginBottom: "8px",
    border: "1px #1f3625 dashed",
    textAlign: "center",
  },
  preview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    margin: "8px",
  },
  prevcontainer: {
    margin: "16px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));
export default AddTreeType;
