import { createStyles, makeStyles } from "@mui/styles";
import { Typography, Box, Grid } from "@mui/material";
import ParkTwoToneIcon from "@mui/icons-material/ParkTwoTone";
import GrassTwoToneIcon from "@mui/icons-material/GrassTwoTone";
import PermIdentityTwoToneIcon from "@mui/icons-material/PermIdentityTwoTone";
import TerrainTwoToneIcon from "@mui/icons-material/TerrainTwoTone";
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import { useRecoilValue } from "recoil";

import { summary } from "../../../store/adminAtoms";
import { TreeLogCumulative } from "./TreeLogCumulative";
import { Apartment, Flag, HolidayVillage, HowToReg, LocationCity, OpacityTwoTone } from "@mui/icons-material";

export const AdminHome = () => {
  const adminSummary = useRecoilValue(summary);
  const classes = useStyles();
  return (
    <div>
      <Typography sx={{ p: 3, pb: 1 }} variant="h5">
        Summary
      </Typography>
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <ParkTwoToneIcon fontSize="large" style={{ color: "#1F3625" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.treeCount}
            </Typography>
            <Typography color="#1f3625" variant="subtitle2">
              Trees
            </Typography>
          </Box>
        </div>

        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <GrassTwoToneIcon fontSize="large" style={{ color: "#F94F25" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.plantTypeCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Plant Types
            </Typography>
          </Box>
        </div>

        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <HowToReg
              fontSize="large"
              style={{ color: "#6166B8" }}
            />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.bookedTreeCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Booked Trees
            </Typography>
          </Box>
        </div>

        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <AssignmentIndTwoToneIcon
              fontSize="large"
              style={{ color: "#6166B8" }}
            />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.assignedTreeCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Assigned Trees
            </Typography>
          </Box>
        </div>

        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <PermIdentityTwoToneIcon
              fontSize="large"
              style={{ color: "#C72542" }}
            />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.userCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Unique Profiles
            </Typography>
          </Box>
        </div>
      </Box>
      <Box style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}
      >
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <Flag fontSize="large" style={{ color: "#53ad7a" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.sitesCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Sites
            </Typography>
          </Box>
        </div>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <TerrainTwoToneIcon
              fontSize="large"
              style={{ color: "#573D1C" }}
            />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.plotCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Total Plots
            </Typography>
          </Box>
        </div>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <OpacityTwoTone fontSize="large" style={{ color: "#3C79BC" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.pondCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Total Ponds
            </Typography>
          </Box>
        </div>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <LocationCity fontSize="large" style={{ color: "#078085" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.districtsCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Districts
            </Typography>
          </Box>
        </div>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <Apartment fontSize="large" style={{ color: "#078085" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.talukasCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Talukas
            </Typography>
          </Box>
        </div>
        <div className={classes.card}>
          <Box sx={{ paddingTop: "10px" }}>
            <HolidayVillage fontSize="large" style={{ color: "#078085" }} />
            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
              {adminSummary.villagesCount}
            </Typography>
            <Typography variant="subtitle2" color="#1f3625">
              Villages
            </Typography>
          </Box>
        </div>
      </Box>
      <Box style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
        {adminSummary?.landTypeCounts && Object.entries(adminSummary.landTypeCounts).map(([key, value]) => (
          <div className={classes.card}>
            <Box sx={{ paddingTop: "10px" }}>
              <ParkTwoToneIcon fontSize="large" style={{ color: "#1F3625" }} />
              <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                {value}
              </Typography>
              <Typography variant="subtitle2" color="#1f3625">
                {key}
              </Typography>
            </Box>
          </div>)
        )}
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              background: "linear-gradient(145deg, #9faca3, #bdccc2)",
              p: 2,
              m: 2,
              borderRadius: 3,
              boxShadow: "14px 14px 19px #9eaaa1,-14px -14px 19px #c4d4c9",
            }}
          >
            {<TreeLogCumulative />}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      width: "100%",
      maxWidth: "180px",
      minHeight: "170px",
      maxHeight: "260px",
      borderRadius: "15px",
      textAlign: "center",
      padding: "16px",
      margin: "15px",
      background: "linear-gradient(145deg, #9faca3, #bdccc2)",
      // boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
      boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
    },
  })
);
