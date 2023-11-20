import React, { useState, useEffect } from 'react';
import { Circle, Layer, Star } from 'react-konva';

const screenLeftSidePixel = 480;

const DrawNode = ({ dropnodeInfo, circleRadius, positionx, positiony, onNodeCreate }) => {
  const [nodes, setNodes] = useState();
  // console.log(dropnodeInfo);

  const fileCount = dropnodeInfo.length;
  // console.log(fileCount);
  const padding = 10; // 間距
  const squareSize = Math.ceil(Math.sqrt(fileCount)); // 正方形的邊長

  const handleDragStart = (e) => {
    e.cancelBubble = true;

    const id = e.target.id();
    setNodes(
      nodes.map((node) => {
        return {
          ...node,
          isDragging: node.id === id,
        };
      })
    );
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;

    setNodes(
      nodes.map((node) => {
        return {
          ...node,
          isDragging: false,
        };
      })
    );
  };

  const generateNodes = (dropnodeInfo) => {

    const NodesGenerate = dropnodeInfo.map((fileInfo, counter) => {
      const nodeId = fileInfo.nodeId;
      const fileName = fileInfo.fileName;
      const startx = positionx - ((squareSize - 1) * (circleRadius + 0.5 * padding)) - screenLeftSidePixel;
      const starty = positiony - ((squareSize - 1) * (circleRadius + 0.5 * padding));
      
      return {
        id: nodeId,
        key: fileName,
        x: startx + (counter % squareSize) * (circleRadius * 2 + padding),
        y: starty + Math.floor(counter / squareSize) * (circleRadius * 2 + padding),
        radius: circleRadius,
        fill: "blue", // 設置圓形的顏色
        draggable: true,
      }
    });

    onNodeCreate(NodesGenerate);
    setNodes(NodesGenerate);

    return nodes;
  }

  useEffect(() => {
    if (positionx === 0 && positiony === 0) return;
    generateNodes(dropnodeInfo);
    console.log("drawingNodes");
  }, [dropnodeInfo]);

  return nodes && nodes.map((node) => (
    <Circle
      key={node.key} // 或者適合的唯一屬性
      id={node.id}
      x={node.x}
      y={node.y}
      radius={circleRadius}
      fill="blue" // 字符串形式的顏色
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
    ));
};

export default DrawNode;
