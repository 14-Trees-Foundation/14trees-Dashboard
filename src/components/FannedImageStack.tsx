import React from 'react';

type FannedImageStackProps = {
  imageUrls: string[];
  cardWidth?: number;
  cardHeight?: number;
  overlapOffset?: number; // in pixels
};

const FannedImageStack: React.FC<FannedImageStackProps> = ({
  imageUrls,
  cardWidth = 120,
  cardHeight = 180,
  overlapOffset = 25,
}) => {
  return (
    <div style={{ position: 'relative', width: cardWidth + (imageUrls.length - 1) * overlapOffset, height: cardHeight }}>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`card-${index}`}
          style={{
            position: 'absolute',
            left: index * overlapOffset,
            width: cardWidth,
            height: cardHeight,
            objectFit: 'cover',
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: index,
          }}
        />
      ))}
    </div>
  );
};

export default FannedImageStack;