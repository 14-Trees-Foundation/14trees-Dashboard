import React from "react";
import { Carousel } from "antd";
import { useMediaQuery } from "@mui/material";

interface ImageCarouselProps {
    imageUrls: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <div
            style={{
                width: "100%",
                maxWidth: isMobile ? "96vw" : "80vw", // Full width for mobile, 80vw for larger screens
                height: isMobile ? "250px" : "420px", // Adjust height for mobile
                overflow: "hidden",
            }}
        >
            <Carousel autoplay dots style={{ width: "100%", height: "100%" }}>
                {imageUrls.map((url, index) => (
                    <div key={index}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                style={{
                                    height: isMobile ? "230px" : "400px",
                                    width: 'auto',
                                    // maxHeight: "100%",
                                    // maxWidth: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ImageCarousel;