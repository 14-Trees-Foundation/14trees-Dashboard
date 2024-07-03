import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { message, Steps, theme } from "antd";

import MenuItem from "@mui/material/MenuItem";
import { Dashboard } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDonation = ({ row, openeditModal, closeEditModal, editSubmit }) => {
  const [current, setCurrent] = useState(0);

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

  const [name, setName] = useState(row.Name);
  const [email, setEmail] = useState(row.Email_Address || "");
  const [donor_type, setDonor_type] = useState(row.donor_type);

  const [Grove, setGrove] = useState(row.Grove);

  const [Land_Type, setLand_Type] = useState(row.Land_Type);
  const [Zone, setZone] = useState(row.Zone);
  const [phone, setPhone] = useState(row.phone || "");
  const [pledged, setPledged] = useState(row.Pledged);
  const [PAN, setPAN] = useState(row.PAN);
  const [dashboard_status, setStatus] = useState(row.DashboardStatus);
  const [assignedPlot, setAssignedPlot] = useState(row.assignedPlot);
  const [remarks, setRemarks] = useState(row.remarks || "");

  const handleSubmit = () => {
    const updatedData = {
      id: row.id,
      Name: name,
      "Email Address": email,
      "Donor Type": donor_type,
      Grove: Grove,
      "Land Type": Land_Type,
      Zone: Zone,
      Phone: phone,
      Pledged: pledged,
      PAN: PAN,
      DashboardStatus: dashboard_status,
      Assigned_Plot: assignedPlot,
      "Remarks for inventory": remarks,
    };

    console.log("updated donation data - ", updatedData);
    editSubmit(updatedData);
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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="text"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Donor_Type"
                    label="Donor Type"
                    type="text"
                    fullWidth
                    value={donor_type}
                    onChange={(e) => {
                      setDonor_type(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Pledged"
                    label="Pledged"
                    type="text"
                    fullWidth
                    value={pledged}
                    onChange={(e) => {
                      setPledged(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Phone"
                    label="Phone"
                    type="text"
                    fullWidth
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 1 && (
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="Land_Type"
                    label="Land_Type"
                    type="text"
                    fullWidth
                    value={Land_Type}
                    onChange={(e) => {
                      setLand_Type(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Assigned Plot"
                    label="Assigned Plot"
                    type="text"
                    fullWidth
                    value={assignedPlot}
                    onChange={(e) => {
                      setAssignedPlot(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Grove"
                    label="Grove"
                    type="text"
                    fullWidth
                    value={Grove}
                    onChange={(e) => {
                      setGrove(e.target.value);
                    }}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    name="Zone"
                    label="Zone"
                    type="text"
                    fullWidth
                    value={Zone}
                    onChange={(e) => {
                      setZone(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 2 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="PAN"
                    label="PAN Number"
                    type="text"
                    fullWidth
                    value={PAN}
                    onChange={(e) => {
                      setPAN(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 3 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="Dashboard_Status"
                    label="Dashboard_Status"
                    type="text"
                    fullWidth
                    value={dashboard_status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />

                  <TextField
                    margin="dense"
                    name="Remarks"
                    label="Remarks"
                    type="text"
                    fullWidth
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                    }}
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
