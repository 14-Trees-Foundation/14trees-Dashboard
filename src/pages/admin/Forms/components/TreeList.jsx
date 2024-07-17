import { useEffect,useRef,useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Typography,
  Chip,
  Box,
} from "@mui/material";

import { Spinner } from "../../../../components/Spinner";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as treeActionCreators from "../../../../redux/actions/treeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";

export const TreeList = ({ onTreeSelect }) => {  
  const isFirstRender = useRef(true);
  const [page, setPage] = useState(0);
  const [plotName, setPlotName] = useState('');
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plotLoading, setPlotLoading] = useState(false);
  // const [assigned, setAssigned] = useState([]);
  // const [unassigned, setUnassigned] = useState([]);
  
  const dispatch = useAppDispatch();
  const { getPlots }
    = bindActionCreators(plotActionCreators, dispatch);
  const { getTrees }
      = bindActionCreators(treeActionCreators, dispatch);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (plotLoading) return;
    getPlotsData();
  }, [page, plotName]);

  const getPlotsData = async () => {
    setTimeout(async () => {
      let filters = [];
      if (plotName.length >= 3) {
        filters = [{ columnField: 'name', operatorValue: 'contains', value: plotName }]
      } 
      setPlotLoading(true);
      await getPlots(page * 10, 10, filters);
      setPlotLoading(false);
    }, 1000);
  };

  let plotsList = [];
  const plotsData = useAppSelector((state) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots);
    plotsList = plotsList.sort((a, b) => b.id - a.id)
  }

  let treesList = [];
  const treesData = useAppSelector((state) => state.treesData);
  if (treesData) {
    treesList = Object.values(treesData.trees);
  }

  let unMapped = treesList.filter((x) => (!x.mapped_to_user && !x.mapped_to_group)).sort(function (a, b) { return a.sapling_id - b.sapling_id; });
  let mapped = treesList.filter((x) => (x.mapped_to_user || x.mapped_to_group)).sort(function (a, b) { return a.sapling_id - b.sapling_id; });

  const fetchAndShowTreeList = async (value) => {
    setSelectedPlot(value);
    setTimeout(async () => {
      setLoading(true);
      await getTrees(0, -1, [ { columnField: "plot_id", value: value.id, operatorField: "equals" } ])
      setLoading(false);
    })
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
          <AutocompleteWithPagination 
            size="medium"
            loading={plotLoading}
            options={plotsList}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
                if (newValue !== null) fetchAndShowTreeList(newValue);
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
          <ToastContainer />
          <div style={{ paddingTop: "16px", paddingLeft: "8px" }}>
            Plot:{" "}
            <span style={{ color: "#C72542", fontStyle: "italic" }}>
              {selectedPlot?.name}
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
                    {mapped.length}
                  </span>
                </h4>
                <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                  Assigned:{" "}
                  <span style={{ color: "#C72542", fontStyle: "italic" }}>
                    {
                      mapped.filter((obj) => {
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
            {mapped.length !== 0 &&
              mapped.map((tree) => {
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
                  {unMapped.length}
                </span>
              </h4>
                <h4 style={{ marginTop: "0px", paddingRight: "8px" }}>
                  Assigned:{" "}
                  <span style={{ color: "#C72542", fontStyle: "italic" }}>
                    {
                      unMapped.filter((obj) => {
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
            {unMapped.length !== 0 &&
              unMapped.map((tree) => {
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
