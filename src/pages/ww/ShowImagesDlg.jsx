import { Dialog, DialogContent } from "@mui/material";
import { useRecoilValue } from "recoil";

import { wwSelectedAlbumImage } from "../../store/adminAtoms";

export const ShowImagesDlg = (props) => {
  const { open, onClose } = props;
  const images = useRecoilValue(wwSelectedAlbumImage);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          p: 2,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {Object.keys(images).length !== 0 ? (
            images.map((image) => {
              return (
                <img
                  src={image}
                  alt="album"
                  style={{
                    width: "100%",
                    height: "auto",
                    paddingBottom: "16px",
                  }}
                />
              );
            })
          ) : (
            <div></div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
