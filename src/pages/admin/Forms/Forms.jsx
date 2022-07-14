import * as React from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import { useSetRecoilState } from "recoil";

import { Tab, TabsList, TabPanel } from "../../../components/CustomTabs";
import { Spinner } from "../../../components/Spinner";
import Axios from "../../../api/local";
import { AssignTree } from "./components/AssignTree";
import { AddOrg } from "./components/Addorg";
import { AddTree } from "./components/Addtree";
import { Grid } from "@mui/material";
import { TreeList } from "./components/TreeList";
import { treeTypesList } from "../../../store/adminAtoms";
import { AddPlot } from "./components/AddPlot";
import { AddTreeType } from './components/AddTreeType';

export const Forms = () => {
  const [loading, setLoading] = React.useState(true);
  const setTreeTypeslist = useSetRecoilState(treeTypesList);
  const [selTrees, setSelectedTrees] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      let TreeRes = await Axios.get(`/trees/treetypes`);
      if (TreeRes.status === 200) {
        setTreeTypeslist(TreeRes.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [setTreeTypeslist]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onTreeSelect = (val) => {
    if (selTrees === "") {
      setSelectedTrees(val);
    } else {
      let trees = selTrees + "," + val;
      trees = Array.from(new Set(trees.split(','))).toString();
      setSelectedTrees(trees);
    }
  };

  const onTreesChanged = (val) => {
    setSelectedTrees(val);
  };

  if (loading) {
    return <Spinner text={"Fetching Tree Data!"} />;
  } else {
    return (
      <TabsUnstyled defaultValue={0}>
        <div style={{ margin: "16px" }}>
          <TabsList>
            <Tab>Assign Trees</Tab>
            <Tab>Add Tree Type</Tab>
            <Tab>Add Org</Tab>
            <Tab>Add Plot</Tab>
            <Tab>Add Tree</Tab>
          </TabsList>
        </div>
        <TabPanel value={0} sx={{ ml: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TreeList onTreeSelect={onTreeSelect} />
            </Grid>
            <Grid item xs={6}>
              <AssignTree selTrees={selTrees} onTreesChanged={onTreesChanged} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={1}>
          <AddTreeType />
        </TabPanel>
        <TabPanel value={2}>
          <AddOrg />
        </TabPanel>
        <TabPanel value={3}>
          <AddPlot />
        </TabPanel>
        <TabPanel value={4}>
          <AddTree />
        </TabPanel>
      </TabsUnstyled>
    );
  }
};
