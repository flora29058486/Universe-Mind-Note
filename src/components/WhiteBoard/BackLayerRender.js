import React, { useState, useEffect } from 'react';
import { Rect, Layer } from "react-konva";

export const BackLayerRender = ({ width, height, positionx, positiony, step }) => {
  const [grid, setGrid] = useState([]);

  // Smooth math for point
  function getLayerPoint(x, y, step) {
    let nextx = x;
    let nexty = y;

    while(Math.round(nextx) % step !== 0) {
      nextx++;
    }
    while(Math.round(nexty) % step !== 0) {
      nexty++;
    }

    return {x: Math.round(nextx), y: Math.round(nexty) };
  }

  const renderGrid = (width, height, x, y, step) => {

    const position = getLayerPoint(x, y, step);
    width = width + (-position.x);
    height = height - position.y;

    const newx = -position.x;
    const newy = -position.y;

    const rects = [];
    // width, height + padding * scale
    for (let y = newy; y < height; y += step) {
      for (let x = newx; x < width; x += step) {
        rects.push(createRect(x, y));
      }
    }
    return rects;
  };

  const createRect = (x, y) => {
    return (
      <Rect
        key={`${x}-${y}`} // Adding a unique key for each rectangle
        x={x}
        y={y}
        width={step}
        height={step}
        name='background'
        stroke="#e2e2ea"
        strokeWidth={1}
        lineCap="round"
        lineJoin="round"
        isListening={false}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
        hitStrokeWidth={0}
      />
    );
  };

  useEffect(() => {
    // setPosition(positionx, positiony);
    // setGrid(renderGrid(width, height, position.x, position.y, step));
    setGrid(renderGrid(width, height, positionx, positiony, step));
    console.log(grid);
  }, [positionx, positiony, width, height]);

  return (<Layer>
    {grid}
  </Layer>);
};
