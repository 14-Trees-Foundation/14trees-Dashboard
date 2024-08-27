import React, { FC, useState } from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-custom.css";
import { ImagesSlider } from "../../components/ImagesSlider";

interface ImageSliderProps {
    images: string[];
}

const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setIndex(index);
        setOpen(true);
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => handleImageClick(index)}>
                        <img src={image} alt={`slide-${index}`} style={{ width: "250px", height: '140px', borderRadius: 10, margin: 3 }} />
                    </Box>
                ))}
            </Slider>
            <ImagesSlider 
                images={images}
                open={open}
                onClose={() => setOpen(false)}
                currentIndex={index}
            />
        </Box>
    );
}

export default ImageSlider;
