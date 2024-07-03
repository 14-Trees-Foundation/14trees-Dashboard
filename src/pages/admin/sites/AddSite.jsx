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
    area: "",
    land_type: "",
    land_strata: "",
    length: "",
    sampatiPatra: "",
    maintenence_type: "",
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
