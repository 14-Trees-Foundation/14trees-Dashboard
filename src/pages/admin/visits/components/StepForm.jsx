import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  // Typography,
} from "@mui/material";
import { message, Steps, theme } from "antd";

const StepForm = ({ open, handleClose, useCase, data, submitFunction }) => {
  const [current, setCurrent] = useState(0);

  const nextStep = () => {
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
      title: "Time Details",
      content: "Last-content",
    },
  ];

  const items = StepFormSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const [visit_name, setVisit_Name] = useState(data.visit_name);
  const [visit_date, setVisit_Date] = useState(data.visit_date);

  const handleSubmit = () => {
    if (useCase === "Add Visit") {
      const newVisitData = {
        visit_name: visit_name,
        visit_date: visit_date,
      };

      try {
        const response = submitFunction(newVisitData);
      } catch (error) {
        console.log("Error : ", error.message);
      }
      setVisit_Name("");
      setVisit_Date("");

      handleClose();
      setCurrent(0);
    } else {
      const updatedVisitData = {
        id: data.id,
        visit_name: visit_name,
        visit_date: visit_date,
      };
      try {
        const response = submitFunction(updatedVisitData);
      } catch (error) {
        console.log("Error in updating: ", error.message);
      }

      console.log("Updated site Data : ", updatedVisitData);
      setVisit_Name("");
      setVisit_Date("");

      handleClose();
      setCurrent(0);
    }
  };

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
                    name="visit_name"
                    label="visit_name"
                    type="text"
                    fullWidth
                    value={visit_name}
                    onChange={(e) => {
                      setVisit_Name(e.target.value);
                    }}
                  />
                </>
              )}
              {current === 1 && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="visit_date"
                    label="Visit date"
                    type="Date"
                    fullWidth
                    value={visit_date}
                    onChange={(e) => {
                      setVisit_Date(e.target.value);
                    }}
                  />
                </>
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

export default StepForm;
