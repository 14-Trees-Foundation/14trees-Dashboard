import { Modal, Card, CardMedia, Grid, Backdrop, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { FC, useState } from 'react';
import { ImagesSlider } from './ImagesSlider';

interface ImageGridModalInputProps {
    title?: string
    open: boolean;
    onClose: () => void;
    imageUris: string[];
}

const ImageGridModal: FC<ImageGridModalInputProps> = ({ title = 'Images', open, onClose, imageUris }) => {
    const [index, setIndex] = useState(0);
    const [sliderOpen, setSliderOpen] = useState(false);

    const handleImageClick = (currentIndex: number) => {
        setIndex(currentIndex);
        setSliderOpen(true);
    }

    return (
        <Modal
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            open={open}
            onClose={onClose}
        >

            <div style={{
                outline: 'none',
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.6)',
                height: '100%',
                width: '100%',
                marginBottom: '25px'
            }}>
                <div style={{ margin: '30px', display: 'flex', alignItems: 'center' }} >
                    <div style={{ flexGrow: 1 }}>
                        <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}><ImageIcon fontSize='large' sx={{ marginX: 2 }} /> {title}</h2>
                    </div>
                    <IconButton
                        style={{ color: 'white' }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                        {imageUris.map((uri, index) => (
                            <Grid item key={index}>
                                <Card sx={{ minWidth: 200, maxWidth: 300 }} onClick={() => { handleImageClick(index); }}>
                                    <CardMedia
                                        sx={{ height: 200 }}
                                        image={uri}
                                        title={`Image ${index + 1}`}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <ImagesSlider 
                        open={sliderOpen}
                        currentIndex={index}
                        onClose={() => { setSliderOpen(false); }}
                        images={imageUris}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ImageGridModal;
