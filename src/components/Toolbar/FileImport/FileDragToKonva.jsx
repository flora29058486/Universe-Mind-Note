import React, { useState } from 'react';
import Chip from '@mui/material/Chip';

const FileDragToKonva = ({ files }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (event) => {
    if (isDragging) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Chip
      label={Array.isArray(files) ? `${files.length} items` : files} // 取決於是單個還是多個
      style={{ position: 'absolute', top: position.y, left: position.x, cursor: 'pointer' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      // 其他需要的屬性和樣式
    />
  );
};

export default FileDragToKonva;