import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { useRecoilValue } from "recoil";
import { searchResults } from "../../store/atoms";

export const UserList = ({ handleClick }) => {
  const searchResult = useRecoilValue(searchResults);

  const classes = UseStyle();
  if (Object.keys(searchResult.users).length !== 0) {
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.itemlong}></div>
          <div className={classes.itemlong}>Name</div>
          <div className={classes.itemshort}>No. Of Plants</div>
          <div className={classes.itemshort}>Last Vsit</div>
        </div>
        {searchResult.users.map((i) => {
          return (
            <div
              className={classes.box}
              key={i._id}
              onClick={() => {
                handleClick(i.user_trees[0]);
              }}
            >
              <Avatar
                className={classes.profile}
                alt="Profile"
                src={i.user_trees[0]?.profile_image?.length > 0 ? i.user_trees[0].profile_image[0] : ""}
                sx={{ width: 40, height: 40 }}
              />
              <div className={classes.itemlong}>{i.name}</div>
              <div className={classes.itemshort}>{i.user_trees.length}</div>
              <div className={classes.itemshort}>
                {i.user_trees[0].date_added
                  ? i.user_trees[0].date_added.slice(0, 10)
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div></div>;
  }
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    header: {
      display: "flex",
      width: "100%",
      height: "15px",
      fontSize: "12px",
      fontWeight: "400",
      color: "#000000",
      margin: "2px",
      marginLeft: "4%",
      marginBottom: "3%",
    },
    itemlong: {
      width: "23%",
      // textAlign: 'center',
      alignSelf: "center",
      marginLeft: "2%",
    },
    itemshort: {
      width: "23%",
      textAlign: "center",
      alignSelf: "center",
    },
    profile: {
      position: "absolute",
      top: "0",
      bottom: "0",
      margin: "auto",
      marginLeft: "4%",
    },
    box: {
      marginBottom: "10px",
      width: "100%",
      minHeight: "80px",
      borderRadius: "5px",
      backgroundColor: "#ffffff",
      fontSize: "16px",
      fontWeight: "450",
      display: "flex",
      cursor: "pointer",
      justifyContent: "center",
      "&:hover": {
        transform: "scale(1.01)",
      },
      [theme.breakpoints.down("480")]: {
        fontSize: "14px",
        minHeight: "70px",
      },
    },
  })
);

export default UserList;
