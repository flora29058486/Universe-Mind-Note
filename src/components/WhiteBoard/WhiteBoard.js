// WhiteBoard.js
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { BackLayerRender } from "./BackLayerRender";
import DrawNode from "./DrawNode.jsx";

const width = window.innerWidth;
const height = window.innerHeight;
const step = 60;
const padding = 200;

function generateBackgroundLayer() {
  // return [...Array(10)].map((_, i) => ({
  //   id: i.toString(),
  //   x: Math.random() * window.innerWidth,
  //   y: Math.random() * window.innerHeight,
  //   rotation: Math.random() * 180,
  //   isDragging: false,
  // }));
  return ({
    key: "backgroundLayer",
    id: "backgroundLayer",
    x: width,
    y: height + padding,
    // scale: 1,
  });
}

const INITIAL_BAKEGROUND_STATE = generateBackgroundLayer();

export const WhiteBoard = ({fileDrop}) => {
  const [backgroundLayerStat, setBackgroundLayerStat] = useState(INITIAL_BAKEGROUND_STATE);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {

  }, [position.x, position.y]);

  const handleDragStart = (e) => {
    e.cancelBubble = true;
    console.log('dragstart');
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    console.log('dragend');
    
    // 獲取拖動結束後的位置
    const position = e.target.position();
    const rel = e.target.getRelativePointerPosition();
    console.log(position);
    console.log(rel);
    // 更新位置狀態
    setPosition({ x: position.x, y: position.y });
  };

  return (
    <Stage
      width={width} 
      height={height}
      draggable={true}
      onDragEnd={handleDragEnd}
    >
      {/* <Layer
        key={backgroundLayerStat.id}
        id={backgroundLayerStat.id}
        x={backgroundLayerStat.x}
        y={backgroundLayerStat.y}
        // draggable
        isListening={false}
        // onDragStart={handleDragStart}
        // onDragEnd={handleDragEnd}
      >
        <BackLayerRender 
          width={width} 
          height={height} 
          positionx={position.x} 
          positiony={position.y} 
          step={step} 
        />
      </Layer> */}
      <BackLayerRender 
        width={width} 
        height={height} 
        positionx={position.x} 
        positiony={position.y} 
        step={step} 
      />
      <DrawNode
        fileCount={fileDrop.length}
        circleRadius={60}
        positionx={position.x} 
        positiony={position.y} 
      />
      {/* <Layer>
        <DrawNode
          fileCount={fileDrop.length}
          circleRadius={60}
          positionx={position.x} 
          positiony={position.y} 
        />
      </Layer> */}
    </Stage>
  );
};
