import { useEffect, useCallback, useState } from "react";
import { Divider, Typography, Box } from "@mui/material";
import { useSetRecoilState } from "recoil";

import { allUserProfile } from "../../../store/adminAtoms";
import { Spinner } from "../../../components/Spinner";
import { Userlist } from "./components/Userlist";
import * as Axios from "../../../api/local";

export const Users = () => {
  const [loading, setLoading] = useState(true);
  const setUserProfiles = useSetRecoilState(allUserProfile);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/profile/allprofile`);
      if (response.status === 200) {
        setUserProfiles(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [setUserProfiles]);

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
          <Typography variant="h3">User Profiles</Typography>
        </div>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <Box sx={{ p: 3 }}>
          <Userlist />
        </Box>
      </>
    );
  }
};
