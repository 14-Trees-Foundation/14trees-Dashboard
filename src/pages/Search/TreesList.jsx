import { createStyles, makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { useRecoilValue } from "recoil";
import { searchResults } from "../../store/atoms";
import { Button } from "@mui/material";

export const TreesList = () => {
  const searchResult = useRecoilValue(searchResults);

  const classes = UseStyle();
  if (searchResult.trees?.length !== 0) {
    return (
      <div style={{ marginTop: '70px' }}>
        <div className={classes.header}>
          <div className={classes.itemshort}>Tree ID</div>
          <div className={classes.itemshort}>Plant Type</div>
          <div className={classes.itemshort}>Planted By</div>
          <div className={classes.itemshort}>Assiged To</div>
          <div className={classes.itemshort}></div>
        </div>
        {searchResult.trees.map((i) => {
          return (
            <div
              className={classes.box}
              key={i.id}
            >
              <Avatar
                className={classes.profile}
                alt="Profile"
                src={i.user_tree_image ? i.user_tree_image : i.image}
                sx={{ width: 40, height: 40 }}
              />
              <div className={classes.itemlong}>{i.sapling_id}</div>
              <div className={classes.itemshort}>{i.plant_type}</div>
              <div className={classes.itemshort}>{i.planted_by}</div>
              <div className={classes.itemshort}>{i.assigned_to_name}</div>
              <div className={classes.itemshort}>
                <Button
                  variant="outlined"
                  color="success"
                  style={{ margin: "0 5px", textTransform: 'none' }}
                  onClick={() => {
                    const { hostname, host } = window.location;
                    if (hostname === "localhost" || hostname === "127.0.0.1") {
                      window.open("http://" + host + "/profile/" + i.sapling_id);
                    } else {
                      window.open("https://" + hostname + "/profile/" + i.sapling_id);
                    }
                  }}
                >
                  Dashboard View
                </Button>
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

export default TreesList;
