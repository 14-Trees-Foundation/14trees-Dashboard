import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSetRecoilState } from "recoil";

import Axios from "../../../../api/local";
import { searchTreeData } from "../../../../store/adminAtoms";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  marginTop: "8px",
  boxShadow: "4px 4px 8px #98a49c, -4px -4px 8px #cadace",
  background: "#B1BFB5",
  marginLeft: theme.spacing(1),
  width: "100%",
  height: "90%",
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
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

export const SearchBox = ({ setLoading }) => {
  const [key, setKey] = useState("");
  const setTreeData = useSetRecoilState(searchTreeData);

  const gettree = async () => {
    setLoading(true);
    try {
      let res = await Axios.get(`/trees/gettree/?sapling_id=${key}`);
      setTreeData(res.data);
      setLoading(false);
      toast.success("Tree found!");
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        toast.error("Sapling ID doesn't exist!");
      } else {
        toast.error(error);
      }
    }
  };

  const handleKeyPress = (key) => {
    if (key === "Enter") {
      gettree();
    }
  };
  return (
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
  );
};
