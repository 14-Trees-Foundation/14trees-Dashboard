import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material"
import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue } from "recoil";
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';

import { albums } from "../../store/adminAtoms";
import { selectedAlbum, selectedAlbumName, selectedImages } from '../../store/selectors';
import { useState } from "react";
import { CreateAlbumDialog } from "./CreateAlbumDialog";

export const Albums = ({handleCreateAlbum}) => {
    const albumsData = useRecoilValue(albums);
    const sAlbum = useRecoilValue(selectedAlbum);
    const sAName = useRecoilValue(selectedAlbumName);
    const sImages = useRecoilValue(selectedImages);
    const [createAlbmDlgOpen, setAlbnDlgOpen] = useState(false);
    const classes = useStyles();
    const [values, setValues] = useState({
        selectedAlbum: sAlbum,
        selectedAName: sAName,
        images: sImages,
        loading: false,
        backdropOpen: false
    });

    const handleClickDlgOpen = () => {
        setAlbnDlgOpen(true)
    }

    const handleDlgClose = () => {
        setAlbnDlgOpen(false)
    }

    const handleSelect = (event) => {
        setValues({
            ...values,
            selectedAlbum: albumsData.find(obj => {return obj.album_name === event.target.value}),
            selectedAName: event.target.value,
            images: albumsData.find(obj => {return obj.album_name === event.target.value}).images.map((image) => ({
                src: image
            }))
        })
    }

    const handleSubmit = (name, files) => {
        handleCreateAlbum(name, files)
    }
    return (
        <>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography variant="h4" align="left" sx={{pl:1,fontWeight: '600', color: '#1f3625'}}>
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
            <Typography variant='subtitle1' align="left" sx={{pl:1}}>
                    These albums can be used to add memory images while gifting.
                </Typography>
            <CreateAlbumDialog open={createAlbmDlgOpen} onClose={handleDlgClose} formData={handleSubmit}/>
            {
                albumsData.length > 0 && (
                    <div className={classes.albumbox} style={{display:'flex'}}>
                        <div className={classes.checkbox}>
                            <Typography variant='h5'>
                                Your Albums
                            </Typography>
                            <FormControl component="fieldset" sx={{alignSelf:'center', pl:2}}>
                                <RadioGroup onChange={handleSelect} value={values.selectedAName}>
                                {
                                    albumsData.map((albumData) => {
                                        return (
                                            <FormControlLabel value={albumData.album_name} control={<Radio />} label={albumData.album_name} />
                                        )
                                    })
                                }
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className={classes.images}>
                            <Carousel hasMediaButton={false} hasIndexBoard={false} images={values.images}/>
                        </div>
                    </div>
                )
            }
        </>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        images:{
            marginTop: '40px', height: '50vh', width: '60%',marginRight:'auto',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '45vh',
            },
        },
        checkbox:{
            marginTop: '60px', height: '50vh', width: '20%',marginLeft: 'auto',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '45vh',
            },
        },
        albumbox:{
            margin: '32px',
            paddingTop: '16px',
            paddingBottom: '32px',
            borderRadius: '15px',
            backgroundColor: '#ffffff'
        }
    })
)