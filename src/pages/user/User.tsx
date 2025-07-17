import { useRecoilValue } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

import { UserLeftDrawer } from "./LeftDrawer";
import {
  adminNavIndex,
} from "../../store/adminAtoms";
import GiftTrees from "../admin/gift/GiftTreesRefactored"

export const User = () => {
  const classes = useStyles();
  const index = useRecoilValue(adminNavIndex);

  const pages = [
    {
      page: GiftTrees,
      displayName: "Gift Cards",
    },
  ];

  const mainBox = () => {
    const Page = pages[index].page;
    return (
      <div className={classes.outlet}>
        <Page />
      </div>
    );
  };

  return (
    <div className={classes.box}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <UserLeftDrawer />
        <Box
          component="main"
          sx={{ minWidth: "1080px", p: 2, width: "100%" }}
        >
          {mainBox()}
        </Box>
      </Box>
    </div>
  );

};

const useStyles = makeStyles((theme: any) =>
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
