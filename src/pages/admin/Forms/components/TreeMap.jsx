import { useEffect, useState, useRef } from "react";
import {
    Typography,
    Box,
} from "@mui/material";

import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";

function TreeMap({ selectedPlot, setSelectedPlot }) {
    const isFirstRender = useRef(true);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [plotName, setPlotName] = useState('');

    const dispatch = useAppDispatch();
    const { getPlots }
        = bindActionCreators(plotActionCreators, dispatch);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (loading) return;
        getPlotsData();
    }, [page, plotName]);

    const getPlotsData = async () => {
        const nameFilter = { columnField: "name", value: plotName, operatorValue: "contains" }
        const filters = plotName.length >= 3 ? [] : [nameFilter]
        setTimeout(async () => {
            setLoading(true);
            await getPlots(page * 10, 10, filters);
            setLoading(false);
        }, 1000);
    };

    let plotsList = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
        plotsList = plotsList.sort((a, b) => b.id - a.id)
    }

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
                <AutocompleteWithPagination 
                    size="medium"
                    loading={loading}
                    options={plotsList}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                        if (newValue !== null) setSelectedPlot(newValue)
                    }}
                    onInputChange={(event) => {
                        const { value } = event.target;
                        setPage(0);
                        setPlotName(value);
                    }}
                    setPage={setPage}
                    fullWidth
                    label="Select a plot"
                    value={selectedPlot}
                />
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
                                    {selectedPlot?.total ?? 0}
                                </span>
                            </h2>
                            <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                                Mapped:{" "}
                                <span style={{ color: "#C72542", fontStyle: "italic" }}>
                                    {selectedPlot?.booked ?? 0}
                                </span>
                            </h2>
                            <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                                Assigned:{" "}
                                <span style={{ color: "#C72542", fontStyle: "italic" }}>
                                    {selectedPlot?.assigned ?? 0}
                                </span>
                            </h2>
                            <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                                Available:{" "}
                                <span style={{ color: "#C72542", fontStyle: "italic" }}>
                                    {selectedPlot?.available ?? 0}
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
};

export default TreeMap;