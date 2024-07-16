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
import { plantTypeHabitList } from "./habitList";
import { CreateAlbumDialog } from "../../ww/CreateAlbumDialog";
import { makeStyles } from "@mui/styles";
import { useDropzone } from "react-dropzone";

const AddTreeType = ({ open, handleClose, createPlantType }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 450,
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
    plant_type_id: "",

    scientific_name: "",
    known_as: "",
    family: "",
    habit: "",
    english_name: "",
    common_name_in_english: "",
    common_name_in_marathi: "",
    category: "",
    // tags: [],
    images: [],
    remarkable_char: "",

    use: "",
    parts_used: "",
  });

  const [files, setFiles] = useState([]);
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
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
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="english_name"
                  label="Name (English)"
                  value={formData.english_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="common_name_in_english"
                  label="Common Name in English"
                  value={formData.common_name_in_english}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="common_name_in_marathi"
                  label="Common Name in Marathi"
                  value={formData.common_name_in_marathi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="plant_type_id"
                  label="Plant Type ID"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="scientific_name"
                  label="Scientific Name"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="known_as"
                  label="Known As"
                  value={formData.known_as}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  name="tags"
                  label="Tags"
                  value={formData.tags}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid> */}
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
              <Grid item xs={12}>
                <TextField
                  name="use"
                  label="Use"
                  value={formData.use}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="family"
                  label="Family"
                  value={formData.family}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
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
                    <TextField {...params} margin="dense" label="Habit" />
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
