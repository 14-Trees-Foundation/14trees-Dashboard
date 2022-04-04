import { useState } from "react";

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Profile } from "../pages/UserProfile/Profile";

import { useRecoilState, useRecoilValue } from "recoil";
import { navIndex, selUsersData } from "../store/atoms";
import logo from "../assets/logo_white_small.png";
import icon from "../assets/icon_round.png";

const drawerWidth = 120;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: "80%",
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const LeftDrawer = () => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:481px)");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [index, setIndex] = useRecoilState(navIndex);
  const selUserInfo = useRecoilValue(selUsersData);
  const username = selUserInfo.user.name.split(" ")[0];

  const onClickNav = (value) => {
    setIndex(value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const pages = [
    {
      page: Profile,
      displayName: "Profile",
      logo: logo,
    },
    // {
    //     page: Maps,
    //     displayName: 'Site Map',
    //     logo: logo
    // },
    // {
    //     page: Maps,
    //     displayName: 'Trees',
    //     logo: logo
    // },
  ];

  const menuitem = () => {
    return (
      <div className={classes.itemlist}>
        {pages.map((item, i) => {
          return (
            <div className={classes.item} onClick={() => onClickNav(i)} key={i}>
              <div className={index === i ? classes.selected : classes.itembtn}>
                <img
                  className={classes.itemlogo}
                  alt={"items"}
                  src={item.logo}
                />
                <div className={classes.itemtext}>{item.displayName}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (matches) {
    return (
      <Box>
        <AppBar position="fixed" open={open} className={classes.appbar}>
          <Toolbar style={{ backgroundColor: "#e5e5e5" }}>
            <div className={classes.header}>
              <img
                src={icon}
                alt={logo}
                className={classes.img}
                onClick={handleDrawerOpen}
              />
              <div className={classes.username}>
                {selUserInfo.tree.event_type && selUserInfo.tree.event_type === "2"
                  ? "Memorial Dashboard"
                  : `${username}'s Dashboard`}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.mdrawer}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <img className={classes.logo} alt={"logo"} src={logo} />
          {menuitem()}
        </Drawer>
      </Box>
    );
  } else {
    return (
      <Drawer className={classes.drawer} variant="permanent" anchor="left">
        <Divider />
        <img className={classes.logo} alt={"logo"} src={logo} />
        {menuitem()}
      </Drawer>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    appbar: {
      backgroundColor: "#e9e9e9",
      color: "#3F5344",
    },
    drawer: {
      width: "14%",
      "& .MuiPaper-root": {
        width: "14%",
        backgroundColor: "#3F5344",
        borderTopRightRadius: "10px",
      },
    },
    img: {
      width: "35px",
      height: "35px",
    },
    header: {
      display: "flex",
      height: "5vh",
    },
    username: {
      lineHeight: "50px",
      fontSize: "34px",
      color: "#1F3625",
      fontWeight: "500",
      marginLeft: "20px",
      [theme.breakpoints.down("1500")]: {
        lineHeight: "40px",
        fontSize: "28px",
      },
      [theme.breakpoints.down("480")]: {
        lineHeight: "40px",
        fontSize: "20px",
      },
    },
    mdrawer: {
      width: "20%",
      "& .MuiPaper-root": {
        width: "20%",
        backgroundColor: "#3F5344",
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
      width: "80%",
      margin: "0 auto 20px auto",
    },
    itembtn: {
      borderRadius: "20px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#3F5344",
      "&:hover": {
        backgroundColor: "#9BC53D",
      },
    },
    selected: {
      borderRadius: "20px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#9BC53D",
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
