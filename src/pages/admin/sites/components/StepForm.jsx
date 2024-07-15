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
  // Typography,
  Autocomplete,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { message, Steps, theme } from "antd";
import {
  ownerOptions,
  LandTypeOptions,
  LandStrataOptions,
  SampatiPatraOptions,
  DistrictOptions,
  TalukaOptions,
  BudhanaOptions,
  JalgaonOptions,
  PuneOptions,
  SambhajinagarOptions,
  BudhanaDTOptions,
  BudhanaKhamgaonOptions,
  BudhanaMalkapurOptions,
  BudhanaMotalaOptions,
  BudhanaNanduraOptions,
  JalgaonJamnerOptions,
  PuneAmbegaonOptions,
  PuneIndapurOptions,
  PuneKhedOptions,
  SambhajiNagarOptions,
} from "../utils/Form_Data";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import TagSelector from "../../../../components/TagSelector";

const StepForm = ({ open, handleClose, useCase, data, submitFunction }) => {
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

  const StepFormSteps = [
    {
      title: "Primary Details",
      content: "First-content",
    },
    {
      title: "Land Details",
      content: "Second-content",
    },
    {
      title: "Location Info",
      content: "Third-content",
    },
    {
      title: "Contour Details",
      content: "Fourth-content",
    },
    {
      title: "Misc Details",
      content: "Last-content",
    },
  ];

  const items = StepFormSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const [name_english, setName_English] = useState(data.name_english);
  const [name_marathi, setName_Marathi] = useState(data.name_marathi);
  const [owner, setOwner] = useState(data.owner);

  const [district, setDistrict] = useState(data.district);
  const [districtFlag, setFlag] = useState(data.district?.value);

  const [taluka, setTaluka] = useState(data.taluka);
  const [talukaFlag, setTalukaFlag] = useState(data.taluka?.value);

  const [village, setVillage] = useState(data.village);
  const [area, setArea] = useState(data.area_acres);
  const [land_type, setLand_Type] = useState(data.land_type);
  const [land_strata, setLand_Strata] = useState(data.land_strata);
  const [length, setLength] = useState(data.length_km);
  const [sampatiPatra, setSampatiPatra] = useState(data.sampatiPatra);
  const [maintenance_type, setMaintenanceType] = useState(
    data.maintenance_type
  );
  const [consent_document_link, setConsentDocumentLink] = useState(
    data.consent_document_link
  );
  const [google_earth_link, setGoogleEarthLink] = useState(
    data.google_earth_link ? data.google_earth_link : []
  );
  const [account, setAccount] = useState(data.account);
  const [tags, setTags] = useState(data.tags ? data.tags : []);

  const [files, setFiles] = useState([{}]);

  const maintenance_type_options = [
    { value: "1", label: "FULL_MAINTENANCE" },
    { value: "2", label: "PLANTATION_ONLY" },
    { value: "3", label: "DISTRIBUTION_ONLY" },
  ];

  const handleOwnerChange = (e, value) => {
    console.log("owner change value for backend : ", value);
    setOwner(value);
  };

  const handleDistrictChange = (e, value) => {
    setDistrict(value);
    console.log("data of district flag", value.value);
    setFlag(value.value);
  };

  const handleTalukaChange = (e, value) => {
    setTaluka(value);
    setTalukaFlag(value.label);
  };

  const handleVillageChange = (e, value) => {
    setVillage(value);
  };

  const handleLandTypeChange = (e) => {
    setLand_Type(e.target.value);
    console.log("land_type: ", land_type);
    // setLandTypeFlag(land_type);
    //console.log("land type flag: ", landtypeflag);
  };

  const handleSubmit = () => {
    if (useCase === "Add Site") {
      const newSiteData = {
        name_marathi: name_marathi,
        name_english: name_english,
        owner: owner.value,
        taluka: taluka.value,
        district: district.value,
        land_type: land_type,
        land_strata: land_strata,
        village: village.value,
        area_acres: area,
        length_km: length,
        consent_letter: sampatiPatra,
        maintenance_type: maintenance_type,
        consent_document_link: consent_document_link,
        google_earth_link: google_earth_link,
        account: account,
        tags: tags,
      };
      console.log(
        "maintenace type value on submit : ",
        maintenance_type,
        "consent letter value on submit: ",
        sampatiPatra
      );

      try {
        const response = submitFunction(newSiteData);

        console.log("New site Data : ", response);
      } catch (error) {
        console.log("Error : ", error.message);
      }
      setName_English("");
      setName_Marathi("");
      setOwner(null);
      setDistrict(null);
      setTaluka(null);
      setVillage(null);
      setArea("");
      setLand_Type("");
      setLand_Strata("");
      setLength("");
      setSampatiPatra("");
      setMaintenanceType("");
      setConsentDocumentLink("");
      setGoogleEarthLink([]);
      setAccount("");
      setTags([]);

      handleClose();
      setCurrent(0);
    } else {
      const updatedSiteData = {
        id: data.id,
        name_marathi: name_marathi,
        name_english: name_english,
        owner: owner.value,
        taluka: taluka.value,
        district: district.value,
        land_type: land_type,
        land_strata: land_strata,
        village: village.value,
        area: area,
        length: length,
        consent_letter: sampatiPatra,
        maintenance_type: maintenance_type,
        consent_document_link: consent_document_link,
        google_earth_link: google_earth_link,
        account: account,
        tags: tags,
      };
      try {
        const response = submitFunction(updatedSiteData, files);
        console.log("response from backend: ", response);
      } catch (error) {
        console.log("Error in updating: ", error.message);
      }

      console.log("Updated site Data : ", updatedSiteData);
      setName_English("");
      setName_Marathi("");
      setOwner("");
      setDistrict("");
      setTaluka("");
      setVillage("");
      setArea("");
      setLand_Type("");
      setLand_Strata("");
      setLength("");
      setSampatiPatra("");
      setMaintenanceType("");
      setConsentDocumentLink("");
      setGoogleEarthLink([]);
      setAccount("");
      setTags([]);

      handleClose();
      setCurrent(0);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".kml",
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) => {
      // toast.error("Only 10 images allowed!");
    },
  });

  const classes = useStyles();
  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle align="center">{useCase}</DialogTitle>{" "}
          {/*useCase will tell if it is Add or Edit */}
          <Steps current={current} items={items} style={{ padding: "40px" }} />
          <form style={{ padding: "40px" }}>
            <DialogContent>
              {current === 0 && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="name_marathi"
                    label="Name (Marathi)"
                    type="text"
                    fullWidth
                    value={name_marathi}
                    onChange={(e) => {
                      setName_Marathi(e.target.value);
                    }}
                  />
                  <TextField
                    margin="dense"
                    name="name_english"
                    label="Name (English)"
                    type="text"
                    fullWidth
                    value={name_english}
                    onChange={(e) => {
                      setName_English(e.target.value);
                    }}
                  />
                  <Autocomplete
                    options={ownerOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    value={owner}
                    onChange={handleOwnerChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        name="owner"
                        label="Owner Type"
                        type="text"
                        fullWidth
                      />
                    )}
                  />

                  <TextField
                    select
                    margin="dense"
                    name="maintenance_type"
                    label="Service Type"
                    type="text"
                    fullWidth
                    value={maintenance_type}
                    onChange={(e) => {
                      setMaintenanceType(e.target.value);
                      console.log("Maintenance type value: ", e.target.value);
                      console.log(
                        "Maintenance type varaible: ",
                        maintenance_type
                      );
                    }}
                  >
                    {maintenance_type_options.map((item) => (
                      <MenuItem key={item.value} value={item.label}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}

              {current === 1 && (
                <DialogContent>
                  <TextField
                    select
                    margin="dense"
                    name="land_type"
                    label="Land Type"
                    type="text"
                    fullWidth
                    value={land_type}
                    onChange={handleLandTypeChange}
                  >
                    {LandTypeOptions.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    margin="dense"
                    name="land_strata"
                    label="Land Strata"
                    type="text"
                    fullWidth
                    value={land_strata}
                    onChange={(e) => {
                      setLand_Strata(e.target.value);
                    }}
                  >
                    {LandStrataOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {land_type != "" && !land_type.includes("Roadside") && (
                    <TextField
                      margin="dense"
                      name="area_acres"
                      label="Area (Acres)"
                      type="number"
                      fullWidth
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                      }}
                    />
                  )}

                  {land_type.includes("Roadside") && (
                    <TextField
                      margin="dense"
                      name="length_km"
                      label="Length (Km)"
                      type="number"
                      fullWidth
                      value={length}
                      onChange={(e) => {
                        setLength(e.target.value);
                      }}
                    />
                  )}
                </DialogContent>
              )}

              {current === 2 && (
                <DialogContent>
                  <Autocomplete
                    options={DistrictOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    value={district}
                    onChange={handleDistrictChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        name="district"
                        label="District"
                        type="text"
                        fullWidth
                      />
                    )}
                  />
                  {districtFlag === "" && (
                    <TextField
                      select
                      margin="dense"
                      name="taluka"
                      label="Taluka"
                      type="text"
                      fullWidth
                      value={taluka}
                      onChange={handleTalukaChange}
                      disabled={districtFlag === ""}
                    />
                  )}
                  {districtFlag == "Buldhana (बुलढाणा)" && (
                    <Autocomplete
                      options={BudhanaOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={taluka}
                      onChange={handleTalukaChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          name="taluka"
                          label="Taluka"
                          type="text"
                          fullWidth
                        />
                      )}
                    />
                  )}{" "}
                  {districtFlag == "Pune (पुणे)" && (
                    <Autocomplete
                      options={PuneOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={taluka}
                      onChange={handleTalukaChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          name="taluka"
                          label="Taluka"
                          type="text"
                          fullWidth
                        />
                      )}
                    />
                  )}{" "}
                  {districtFlag == "Sambhajinagar (संभाजीनगर)" && (
                    <Autocomplete
                      options={SambhajinagarOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={taluka}
                      onChange={handleTalukaChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          name="taluka"
                          label="Taluka"
                          type="text"
                          fullWidth
                        />
                      )}
                    />
                  )}{" "}
                  {districtFlag == "Jalgaon (जळगाव)" && (
                    <Autocomplete
                      options={JalgaonOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={taluka}
                      onChange={handleTalukaChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          name="taluka"
                          label="Taluka"
                          type="text"
                          fullWidth
                        />
                      )}
                    />
                  )}
                  {talukaFlag == "" && (
                    <TextField
                      select
                      margin="dense"
                      name="village"
                      label="Village"
                      type="text"
                      fullWidth
                      value={village}
                      onChange={handleVillageChange}
                      disabled={talukaFlag === ""}
                    ></TextField>
                  )}
                  {districtFlag === "Buldhana (बुलढाणा)" &&
                    talukaFlag === "Buldhana (बुलढाणा)" && (
                      <Autocomplete
                        options={BudhanaDTOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Buldhana (बुलढाणा)" &&
                    talukaFlag === "Khamgaon (खामगाव)" && (
                      <Autocomplete
                        options={BudhanaKhamgaonOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Buldhana (बुलढाणा)" &&
                    talukaFlag === "Malkapur (मलकापूर)" && (
                      <Autocomplete
                        options={BudhanaMalkapurOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Buldhana (बुलढाणा)" &&
                    talukaFlag === "Motala (मोताळा)" && (
                      <Autocomplete
                        options={BudhanaMotalaOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Buldhana (बुलढाणा)" &&
                    talukaFlag === "Nandura (नांदुरा)" && (
                      <Autocomplete
                        options={BudhanaNanduraOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Jalgaon (जळगाव)" &&
                    talukaFlag === "Jamner (जामनेर)" && (
                      <Autocomplete
                        options={JalgaonJamnerOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Pune (पुणे)" &&
                    talukaFlag === "Ambegaon (आंबेगाव)" && (
                      <Autocomplete
                        options={PuneAmbegaonOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Pune (पुणे)" &&
                    talukaFlag === "Indapur (इंदापूर)" && (
                      <Autocomplete
                        options={PuneIndapurOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Pune (पुणे)" &&
                    talukaFlag === "Khed (खेड)" && (
                      <Autocomplete
                        options={PuneKhedOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  {districtFlag === "Sambhajinagar (संभाजीनगर)" &&
                    talukaFlag === "Soegaon" && (
                      <Autocomplete
                        options={SambhajiNagarOptions}
                        getOptionLabel={(option) => option.label}
                        value={village}
                        onChange={handleVillageChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="dense"
                            name="village"
                            label="Village"
                            type="text"
                            fullWidth
                          />
                        )}
                      />
                    )}
                </DialogContent>
              )}

              {current === 3 && useCase === "Edit Site" && (
                <DialogContent>
                  <div className={classes.imgdiv}>
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p style={{ cursor: "pointer" }}>
                          Upload KML files. Click or Drag!
                        </p>
                      </div>
                    </section>
                  </div>
                </DialogContent>
              )}

              {current === 4 && (
                <DialogContent>
                  <TextField
                    select
                    margin="dense"
                    name="sampatiPatra"
                    label="Consent Letter Type"
                    type="text"
                    fullWidth
                    value={sampatiPatra}
                    onChange={(e) => {
                      setSampatiPatra(e.target.value);
                      console.log("sampati pater value: ", e.target.value);
                    }}
                  >
                    {SampatiPatraOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    margin="dense"
                    name="consent_document_link"
                    label="Consent Document Link"
                    type="url"
                    fullWidth
                    value={consent_document_link}
                    onChange={(e) => {
                      setConsentDocumentLink(e.target.value);
                    }}
                  />

                  <TextField
                    margin="dense"
                    name="account"
                    label="Account"
                    type="text"
                    fullWidth
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value);
                    }}
                  />

                  <TagSelector
                    value={tags}
                    handleChange={(tags) => setTags(tags)}
                  />
                </DialogContent>
              )}

              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "15px",
                }}
              ></DialogActions>
            </DialogContent>
          </form>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {current <= StepFormSteps.length - 1 && (
              <Button
                variant="contained"
                type="primary"
                color="primary"
                style={{ margin: "0 8px 20px 8px" }}
                onClick={() => {
                  handleClose();
                  setCurrent(0);
                }}
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
            {current < StepFormSteps.length - 1 && (
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

            {current === StepFormSteps.length - 1 && (
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
export default StepForm;
