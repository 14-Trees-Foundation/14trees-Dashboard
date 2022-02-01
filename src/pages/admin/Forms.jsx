import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { AssignTree } from './Forms/AssignTree';
import { AddOrg } from './Forms/Addorg';
import { AddTree } from './Forms/Addtree';

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
  return (
    <TabsUnstyled defaultValue={0}>
      <TabsList>
        <Tab>Assign Trees</Tab>
        <Tab>Add Org</Tab>
        <Tab>Add Tree</Tab>
      </TabsList>
      <TabPanel value={0}>
        <AssignTree />
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
