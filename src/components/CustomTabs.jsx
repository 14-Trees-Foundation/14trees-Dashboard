import { styled } from "@mui/system";
import { Tab, Tabs } from "@mui/material";
import { TabPanel } from "@mui/lab";

const tabClasses = { selected: "Mui-selected" };
const buttonClasses = { focusVisible: "Mui-focusVisible", disabled: "Mui-disabled" };

export const CustomTab = styled(Tab)`
  color: #1f3625;
  cursor: pointer;
  font-size: 1rem;
  background-color: transparent;
  width: auto;
  min-width: 150px;
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

  &.${buttonClasses.focusVisible} {
    color: #fff;
    outline: none;
    background-color: #9bc53d;
  }

  &.${tabClasses.selected} {
    color: #1f3625;
    font-weight: 550;
    background: #b1bfb5;
    box-shadow: inset 11px 11px 30px #98a49c, inset -11px -11px 30px #cadace;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CustomTabPanel = styled(TabPanel)`
  width: 100%;
  font-size: 0.875rem;
`;

export const CustomTabsList = styled(Tabs)`
  min-width: 220px;
  background: #b1bfb5;
  box-shadow: 7px 7px 10px #98a49c, -7px -7px 12px #cadace;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;
