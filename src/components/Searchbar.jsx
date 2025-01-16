import * as React from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";

export const SearchBar = ({ searchSubmit }) => {
  const classes = useStyles();
  const [search, setSearch] = React.useState("");

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const onSubmit = () => {
    searchSubmit(search);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className={classes.container}>
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          fullWidth
          value={search}
          placeholder="Type your name"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "search-input" }}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onSubmit}
      >
        Find My Tree
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "95%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
  button: {
    minWidth: "150px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
}));
