import { useState } from "react";
import { Drawer, Divider, Box, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import LeaderBoardOutlined from "@mui/icons-material/LeaderboardOutlined";
import ForestOutlined from "@mui/icons-material/ForestOutlined";
import OpacityOutlined from "@mui/icons-material/OpacityOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import FaceIcon from "@mui/icons-material/Face";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LandscapeIcon from '@mui/icons-material/Landscape';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import logo from "../../assets/logo_white_small.png";
import { useRecoilState } from "recoil";
import { adminNavIndex } from "../../store/adminAtoms";
import { useAuth } from "./auth/auth";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MapIcon from '@mui/icons-material/Map';
import FestivalIcon from '@mui/icons-material/Festival';
import { useNavigate } from "react-router-dom";

export const AdminLeftDrawer = () => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:481px)");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [index, setIndex] = useRecoilState(adminNavIndex);
  const navigate = useNavigate();
  let auth = useAuth();
  const [subIndex, setSubIndex] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const onClickNav = (value, subValue) => {
    if (subValue !== undefined) {
      setIndex(value);
      setSubIndex(subValue);
    } else {
      setIndex(value);
      setSubIndex(null);
      setExpanded(value !== expanded ? value : null);
    }
  };

  const pages = [
    {
      displayName: "Home",
      logo: LeaderBoardOutlined,
      display: true,
    },
    {
      displayName: "Trees",
      logo: ForestOutlined,
      display: true,
    },
    {
      displayName: "Plant Types",
      logo: ForestOutlined,
      display: true,
    },
    {
      displayName: "Ponds",
      logo: OpacityOutlined,
      display: true,
    },
    {
      displayName: "Plots",
      logo: LandscapeIcon,
      display: true,
    },
    {
      displayName: "People",
      logo: AccountCircleOutlined,
      // display: auth.permissions.includes("all"),
      display: true,
    },
    {
      displayName: 'People Groups',
      logo: CorporateFareIcon,
      display: true
    },
    // {
    //   displayName: 'Sites',
    //   logo: MapIcon,
    //   display: true
    // },
    // {
    //   displayName: 'Events',
    //   logo: FestivalIcon,
    //   display: true
    // },
    // {
    //   displayName: 'Donation',
    //   logo: VolunteerActivismIcon,
    //   display: true
    // },
    // {
    //   displayName: "Images",
    //   logo: FaceIcon,
    //   // display: auth.permissions.includes("all"),
    //   display: true,
    // },

  ];
  const menuitem = () => {
    return (
      <div className={classes.itemlist}>
        {pages.map((item, i) => {
          if (item.display) {
            return (
              <div
                className={classes.item}
                onClick={() => onClickNav(i)}
                key={i}
              >
                <div
                  className={index === i ? classes.selected : classes.itembtn}
                >
                  <item.logo />
                  <div className={classes.itemtext}>{item.displayName}</div>
                </div>
                {i === expanded && item.subPages && item.subPages.map((subItem, j) => (
                  <div
                    className={classes.item}
                    onClick={() => onClickNav(i, j)}
                    key={j}
                    style={{ marginLeft: 20, marginTop: 10 }} 
                  >
                    <div
                      className={index === i && subIndex === j ? classes.selected : classes.itembtn}
                    >
                      <subItem.logo />
                      <div className={classes.itemtext}>{subItem.displayName}</div>
                    </div>
                  </div>
                ))}
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
        <AppBar position="fixed" open={open} className={classes.appbar}>
          <Toolbar style={{ backgroundColor: "#1F3625" }}>
            <div className={classes.header}>
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
            onClick={() => { navigate("/"); }} 
            style={{cursor: 'pointer'}}
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
          onClick={() => { navigate("/"); }} 
          style={{cursor: 'pointer'}}
        />
        {menuitem()}
      </Drawer>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    appbar: {
      color: "#ffffff",
    },
    drawer: {
      width: "14%",
      maxWidth: "200px",
      "& .MuiPaper-root": {
        width: "14%",
        maxWidth: "200px",
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
      width: "calc(100% - 20px)",
      margin: "0 0 20px 20px",
    },
    itembtn: {
      padding: "0 16px",
      borderRadius: "20px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
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
      justifyContent: "space-evenly",
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
