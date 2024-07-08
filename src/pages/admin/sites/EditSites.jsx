import React, { useState } from "react";
import StepForm from "../sites/components/StepForm";

function EditSites({ row, openeditModal, closeEditModal, editSubmit }) {
  const formData = row;

  const initialValues = {
    id: formData.id,
    name_english: formData.name_english,
    name_marathi: formData.name_marathi,
    owner: {
      value: formData.owner,
      label: formData.owner,
    },
    district: {
      value: formData.district,
      label: formData.district,
    },
    taluka: {
      value: formData.taluka,
      label: formData.taluka,
    },
    village: {
      value: formData.village,
      label: formData.village,
    },
    area_acres: formData.area_acres,
    land_type: formData.land_type,
    land_strata: formData.land_strata,
    length_km: formData.length_km,
    sampatiPatra: formData.consent_letter,
    maintenance_type: formData.maintenance_type,
    consent_document_link: formData.consent_document_link,
    google_earth_link: formData.google_earth_link,
    account: formData.account,
  };

  return (
    <StepForm
      open={openeditModal}
      handleClose={closeEditModal}
      useCase={"Edit Site"}
      data={initialValues}
      submitFunction={editSubmit}
    />
  );
}

export default EditSites;
