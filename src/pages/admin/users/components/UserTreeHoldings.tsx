import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from 'react';
import * as userTreesActionCreators from '../../../../redux/actions/userTreeActions';
import {bindActionCreators} from 'redux';
import {useAppDispatch, useAppSelector} from '../../../../redux/store/hooks';

import {
  DataGrid,
  GridCellParams,
  GridFilterItem,
  GridFilterModel,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import Chip from "../../../../stories/Chip/Chip";
import { userTreeHoldings } from "../../../../store/adminAtoms";
import { Box } from "@mui/material";
import { RootState } from "../../../../redux/store/store";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    valueGetter: (params: GridValueGetterParams) => params.row.user.name,
  },
  {
    field: "email",
    headerName: "Email",
    width: 350,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.user.email,
  },
  {
    field: "count",
    headerName: "Total Tree",
    width: 150,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.count,
  },
  {
    field: "matched",
    headerName: "Assigned Tree",
    width: 150,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => {
      if (!params.row.matched) {
        return 0;
      } else {
        return params.row.matched.count;
      }
    },
  },
  {
    field: "plot",
    headerName: "Plot",
    width: 350,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.plot.name,
  },
];

const handleClick = (e: GridCellParams<any, any, any>) => {
  if (e.field === "email") {
    window.open("http://localhost:3000/ww/" + e.formattedValue);
  }
};

export const UserTreeHoldings = () => {

    let [ currentPage, setCurrentPage ] = useState<number>(0);
  let [ filters, setFilters ] = useState<GridFilterItem[]>([]);

  const dispatch = useAppDispatch();
    const { getUserTreeCount } =
        bindActionCreators(userTreesActionCreators, dispatch);

  const userTreeCountData = useAppSelector((state: RootState) => state.userTreeCountData)
  // const treeHoldings = useRecoilValue(userTreeHoldings);
  const treeHoldings = userTreeCountData.results;
  let allTrees = 0;
  let assignedTrees = 0;

  const getUserTreeData = () => {
        getUserTreeCount(currentPage*20, 20, filters);
  }

  useEffect(getUserTreeData, [currentPage, filters]);

  treeHoldings.forEach((element: { count: number }) => {
    allTrees += element.count;
  });

  treeHoldings.forEach((element: { matched: { count: number } }) => {
    if (element.matched?.count) {
      assignedTrees += element.matched.count;
    }
  });

  return (
    <div style={{ height: "700px", maxHeight: "900px", width: "100%" }}>
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
            label={`Total Reserved Trees - ${allTrees}`}
            size={"large"}
            mode={"secondary"}
            backgroundColor={"#C72542"}
            handleClick={() => console.log("Todo")}
          />
          <Chip
            label={`Total Assigned Trees - ${assignedTrees}`}
            size={"large"}
            mode={"secondary"}
            handleClick={() => console.log("Todo")}
            backgroundColor={undefined}
          />
        </div>
        <DataGrid
          filterMode="server"
          onFilterModelChange={(model: GridFilterModel) => {
            setFilters(model.items)
          }}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.user.name + row.plot.name}
          rowCount={userTreeCountData.totalResults}
          rows={treeHoldings}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          onPageChange={(page: number) => {
            setCurrentPage(page);
          }}
          onCellClick={(e) => handleClick(e)}
        />
      </Box>
    </div>
  );
};
