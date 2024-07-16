import React, { useState } from "react";
import StepForm from "../visits/components/StepForm";

function EditVisit({ row, openeditModal, closeEditModal, editSubmit }) {
  const formData = row;

  const initialValues = {
    id: formData.id,
    visit_name: formData.visit_name,
    visit_date: formData.visit_date,
   
  };

  return (
    <StepForm
      open={openeditModal}
      handleClose={closeEditModal}
      useCase={"Edit Visit"}
      data={initialValues}
      submitFunction={editSubmit}
    />
  );
}

export default EditVisit;
