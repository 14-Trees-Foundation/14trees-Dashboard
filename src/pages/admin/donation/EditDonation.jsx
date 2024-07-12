import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Steps } from "antd";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDonation = ({ row, openeditModal, closeEditModal, editSubmit }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(row);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const nextStep = () => {
    console.log(
      "Next button is clicked and the value of current is: ",
      current
    );
    setCurrent(current + 1);
  };

  const prevStep = () => {
    setCurrent(current - 1);
  };

  const EditDonationSteps = [
    {
      title: "Donor Details",
      content: "First-content",
    },
    {
      title: "Land Details",
      content: "Second-content",
    },
    {
      title: "Payment Details",
      content: "Third-content",
    },
    {
      title: "Other Details",
      content: "Last-content",
    },
  ];

  const items = EditDonationSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleSubmit = () => {

    console.log("updated donation data - ", formData);
    editSubmit(formData);
    closeEditModal();
  };

  return (
    <>
      <ToastContainer />
      <div>
        <Dialog open={openeditModal} fullWidth maxWidth="md">
          <DialogTitle align="center">Edit Donation</DialogTitle>
          <Steps current={current} items={items} style={{ padding: "40px" }} />

          <form style={{ padding: "40px" }}>
            <DialogContent>
              {current === 0 && (
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
                    name="email_address"
                    label="Email"
                    type="text"
                    fullWidth
                    value={formData.email_address}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="donor_type"
                    label="Donor Type"
                    type="text"
                    fullWidth
                    value={formData.donor_type}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="pledged"
                    label="Pledged"
                    type="text"
                    fullWidth
                    value={formData.pledged}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="phone"
                    label="Phone"
                    type="text"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </DialogContent>
              )}

              {current === 1 && (
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="land_type"
                    label="Land Type"
                    type="text"
                    fullWidth
                    value={formData.land_type}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="assigned_plot"
                    label="Assigned Plot"
                    type="text"
                    fullWidth
                    value={formData.assigned_plot}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="grove"
                    label="Grove"
                    type="text"
                    fullWidth
                    value={formData.grove}
                    onChange={handleChange}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="zone"
                    label="Zone"
                    type="text"
                    fullWidth
                    value={formData.zone}
                    onChange={handleChange}
                  />
                </DialogContent>
              )}

              {current === 2 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="pan"
                    label="PAN Number"
                    type="text"
                    fullWidth
                    value={formData.pan}
                    onChange={handleChange}
                  />
                </DialogContent>
              )}

              {current === 3 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="dashboard_status"
                    label="Dashboard Status"
                    type="text"
                    fullWidth
                    value={formData.dashboard_status}
                    onChange={handleChange}
                  />

                  <TextField
                    margin="dense"
                    name="remarks_for_inventory"
                    label="Remarks"
                    type="text"
                    fullWidth
                    value={formData.remarks_for_inventory}
                    onChange={handleChange}
                  />
                </DialogContent>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "15px",
              }}
            ></DialogActions>
          </form>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {current <= EditDonationSteps.length - 1 && (
              <Button
                variant="contained"
                type="primary"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => closeEditModal()}
              >
                Cancel
              </Button>
            )}
            {current < EditDonationSteps.length - 1 && (
              <Button
                variant="contained"
                type="primary"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => nextStep()}
              >
                Next
              </Button>
            )}

            {current > 0 && (
              <Button
                variant="contained"
                type="primary"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => prevStep()}
              >
                Previous
              </Button>
            )}
            {current === EditDonationSteps.length - 1 && (
              <Button
                variant="contained"
                type="submit"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => handleSubmit()}
              >
                Done
              </Button>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default EditDonation;
