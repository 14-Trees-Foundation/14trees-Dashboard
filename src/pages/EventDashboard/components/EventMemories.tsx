import React, { useRef, useState } from "react";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useMediaQuery, Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ImageCarouselProps {
    imageUrls: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    const carouselRef = useRef<CarouselRef | null>(null);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        if (typeof document !== "undefined") {
            const activeElement = document.activeElement;
            if (activeElement instanceof HTMLElement) {
                activeElement.blur();
            }
        }

        setActiveImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setActiveImageIndex(null);
    };

    const arrowClassName = "event-memories-carousel-arrow";

    const arrowBaseStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        width: isMobile ? 32 : 40,
        height: isMobile ? 32 : 40,
        borderRadius: "50%",
        background: "rgba(0, 0, 0, 0.45)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        pointerEvents: "auto",
    };

    const prevArrow = (
        <button
            type="button"
            aria-label="Previous image"
            className={arrowClassName}
            style={{ ...arrowBaseStyle, left: isMobile ? 8 : 16 }}
            onClick={(event) => {
                event.stopPropagation();
                if (carouselRef.current) {
                    carouselRef.current.prev();
                }
            }}
        >
            <LeftOutlined />
        </button>
    );

    const nextArrow = (
        <button
            type="button"
            aria-label="Next image"
            className={arrowClassName}
            style={{ ...arrowBaseStyle, right: isMobile ? 8 : 16 }}
            onClick={(event) => {
                event.stopPropagation();
                if (carouselRef.current) {
                    carouselRef.current.next();
                }
            }}
        >
            <RightOutlined />
        </button>
    );

    return (
        <div
            style={{
                width: "100%",
                maxWidth: isMobile ? "96vw" : "80vw", // Full width for mobile, 80vw for larger screens
                height: isMobile ? "250px" : "420px", // Adjust height for mobile
                overflow: "hidden",
                position: "relative",
                // margin: "0 auto",
                // display: "flex",
                // justifyContent: "center",
            }}
        >
            <Carousel
                ref={carouselRef}
                autoplay
                arrows
                dots
                prevArrow={prevArrow}
                nextArrow={nextArrow}
                style={{ width: "100%", height: "100%" }}
            >
                {imageUrls.map((url, index) => (
                    <div key={index}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                                cursor: "zoom-in",
                            }}
                            onClick={() => openLightbox(index)}
                            // onMouseEnter={() => !isMobile && openLightbox(index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    openLightbox(index);
                                }
                            }}
                        >
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                style={{
                                    height: isMobile ? "230px" : "400px",
                                    width: 'auto',
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </Carousel>

            <Dialog
                fullScreen
                open={isLightboxOpen && activeImageIndex !== null}
                onClose={closeLightbox}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.92)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                <IconButton
                    aria-label="Close image preview"
                    onClick={closeLightbox}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "#fff",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        '&:hover': {
                            backgroundColor: "rgba(0,0,0,0.7)",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {activeImageIndex !== null && (
                    <Box
                        sx={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={imageUrls[activeImageIndex]}
                            alt={`Expanded slide ${activeImageIndex}`}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                )}
            </Dialog>
        </div>
    );
};

export default ImageCarousel;