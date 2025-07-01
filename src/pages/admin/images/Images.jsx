import { Box, Divider, Typography } from "@mui/material";
import { Tabs } from "@mui/base";

import { CustomTab as Tab, CustomTabsList as TabsList, CustomTabPanel as TabPanel } from "../../../components/CustomTabs";
import { AddMemories } from "./components/AddMemories";

export const Images = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
        }}
      >
        <Typography variant="h3">Images</Typography>
      </div>
      <Divider sx={{ backgroundColor: "#ffffff" }} />
      <Box sx={{ p: 3 }}>
        <Tabs defaultValue={0}>
          <TabsList>
            <Tab>Add Memories</Tab>
          </TabsList>
          <TabPanel value={0}>
            <AddMemories />
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
};
