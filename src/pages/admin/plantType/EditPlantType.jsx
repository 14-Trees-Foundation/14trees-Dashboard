import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import { plantTypeHabitList } from "./habitList";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";

function EditTreeType({
  row,
  openeditModal,
  handleCloseEditModal,
  editSubmit,
}) {
  const [formData, setFormData] = useState(row);

  const classes = useStyles();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editSubmit(formData);
    handleCloseEditModal(false);
  };
  const [files, setFiles] = useState([]);
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

      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...(prevFormData.images || []), acceptedFiles],
      }));
    },
    onDropRejected: (rejectedFiles) => {
      // toast.error("Only 10 images allowed!");
    },
  });

  return (
    <Dialog open={openeditModal} onClose={() => handleCloseEditModal(false)}>
      <DialogTitle align="center">Edit Tree Type</DialogTitle>
      <form onSubmit={handleEditSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="english_name"
            label="Name (English)"
            type="text"
            fullWidth
            value={formData.english_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="common_name_in_english"
            label="Common Name in English"
            type="text"
            fullWidth
            value={formData.common_name_in_english}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="common_name_in_marathi"
            label="Common Name in Marathi"
            type="text"
            fullWidth
            value={formData.common_name_in_marathi}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="scientific_name"
            label="Scientific Name"
            type="text"
            fullWidth
            value={formData.scientific_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="known_as"
            label="Known As"
            type="text"
            fullWidth
            value={formData.known_as}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            value={formData.tags}
            onChange={handleChange}
          />
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
          <TextField
            margin="dense"
            name="images"
            label="Images"
            type="text"
            fullWidth
            value={formData.images}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="use"
            label="Use"
            type="text"
            fullWidth
            value={formData.use}
            onChange={handleChange}
          />
          <Autocomplete
            fullWidth
            name="habit"
            disablePortal
            options={plantTypeHabitList}
            value={
              formData.habit
                ? plantTypeHabitList.find((item) => item === formData.habit)
                : undefined
            }
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Habit" />
            )}
            onChange={(event, value) => {
              if (value !== null)
                setFormData((prevState) => ({ ...prevState, habit: value }));
            }}
          />
          <TextField
            margin="dense"
            name="plant_type_id"
            label="Plant Type ID"
            type="text"
            fullWidth
            value={formData.plant_type_id}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleCloseEditModal(false)}
            color="error"
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="success">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
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

export default EditTreeType;
