import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { VisitTypeList } from "../../../types/visits";
// import StepForm from "../visits/components/StepForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  maxWidth: 600,
  height: 300,
  overflow: "auto",
  scrollbarWidth: "thin",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const AddVisit = ({ open, handleClose, createVisit }) => {

  const [formData, setFormData] = useState({
    visit_name: '',
    visit_date: '',
    visit_type: null
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createVisit({
      visit_name: formData.visit_name,
      visit_date: formData.visit_date,
      visit_type: formData.visit_type.id
    });
    setFormData({
      visit_name: '',
      visit_date: '',
      visit_type: null
    });

    handleClose();
  };

  return (
    // <>
    //   <StepForm
    //     open={open}
    //     handleClose={handleClose}
    //     useCase={"Add Visit"}
    //     data={initialValues}
    //     submitFunction={createVisit}
    //   />
    // </>
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" align="center" sx={{ marginBottom: "8px" }}>
            Add Visit
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container rowSpacing={2} columnSpacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  name="visit_name"
                  label="Visit Name"
                  value={formData.visit_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  name="visit_type"
                  disablePortal
                  options={VisitTypeList}
                  value={formData.visit_type}
                  renderInput={(params) => (
                    <TextField {...params} label="Visit Type" required />
                  )}
                  onChange={(event, value) => {
                    if (VisitTypeList.includes(value))
                      setFormData((prevState) => ({
                        ...prevState,
                        visit_type: value,
                      }));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="visit_date"
                  label="Visit Date"
                  type="date"
                  value={formData.visit_date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="outlined" color="error" onClick={handleClose} sx={{ marginRight: "8px" }}>
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

export default AddVisit;
