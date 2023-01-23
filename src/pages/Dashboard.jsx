import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createStyles, makeStyles } from "@mui/styles";

import { useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player/youtube";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

import * as Axios from "../api/local";
import {
  usersData,
  selUsersData,
  overallData,
  pondsImages,
  navIndex,
  activitiesData,
  openVideo,
  videoUrl,
} from "../store/atoms";
import { Profile } from "./UserProfile/Profile";
import { Maps } from "./Maps/Maps";
import { RightDrawer } from "../components/RightDrawer";
import { LeftDrawer } from "../components/LeftDrawer";
import { Popup } from "../stories/Popup/Popup";
import { NotFound } from "./notfound/NotFound";
import { Spinner } from "../components/Spinner";
import logo from "../assets/logo_white_small.png";

export const Dashboard = () => {
  const styles = useStyles();
  const matches = useMediaQuery("(max-width:601px)");
  const { saplingId } = useParams();

  const setUserinfo = useSetRecoilState(usersData);
  const setSelectedUserinfo = useSetRecoilState(selUsersData);
  const setOverallInfo = useSetRecoilState(overallData);
  const setPondsImages = useSetRecoilState(pondsImages);
  const setActivities = useSetRecoilState(activitiesData);
  const index = useRecoilValue(navIndex);
  const [open, setOpen] = useRecoilState(openVideo);
  const url = useRecoilValue(videoUrl);

  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(true);
  const [template, setTemplate] = useState("");

  const onToggleVideo = () => {
    setOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.default.get(`/profile?id=${saplingId}`);
      if (response.status === 200) {
        // let data = response.data.usertrees.filter(function (data) {return data.tree.sapling_id === saplingId});
        setUserinfo(response.data);
        setTemplate(response.data?.usertrees[0]?.tree?.plot?.name.includes("G20") ? "G20" : "");
        console.log(response, template)
        setSelectedUserinfo(
          response.data.usertrees.filter(
            (data) => data.tree.sapling_id === saplingId
          )[0]
        );
      } else if (response.status === 204) {
        setLoading(false);
        setUserinfo(response.data);
      } else {
        setFound(false);
      }
    } catch (error) {
      setFound(false);
    }

    const overallResponse = await Axios.default.get(`/analytics/totaltrees`);
    if (overallResponse.status === 200) {
      setOverallInfo(overallResponse.data);
    }

    const pondImagesRes = await Axios.default.get(`/analytics/totalponds`);
    if (pondImagesRes.status === 200) {
      setPondsImages(pondImagesRes.data);
    }

    const actRes = await Axios.default.get(`/activity/`);
    if (pondImagesRes.status === 200) {
      setActivities(actRes.data);
    }

    setLoading(false);
  }, [
    template,
    saplingId,
    setUserinfo,
    setOverallInfo,
    setPondsImages,
    setActivities,
    setSelectedUserinfo,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pages = [
    {
      page: Profile,
      displayName: "Profile",
      logo: logo,
    },
    {
      page: Maps,
      displayName: "Site Map",
      logo: logo,
    },
    {
      page: Maps,
      displayName: "Trees",
      logo: logo,
    },
  ];
  const MainBox = () => {
    const Page = pages[index].page;
    return <Page saplingId={saplingId} />;
  };

  if (loading) {
    return <Spinner />;
  } else if (!found) {
    return <NotFound />;
  } else if (open) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Popup toggle={onToggleVideo}>
          <ReactPlayer url={url} width="100%" height="90%" controls={true} />
        </Popup>
      </div>
    );
  } else {
    return (
      <Box sx={{ display: "flex" }}>
        <LeftDrawer saplingId={saplingId} />
        <Box component="main"
          sx={{ backgroundColor: "#e5e5e5", width: matches ? "100%" : "65%" }}>
          <MainBox/>
        </Box>
        {
          template === "G20" ?
            <RightDrawer showWhatsNew={false}>
              <div className={styles.feed}>
                <TwitterEmbed/> 
              </div>
            </RightDrawer> :
            <RightDrawer showWhatsNew={true}/>
        }
      </Box>
    );
  }
};

const TwitterEmbed = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    document.getElementsByClassName("twitter-embed")[0].appendChild(script);
  }, []);
  return (
    <div className="twitter-embed">
      <a class="twitter-timeline"
        // data-width="360"
        data-height="560"
        href="https://twitter.com/g20org?ref_src=twsrc%5Etfw">Tweets by g20org
      </a>
    </div>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    feed: {
      marginLeft: "4%",
      marginRight: "4%",
      "&::-webkit-scrollbar": {
        width: "0.6em",
      },
      [theme.breakpoints.down("1025")]: {
        marginTop: "5px",
        maxHeight: "35vh",
      },
    }
  })
);  