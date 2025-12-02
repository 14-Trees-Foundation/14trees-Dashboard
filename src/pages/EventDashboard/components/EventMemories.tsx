import React, { useRef, useState } from "react";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useMediaQuery, Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import plantingIllustration from "../../../assets/planting_illustration.jpg";
import image7 from "../../../assets/image 7.png";
import image10 from "../../../assets/image 10.png";
import aranyaPoster from "../../../assets/ARANYA_poster.jpg";
import neem from "../../../assets/neem.png";

interface ImageCarouselProps {
    imageUrls: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
    // Default images used when no event memories are provided
    // Using local assets already present in the repo (static imports)
    const defaultImages: string[] = [
        plantingIllustration,
        image7,
        image10,
        aranyaPoster,
        neem,
    ];

    const effectiveImageUrls: string[] = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : defaultImages;
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

    // chunk images into pairs so each carousel slide shows 2 images side-by-side
    const chunks: Array<Array<string | null>> = [];
    for (let i = 0; i < effectiveImageUrls.length; i += 2) {
        const first = effectiveImageUrls[i] ?? null;
        const second = effectiveImageUrls[i + 1] ?? null;
        chunks.push([first, second]);
    }

    return (
        <div
            style={{
                width: "100%",
                maxWidth: isMobile ? "96vw" : "80vw",
                height: isMobile ? "250px" : "420px",
                overflow: "hidden",
                position: "relative",
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
                {chunks.map((pair, chunkIndex) => (
                    <div key={chunkIndex}>
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                width: "100%",
                                gap: "17px",
                            }}
                        >
                            {pair.map((url, pos) => {
                                const originalIndex = chunkIndex * 2 + pos;
                                return (
                                    <div
                                        key={pos}
                                        style={{
                                            flex: "1 1 0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: url ? "zoom-in" : "default",
                                        }}
                                        onClick={() => url && openLightbox(originalIndex)}
                                        role={url ? "button" : undefined}
                                        tabIndex={url ? 0 : -1}
                                        onKeyDown={(event) => {
                                            if (url && (event.key === "Enter" || event.key === " ")) {
                                                event.preventDefault();
                                                openLightbox(originalIndex);
                                            }
                                        }}
                                    >
                                        {url ? (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: isMobile ? 230 : 400,
                                                    overflow: "hidden",
                                                    borderRadius: 8,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Slide ${originalIndex}`}
                                                    style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        display: "block",
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ width: "100%", height: isMobile ? 230 : 400 }} />
                                        )}
                                    </div>
                                );
                            })}
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
                            src={effectiveImageUrls[activeImageIndex]}
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