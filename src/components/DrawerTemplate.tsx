import { FC } from "react";
import { Box, Divider, Drawer } from "@mui/material";
import logo from "../assets/logo_white_small.png";
import { useRecoilState, useSetRecoilState } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";
import { navIndex } from "../store/atoms";

interface DrawerTemplateProps {
    pages: any[]
}

const DrawerTemplate: FC<DrawerTemplateProps> = ({ pages }) => {

    const [index, setIndex] = useRecoilState(navIndex);
    const classes = useStyles();

    const onClickNav = (value: any) => {
        setIndex(value);
    };

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
            <Box style={{ padding: 20, flexGrow: 1, overflow: 'hidden' }}>
                { mainBox() }
            </Box>
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

export default DrawerTemplate;