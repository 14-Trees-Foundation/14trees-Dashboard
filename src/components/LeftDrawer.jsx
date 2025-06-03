import { useEffect, useRef, useState } from "react";

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
import { gsap } from "gsap";

import { Profile } from "../pages/UserProfile/Profile";

import { useRecoilState, useRecoilValue } from "recoil";
import { navIndex, selUsersData } from "../store/atoms";
import logo from "../assets/logo_white_small.png";
import icon from "../assets/icon_round.png";
import { Button, Typography } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { ReferralDialog } from "./Referral/ReferralDialog";

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
  const userNameRef = useRef(null);
  const [referralOpen, setReferralOpen] = useState(false);

  const username = selUserInfo.assigned_to;

  const onClickNav = (value) => {
    setIndex(value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    // GSAP animation for the username text
    gsap.fromTo(
      userNameRef.current,
      { width: 0, opacity: 0 },
      {
        duration: 2,
        delay: 2,
        width: "auto",
        opacity: 1,
        ease: "power3.out",
        overflow: "hidden",
        whiteSpace: "nowrap",
      });

  }, [selUserInfo, userNameRef]);

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
            {selUserInfo?.assigned_to
              ? (<div className={classes.header}>
                <img
                  src={icon}
                  alt={logo}
                  className={classes.img}
                  onClick={handleDrawerOpen}
                />
                <div className={classes.username} ref={userNameRef}>
                  {selUserInfo.event_type && selUserInfo.event_type === "2"
                    ? "Memorial Dashboard"
                    : `${username}'s Dashboard`}
                </div>
                <div className={classes.buttonContainer}>
                  {username.length <= 8 && <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      window.open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"
                      );
                    }}
                    startIcon={<CardGiftcardIcon />}
                  >
                    <span className={classes.buttonText}>Gift a Tree</span>
                  </Button>}
                </div>
              </div>)
              : (
                <div className={classes.header}>
                  <img
                    src={icon}
                    alt={logo}
                    className={classes.img}
                    onClick={handleDrawerOpen}
                  />
                  <div className={classes.username}>
                    Redeem Your Gift Tree
                  </div>
                </div>
              )
            }
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
        <img className={classes.logo} alt={"logo"} src={logo} onClick={() => { window.open("https://www.14trees.org") }} />
        {menuitem()}
        <Box
          sx={{
            margin: "20px 10px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#2e7d32",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Inspire Others to Give
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#4caf50",
              marginBottom: "10px",
            }}
          >
            Do you know, you can create your personal referral link and share
            it with friends and family? Every contribution made through your
            link will be tracked. When someone contributes using your link,
            you&apos;ll receive an email with your personal referral dashboard
            where you can see the impact you&apos;ve inspired as others join
            you in gifting trees.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#2e7d32",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => setReferralOpen(true)}
          >
            Create & Share Your Link
          </Typography>
        </Box>

        <ReferralDialog open={referralOpen} onClose={() => { setReferralOpen(false) }} linkType="donate" />
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
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: 'center',
      height: "5vh",
    },
    username: {
      lineHeight: "normal",
      fontSize: "34px",
      color: "#1F3625",
      fontWeight: "500",
      marginLeft: "20px",
      [theme.breakpoints.down("1500")]: {
        lineHeight: "normal",
        fontSize: "28px",
      },
      [theme.breakpoints.down("480")]: {
        lineHeight: "normal",
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
      cursor: "pointer",
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
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      flexGrow: 1,
      flexWrap: "wrap", // Allow buttons to wrap on smaller screens
      gap: "5px", // Add gap between buttons
    },
    buttonText: {
      [theme.breakpoints.down("1145")]: {
        display: "none",
      },
    }
  })
);
