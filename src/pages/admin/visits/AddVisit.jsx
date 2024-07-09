import React, { useState } from "react";
import StepForm from "../sites/components/StepForm";
const AddVisit = ({ open, handleClose, createVisit }) => {
  const initialValues = {
    visit_name: "",
    visit_date: "",
  };

  return (
    <>
      <StepForm
        open={open}
        handleClose={handleClose}
        useCase={"Add Visit"}
        data={initialValues}
        submitFunction={createVisit}
      />
    </>
  );
};

export default AddVisit;
