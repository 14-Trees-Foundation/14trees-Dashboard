import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { allPonds } from "../../../../store/adminAtoms";
import Chip from "../../../../stories/Chip/Chip";

function getCapacity(params) {
  return (
    parseInt(params.row.depthFt) *
    parseInt(params.row.widthFt) *
    parseInt(params.row.lengthFt)
  );
}

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    valueGetter: (params) => params.row.name,
  },
  {
    field: "storage",
    headerName: "Pond capacity (cu ft)",
    width: 180,
    editable: false,
    valueGetter: getCapacity,
  },
  {
    field: "type",
    headerName: "Type of Pond",
    width: 150,
    editable: false,
    valueGetter: (params) => params.row.type,
  },
];

export const PondsList = () => {
  const ponds = useRecoilValue(allPonds);
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          height: "100%",
          minHeight: "600px",
          background: "linear-gradient(145deg, #9faca3, #bdccc2)",
          p: 2,
          borderRadius: 3,
          boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
          "& .MuiButton-root": {
            color: "#1f3625",
            pr: 2,
          },
          "& .MuiDataGrid-toolbarContainer": {
            p: 2,
          },
          "& .MuiDataGrid-root": {
            height: "calc(100% - 55px)",
          },
        }}
      >
        <div style={{ display: "flex", padding: "16px 0" }}>
          <Chip
            label={`Total - ${ponds.length}`}
            size={"large"}
            mode={"secondary"}
            backgroundColor={theme.custom.color.secondary.red}
          />
        </div>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
          rows={ponds}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[50]}
          disableSelectionOnClick
        />
      </Box>
    </>
  );
};
