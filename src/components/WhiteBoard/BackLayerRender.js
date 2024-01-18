import React, { useState, useEffect, useCallback } from 'react';
import { Rect, Layer, Image } from "react-konva";
import useImage from 'use-image';

import randomShapeBackground from '../../Image/randomShapeBackground.png';
import whiteRectBackground from '../../Image/whiteRectBackground.png';
import greenRect from '../../Image/greenRect.jpg';

export const BackLayerRender = ({ width, height, positionx, positiony, background }) => {
  const [localBg, setLocalBg] = useState('line');
  const [step, setStep] = useState(60); // [px]
  const [grid, setGrid] = useState([]);
  const backgrounds = {
    randomShapeBackground: randomShapeBackground,
    whiteRectBackground: whiteRectBackground,
    greenRect: greenRect,
  };
  const [image, status] = useImage(backgrounds[background] || greenRect);

  const updateStepAndBackground = useCallback((bg) => {
    switch(bg) {
      case 'randomShapeBackground':
        setLocalBg('randomShapeBackground');
        setStep(210);
        break;
      case 'whiteRectBackground':
        setLocalBg('whiteRectBackground');
        setStep(80);
        break;
      case 'greenRect':
        setLocalBg('greenRect');
        setStep(100);
        break;
      default:
        setLocalBg('line');
        setStep(60);
    }
  }, []);

  useEffect(() => {
    updateStepAndBackground(background);
  }, [background, updateStepAndBackground]);

  const getLayerPoint = useCallback((x, y, step) => {
    let nextx = x;
    let nexty = y;

    while(Math.round(nextx) % step !== 0) {
      nextx++;
    }
    while(Math.round(nexty) % step !== 0) {
      nexty++;
    }

    return {x: Math.round(nextx), y: Math.round(nexty) };
  }, []);

  const createRect = useCallback((x, y, step) => {
    if (localBg !== 'line') {
      return (
        <Image
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={step}
          height={step}
          image={image}
        />
      );
    } else {
      return (
        <Rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={step}
          height={step}
          stroke="#e2e2ea"
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
        />
      );
    }
  }, [localBg, image, step]);

  const renderGrid = useCallback((width, height, x, y, step) => {
    const position = getLayerPoint(x, y, step);
    const adjustedWidth = width + (-position.x);
    const adjustedHeight = height - position.y;

    const newx = -position.x;
    const newy = -position.y;

    const rects = [];
    for (let y = newy; y < adjustedHeight; y += step) {
      for (let x = newx; x < adjustedWidth; x += step) {
        rects.push(createRect(x, y, step));
      }
    }
    return rects;
  }, [getLayerPoint, createRect, step]);

  useEffect(() => {
    if (status === 'loaded') {
      setGrid(renderGrid(width, height, positionx, positiony, step));
    }
  }, [positionx, positiony, width, height, step, renderGrid, status]);

  return (
    <Layer>
      {grid}
    </Layer>
  );
};

