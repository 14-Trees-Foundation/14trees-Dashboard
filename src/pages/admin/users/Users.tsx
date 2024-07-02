import { Divider } from "@mui/material";
import { User1 } from "./table/User1";
import { ToastContainer } from "react-toastify";

export const Users = () => {

  return (
    <>
      <ToastContainer />
      <User1 />
      <Divider sx={{ backgroundColor: "#ffffff", marginTop:'20px' }} />
      {/* <Box sx={{ p: 3 }}>
        <TabsUnstyled defaultValue={0}>
          <TabsList>
            <Tab>Tree Holdings</Tab>
            <Tab>Assigned Users</Tab>
          </TabsList>
          <TabPanel value={0}>
            <UserTreeHoldings />
          </TabPanel>
          <TabPanel value={1}>
            <Userlist />
          </TabPanel>
          <TabPanel value={2}>
            <UserEdit />
          </TabPanel>
        </TabsUnstyled>
      </Box> */}
    </>
  );
};
