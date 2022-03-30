import {
  Button,
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import EditIcon from '@mui/icons-material/Edit';

import { albums, wwSelectedAlbumImage } from "../../store/adminAtoms";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { ShowImagesDlg } from "./ShowImagesDlg";

export const Albums = ({ handleCreateAlbum, handleDeleteAlbum }) => {
  const albumsData = useRecoilValue(albums);
  const setImages = useSetRecoilState(wwSelectedAlbumImage);
  const [delAlbumDlg, setDelAlbumDlg] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [createAlbmDlgOpen, setAlbnDlgOpen] = useState(false);
  const [showAlbmDlgOpen, setShowAlbmDlgOpen] = useState(false);
  const classes = useStyles();

  const handleClickDlgOpen = () => {
    setAlbnDlgOpen(true);
  };

  const handleDlgClose = () => {
    setAlbnDlgOpen(false);
  };

  const handleAlbumClick = (images) => {
    setImages(images);
    setShowAlbmDlgOpen(true);
  };

  const handleSubmit = (name, files) => {
    handleCreateAlbum(name, files);
  };

  const handleDelAlbumDlgClose = () => {
    setDelAlbumDlg(false);
  };

  const handleAlbumNameChange = (albumn_name) => {
    setSelectedAlbum(albumn_name);
    setDelAlbumDlg(true);
  };

  const deleteAlbum = async () => {
    handleDeleteAlbum(selectedAlbum);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          align="left"
          sx={{ pl: 1, fontWeight: "600", color: "#1f3625" }}
        >
          Albums ({albumsData.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClickDlgOpen()}
        >
          Create Album
        </Button>
      </div>
      <Typography variant="subtitle1" align="left" sx={{ pl: 1 }}>
        These albums can be used to add memory images while gifting.
      </Typography>
      <ShowImagesDlg
        open={showAlbmDlgOpen}
        onClose={() => setShowAlbmDlgOpen(false)}
      />
      <CreateAlbumDialog
        open={createAlbmDlgOpen}
        onClose={handleDlgClose}
        formData={handleSubmit}
      />
      <Dialog
        open={delAlbumDlg}
        onClose={() => {
          setDelAlbumDlg(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Album?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to delete. These album images will still
            be there, if you have used them in any profile assignment
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelAlbumDlgClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteAlbum();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {albumsData.length > 0 && (
        <div className={classes.albumbox}>
          <Grid container spacing={5}>
            {albumsData.map((albumData) => {
              return (
                <Grid item xs={12} md={6} lg={4}>
                  <Box
                    sx={{
                      minWidth: "100%",
                      maxWidth: "320px",
                      minHeight: "320px",
                      borderRadius: "15px",
                      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        height: "40px",
                        minWidth: "40px",
                        background: "#fff",
                        top: "-15px",
                        right: "-10px",
                        borderRadius: "8px",
                        display: "flex",
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {/* <EditIcon style={{
                                                            color: '#3C79BC',
                                                            paddingTop: '4px',
                                                            paddingLeft: '6px',
                                                            fontSize: '32px'
                                                        }} onClick={() => editAlbum(albumData)}/> */}
                      <DeleteForeverIcon
                        style={{
                          color: "#C72542",
                          paddingTop: "4px",
                          paddingLeft: "6px",
                          fontSize: "32px",
                        }}
                        onClick={() => {
                          handleAlbumNameChange(albumData);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        backgroundImage: `url("${albumData.images[0]}")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        width: "100%",
                        height: "320px",
                        borderRadius: "15px",
                      }}
                      onClick={() => handleAlbumClick(albumData.images)}
                    >
                      <div
                        style={{
                          width: "calc(100% - 10px)",
                          height: "60px",
                          backgroundColor: "rgb(0, 0, 0)",
                          background: "rgba(0, 0, 0, 0.8)",
                          color: "#ffffff",
                          fontSize: "18px",
                          fontWeight: "600",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          textAlign: "center",
                          borderBottomLeftRadius: "15px",
                          borderBottomRightRadius: "15px",
                          position: "absolute",
                          bottom: 0,
                        }}
                      >
                        {albumData.album_name.split("/")[2]}
                      </div>
                    </div>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    images: {
      marginTop: "40px",
      height: "50vh",
      width: "80%",
      marginRight: "auto",
      [theme.breakpoints.down("480")]: {
        width: "100%",
        height: "45vh",
      },
    },
    checkbox: {
      marginTop: "60px",
      height: "auto",
      width: "20%",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      [theme.breakpoints.down("480")]: {
        width: "100%",
      },
    },
    albumbox: {
      margin: "32px",
      padding: theme.spacing(5),
      borderRadius: "15px",
      backgroundColor: "#ffffff",
    },
  })
);
