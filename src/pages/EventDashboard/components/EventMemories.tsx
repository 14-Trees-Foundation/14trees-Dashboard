import React from "react";
import { Carousel } from "antd";

interface ImageCarouselProps {
    imageUrls: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
    return (
        <div style={{ width: "100%", maxWidth: "80vw", height: "420px", overflow: "hidden" }}>
            <Carousel autoplay dots style={{ width: "100%", height: "100%" }}>
                {imageUrls.map((url, index) => (
                    <div key={index}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: "100%",
                                width: '100%',
                            }}
                        >
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                style={{
                                    height: '400px',
                                    width: 'auto',
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

