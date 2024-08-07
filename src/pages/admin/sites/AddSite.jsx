import React, { useState } from "react";
import StepForm from "../sites/components/StepForm";
const AddSite = ({ open, handleClose, createSite }) => {
  const initialValues = {
    name_english: "",
    name_marathi: "",
    owner: null,
    district: null,
    taluka: null,
    village: null,
    area_acres: 0,
    land_type: "",
    land_strata: "",
    length_km: 0,
    sampatiPatra: "",
    maintenance_type: "",
    consent_document_link: "",
    google_earth_link: "",
    account: "",
  };

  return (
    <>
      <StepForm
        open={open}
        handleClose={handleClose}
        useCase={"Add Site"}
        data={initialValues}
        submitFunction={createSite}
      />
    </>
  );
};

export default AddSite;
