import { Box, ImageList, ImageListItem } from "@mui/material"
import { FC } from "react"

interface VisitImagesProps { 
    images: string[]
}

const VisitImages: FC<VisitImagesProps> = ({ images }) => {

    return (
        <Box>
            <ImageList cols={4}>
                {images.map((item, index) => (
                    <ImageListItem key={index}>
                        <img
                            src={item}
                            alt="green iguana"
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    )   
}

export default VisitImages;