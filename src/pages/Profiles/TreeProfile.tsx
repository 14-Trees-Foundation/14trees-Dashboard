import { FC } from "react";
import { Box, Divider, Drawer } from "@mui/material";
import logo from "../../assets/logo_white_small.png";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activitiesData, navIndex } from "../../store/atoms";
import { createStyles, makeStyles } from "@mui/styles";
import TreePage from "./Tree";
import { RightDrawer } from "../../components/RightDrawer";

interface TreeProfileProps {}

const TreeProfile: FC<TreeProfileProps> = ({ }) => {

    const [index, setIndex] = useRecoilState(navIndex);
    const setActivities = useSetRecoilState(activitiesData);
    const classes = useStyles();

    const onClickNav = (value: any) => {
        setIndex(value);
    };

    const pages = [
        {
            page: TreePage,
            displayName: "Tree Profile",
            logo: logo,
        },
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

    const mainBox = () => {
        const Page = pages[index].page;
        return (
          <div >
            <Page />
          </div>
        );
    };

    const activities: any[] = [
        {
            "images": [],
            "_id": "614efee3e9781c14cd80fd32",
            "title": "Project 40,000 trees for IIT Kanpur Diamond Jubilee Celebration",
            "type": "2",
            "date": "2021-09-24T18:30:00.000Z",
            "desc": "On the occasion of IIT Kanpur's Diamond Jubilee, let us plant one tree in the name of each IIT Kanpur alum. ",
            "author": "Abhishek Singh",
            "video": "https://www.youtube.com/watch?v=YCVP3bon5Zs",
            "__v": 0
        },
        {
            "_id": "61da41a5979ec94446ff66b1",
            "title": "Project 14 Trees: What, Why and How",
            "type": "2",
            "date": "2022-01-07T18:30:00.000Z",
            "desc": "14 Trees Foundation is a charitable organisation dedicated to building sustainable, carbon-footprint-neutral eco-systems through re-forestation. We are on a mission to transform barren, unused patches of land into sustainable forests.",
            "author": "Pravin Bhagwat",
            "images": [],
            "video": "https://www.youtube.com/watch?v=V-fZmDAyFVs",
            "__v": 0
        }
    ]

    setActivities(activities);

    return (
        <Box style={{ display: "flex" }} >
            <Drawer
                className={classes.mdrawer}
                variant="persistent"
                anchor="left"
                open={true}
            >
                <Divider />
                <img className={classes.logo} alt={"logo"} src={logo} />
                {menuitem()}
            </Drawer>
            <Box style={{ padding: 10 }}>
                { mainBox() }
            </Box>
            <RightDrawer showWhatsNew={true}/>
        </Box>
    );
}

const useStyles = makeStyles((theme: any) =>
  createStyles({
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
    mdrawer: {
      width: "15%",
      "& .MuiPaper-root": {
        width: "15%",
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

export default TreeProfile;