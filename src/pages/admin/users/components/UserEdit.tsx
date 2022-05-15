import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";

import { useState } from "react";
import Axios from "../../../../api/local";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../../../../components/Spinner";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  marginTop: "8px",
  boxShadow: "4px 4px 8px #98a49c, -4px -4px 8px #cadace",
  background: "#B1BFB5",
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  maxWidth: "480px",
  height: "60px",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(2.5, 1, 1, 1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    maxWidth: "480px",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

type usertree = {
    date_added: string,
    user: {
        name: string
    },
  tree: {
    sapling_id: string;
    image: [string]
  };
};

export const UserEdit = () => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<usertree>();

  const gettree = async () => {
    setLoading(true);
    try {
      let res = await Axios.get(`/profile?id=${key}`);
      let filtered = res.data.usertrees?.filter((item: usertree) => {
        return item.tree.sapling_id === key;
      });
      setProfile(filtered[0]);
      setLoading(false);
      toast.success("User found!");
    } catch (error) {
      setLoading(false);
      toast.error("Sapling ID doesn't exist!");
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      gettree();
    }
  };

  const deleteTree = async () => {
    setLoading(true);
    try {
      await Axios.delete(`/profile?id=${profile?.tree.sapling_id}`);
      setProfile(undefined);
      setLoading(false);
      toast.success("User Profile deleted!");
    } catch (error) {
      setLoading(false);
      toast.error("Sapling ID doesn't exist!");
    }
  }

  if (loading) {
    return <Spinner text={"Fetching User Data!"} />;
  } else {
    return (
      <Box
        sx={{
          background: "linear-gradient(145deg, #9faca3, #bdccc2)",
          p: 2,
          borderRadius: 3,
          boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
          height: "640px",
          width: "100%",
          ml: "auto",
          mr: "auto",
        }}
      >
        <Search>
          <ToastContainer />
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Sapling ID"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e.key)}
          />
        </Search>
        {profile && (
          <Card
            sx={{
              background: "linear-gradient(145deg, #9faca3, #bdccc2)",
              p: 2,
              borderRadius: 3,
              boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
              maxWidth: "480px",
              height: "460px",
              mt: 3,
              mr: "auto",
              ml: "auto",
            }}
          >
            <img src={profile.tree.image[0]} style={{width: '100%', height: '240px', objectFit:'cover'}} alt=""/>
            <CardContent>
                <Typography>
                    Name: {profile.user.name}
                </Typography>
                <Typography>
                    Sapling ID: {profile.tree.sapling_id}
                </Typography>
                <Typography>
                    Date Added: {profile.date_added}
                </Typography>
            </CardContent>
            <CardActions>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                <Button
                      sx={{ m: 2 }}
                      size="large"
                      variant="contained"
                      color="secondary"
                      disabled={true}
                    >
                      Modify
                    </Button>
                    <Button
                      sx={{ m: 2 }}
                      size="large"
                      variant="contained"
                      color="secondary"
                      onClick={deleteTree}
                    >
                      Delete
                    </Button>
                </div>
            </CardActions>
          </Card>
        )}
      </Box>
    );
  }
};
