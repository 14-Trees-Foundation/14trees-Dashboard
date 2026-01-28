import * as React from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar = ({ searchSubmit, initialValue = "", compact = false }) => {
  const classes = useStyles();
  const [search, setSearch] = React.useState(initialValue);

  React.useEffect(() => {
    setSearch(initialValue);
  }, [initialValue]);

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
    <div className={compact ? classes.compactContainer : classes.container}>
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          fullWidth
          value={search}
          placeholder="Type your name"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "search-input" }}
          sx={compact ? {
            "& .MuiOutlinedInput-input": {
              padding: "6px 10px",
              fontSize: "14px",
              "@media (max-width: 600px)": {
                padding: "5px 8px",
                fontSize: "13px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d0d0d0",
            }
          } : {}}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={compact ? classes.compactButton : classes.button}
        onClick={onSubmit}
        size={compact ? "small" : "medium"}
      >
        {compact ? <SearchIcon fontSize="small" /> : "Find My Tree"}
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
  compactContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      gap: "4px",
    },
  },
  button: {
    minWidth: "150px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
  compactButton: {
    minWidth: "auto",
    padding: "6px 8px",
    textTransform: "none",
    fontSize: "13px",
    height: "32px",
  },
}));
