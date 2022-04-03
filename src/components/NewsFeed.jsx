import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sortedActivites } from "../store/selectors";
import { openVideo, videoUrl } from "../store/atoms";
import Divider from "@mui/material/Divider";

export const NewsFeed = () => {
  const classes = useStyles();
  const activities = useRecoilValue(sortedActivites);
  const setOpen = useSetRecoilState(openVideo);
  const setVideoUrl = useSetRecoilState(videoUrl);

  const playVideo = (url) => {
    setVideoUrl(url);
    setOpen(true);
  };

  const element = (value) => {
    if (value.type === "2") {
      const vimagelink =
        "https://img.youtube.com/vi/" +
        value.video.split("?v=").pop() +
        "/mqdefault.jpg";
      const date = value.date.slice(0, 10);
      return (
        <div
          onClick={() => playVideo(value.video)}
          style={{ cursor: "pointer" }}
        >
          <img className={classes.videoimg} src={vimagelink} alt={"video"} />
          <div
            style={{ marginTop: "5px", fontWeight: "500", fontSize: "13px" }}
          >
            {value.title}
          </div>
          <div
            style={{ marginTop: "3px", fontWeight: "450", fontSize: "12px" }}
          >
            {date}
          </div>
          <Divider style={{ margin: "2% 0 2% 0" }} />
        </div>
      );
    } else {
      const date = value.date.slice(0, 10);
      return (
        <div>
          <div style={{ display: "flex", marginTop: "5%" }}>
            <img
              className={classes.actimg}
              src={value.images[0]}
              alt={"video"}
            />
            <div
              style={{ marginTop: "8%", fontWeight: "500", fontSize: "12px" }}
            >
              {value.title}
              <div
                style={{
                  marginTop: "3px",
                  fontWeight: "350",
                  fontSize: "10px",
                }}
              >
                {date}
              </div>
            </div>
          </div>
          <Divider style={{ margin: "5% 0 2% 0" }} />
        </div>
      );
    }
  };
  return (
    <div className={classes.main}>
      {activities.map((item, i) => {
        return <div key={i}>{element(item)}</div>;
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      minWidth: "80%",
      maxWidth: "420px",
      minHeight: "100%",
    },
    videoimg: {
      borderRadius: "10px",
      width: "100%",
    },
    actimg: {
      width: "45%",
      height: "70px",
      borderRadius: "10px",
      marginRight: "5%",
      objectFit: "cover",
    },
  })
);
