import { useState } from "react";
import { Drawer, Divider, Box, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import logo from "../assets/logo_white_small.png"
import { useNavigate } from "react-router-dom";

interface SinglePageDrawerProps {
    pages: {
        displayName: string,
        logo: any,
        display: boolean,
        key: number,
        onClick: () => void
    }[]
}

export const SinglePageDrawer: React.FC<SinglePageDrawerProps> = ({ pages }) => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:481px)");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const menuitem = () => {
    return (
      <div className={classes.itemlist}>
        {pages.map((item, i) => {
          if (item.display) {
            return (
              <div
                className={classes.item}
                onClick={() => { item.onClick(); setIndex(i) }}
                key={i}
              >
                <div
                  className={index === item.key ? classes.selected : classes.itembtn}
                >
                  <item.logo />
                  <div className={classes.itemtext}>{item.displayName}</div>
                </div>
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    );
  };

  if (matches) {
    return (
      <Box>
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar style={{ backgroundColor: "#1F3625" }}>
            <div>
              <MenuIcon onClick={() => setOpen(true)} />
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.mdrawer}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Divider />
          <img
            className={classes.logo}
            alt={"logo"}
            src={logo}
            onClick={() => {
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          />
          {menuitem()}
        </Drawer>
      </Box>
    );
  } else {
    return (
      <Drawer className={classes.drawer} variant="permanent" anchor="left">
        <Divider />
        <img
          className={classes.logo}
          alt={"logo"}
          src={logo}
          onClick={() => {
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        />
        {menuitem()}
      </Drawer>
    );
  }
};

const useStyles = makeStyles((theme: any) =>
  createStyles({
    appbar: {
      color: "#ffffff",
    },
    drawer: {
      width: "20%",
      maxWidth: "250px",
      "& .MuiPaper-root": {
        width: "20%",
        maxWidth: "250px",
        backgroundColor: "#1f3625",
        boxShadow: "2px 2px 8px #354639,-2px -2px 8px #49604f",
        opacity: "80%",
        borderTopRightRadius: "10px",
        borderRight: "0px",
      },
    },
    mdrawer: {
      width: "20%",
      "& .MuiPaper-root": {
        width: "20%",
        backgroundColor: "#1f3625",
        boxShadow: "2px 2px 8px #354639,-2px -2px 8px #49604f",
        borderTopRightRadius: "10px",
      },
    },
    itemlist: {
      width: "100%",
      color: "#ffffff",
    },
    item: {
      cursor: "pointer",
      color: "#ffffff",
      width: "calc(100% - 10px)",
      margin: "0 0 20px 10px",
    },
    itembtn: {
      padding: "0 16px",
      borderRadius: "20px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "#1f3625",
      "&:hover": {
        backgroundColor: "#383838",
      },
    },
    selected: {
      padding: "0 16px",
      borderTopLeftRadius: "20px",
      borderBottomLeftRadius: "20px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      boxShadow: "7px 7px 11px #0d1710,-7px -7px 11px #31553a",
      background: "linear-gradient(145deg, #1c3121, #213a28)",
    },
    logo: {
      width: "80px",
      height: "100px",
      margin: "12px auto 30px auto",
      paddingTop: "25px",
      [theme.breakpoints.down("md")]: {
        width: "60px",
        height: "80px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "40px",
        height: "55px",
      },
    },
    itemlogo: {
      width: "18px",
      height: "20px",
    },
    itemtext: {
      margin: "5px",
      fontWeight: 450,
      fontSize: 16,
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
  })
);
