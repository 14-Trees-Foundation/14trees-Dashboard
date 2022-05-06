import { useEffect, useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";

import { CustomBox } from "../../../../components/CustomBox";
import { selectedPlot } from "../../../../store/adminAtoms";
import * as Axios from "../../../../api/local";
import { TreeLogByPlotDate } from "../components/TreeLogByPlotDate";
import { TreeTypeCountByPlot } from "../components/TreeTypeCountByPlot";
import { Spinner } from "../../../../components/Spinner";
import Chip from "../../../../stories/Chip/Chip";

const columns = [
  {
    field: "sapling_id",
    headerName: "Sapling ID",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "tree_name",
    headerName: "Tree name",
    headerAlign: "center",
    width: 180,
    align: "center",
    editable: false,
  },
  {
    field: "date_added",
    headerName: "Date added",
    headerAlign: "center",
    width: 180,
    editable: false,
    align: "center",
    valueFormatter: (params) => {
      const valueFormatted = params.value.slice(0, 10);
      return `${valueFormatted}`;
    },
  },
  {
    field: "assigned_to",
    headerName: "Assigned To",
    headerAlign: "center",
    width: 200,
    editable: false,
    align: "center",
    renderCell: (params) => {
      if (params.value !== undefined) {
        return (
          <div
            style={{
              minHeight: "38px",
              paddingTop: "12px",
              lineHeight: "38px",
              width: "100%",
              padding: "0 12px",
              backgroundColor: "#6166B8",
              borderRadius: "2em",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {params.value}
          </div>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    field: "gifted_by",
    headerName: "Planted By",
    headerAlign: "center",
    width: 200,
    editable: false,
    align: "center",
    renderCell: (params) => {
      if (params.value !== undefined && params.value !== 'undefined') {
        return (
          <div
            style={{
              minHeight: "38px",
              paddingTop: "12px",
              lineHeight: "38px",
              width: "100%",
              padding: "0 12px",
              backgroundColor: "#F94F25",
              borderRadius: "2em",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {params.value}
          </div>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    field: "donated_by",
    headerName: "Donated By",
    headerAlign: "center",
    width: 180,
    editable: false,
    align: "center",
  },
  {
    field: "added_by",
    headerName: "Added By",
    headerAlign: "center",
    width: 180,
    editable: false,
    align: "center",
  },
];

export const Plotwise = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [treeList, setTreeList] = useState({});
  let selPlot = useRecoilValue(selectedPlot);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(
        `/trees/plot/list?plot_name=${selPlot}`
      );
      if (response.status === 200) {
        setTreeList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [selPlot, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Spinner text={"Fetching tree list"} />;
  } else {
    return (
      <Box sx={{ pt: 3, pb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <CustomBox>
              <TreeLogByPlotDate />
            </CustomBox>
          </Grid>
          <Grid item xs={6}>
            <CustomBox>
              <TreeTypeCountByPlot />
            </CustomBox>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                color: "#2D1B08",
                background: "linear-gradient(145deg, #9faca3, #bdccc2)",
                boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
                p: 2,
                borderRadius: 3,
                height: "100%",
                minHeight: "900px",
                "& .MuiButton-root": {
                  color: "#1f3625",
                  pr: 2,
                },
                "& .MuiDataGrid-toolbarContainer": {
                  p: 2,
                },
                "& .MuiDataGrid-root": {
                  height: "94%",
                },
              }}
            >
              <div style={{ display: "flex", padding: "16px 0" }}>
                <Chip
                  label={`Total - ${treeList.length}`}
                  size={"large"}
                  mode={"secondary"}
                  backgroundColor={theme.custom.color.secondary.red}
                />
                <Chip
                  label={`Assigned - ${
                    treeList.filter((val) => {
                      return val.assigned_to;
                    }).length
                  }`}
                  size={"large"}
                  mode={"secondary"}
                />
              </div>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row.sapling_id}
                rows={treeList}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                disableSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
};
