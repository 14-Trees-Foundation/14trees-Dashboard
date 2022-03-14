import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

import { allUserProfile } from "../../../../store/adminAtoms";
import Chip from "../../../../stories/Chip/Chip";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    valueGetter: (params) => params.row.user.name,
  },
  {
    field: "tree_name",
    headerName: "Tree name",
    width: 180,
    editable: false,
    valueGetter: (params) => params.row.treetype.name,
  },
  {
    field: "sapling_id",
    headerName: "Sapling ID",
    width: 150,
    editable: false,
    valueGetter: (params) => params.row.tree.sapling_id,
  },
  {
    field: "date_added",
    headerName: "Date added",
    width: 250,
    valueFormatter: (params) => {
      const valueFormatted =
        params.value !== undefined ? params.value.slice(0, 10) : "";
      return `${valueFormatted}`;
    },
  },
  {
    field: "plot",
    headerName: "Plot name",
    width: 250,
    editable: false,
    valueGetter: (params) => params.row.plot.name,
  },
];

export const Userlist = () => {
  const userProfiles = useRecoilValue(allUserProfile);

  let uniqueUsers = [
    ...new Map(
      userProfiles.map((profiles) => [profiles.user.userid, profiles])
    ).values(),
  ];
  const theme = useTheme();
  return (
    <div style={{ height: "980px", maxHeight: "1200px", width: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: 2,
          borderRadius: 3,
          height: "100%",
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
            label={`Total Assigned Trees - ${userProfiles.length}`}
            size={"large"}
            mode={"secondary"}
            backgroundColor={theme.custom.color.secondary.red}
            handleClick={() => console.log("Todo")}
          />
          <Chip
            label={`Unique User Profiles - ${uniqueUsers.length}`}
            size={"large"}
            mode={"secondary"}
            handleClick={() => console.log("Todo")}
          />
        </div>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
          rows={userProfiles}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[50]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};
