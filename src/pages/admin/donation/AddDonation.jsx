import React, { useEffect, useState } from "react";
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
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import "./Donation";
import MenuItem from "@mui/material/MenuItem";
import { message, Steps, theme } from "antd";
import PaymentQR14tree from "../../../assets/PaymentQR14tree.jpg";
import { Email } from "@mui/icons-material";
import { watch } from "fs";

const AddDonation = ({ open, handleClose, createDonation }) => {
  const [current, setCurrent] = useState(0);

  const nextStep = () => {
    setCurrent(current + 1);
  };

  const prevStep = () => {
    setCurrent(current - 1);
  };

  const handleCancelButton = () => {
    setName("");
    setEmail("");
    setNo_of_Trees("");
    setNo_of_Acres("");
    setGrove("");
    setSite_Type("");
    setQRCode("");
    setTotal_Payment("");
    setContribution("");
    setPAN("");
    setFCRA("");
    setListOfNames("");
    setSummary("");
    setComments("");
    setIsTextFieldEnabled(true);
    setTaxBenefit(true);
    settaxBenefitRadioButton("yes");
    setRadioButton("yes");

    setCurrent(0);
    handleClose();
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
  const [No_of_Trees, setNo_of_Trees] = useState("");
  const [No_of_Acres, setNo_of_Acres] = useState("");

  const [Grove, setGrove] = useState("");

  const [Site_Type, setSite_Type] = useState("");
  const [QRCode, setQRCode] = useState("");
  const [Total_Payment_based_on_selection, setTotal_Payment] = useState(0);
  const [Contribution_dropdown_Screenshot, setContribution] = useState("");
  const [PAN, setPAN] = useState("");
  const [FCRA_matters, setFCRA] = useState("");
  const [List_of_people_names, setListOfNames] = useState([{ value: "" }]);
  const [Summary, setSummary] = useState("");
  const [Comments, setComments] = useState("");

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [numOfTreeError, setNumOfTreeError] = useState("");

  const [isTextFieldEnabled, setIsTextFieldEnabled] = useState(true);
  const [TaxBenefitChange, setTaxBenefit] = useState(true);

  const [tagValue, setTagValue] = useState("");
  const [tags, setTags] = useState([]);
  const [tree_acre_radio_button, setRadioButton] = useState("yes");
  const [taxBenefitRadioButton, settaxBenefitRadioButton] = useState("yes");

  const [stageCheck, setStageCheck] = useState(false);

  const SiteTypeOptions = [
    { value: "1", label: "Pubilc" },
    { value: "2 ", label: "Foundation" },
  ];

  const GroveTypeOptions = [
    { value: "1", label: "Visitor's grove" },
    { value: "2", label: "Family grove" },
    { value: "3", label: "Memorial grove" },
    { value: "4", label: "Social/professional group grove" },
    { value: "5", label: "School/College alumni grove" },
    { value: "6", label: "Corporate grove" },
    { value: "7", label: "Conference grove" },
  ];

  const handleSubmit = () => {
    const newDonation = {
      Name: name,
      Email_Address: email,
      No_of_Trees: No_of_Trees,
      No_of_Acres: No_of_Acres,
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

    setName("");
    setEmail("");
    setNo_of_Trees("");
    setNo_of_Acres("");
    setGrove("");
    setSite_Type("");
    setQRCode("");
    setTotal_Payment("");
    setContribution("");
    setPAN("");
    setFCRA("");
    setListOfNames("");
    setSummary("");
    setComments("");
    setIsTextFieldEnabled(true);
    setTaxBenefit(true);
    settaxBenefitRadioButton("yes");
    setRadioButton("yes");

    handleClose();
    setCurrent(0);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.validity.valid) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setEmailError(!emailPattern.test(e.target.value));
  };

  const handleNumOfTree = (e) => {
    const value = e.target.value;
    setNo_of_Trees(value);

    // Basic validation: check if the value is a valid number
    if (value !== "" && isNaN(Number(value))) {
      setNumOfTreeError("Please enter a valid number");
    } else {
      setNumOfTreeError("");
    }
  };

  const handleGroveType = (e) => {
    setGrove(e.target.value);
  };

  const handleSiteType = (e) => {
    const value = e.target.value;

    setSite_Type(e.target.value);
    console.log("site type value", e.target.value);
    console.log(" type of value", typeof e.target.value);

    let total;
    if (value == "Public") {
      total = { No_of_Trees } * 1500;
      console.log("total value when public: ", total);
    } else if (value == "Foundation") {
      total = { No_of_Acres } * 3000;
      console.log("total value when foundation: ", total);
    } else {
      total = 0;
    }
    console.log("Total value: ", total);

    setTotal_Payment(total);
    console.log("Value of Total: ", Total_Payment_based_on_selection);
  };

  const handleRadioChange = (e) => {
    setIsTextFieldEnabled(e.target.value === "yes");
    if (e.target.value === "yes") {
      setRadioButton("yes");
    }
    if (e.target.value === "no") {
      setRadioButton("no");
    }
  };

  const handleTaxBenefitChange = (e) => {
    setTaxBenefit(e.target.value === "yes");
    if (e.target.value === "yes") {
      settaxBenefitRadioButton("yes");
    }
    if (e.target.value === "no") {
      settaxBenefitRadioButton("no");
    }
  };

  const addTags = () => {
    if (tagValue) {
      setTags([...tags, tagValue]);
      setTagValue("");
    }
    console.log(tags);
  };

  const deleteTags = (value) => {
    let remainTags = tags.filter((t) => t !== value);
    setTagValue(remainTags);
    console.log(tags);
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullwidth
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
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
            <DialogContent>
              {current === 0 && (
                <DialogContent>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    error={nameError}
                    helperText={
                      nameError
                        ? "Please enter your name (letters and spaces only)"
                        : ""
                    }
                    inputProps={{
                      pattern: "[A-Za-z ]+",
                    }}
                    onChange={handleNameChange}
                  />
                  <TextField
                    margin="dense"
                    required
                    name="email"
                    label="Email"
                    type="text"
                    fullWidth
                    value={email}
                    error={emailError}
                    helperText={
                      emailError ? "Please enter valid email id " : ""
                    }
                    onChange={handleEmailChange}
                  />
                </DialogContent>
              )}

              {current === 1 && (
                <DialogContent>
                  <Grid
                    container
                    justify="flex-start"
                    alignItems="flex-end"
                    spacing={2}
                    direction="row"
                  >
                    <Grid item xs={12}>
                      <RadioGroup
                        row
                        aria-label="enable"
                        name="enable"
                        value={tree_acre_radio_button}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Trees"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="Acres"
                        />
                      </RadioGroup>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="No of Trees"
                        label="No of Trees"
                        type="number"
                        fullWidth
                        value={No_of_Trees}
                        disabled={!isTextFieldEnabled}
                        error={Boolean(numOfTreeError)}
                        helperText={numOfTreeError}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onChange={handleNumOfTree}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="No of Acres"
                        label="No of Acres"
                        type="number"
                        fullWidth
                        value={No_of_Acres}
                        disabled={isTextFieldEnabled}
                        onChange={(e) => {
                          setNo_of_Acres(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    select
                    autoFocus
                    margin="dense"
                    name="Grove"
                    label="Grove Type"
                    type="text"
                    fullWidth
                    value={Grove}
                    onChange={handleGroveType}
                  >
                    {GroveTypeOptions.map((item) => (
                      <MenuItem key={item.value} value={item.label}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    autoFocus
                    margin="dense"
                    name="Site Type"
                    label="Site Type"
                    type="text"
                    fullWidth
                    value={Site_Type}
                    onChange={handleSiteType}
                  >
                    {SiteTypeOptions.map((item) => (
                      <MenuItem key={item.value} value={item.label}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </DialogContent>
              )}

              {current === 2 && (
                <DialogContent>
                  <div style={{ textAlign: "center" }}>
                    <img
                      // eslint-disable-next-line no-octal-escape
                      src={PaymentQR14tree} // Replace with your QR code image URL
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
                    type="number"
                    fullWidth
                    value={Total_Payment_based_on_selection}
                    readOnly
                  ></TextField>

                  <label htmlFor="name">
                    <p>Upload Payment Screenshot</p>{" "}
                  </label>

                  <input
                    type="file"
                    name="Contribution dropdown Screenshot"
                    label="Contribution_dropdown_Screenshot"
                    fullWidth
                    // onChange={()=>{}}
                  />
                </DialogContent>
              )}

              {current === 3 && (
                <DialogContent>
                  <Grid
                    container
                    justify="flex-start"
                    alignItems="flex-end"
                    spacing={2}
                    direction="row"
                  >
                    <Grid item xs={12}></Grid>
                    <Grid item xs={6}>
                      <RadioGroup
                        row
                        aria-label="enable"
                        name="enable"
                        value={taxBenefitRadioButton}
                        onChange={handleTaxBenefitChange}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Indian Donor"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="Foreign Donor"
                        />
                      </RadioGroup>
                      <TextField
                        margin="dense"
                        name="PAN"
                        label="PAN Number"
                        type="text"
                        fullWidth
                        value={PAN}
                        disabled={!TaxBenefitChange}
                        onChange={(e) => {
                          setPAN(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        margin="dense"
                        name="FCRA_matters"
                        label="80g / 501 (c)/ FCRA section"
                        type="text"
                        fullWidth
                        disabled={TaxBenefitChange}
                        value={FCRA_matters}
                        onChange={(e) => {
                          setFCRA(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
              )}

              {current === 4 && (
                <div className="tagInput">
                  {tags.map((item, index) => {
                    return (
                      <Button onClick={() => deleteTags(item)} key={index}>
                        {item}
                        <span>X</span>
                      </Button>
                    );
                  })}
                  <input
                    label="List of name"
                    type="text"
                    fullWidth
                    style={{
                      marginRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                  />
                  <Button onClick={addTags}>Add Name</Button>
                </div>
              )}

              {current === 5 && (
                <DialogContent>
                  <Grid
                    container
                    // justify="flex-start"
                    // alignItems="flex-end"
                    spacing={2}
                  >
                    <Grid item xs={6}>
                      <label htmlFor="name">Name</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={name}
                      />
                      <label htmlFor="name">Email</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={email}
                      />
                      <label htmlFor="name">Number Of Trees</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="No_of_Trees_Acres"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={No_of_Trees}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        name="No_of_Trees_Acres"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={No_of_Acres}
                      />
                      <label htmlFor="name">PAN</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="PAN"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={PAN}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <label htmlFor="name">Total Payment</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="Total_Payment_based_on_selection"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={Total_Payment_based_on_selection}
                      />
                      <label htmlFor="name">Grove</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="Grove"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={Grove}
                      />
                      <label htmlFor="name">Site Type</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="Site_Type"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={Site_Type}
                      />
                      <label htmlFor="name">FCRA</label>
                      <TextField
                        autoFocus
                        margin="dense"
                        name="FCRA_matters"
                        type="text"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        value={FCRA_matters}
                      />
                    </Grid>
                  </Grid>
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
                onClick={handleCancelButton}
              >
                Cancel
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
