import React from 'react';
import Slider from 'react-slick';
import { Box, CardMedia } from '@mui/material';

type Props = {
    imageUrls: string[];
};

const ImageCarousel: React.FC<Props> = ({ imageUrls }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    return (
        <Box
            sx={{
                maxWidth: 300,
                maxHeight: 400,
                mx: 'auto',
                overflow: 'hidden',
                borderRadius: 2
            }}
        >
            <Slider {...settings}>
                {imageUrls.map((url, idx) => (
                    <Box key={idx}>
                        <CardMedia
                            component="img"
                            image={url}
                            alt={`Image ${idx + 1}`}
                            sx={{
                                width: '100%',
                                height: 400,
                                objectFit: 'cover',
                                borderRadius: 2
                            }}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default ImageCarousel;
