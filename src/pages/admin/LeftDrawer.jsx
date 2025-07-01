import { useEffect, useState } from "react";
import { Drawer, Divider, Box, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import LeaderBoardOutlined from "@mui/icons-material/LeaderboardOutlined";
import ForestOutlined from "@mui/icons-material/ForestOutlined";
import GrassTwoToneIcon from "@mui/icons-material/GrassTwoTone";
import OpacityOutlined from "@mui/icons-material/OpacityOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import TourIcon from "@mui/icons-material/TourOutlined";
import logo from "../../assets/logo_white_small.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MapIcon from "@mui/icons-material/Map";
import FestivalIcon from "@mui/icons-material/Festival";
import { Analytics, CardGiftcard, Inventory, Campaign  } from "@mui/icons-material";
import { UserRoles } from "../../types/common";

export const AdminLeftDrawer = () => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:481px)");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    // Check if we should bypass auth
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true';
    
    if (bypassAuth) {
      // If bypassing auth, assume admin role
      setIsAdmin(true);
      return;
    }
    
    const roles = localStorage.getItem("roles") || '[]';
    try {
      const rolesArr = JSON.parse(roles);
      const admin = rolesArr.includes(UserRoles.Admin) || rolesArr.includes(UserRoles.SuperAdmin)
      setIsAdmin(admin)
      if (!admin) {
        navigate("/tree-cards");
      }
    } catch (error) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (auth.roles.includes(UserRoles.User)) {
      navigate("/tree-cards");
    }
  }, [auth]);

  const pages = [
    {
      displayName: "Home",
      logo: LeaderBoardOutlined,
      display: true,
      path: "home",
    },
    {
      displayName: "Sites",
      logo: MapIcon,
      display: true,
      path: "sites",
    },
    {
      displayName: "Plots",
      logo: LandscapeIcon,
      display: true,
      path: "plots",
    },
    {
      displayName: "Trees",
      logo: ForestOutlined,
      display: true,
      path: "trees",
    },
    {
      divider: true,
    },
    {
      displayName: "Plant Types",
      logo: GrassTwoToneIcon,
      display: true,
      path: "plant-types",
    },
    {
      displayName: "Ponds",
      logo: OpacityOutlined,
      display: true,
      path: "ponds",
    },
    {
      displayName: "People",
      logo: AccountCircleOutlined,
      display: true,
      path: "people",
    },
    {
      displayName: "People Groups",
      logo: CorporateFareIcon,
      display: true,
      path: "people-group",
    },
    {
      divider: true,
    },
    {
      displayName: "Visits",
      logo: TourIcon,
      display: true,
      path: "visits",
    },
    {
      displayName: "Events",
      logo: FestivalIcon,
      display: true,
      path: "events",
    },
    {
      displayName: "Site Inventory",
      logo: Inventory,
      display: true,
      path: "site-inventory",
    },
    {
      displayName: "GC Inventory",
      logo: Inventory,
      display: true,
      path: "gc-inventory",
    },
    {
      displayName: "Campaigns",
      logo: Campaign,
      display: auth.signedin,
      path: "campaigns",
    },
    {
      displayName: "Tree Cards",
      logo: CardGiftcard,
      display: auth.signedin,
      path: "tree-cards",
    },
    {
      displayName: "Donations",
      logo: VolunteerActivismIcon,
      display: true,
      path: "donations",
    },
    {
      displayName: "Corporate Dashboard",
      logo: Analytics,
      display: true,
      path: "corporate-dashboard",
    },
    // {
    //   displayName: "Images",
    //   logo: FaceIcon,
    //   // display: auth.permissions.includes("all"),
    //   display: true,
    // },
  ];

  const isActive = (path) => {
    return location.pathname === `/admin/${path}` || 
           (path === 'home' && location.pathname === '/admin');
  };

  const menuitem = () => {
    return (
      <div className={classes.itemlist}>
        {pages.map((item, i) => {
          if (item.divider) {
            return (
              <Divider 
                sx={{ 
                  width: "calc(100% - 20px)", 
                  margin: "0 0 20px 20px", 
                  backgroundColor: 'white' 
                }} 
                key={i} 
              />
            );
          } else if (item.display) {
            return (
              <Link 
                to={`/admin/${item.path}`} 
                key={i}
                style={{ textDecoration: 'none' }}
              >
                <div className={classes.item}>
                  <div className={isActive(item.path) ? classes.selected : classes.itembtn}>
                    <item.logo />
                    <div className={classes.itemtext}>{item.displayName}</div>
                  </div>
                </div>
              </Link>
            );
          } else {
            return null;
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
            onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
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