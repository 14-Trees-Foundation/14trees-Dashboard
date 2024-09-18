import { Box, ImageList, ImageListItem } from "@mui/material"
import { FC, useState } from "react"
import { ImagesSlider } from "../../../components/ImagesSlider";

interface VisitImagesProps { 
    images: string[]
}

const VisitImages: FC<VisitImagesProps> = ({ images }) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setIndex(index);
        setOpen(true);
    }

    return (
        <Box>
            <ImageList cols={4}>
                {images.map((item, index) => (
                    <ImageListItem key={index} onClick={() => handleImageClick(index)}>
                        <img
                            src={item}
                            alt="green iguana"
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>

            <ImagesSlider open={open} onClose={() => setOpen(false)} currentIndex={index} images={images}/>
        </Box>
    )   
}

export default VisitImages;