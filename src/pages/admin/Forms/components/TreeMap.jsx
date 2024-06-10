import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    Paper,
    Typography,
    Autocomplete,
    TextField,
    Box,
} from "@mui/material";

import Axios from "../../../../api/local";
import { Spinner } from "../../../../components/Spinner";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";

function TreeMap( {selectedPlot, setSelectedPlot} ) {
    const [page, setPage] = useState(0);
    const [plotName, setPlotName] = useState('');
    const [loading, setLoading] = useState(false);
    const [assigned, setAssigned] = useState([]);
    const [unassigned, setUnassigned] = useState([]);

    const dispatch = useAppDispatch();
    const { getPlots }
        = bindActionCreators(plotActionCreators, dispatch);

    useEffect(() => {
        getPlotsData();
    }, [page, plotName]);

    const getPlotsData = async () => {
        setTimeout(async () => {
            await getPlots(page * 10, 10, plotName);
        }, 1000);
    };

    let plotsList = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
    }

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
        setSelectedPlot(value);
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
                        Select a plot
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
                        options={plotsList}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            if (newValue !== null) fetchAndShowTreeList(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setPage(0);
                                    setPlotName(value);
                                }} 
                                label="Select a plot"
                                variant="outlined"
                            />
                        )}
                        ListboxProps={{
                            onScroll: (event) => {
                                const listboxNode = event.target;
                                if (Math.ceil(listboxNode.scrollTop) + listboxNode.clientHeight === listboxNode.scrollHeight) {
                                  setPage(page + 1);
                                }
                              }
                        }}
                    />
                    <ToastContainer />

                    <div
                        style={{
                            width: "100%",
                            padding: "12px",
                            minHeight: "20%",
                            maxHeight: "180px",
                            overflowY: "auto",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'column' }}>
                            <div >
                                <h2>
                                    Plot:{" "}
                                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                                        {selectedPlot?.name}
                                    </span>
                                </h2>

                            </div>
                            <div style={{ display: 'flex' }}>
                                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                                    Total:{" "}
                                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                                        {assigned.length}
                                    </span>
                                </h2>
                                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
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
                                </h2>
                            </div>
                        </div>
                        <div></div>
                        {/* {assigned.length !== 0 &&
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
              })} */}
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
                    </div>
                </Box>
            </Box>
        );
    }
};

export default TreeMap;