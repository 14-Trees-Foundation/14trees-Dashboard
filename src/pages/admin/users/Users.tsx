import { useEffect, useCallback, useState } from "react";
import { Divider, Typography, Box } from "@mui/material";
import { useSetRecoilState } from "recoil";
import TabsUnstyled from "@mui/base/TabsUnstyled";

import { Tab, TabsList, TabPanel } from "../../../components/CustomTabs";
import { allUserProfile, userTreeHoldings } from "../../../store/adminAtoms";
import { Spinner } from "../../../components/Spinner";
import { Userlist } from "./components/Userlist";
import * as Axios from "../../../api/local";
import { UserTreeHoldings } from "./components/UserTreeHoldings";
import { UserEdit } from "./components/UserEdit";

export const Users = () => {
  const [loading, setLoading] = useState(true);
  const setUserProfiles = useSetRecoilState(allUserProfile);
  const setUserTreeHoldings = useSetRecoilState(userTreeHoldings);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/profile/allprofile`);
      if (response.status === 200) {
        setUserProfiles(response.data.result);
      }

      response = await Axios.default.get(`/mytrees/count/usertreescount`);
      if (response.status === 200) {
        setUserTreeHoldings(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [setUserProfiles, setUserTreeHoldings]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Spinner text={"Fetching User Profile Data!"} />;
  } else {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 12px",
          }}
        >
          <Typography variant="h3">User Management</Typography>
        </div>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <Box sx={{ p: 3 }}>
          <TabsUnstyled defaultValue={0}>
            <TabsList>
              <Tab>Tree Holdings</Tab>
              <Tab>Assigned Users</Tab>
              <Tab>Edit Users</Tab>
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
        </Box>
      </>
    );
  }
};
