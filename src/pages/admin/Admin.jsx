import { useEffect, useCallback, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import * as Axios from "../../api/local";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import {
  summary,
  adminNavIndex,
  treeLoggedByDate,
  plotsList,
} from "../../store/adminAtoms";
import { AdminHome } from "./home/AdminHome";
import { Trees } from "./tree/Tree";
import { Users } from "./users/Users";
import { Ponds } from "./Ponds/Ponds";
import { Images } from "./images/Images";
import { PlantTypeComponent } from "./plantType/PlantType";
import { PlotComponent } from "./plot/Plot";
import { OrganizationComponent } from "./organization/Organization";
import { DonationComponent } from "./donation/Donation";
import { SitesComponent } from "./sites/Sites";
import { EventsComponent } from "./events/Events";
import { VisitsComponent } from "./visits/Visits";
import SiteInventory from "./Inventory/SiteInventory";
import GiftTrees from "./gift/GiftTrees";
import GCInventory from "./Inventory/GCInventory";
import CSRInventory from "./csr/CSRInventory";

export const Admin = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const setSummary = useSetRecoilState(summary);
  const setTreeLoggedByDate = useSetRecoilState(treeLoggedByDate);
  const setPlotsList = useSetRecoilState(plotsList);
  const index = useRecoilValue(adminNavIndex);
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/analytics/summary`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      });
      if (response.status === 200) {
        setSummary(response.data);
      }
      response = await Axios.default.get(`/trees/loggedbydate`);
      if (response.status === 200) {
        response.data.forEach((element, index) => {
          element["_id"] = element["_id"].substring(0, 10);
        });
        setTreeLoggedByDate(response.data);
      }
      // let plotRes = await Axios.default.get(`/plots`);
      // if (plotRes.status === 200) {
      //   setPlotsList(plotRes.data.result);
      // }
    } catch (error) {
      if (error.response.status === 500) {
        navigate("/login");
      }
    }

    setLoading(false);
  }, [setSummary, navigate, setTreeLoggedByDate, setPlotsList, token]);

  useEffect(() => {
    fetchData();
    document.title = "14Trees Admin Home";
  }, [fetchData]);

  const pages = [
    {
      page: AdminHome,
      displayName: "Admin Home",
    },
    {
      page: SitesComponent,
      displayName: "Sites",
    },
    {
      page: PlotComponent,
      displayName: "Plots",
    },
    {
      page: Trees,
      displayName: "Trees",
    },
    {
      page: PlantTypeComponent,
      displayName: "Plant Types",
    },
    {
      page: Ponds,
      displayName: "Ponds",
    },
    {
      page: Users,
      displayName: "Users",
    },
    {
      page: OrganizationComponent,
      displayName: "Organizations",
    },
    {
      page: VisitsComponent,
      displayName: "Visits",
    },
    {
       page: EventsComponent,
       displayName: "Events",
    },
    {
      page: SiteInventory,
      displayName: "Site Inventory",
    },
    {
      page: GCInventory,
      displayName: "GC Inventory",
    },
    {
      page: GiftTrees,
      displayName: "Tree Cards",
    },
    {
      page: DonationComponent,
      displayName: "Donations",
    },
    {
      page: CSRInventory,
      displayName: "CSR Analytics",
    },
    {
      page: Images,
      displayName: "Images",
    },
  ];

  const mainBox = () => {
    if (index === undefined || index >= pages.length) {
      return <div>Please select a valid page</div>;
    }
    const Page = pages[index].page;
    return (
      <div className={classes.outlet}>
        <Page />
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className={classes.box}>
        {/* <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/> */}
        <Box
          sx={{
            display: "flex",
          }}
        >
          <AdminLeftDrawer />
          <Box
            component="main"
            sx={{ minWidth: "1080px", p: 2, width: "100%" }}
          >
            {mainBox()}
          </Box>
        </Box>
      </div>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    box: {
      overflow: "auto",
      width: "100%",
      position: "relative",
      backgroundColor: "#B1BFB5",
      minHeight: "100vh",
      heigth: "100%",
    },
    bg: {
      width: "100%",
      objectFit: "cover",
    },
    outlet: {
      [theme.breakpoints.down("768")]: {
        marginTop: "48px",
      },
    },
  })
);
