import React, { useEffect, useState } from "react";

const ScrambledImages: React.FC<{ images_urls: string[] }> = ({ images_urls }) => {
    const [images, setImages] = useState<string[]>([])
    const [imageSize, setImageSize] = useState("100%")

    useEffect(() => {
        setImages(images_urls.slice(0, 5))
        setImageSize(images_urls.length <= 3 ? "100%" : "55%")
    }, [images_urls])


    // Positioning rules for different image counts
    const positions: any = {
        2: [
            { top: "0%", left: "0%", rotate: -10 },
            { top: "30%", left: "10%", rotate: 10 },
        ],
        3: [
            { top: "0%", left: "0%", rotate: -5 },
            { top: "15%", left: "10%", rotate: 8 },
            { top: "35%", left: "15%", rotate: -8 },
        ],
        4: [
            { top: "0%", left: "0%", rotate: -8 },
            { top: "0%", left: "50%", rotate: 8 },
            { top: "50%", left: "0%", rotate: 5 },
            { top: "50%", left: "50%", rotate: -5 },
        ],
        5: [
            { top: "0%", left: "0%", rotate: -8 },
            { top: "0%", left: "50%", rotate: 8 },
            { top: "50%", left: "0%", rotate: 5 },
            { top: "50%", left: "50%", rotate: -5 },
            { top: "25%", left: "25%", rotate: 0 },
        ],
    };

    return (
        <div
            style={{
                position: "relative", // Ensure the container is relative
                width: "100%",
                height: "200px", // Set a fixed height for the container
                overflow: "hidden", // Prevent images from overflowing
            }}
        >
            {images.map((src, index) => {
                const { top, left, rotate } = positions[images.length][index];

                return (
                    <img
                        key={index}
                        src={src}
                        alt={`scrambled-${index}`}
                        className="absolute object-cover shadow-lg rounded-md"
                        style={{
                            position: 'absolute',
                            width: imageSize,
                            height: imageSize,
                            top,
                            left,
                            transform: `rotate(${rotate}deg)`,
                            zIndex: index,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default ScrambledImages;
