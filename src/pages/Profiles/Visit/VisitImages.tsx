import { Box, ImageList, ImageListItem } from "@mui/material"
import { FC } from "react"

interface VisitImagesProps { }

const VisitImages: FC<VisitImagesProps> = () => {

    return (
        <Box>
            <ImageList cols={4}>
                {[1,2,3,4,5,6,7,8,9,10,11,12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                    <ImageListItem key={item}>
                        <img
                            src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
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