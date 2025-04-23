import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';
import { styled } from '@mui/material/styles';

const AvatarWrapper = styled('div')({
  position: 'fixed',
  bottom: '90px',
  left: '20px',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  zIndex: 1000,
  overflow: 'hidden',
});

interface AvatarContainerProps {
  isVisible: boolean;
}

export const AvatarContainer: React.FC<AvatarContainerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <AvatarWrapper>
      <Canvas
        camera={{ position: [0, 1.5, 2.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Avatar scale={[1, 1, 1]} position={[0, -1, 0]} rotation={[0, 0.5, 0]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </AvatarWrapper>
  );
};

export default AvatarContainer;
