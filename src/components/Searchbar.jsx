import * as React from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";

export const SearchBar = ({ searchSubmit }) => {
  const classes = usestyle();
  const [search, setSearch] = React.useState("");
  const handleChange = (prop) => (event) => {
    setSearch(event.target.value);
  };
  const onSubmit = () => {
    searchSubmit(search);
  };
  return (
    <div className={classes.box}>
      <FormControl sx={{ width: "100%" }} variant="outlined">
        <OutlinedInput
          fullWidth
          value={search}
          onChange={handleChange("key")}
          inputProps={{
            "aria-label": "key",
          }}
        />
      </FormControl>
      <div className={classes.btndiv}>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

const usestyle = makeStyles((theme) => ({
  box: {
    marginLeft: "2.5%",
    marginRight: "2.5%",
    display: "flex",
  },
  btndiv: {
    marginLeft: "-180px",
    display: "flex",
    marginTop: "-1px",
    [theme.breakpoints.down("480")]: {
      marginLeft: "-100px",
    },
  },
  btn: {
    width: "190px",
    [theme.breakpoints.down("480")]: {
      width: "100px",
    },
  },
}));
