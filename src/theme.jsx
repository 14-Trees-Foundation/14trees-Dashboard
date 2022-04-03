import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  custom: {
    color: {
      secondary: {
        purple: "#6166B8",
        red: "#C72542",
        orange: "#F94F25",
        pink: "#FEC8FE",
      },
      primary: {
        lightgreen: "#9BC53D",
        brown: "#573D1C",
        green: "#1F3625",
        blue: "#3C79BC",
      },
    },
  },
  palette: {
    primary: {
      light: "#9BC53D",
      main: "#3f50b5",
      dark: "#1F3625",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Helvetica, Arial, Sans-Serif",
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { color: "primary", variant: "contained" },
          style: {
            backgroundColor: "#9BC53D",
            fontcolor: "#ffffff",
            fontSize: 18,
            minWidth: "100px",
            textTransform: "none",
            borderRadius: "7px",
            "&:hover": {
              backgroundColor: "#1F3625",
              color: "#ffffff",
            },
          },
        },
        {
          props: { color: "secondary", variant: "contained" },
          style: {
            minWidth: "200px",
            borderRadius: "7px",
            backgroundColor: "#1F3625",
            color: "#9BC53D",
            border: "1px solid #dcdcdc",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#9BC53D",
              color: "#ffffff",
            },
          },
        },
      ],
    },
  },
});

export default theme;
