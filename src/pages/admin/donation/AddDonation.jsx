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
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MenuItem from "@mui/material/MenuItem";
import { message, Steps, theme } from "antd";

const AddDonation = ({ open, handleClose, createDonation }) => {
  const [current, setCurrent] = useState(0);

  const nextStep = () => {
    setCurrent(current + 1);
    console.log("value of : ", current);
  };

  const prevStep = () => {
    setCurrent(current - 1);
  };

  const add_donation_steps = [
    {
      title: "Donor Details",
      content: "First-content",
    },
    {
      title: "Donation Details",
      content: "Second-content",
    },
    {
      title: "Payment Details",
      content: "Third-content",
    },
    {
      title: "Tax benefits",
      content: "Fourth-content",
    },

    {
      title: "Name Assignment Details",
      content: "Fifth-content",
    },

    {
      title: "Summary",
      content: "Sixth-content",
    },

    {
      title: "Thank You",
      content: "Last-content",
    },
  ];

  const items = add_donation_steps.map((item) => ({
    key: item.title,

    title: item.title,
  }));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [No_of_Trees_Acres, setNo_of_Trees_Acres] = useState("");

  const [Grove, setGrove] = useState("");

  const [Site_Type, setSite_Type] = useState("");
  const [QRCode, setQRCode] = useState("");
  const [Total_Payment_based_on_selection, setTotal_Payment] = useState("");
  const [Contribution_dropdown_Screenshot, setContribution] = useState("");
  const [PAN, setPAN] = useState("");
  const [FCRA_matters, setFCRA] = useState("");
  const [List_of_people_names, setListOfNames] = useState("");
  const [Summary, setSummary] = useState("");
  const [Comments, setComments] = useState("");

  const handleSubmit = () => {
    const newDonation = {
      Name: name,
      Email_Address: email,
      No_of_Trees_Acres: No_of_Trees_Acres,
      Grove: Grove,
      Site_Type: Site_Type,
      QRCode: QRCode,
      Total_Payment_based_on_selection: Total_Payment_based_on_selection,
      Contribution_dropdown_Screenshot: Contribution_dropdown_Screenshot,
      PAN: PAN,
      FCRA_matters: FCRA_matters,
      List_of_people_names: List_of_people_names,
      Summary: Summary,
      Comments: Comments,
    };

    createDonation(newDonation);
    console.log("New Donation Data : ", newDonation);
    handleClose();
    setCurrent(0);
  };

  const [error, setError] = useState(false);

  const validateNameInput = (value) => {
    try {
      if (typeof value === String) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    const eachValue = e.target.value;
    console.log("Each value : ", eachValue);
    console.log("Name : ", name);

    if (typeof eachValue === "number") {
      setError(true);
      console.log("Error : ", error);
    } else {
      setError(false);

      console.log("Error : ", error);
      console.log("Name : ", name);
    }
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="xl"
          style={{}}
        >
          <DialogTitle align="center">Add Donation</DialogTitle>
          {current < add_donation_steps.length && (
            <>
              <div
                style={{
                  padding: "0 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Steps
                  current={current}
                  items={items}
                  style={{ display: "flex", alignItems: "center" }}
                />
                {/* {current <= 3 && add_donation_steps.length > 4 && (
                  <div
                    style={{
                      marginLeft: "15px",
                      fontSize: "28px",
                      color: "green",
                    }}
                  >
                    <ArrowRightAltIcon />
                  </div>
                )} */}
              </div>
            </>
          )}
          {/* {current > 3 && (
            <Steps
              current={current}
              items={items.slice(4, 7)}
              style={{ padding: "40px" }}
            />
          )} */}

          <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
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
                    error={error}
                    helperText={error && "Name should be string"}
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
                </DialogContent>
              )}

              {current === 1 && (
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="No of Trees/Acres"
                    label="No of Trees/Acres"
                    type="text"
                    fullWidth
                    value={No_of_Trees_Acres}
                    onChange={(e) => {
                      setNo_of_Trees_Acres(e.target.value);
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
                    name="Site Type"
                    label="Site Type"
                    type="text"
                    fullWidth
                    value={Site_Type}
                    onChange={(e) => {
                      setSite_Type(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 2 && (
                <DialogContent>
                  <div style={{ textAlign: "center" }}>
                    <img
                      // eslint-disable-next-line no-octal-escape
                      src="https://cdn.discordapp.com/attachments/1240961695141331016/1256211630661042228/PaymentInstructionsImage.jpg?ex=6683e640&is=668294c0&hm=db18bdff2f52c91cf41cf8a146d5b38bf9423c852c43b12e9d1d6e5bf5e9550e&" // Replace with your QR code image URL
                      alt="QR Code"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        marginBottom: "20px",
                      }}
                    />
                  </div>

                  <TextField
                    margin="dense"
                    name="Total Payment based on selection"
                    label="Total_Payment_based_on_selection"
                    type="text"
                    fullWidth
                    value={Total_Payment_based_on_selection}
                    onChange={(e) => {
                      setTotal_Payment(e.target.value);
                    }}
                  ></TextField>
                  <TextField
                    margin="dense"
                    name="Contribution dropdown Screenshot"
                    label="Contribution_dropdown_Screenshot"
                    type="text"
                    fullWidth
                    value={Contribution_dropdown_Screenshot}
                    onChange={(e) => {
                      setContribution(e.target.value);
                    }}
                  ></TextField>
                </DialogContent>
              )}

              {current === 3 && (
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

                  <TextField
                    margin="dense"
                    name="FCRA_matters"
                    label="80g / 501 (c)/ FCRA section"
                    type="text"
                    fullWidth
                    value={FCRA_matters}
                    onChange={(e) => {
                      setFCRA(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 4 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="List_of_people_names"
                    label="List of people names"
                    type="text"
                    fullWidth
                    value={List_of_people_names}
                    onChange={(e) => {
                      setListOfNames(e.target.value);
                    }}
                    error={Boolean(error)}
                    helperText={error}
                  />
                </DialogContent>
              )}

              {current === 5 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="Summary"
                    label="Summary"
                    type="text"
                    fullWidth
                    value={Summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                    }}
                  />
                </DialogContent>
              )}

              {current === 6 && (
                <DialogContent>
                  <TextField
                    margin="dense"
                    name="Comments"
                    label="Comments/feedbacks"
                    type="text"
                    fullWidth
                    value={Comments}
                    onChange={(e) => {
                      setComments(e.target.value);
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
            {current <= add_donation_steps.length - 1 && (
              <Button
                variant="contained"
                type="primary"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            )}

            {current < add_donation_steps.length - 1 && (
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

            {current === add_donation_steps.length - 1 && (
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

export default AddDonation;
