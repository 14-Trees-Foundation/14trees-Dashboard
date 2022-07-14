import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "../../../../components/Spinner";
import Axios from "../../../../api/local";

const intitialFValues = {
    name: "",
    id: "",
    loading: false,
    backdropOpen: false,
};

export const AddTreeType = () => {
    const [values, setValues] = useState(intitialFValues);

    const formSubmit = async () => {
        console.log("here")
        setValues({
          ...values,
          loading: true,
          backdropOpen: true,
        });
        const params = JSON.stringify({
          name: values.name,
          tree_id: values.id,
        });
    
        try {
          let res = await Axios.post("/trees/addtreetype", params, {
            headers: {
              "Content-type": "application/json",
            },
          });
    
          console.log(res.status)
          if (res.status === 201) {
            setValues({
              ...values,
              loading: false,
            });
            toast.success("Data uploaded successfully!");
          } else if (
            res.status === 204 ||
            res.status === 400 ||
            res.status === 409 ||
            res.status === 404
          ) {
            setValues({
              ...values,
              loading: false,
              backdropOpen: false,
            });
            toast.error(res.status.error);
          }
        } catch (error) {
          if (
            error.response.status === 409 ||
            error.response.status === 404 ||
            error.response.status === 400 ||
            error.response.status === 500
          ) {
            setValues({
              ...values,
              loading: false,
              backdropOpen: false,
            });
            toast.error(error.response.data.error);
          }
        }
      };

    if (values.loading) {
        return <Spinner />;
    } else {
        return (
            <Box
                sx={{
                color: "#2D1B08",
                ml: "auto",
                mr: "auto",
                mt: 4,
                width: "800px",
                minHeight: "400px",
                background: "linear-gradient(145deg, #9faca3, #bdccc2)",
                p: 2,
                borderRadius: 3,
                boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
                "& .MuiFormControl-root": {
                    width: "100%",
                },
                }}
            >
            <ToastContainer />
            <Box
              sx={{
                bottom: 0,
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ p: 2, pl: 0 }}>
                Add tree type
              </Typography>
                <TextField
                    sx={{mb:2}}
                    label="Tree Type ID*"
                    name="id"
                    onChange={(e) => setValues({
                        ...values,
                        id: e.target.value
                      })}
                />
                <TextField
                    label="Tree Type Name"
                    name="name"
                    sx={{mb:2}}
                    onChange={(e) => setValues({
                        ...values,
                        name: e.target.value
                      })}
                />
                <Button
                    sx={{ m: 2 }}
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={formSubmit}
                >
                    Submit
                </Button>
            </Box>
          </Box>
        );
      }
}