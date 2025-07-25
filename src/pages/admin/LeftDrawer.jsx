import { useEffect, useState } from "react";
import { Drawer, Divider, Box, AppBar, Toolbar, Collapse } from "@mui/material";
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import TourIcon from "@mui/icons-material/TourOutlined";
import logo from "../../assets/logo_white_small.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MapIcon from "@mui/icons-material/Map";
import FestivalIcon from "@mui/icons-material/Festival";
import { Analytics, CardGiftcard, Inventory, Campaign } from "@mui/icons-material";
import { UserRoles } from "../../types/common";
import { PAGE_SUB_SECTIONS, getSubSectionsForPage } from "../../config/pageSubSections";

export const AdminLeftDrawer = () => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:481px)");
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [drawerWidth, setDrawerWidth] = useState(200); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const classes = useStyles();

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
      display: true, // Show to all users who can access the admin panel
      path: "campaigns",
    },
    {
      displayName: "Tree Cards",
      logo: CardGiftcard,
      display: true, // Show to all users who can access the admin panel
      path: "tree-cards",
    },
    {
      displayName: "Tree Cards (Old)",
      logo: CardGiftcard,
      display: true, // Show to all users who can access the admin panel
      path: "tree-cards-old",
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

  const handleMenuClick = (path, hasSubSections = false) => {
    if (hasSubSections) {
      // Check if this menu is currently expanded
      const isCurrentlyExpanded = expandedMenus[path];
      
      // Collapse all menus first, then expand the clicked one if it wasn't expanded
      if (isCurrentlyExpanded) {
        // If clicking on an already expanded menu, just collapse it
        setExpandedMenus({});
      } else {
        // Collapse all others and expand this one
        setExpandedMenus({ [path]: true });
        navigate(`/admin/${path}`);
      }
    } else {
      // For regular menu items, collapse all expanded menus and navigate
      setExpandedMenus({});
      navigate(`/admin/${path}`);
    }
  };

  const handleSubSectionClick = (path, sectionId) => {
    // Set active section immediately for instant feedback
    setActiveSubSection(sectionId);
    
    navigate(`/admin/${path}`);
    // Add a small delay to ensure page navigation is complete before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Calculate the scroll position manually to avoid affecting sidebar
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middleOfScreen = window.innerHeight / 2;
        const scrollTo = absoluteElementTop - middleOfScreen + (elementRect.height / 2);
        
        // Smooth scroll to the calculated position
        window.scrollTo({
          top: Math.max(0, scrollTo),
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const isSubSectionActive = (sectionId) => {
    return activeSubSection === sectionId;
  };

  // Effect to detect scroll position and update active sub-section
  useEffect(() => {
    const currentPath = location.pathname.replace('/admin/', '');
    const sections = getSubSectionsForPage(currentPath);
    
    if (sections.length === 0) {
      setActiveSubSection(null);
      return;
    }

    const handleScroll = () => {
      let currentSection = null;
      let minDistance = Infinity;
      
      sections.forEach(section => {
        const element = document.getElementById(section.sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calculate distance from top of viewport
          const distanceFromTop = Math.abs(rect.top);
          
          // If section is visible and closer to top than previous sections
          if (rect.bottom > 0 && rect.top < viewportHeight && distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            currentSection = section.sectionId;
          }
        }
      });
      
      // Only update if we found a section and it's different from current
      if (currentSection && currentSection !== activeSubSection) {
        setActiveSubSection(currentSection);
      }
    };

    // Use throttling to improve performance
    let timeoutId;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    // Check initial position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  // Effect to manage menu expansion based on current page
  useEffect(() => {
    const currentPath = location.pathname.replace('/admin/', '');
    const sections = getSubSectionsForPage(currentPath);
    
    if (sections.length > 0) {
      // Auto-expand menu if we're on a page with sub-sections
      setExpandedMenus(prev => ({
        ...prev,
        [currentPath]: true
      }));
      
      // Initialize with first section if no active section is set
      if (!activeSubSection) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
          const firstElement = document.getElementById(sections[0].sectionId);
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              setActiveSubSection(sections[0].sectionId);
            }
          }
        }, 200);
      }
    } else {
      // Clear active section if page doesn't have sub-sections
      setActiveSubSection(null);
    }
  }, [location.pathname]);

  // Handle drawer resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    e.preventDefault();
    
    const newWidth = Math.min(Math.max(150, e.clientX), 400); // Min 150px, Max 400px
    setDrawerWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add global event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while resizing
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

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
            const subSections = getSubSectionsForPage(item.path);
            const hasSubSections = subSections.length > 0;
            const isExpanded = expandedMenus[item.path];
            
            return (
              <div key={i}>
                {/* Main menu item */}
                <div className={classes.item}>
                  <div 
                    className={isActive(item.path) ? classes.selected : classes.itembtn}
                    onClick={() => handleMenuClick(item.path, hasSubSections)}
                    style={{ cursor: 'pointer' }}
                  >
                    <item.logo />
                    <div className={classes.itemtext}>{item.displayName}</div>
                    {hasSubSections && (
                      <div style={{ marginLeft: 'auto', marginRight: '8px' }}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-sections */}
                {hasSubSections && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <div className={classes.subSectionList}>
                      {subSections.map((subSection, subIndex) => (
                        <div 
                          key={subIndex}
                          className={classes.subItem}
                          onClick={() => handleSubSectionClick(item.path, subSection.sectionId)}
                        >
                          <div className={
                            isSubSectionActive(subSection.sectionId) 
                              ? classes.subSelected 
                              : classes.subItembtn
                          }>
                            <subSection.icon style={{ fontSize: '16px' }} />
                            <div className={classes.subItemtext}>{subSection.displayName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Collapse>
                )}
              </div>
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
          sx={{
            width: Math.min(drawerWidth, window.innerWidth * 0.8),
            '& .MuiDrawer-paper': {
              width: Math.min(drawerWidth, window.innerWidth * 0.8),
            },
          }}
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
          {/* Resize Handle for Mobile */}
          <div
            className={classes.resizeHandle}
            onMouseDown={handleMouseDown}
            style={{
              cursor: isResizing ? 'col-resize' : 'col-resize',
              backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
              width: isResizing ? '12px' : '8px',
            }}
            title="Drag to resize sidebar"
          />
        </Drawer>
      </Box>
    );
  } else {
    return (
      <Drawer 
        className={classes.drawer} 
        variant="permanent" 
        anchor="left"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <Divider />
        <img
          className={classes.logo}
          alt={"logo"}
          src={logo}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        {menuitem()}
        {/* Resize Handle */}
        <div
          className={classes.resizeHandle}
          onMouseDown={handleMouseDown}
          style={{
            cursor: isResizing ? 'col-resize' : 'col-resize',
            backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
            width: isResizing ? '12px' : '8px',
          }}
          title="Drag to resize sidebar"
        />
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
      "& .MuiPaper-root": {
        backgroundColor: "#1f3625",
        boxShadow: "2px 2px 8px #354639,-2px -2px 8px #49604f",
        opacity: "80%",
        borderTopRightRadius: "10px",
        borderRight: "0px",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      },
    },
    mdrawer: {
      "& .MuiPaper-root": {
        backgroundColor: "#1f3625",
        boxShadow: "2px 2px 8px #354639,-2px -2px 8px #49604f",
        borderTopRightRadius: "10px",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
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
      boxShadow: "7px 7px 11px #0d1710,-7px -7px 11px #31553a, inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      background: "linear-gradient(145deg, #1c3121, #213a28)",
      border: "1px solid rgba(76, 175, 80, 0.6)",
      "& svg": {
        color: "#81C784",
      },
      "& .MuiTypography-root, & div": {
        color: "#ffffff",
        fontWeight: "500",
      },
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
    resizeHandle: {
      position: "absolute",
      top: 0,
      right: "-2px", // Slightly outside the drawer
      width: "8px",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      cursor: "col-resize",
      zIndex: 1001,
      borderRadius: "0 4px 4px 0",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        width: "12px",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
      },
    },
    subSectionList: {
      width: "calc(100% - 10px)",
      marginLeft: "10px",
      paddingLeft: "10px",
      borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
      marginTop: "5px",
    },
    subItem: {
      cursor: "pointer",
      color: "#ffffff",
      width: "calc(100% - 10px)",
      marginBottom: "5px",
      marginLeft: "10px",
    },
    subItembtn: {
      padding: "4px 12px",
      borderRadius: "8px",
      height: "auto",
      minHeight: "26px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transform: "translateX(2px)",
      },
    },
    subSelected: {
      padding: "4px 12px",
      borderRadius: "8px",
      height: "auto",
      minHeight: "26px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "rgba(76, 175, 80, 0.4)",
      border: "1px solid rgba(76, 175, 80, 0.8)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(76, 175, 80, 0.3)",
      transform: "translateX(4px)",
      "& svg": {
        color: "#A5D6A7",
      },
      "& div": {
        color: "#ffffff",
        fontWeight: "500",
      },
    },
    subItemtext: {
      margin: "0 0 0 8px",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      wordWrap: "break-word",
      whiteSpace: "normal",
      flex: 1,
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
    header: {
      color: "white",
      cursor: "pointer",
    },
  })
);