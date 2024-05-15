import { Button } from '@mui/material';
import React, { useState } from 'react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapsible">
        <Button variant="contained" onClick={toggleOpen}>{title}</Button>
      {isOpen && <div className="collapsible__content">{children} <hr /></div>}
    </div>
  );
};

export default Collapsible;
