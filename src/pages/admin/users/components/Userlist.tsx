import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  DataGrid,
  GridToolbar,
  GridValueGetterParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import { allUserProfile } from "../../../../store/adminAtoms";
import Chip from "../../../../stories/Chip/Chip";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.user.name,
  },
  {
    field: "tree_name",
    headerName: "Tree name",
    width: 180,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.treetype.name,
  },
  {
    field: "sapling_id",
    headerName: "Sapling ID",
    width: 150,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.tree.sapling_id,
  },
  {
    field: "date_added",
    headerName: "Date added",
    width: 250,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted =
        params.value !== undefined
          ? (params.value! as string).slice(0, 10)
          : "";
      return `${valueFormatted}`;
    },
  },
  {
    field: "plot",
    headerName: "Plot name",
    width: 250,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.plot.name,
  },
];

export const Userlist = () => {
  const userProfiles = useRecoilValue(allUserProfile);

  let uniqueUsers = [
    ...new Map(
      userProfiles.map((profiles: { user: { userid: any } }) => [
        profiles.user.userid,
        profiles,
      ])
    ).values(),
  ];
  return (
    <div style={{ height: "980px", maxHeight: "1200px", width: "100%" }}>
      <Box
        sx={{
          background: "linear-gradient(145deg, #9faca3, #bdccc2)",
          p: 2,
          borderRadius: 3,
          boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
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
            backgroundColor={"#C72542"}
            handleClick={() => console.log("Todo")}
          />
          <Chip
            label={`Unique User Profiles - ${uniqueUsers.length}`}
            size={"large"}
            mode={"secondary"}
            handleClick={() => console.log("Todo")}
            backgroundColor={undefined}
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
