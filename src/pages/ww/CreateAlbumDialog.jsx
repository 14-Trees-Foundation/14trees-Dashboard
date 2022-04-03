import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateAlbumDialog = (props) => {
  const { open, onClose, formData } = props;
  const [files, setFiles] = React.useState([]);
  const classes = useStyles();
  const [albumName, setAName] = React.useState("");
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    onDropRejected: (rejectedFiles) => {
      toast.error("Only 10 images allowed!");
    },
  });

  const thumbs = files.map((file) => (
    <div stye={{ display: "inline-flex" }} key={file.name}>
      <div style={{ display: "flex", minWidth: 0, overflow: "hidden" }}>
        <img className={classes.preview} src={file.preview} alt="thumb" />
      </div>
    </div>
  ));

  const handleAlbumName = (event) => {
    setAName(event.target.value);
  };

  const handleSubmit = () => {
    if (albumName === "") {
      toast.error("Album name required!");
    } else {
      onClose();
      formData(albumName, files);
    }
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography variant="body1" align="center">
          Select upto 10 images for your album
        </Typography>
        <Typography variant="subtitle1" align="center">
          Please select a unique album name
        </Typography>
      </DialogTitle>
      <ToastContainer />
      <DialogContent>
        <div
          style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "380px" }}
        >
          <TextField
            variant="outlined"
            label="Album name"
            onChange={(e) => handleAlbumName(e)}
            fullWidth
            // error={error}
          />
          <div className={classes.imgdiv}>
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p style={{ cursor: "pointer" }}>
                  Upload album images. Click or Drag!
                </p>
              </div>
            </section>
          </div>
          <div className={classes.prevcontainer}>{thumbs}</div>
          <div className={classes.actions}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Album
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  imgdiv: {
    padding: "8px",
    marginTop: "8px",
    marginBottom: "8px",
    border: "1px #1f3625 dashed",
    textAlign: "center",
  },
  preview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    margin: "8px",
  },
  prevcontainer: {
    margin: "16px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));
