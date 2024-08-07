import React, { FC } from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-custom.css";

interface ImageSliderProps {
    images: string[];
}

const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <img src={image} alt={`slide-${index}`} style={{ width: "100%", maxHeight: "450px", borderRadius: 10 }} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}

export default ImageSlider;
