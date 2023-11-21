import React, { useState, useEffect } from 'react';
import { Circle } from 'react-konva';

const DrawExistingNode = ({ nodeInfo, circleRadius }) => {
  const [nodes, setNodes] = useState();

  useEffect(() => {
    console.log(nodeInfo);
    setNodes(drawBatchNodes);
  }, [nodeInfo, circleRadius]);

  const drawBatchNodes = nodeInfo.map((node) => {
    // if (node.x !== null && node.y !== null) {
    //   return {
    //     id: node.nodeId,
    //     key: node.fileName,
    //     x: node.x,
    //     y: node.y,
    //   };
    // }
    return {
      id: node.nodeId,
      key: node.fileName + node.nodeId,
      x: node.x,
      y: node.y,
    };
  });

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

  return nodes && nodes.map((node) => (
    <Circle
      id={node.id}
      key={node.key}
      x={node.x}
      y={node.y}
      name="node"
      radius={circleRadius}
      fill="blue"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  ));
};

export default DrawExistingNode;
