import * as React from 'react';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import { useSetRecoilState } from 'recoil';

import { Tab, TabsList, TabPanel } from '../../../components/CustomTabs';
import { Spinner } from '../../../components/Spinner';
import Axios from "../../../api/local";
import { AssignTree } from './components/AssignTree';
import { AddOrg } from './components/Addorg';
import { AddTree } from './components/Addtree';
import { Grid } from '@mui/material';
import { TreeList } from './components/TreeList';
import {
  plotsList,
  treeTypesList
} from '../../../store/adminAtoms';

export const Forms = () => {
  const [loading, setLoading] = React.useState(true);
  const setTreeTypeslist = useSetRecoilState(treeTypesList);
  const setPlotsList = useSetRecoilState(plotsList);

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      let TreeRes = await Axios.get(`/trees/treetypes`);
      if (TreeRes.status === 200) {
        setTreeTypeslist(TreeRes.data);
      }

      let plotRes = await Axios.get(`/plots`);
      if (plotRes.status === 200) {
        setPlotsList(plotRes.data);
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  }, [setPlotsList, setTreeTypeslist]);

  React.useEffect(() => {
    fetchData()
  }, [fetchData]);

  if (loading) {
    return <Spinner text={"Fetching Tree Data!"} />
  } else {
    return (
      <TabsUnstyled defaultValue={0}>
        <TabsList>
          <Tab>Assign Trees</Tab>
          <Tab>Add Org</Tab>
          <Tab>Add Tree</Tab>
        </TabsList>
        <TabPanel value={0}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TreeList />
            </Grid>
            <Grid item xs={6}>
              <AssignTree />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={1}>
          <AddOrg />
        </TabPanel>
        <TabPanel value={2}>
          <AddTree />
        </TabPanel>
      </TabsUnstyled>
    );
  }
}
