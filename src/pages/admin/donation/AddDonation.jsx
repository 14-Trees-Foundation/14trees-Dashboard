import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import "./Donation";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { Steps, Table } from "antd";
import PaymentQR14tree from "../../../assets/PaymentQR14tree.jpg";
import { UserForm } from "./components/UserForm";
import { BulkUserForm } from "./components/UserBulkForm";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from "../../../redux/actions/userActions";

function equallyDistributeTrees(totalTrees, users) {
  const usersCount = users.length;
  if (usersCount === 0) return [];

  const baseCount = Math.floor(totalTrees / usersCount);
  const remainder = totalTrees % usersCount;

  let newUsers = users.map((user, idx) => ({ ...user, gifted_trees: baseCount + (remainder > idx ? 1 : 0) }));

  return newUsers;
}

const AddDonation = ({ open, handleClose, createDonation }) => {
  const dispatch = useAppDispatch();
  const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

  const usersData = useAppSelector((state) => state.searchUsersData);
  let usersList = [];
  if (usersData) {
    usersList = Object.values(usersData.users);
  }

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
    setPhone("");
    setNo_of_Trees(0);
    setNo_of_Acres(0);
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

    setTag("");
    setUsers([]);

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

  const [userAddOption, setUserAddOption] = useState('single');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [No_of_Trees, setNo_of_Trees] = useState(0);
  const [No_of_Acres, setNo_of_Acres] = useState(0);
  const [Grove, setGrove] = useState("");
  const [Site_Type, setSite_Type] = useState("");
  const [tag, setTag] = useState("");

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
  const [phoneError, setPhoneError] = useState(false);
  const [numOfTreeError, setNumOfTreeError] = useState("");

  const [isTextFieldEnabled, setIsTextFieldEnabled] = useState(true);
  const [TaxBenefitChange, setTaxBenefit] = useState(true);

  const [tagValue, setTagValue] = useState("");
  const [tags, setTags] = useState([]);
  const [tree_acre_radio_button, setRadioButton] = useState("yes");
  const [taxBenefitRadioButton, settaxBenefitRadioButton] = useState("yes");
  const [users, setUsers] = useState([]);

  const SiteTypeOptions = [
    { value: "1", label: "Public" },
    { value: "2 ", label: "Foundation" },
  ];

  const GroveType = {
    "Public": [
      { value: "1.5K-Visitors", label: "Visitor's grove" },
      { value: "1.5K-Memorial-Trees", label: "Memorial grove" },
      { value: "1.5K-Alumni-Grove", label: "School/College alumni grove" },
      { value: "1.5K-Corporate-Gift", label: "Corporate grove" },
      { value: "1.5K-Conference-Gift", label: "Conference grove" },
    ],
    "Foundation": [
      { value: "3K-Visitors", label: "Visitor's grove" },
      { value: "3K-Family-Grove", label: "Family grove" },
      { value: "3K-Memorial-Grove", label: "Memorial grove" },
      { value: "3K-IIT-Alumni-Grove", label: "School/College alumni grove" },
      { value: "3K-Corporate-Gift", label: "Corporate grove" },
      { value: "3K-Conference-Gift", label: "Conference grove" },
    ]
  }

  const GroveTypeOptions = [
    { value: "1", label: "Visitor's grove" },
    { value: "2", label: "Family grove" },
    { value: "3", label: "Memorial grove" },
    { value: "4", label: "Social/professional group grove" },
    { value: "5", label: "School/College alumni grove" },
    { value: "6", label: "Corporate grove" },
    { value: "7", label: "Conference grove" },
  ];

  const checkDisabled = () => {
    if (current === 0) {
      return (nameError || emailError || phoneError || name === '' || email === '' || phone === '')
    } else if (current === 1) {
      return (numOfTreeError || No_of_Trees === 0 || Grove === '' || Site_Type === '')
    } else if (current === 4) {
      return users.length === 0
    }

    return false
  }

  const handleSubmit = () => {
    const newDonation = {
      name: name,
      email: email,
      phone: phone,
      no_of_trees: No_of_Trees,
      no_of_acres: No_of_Acres,
      grove: Grove,
      land_type: Site_Type,
      QRCode: QRCode,
      total_payment_based_on_selection: Total_Payment_based_on_selection,
      contribution_dropdown_screenshot: Contribution_dropdown_Screenshot,
      pan: PAN,
      FCRA_matters: FCRA_matters,
      list_of_people_names: List_of_people_names,
      summary: Summary,
      comments: Comments,
      tag: tag,
      users: users,
    };

    createDonation(newDonation);
    console.log("New Donation Data : ", newDonation);

    handleCancelButton();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.validity.valid) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  const handleEmailChange = (event, value) => {
    let isSet = false;
    usersList.forEach((user) => {
      if (`${user.name} (${user.email})` === value) {
        isSet = true;
        setName(user.name);
        setPhone(user.phone);
        setEmail(user.email);
        setEmailError(false);
        setNameError(false);
        setPhoneError(false);
      }
    });

    if (!isSet && email !== value && value !== ` ()`) {
      setEmail(value);
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(!emailPattern.test(value));

      if (value.length >= 3) searchUsers(value);
    }
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setPhone(value);

    const phonePattern = /^\d{10}$/;
    setPhoneError(!phonePattern.test(value))
  };

  const handleNumOfTree = (e) => {
    const value = e.target.value;

    // Basic validation: check if the value is a valid number
    if (value !== "" && isNaN(parseInt(value))) {
      setNumOfTreeError("Please enter a valid number");
    } else if (parseInt(value) === 0) {
      setNumOfTreeError("Please enter a number greater than 0");
    } else {
      setNo_of_Trees(parseInt(value));
      setNumOfTreeError("");
    }
  };

  useEffect(() => {
    if (Site_Type !== '') {
      const multiplier = Site_Type === 'Public' ? 1500 : 3000;
      setTotal_Payment(No_of_Trees * multiplier);
    }
  }, [Site_Type, No_of_Trees]);

  useEffect(() => {
    let tag = '';
    GroveType[Site_Type]?.forEach((option) => {
      if (option.label === Grove) {
        tag = option.value;
      }
    })
    if (tag === '') setGrove('');
    else setTag(tag)
  }, [Site_Type, Grove]);

  const handleGroveType = (e) => {
    setGrove(e.target.value);
  };

  const handleSiteType = (e) => {
    setSite_Type(e.target.value);
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

  const handleRemoveUser = (email) => {
    const idx = users.find((user) => user.email === email);
    if (idx) {
      setUsers(equallyDistributeTrees(No_of_Trees, users.filter((user) => user.email !== email)));
    }
  }

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "gifted_trees",
      key: "gifted_trees",
      title: "Gifted Trees",
      width: 100,
      align: "center",
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 150,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => {
              handleRemoveUser(record.email)
            }}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

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
                    required
                    margin="dense"
                    name="phone"
                    label="Contact No."
                    type="text"
                    fullWidth
                    value={phone}
                    error={phoneError}
                    helperText={
                      phoneError
                        ? "Please enter valid phone number"
                        : ""
                    }
                    inputProps={{
                      pattern: "[0-9]+",
                    }}
                    onChange={handlePhoneChange}
                  />
                  <Autocomplete
                    fullWidth
                    options={usersList.map((user) => `${user.name} (${user.email})`)}
                    onInputChange={handleEmailChange}
                    value={email}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Email"
                        variant="outlined"
                        name="email"
                        margin="dense"
                        error={emailError}
                        helperText={
                          emailError ? "Please enter valid email id " : ""
                        }
                      />
                    )}
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
                          disabled
                          label="Acres"
                        />
                      </RadioGroup>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
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
                  <TextField
                    select
                    margin="dense"
                    name="Grove"
                    label="Grove Type"
                    type="text"
                    fullWidth
                    value={Grove}
                    disabled={Site_Type === ''}
                    onChange={handleGroveType}
                  >
                    {GroveType[Site_Type]?.map((item) => (
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

                <div
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Grid
                    container
                    style={{ marginRight: '20px', height: 300 }}
                  >
                    <Grid item xs={12}>
                      <RadioGroup
                        row
                        aria-label="enable"
                        name="enable"
                        value={userAddOption}
                        onChange={(e) => { setUserAddOption(e.target.value) }}
                      >
                        <FormControlLabel
                          value="single"
                          control={<Radio />}
                          label="Manually"
                        />
                        <FormControlLabel
                          value="bulk"
                          control={<Radio />}
                          label="CSV Upload"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12}>
                      {userAddOption === 'single' && (
                        <UserForm onSubmit={(user) => { setUsers(prev => equallyDistributeTrees(No_of_Trees, [...prev, user])) }} />
                      )}

                      {userAddOption === 'bulk' && (
                        <BulkUserForm onSubmit={users => { setUsers(equallyDistributeTrees(No_of_Trees, users)) }} />
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    style={{ marginLeft: '20px', height: 450 }}
                  >
                    <Table
                      style={{ height: 300 }}
                      columns={columns}
                      dataSource={users}
                      pagination={{ pageSize: 5 }}
                    />
                  </Grid>
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
                variant="outlined"
                color="error"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={handleCancelButton}
              >
                Cancel
              </Button>
            )}
            {current > 0 && (
              <Button
                variant="outlined"
                color='primary'
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => prevStep()}
              >
                Previous
              </Button>
            )}

            {current < add_donation_steps.length - 1 && (
              <Button
                variant="contained"
                color="success"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => nextStep()}
                disabled={checkDisabled()}
              >
                Next
              </Button>
            )}

            {current === add_donation_steps.length - 1 && (
              <Button
                variant="contained"
                color="success"
                type="submit"
                style={{ margin: "0 8px 20px 8px" }}
                disabled={checkDisabled()}
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
