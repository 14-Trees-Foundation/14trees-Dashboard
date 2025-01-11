import { createStyles, makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { useRecoilValue } from "recoil";
import { searchResults } from "../../store/atoms";
import { Button } from "@mui/material";

export const UserList = () => {
  const searchResult = useRecoilValue(searchResults);

  let lastVisit = {}
  let profileImages = {}
  searchResult.users.map((i) => {
    let last = i.assigned_trees[0]?.assigned_at;
    let profile = i.assigned_trees[0]?.profile_image;
    i.assigned_trees.map((j) => {
      if (j.profile_image) profile = j.profile_image;
      if (j.assigned_at > last) {
        last = j.assigned_at
      }
    })

    lastVisit[i.id] = last
    profileImages[i.id] = profile
  })


  const classes = UseStyle();
  if (Object.keys(searchResult.users).length !== 0) {
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.itemlong}>Name</div>
          <div className={classes.itemshort}>Trees Assigned</div>
          <div className={classes.itemshort}>Trees Sponsored</div>
          <div className={classes.itemshort}></div>
          <div className={classes.itemshort}></div>
        </div>
        {searchResult.users.map((i) => {
          return (
            <div
              className={classes.box}
              key={i.id}
            >
              <Avatar
                className={classes.profile}
                alt="Profile"
                src={profileImages[i.id] ? profileImages[i.id] : undefined}
                sx={{ width: 40, height: 40 }}
              />
              <div className={classes.itemlong}>{i.name}</div>
              <div className={classes.itemshort}>{i.assigned_trees.length}</div>
              <div className={classes.itemshort}>{i.sponsored_trees}</div>
              <div className={classes.itemshort}>
                {i.sponsored_trees > 0 && <Button
                  variant="outlined"
                  color="success"
                  style={{ margin: "0 5px", textTransform: 'none' }}
                  onClick={() => {
                    const { hostname, host } = window.location;
                    if (hostname === "localhost" || hostname === "127.0.0.1") {
                      window.open("http://" + host + "/dashboard/" + i.id);
                    } else {
                      window.open("https://" + hostname + "/dashboard/" + i.id);
                    }
                  }}
                >
                  Sponsored View
                </Button>}
              </div>
              <div className={classes.itemshort}>
                {i.assigned_trees.length > 0 && <Button
                  variant="outlined"
                  color="success"
                  style={{ margin: "0 5px", textTransform: 'none' }}
                  onClick={() => {
                    const { hostname, host } = window.location;
                    if (hostname === "localhost" || hostname === "127.0.0.1") {
                      window.open("http://" + host + "/profile/user/" + i.id);
                    } else {
                      window.open("https://" + hostname + "/profile/user/" + i.id);
                    }
                  }}
                >
                  Dashboard View
                </Button>}
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
