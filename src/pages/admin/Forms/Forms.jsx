import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { useSetRecoilState } from 'recoil';

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

const Tab = styled(TabUnstyled)`
  color: #1f3625;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #1f3625;
    color: #ffffff;
  }

  &.${buttonUnstyledClasses.focusVisible} {
    color: #fff;
    outline: none;
    background-color: #9BC53D;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: #9BC53D;
    color: #1f3625;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

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
