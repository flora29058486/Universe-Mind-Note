import React, { useState, useEffect } from 'react';
import { Circle, Layer, Star } from 'react-konva';

const DrawNode = ({ fileCount, circleRadius, positionx, positiony }) => {
  const [nodes, setNodes] = useState();

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

  const generateNodes = () => {
    const nodes = [];
    console.log(positionx, positiony);
    // const startx = positionx - ((squareSize * (circleRadius * 2 + padding)) / 2);
    // const starty = positiony - ((squareSize * (circleRadius * 2 + padding)) / 2);
    const startx = positionx - (((squareSize - 1) * (circleRadius + 0.5 * padding)) / 2)
    const starty = positiony - (((squareSize - 1) * (circleRadius + 0.5 * padding)) / 2)
    console.log(startx, starty);



    for (let i = 0; i < fileCount; i++) {
      const row = Math.floor(i / squareSize);
      const col = i % squareSize;
      const x = startx + col * (circleRadius * 2 + padding) + circleRadius;
      const y = starty + row * (circleRadius * 2 + padding) + circleRadius;
      nodes.push({
        key: i,
        id: i.toString(),
        x: x,
        y: y,
        radius: circleRadius,
        fill: "blue", // 設置圓形的顏色
        draggable: true,
      })
    }

    return nodes;
  }

  useEffect(() => {
    if (positionx === 0 && positiony === 0) return;
    setNodes(generateNodes());
    console.log("drawingNodes");
  }, [fileCount]);

  // return nodes && nodes.map((node) => (
  //   <Circle
  //     key={node.key} // 或者適合的唯一屬性
  //     id={node.id}
  //     x={node.x}
  //     y={node.y}
  //     radius={circleRadius}
  //     fill="blue" // 字符串形式的顏色
  //     draggable={true}
  //     onDragStart={handleDragStart}
  //     onDragEnd={handleDragEnd}
  //   />
  //   ))

    return(
      <Layer>
        {nodes && nodes.map((node) => (
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
        ))}
      </Layer>
    );
  ;
};

export default DrawNode;
