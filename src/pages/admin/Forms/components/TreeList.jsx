import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import {
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Box,
} from "@mui/material";

import Axios from "../../../../api/local";
import { Spinner } from "../../../../components/Spinner";
import { plotsList } from "../../../../store/adminAtoms";

export const TreeList = ({ onTreeSelect }) => {
  const plots = useRecoilValue(plotsList);
  const [selectedPlot, setSelectedPlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);

  const CustomPaper = (props) => {
    return (
      <Paper
        style={{
          borderRadius: "20px",
          boxShadow: "4px 4px 6px #98a49c, -4px -4px 6px #cadace",
          background: "#b1bfb5",
        }}
        {...props}
      />
    );
  };

  const fetchAndShowTreeList = async (value) => {
    setSelectedPlot(value.name);
    setLoading(true);
    try {
      let response = await Axios.get(`/trees/plot/count?id=${value._id}`);
      if (response.status === 200) {
        let unMapped = response.data.trees
          .filter((x) => !x.mapped_to)
          .sort(function (a, b) {
            return a.sapling_id - b.sapling_id;
          });
        let mapped = response.data.trees
          .filter((x) => x.mapped_to)
          .sort(function (a, b) {
            return a.sapling_id - b.sapling_id;
          });
        setAssigned(mapped);
        setUnassigned(unMapped);
        toast.success("Tree list fetched!");
      }
    } catch (error) {
      toast.error("Error fetching tree list!");
    }
    setLoading(false);
  };

  if (loading) {
    return <Spinner text={"Fetching Tree Data!"} />;
  } else {
    return (
      <Box
        sx={{
          color: "#2D1B08",
          ml: "auto",
          mr: "auto",
          mt: 4,
          width: "90%",
          minHeight: "700px",
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
          <Typography variant="body1" gutterBottom sx={{ p: 0 }}>
            Step - 1
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ pb: 2 }}>
            Select Plot and Select tree from UnAssigned Trees
          </Typography>
          <Autocomplete
            sx={{
              mt: 1,
              width: "75%",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
                borderRadius: "25px",
                boxShadow: "4px 4px 8px #98a49c, -4px -4px 8px #cadace",
              },
            }}
            PaperComponent={CustomPaper}
            id="plots"
            options={plots}
            autoHighlight
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              fetchAndShowTreeList(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select plot to fetch tree list"
                variant="outlined"
              />
            )}
          />
          <ToastContainer />
          <div style={{ paddingTop: "16px", paddingLeft: "8px" }}>
            Plot:{" "}
            <span style={{ color: "#C72542", fontStyle: "italic" }}>
              {selectedPlot}
            </span>
          </div>
          <div style={{ paddingTop: "4px", paddingLeft: "8px" }}>
            <span style={{ color: "#C72542", fontStyle: "italic" }}>
              Highlighted trees are assigned!
            </span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "12px",
              minHeight: "20%",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ marginTop: "0px", paddingLeft: "8px" }}>
                Mapped Trees
              </h4>
              <div style={{display:'flex'}}>
                <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                  Total:{" "}
                  <span style={{ color: "#C72542", fontStyle: "italic" }}>
                    {assigned.length}
                  </span>
                </h4>
                <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                  Assigned:{" "}
                  <span style={{ color: "#C72542", fontStyle: "italic" }}>
                    {
                      assigned.filter((obj) => {
                        if (obj.assigned_to) {
                          return true;
                        }

                        return false;
                      }).length
                    }
                  </span>
                </h4>
              </div>
            </div>
            <div></div>
            {assigned.length !== 0 &&
              assigned.map((tree) => {
                return (
                  <Chip
                    key={tree.sapling_id}
                    label={tree.sapling_id}
                    style={{
                      color: tree.assigned_to ? "#fff" : "#3C79BC",
                      marginRight: "12px",
                      marginBottom: "12px",
                      borderRadius: "16px",
                      boxShadow: "2px 2px 8px #737c76, -2px -2px 8px #effff4",
                      background: tree.assigned_to ? "#1f3625" : "#b1bfb5",
                    }}
                    onClick={() =>
                      window.open(
                        "http://dashboard.14trees.org/profile/" +
                          tree.sapling_id,
                        "_blank"
                      )
                    }
                  />
                );
              })}
          </div>
          <div
            style={{
              width: "100%",
              padding: "12px",
              minHeight: "40%",
              maxHeight: "280px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ marginTop: "0px", paddingLeft: "8px" }}>
                UnMapped Trees
              </h4>
              <div style={{display:'flex'}}>
              <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                Total:{" "}
                <span style={{ color: "#C72542", fontStyle: "italic" }}>
                  {unassigned.length}
                </span>
              </h4>
                <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                  Assigned:{" "}
                  <span style={{ color: "#C72542", fontStyle: "italic" }}>
                    {
                      unassigned.filter((obj) => {
                        if (obj.assigned_to) {
                          return true;
                        }

                        return false;
                      }).length
                    }
                  </span>
                </h4>
              </div>
            </div>
            {unassigned.length !== 0 &&
              unassigned.map((tree) => {
                return (
                  <Chip
                    key={tree.spaling_id}
                    label={tree.sapling_id}
                    style={{
                      color: tree.assigned_to ? "#fff" : "#1f3625",
                      marginRight: "12px",
                      marginBottom: "12px",
                      borderRadius: "16px",
                      boxShadow: "2px 2px 8px #737c76, -2px -2px 8px #effff4",
                      background: tree.assigned_to ? "#1f3625" : "#b1bfb5",
                    }}
                    onClick={
                      tree.assigned_to
                        ? () =>
                            window.open(
                              "http://dashboard.14trees.org/profile/" +
                                tree.sapling_id,
                              "_blank"
                            )
                        : () => onTreeSelect(tree.sapling_id)
                    }
                  />
                );
              })}
          </div>
        </Box>
      </Box>
    );
  }
};
