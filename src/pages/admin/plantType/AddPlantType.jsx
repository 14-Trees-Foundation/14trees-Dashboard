import { React, useEffect, useState } from "react";
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
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";

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

  const [plantTypes, setPlantTypes] = useState([]);
  const [enSearchStr, setEnSearchStr] = useState('');
  const [mrSearchStr, setMrSearchStr] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (enSearchStr.length > 0) getPlantTypes(enSearchStr);
    }, 300)

    return () => { clearTimeout(timeoutId) };
  }, [enSearchStr]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mrSearchStr.length > 0) getPlantTypes(mrSearchStr);
    }, 300)

    return () => { clearTimeout(timeoutId) };
  }, [mrSearchStr]);


  const getPlantTypes = async (searchStr) => {
    const apiClinet = new ApiClient();
    try {
      const resp = await apiClinet.getPlantTypes(0, 20, [{ columnField: 'combined_name', operatorValue: 'contains', value: searchStr }]);
      resp.results.forEach(item => { item.key = item.id });
      setPlantTypes(resp.results);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEnglishNameChange = (event, value) => {
    let isSet = false;
    plantTypes.forEach((pt) => {
      if (pt.name === value) isSet = true;
    })

    if (!isSet) {
      if (value.length >= 1) setEnSearchStr(value);
    }
    setFormData(prevState => ({
      ...prevState,
      'common_name_in_english': value,
      name: value.trim() + " (" + (prevState.common_name_in_marathi?.trim() || '') + ")",
    }))
  }

  const handleMarathiNameChange = (event, value) => {
    let isSet = false;
    plantTypes.forEach((pt) => {
      if (pt.name === value) isSet = true;
    })

    if (!isSet) {
      if (value.length >= 1) setEnSearchStr(value);
    }
    setFormData(prevState => ({
      ...prevState,
      'common_name_in_marathi': value,
      name: (prevState.common_name_in_english?.trim() || '') + " (" + value.trim() + ")",
    }))
  }

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
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
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
                {/* <TextField
                  name="common_name_in_english"
                  label="Common Name in English"
                  value={formData.common_name_in_english}
                  onChange={handleChange}
                  fullWidth
                /> */}
                <Autocomplete
                  fullWidth
                  options={plantTypes}
                  name='common_name_in_english'
                  noOptionsText="No Plant Types Found"
                  value={formData.common_name_in_english}
                  onInputChange={handleEnglishNameChange}
                  getOptionLabel={(option) => option.name ? option.name : option}
                  isOptionEqualToValue={(option, value) => value.name ? option.name === value.name : option === value}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        {...optionProps}
                      >
                        {option.name ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant='body1'>{option.name}</Typography>
                            {option.english_name && <Typography variant='body2' color={'#494b4b'}>Eng name: {option.english_name}</Typography>}
                            {option.scientific_name && <Typography variant='body2' color={'#494b4b'}>Sci name: {option.scientific_name}</Typography>}
                            {option.known_as && <Typography variant='subtitle2' color={'GrayText'}>Known as: {option.known_as}</Typography>}
                          </Box>
                        ) : (
                          <Typography>{option}</Typography>
                        )}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="common_name_in_english"
                      label="Name (English)"
                      variant="outlined"
                    />
                  )}>
                </Autocomplete>
              </Grid>
              <Grid item xs={6}>
                {/* <TextField
                  name="common_name_in_marathi"
                  label="Common Name in Marathi"
                  value={formData.common_name_in_marathi}
                  onChange={handleChange}
                  fullWidth
                /> */}
                <Autocomplete
                  fullWidth
                  options={plantTypes}
                  name='common_name_in_marathi'
                  noOptionsText="No Plant Types Found"
                  value={formData.common_name_in_marathi}
                  onInputChange={handleMarathiNameChange}
                  getOptionLabel={(option) => option.name ? option.name : option}
                  isOptionEqualToValue={(option, value) => value.name ? option.name === value.name : option === value}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        {...optionProps}
                      >
                        {option.name ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant='body1'>{option.name}</Typography>
                            {option.english_name && <Typography variant='body2' color={'#494b4b'}>Eng name: {option.english_name}</Typography>}
                            {option.scientific_name && <Typography variant='body2' color={'#494b4b'}>Sci name: {option.scientific_name}</Typography>}
                            {option.known_as && <Typography variant='subtitle2' color={'GrayText'}>Known as: {option.known_as}</Typography>}
                          </Box>
                        ) : (
                          <Typography>{option}</Typography>
                        )}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="common_name_in_marathi"
                      label="Name (English)"
                      variant="outlined"
                    />
                  )}>
                </Autocomplete>
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
