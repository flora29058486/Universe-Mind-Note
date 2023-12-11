import React, { useState, useEffect, useRef } from 'react';
import { Circle, Layer } from 'react-konva';

const DrawExistingNode = ({ nodeInfo, circleRadius }) => {
  const [nodes, setNodes] = useState([]);
  const [previousShape, setPreviousShape] = useState(null);
  const existingNodeLayerRef = useRef();
  const moveNodeTempLayerRef = useRef();

  useEffect(() => {
    setNodes(
      nodeInfo.map((node) => ({
        id: node.nodeId,
        key: node.fileName + node.nodeId,
        x: node.x,
        y: node.y,
        isDragging: false, // 初始化拖曳狀態為 false
      }))
    );
  }, [nodeInfo]);

  const handleDragStart = (e) => {
    e.target.moveTo(moveNodeTempLayerRef.current);
    
    const id = e.target.id();

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isDragging: node.id === id,
      }))
    );
  };

  const handleDragMove = (e) => {
    const shapeMoving = e.target;
    console.log(shapeMoving)

    const pos = e.target.getStage().getPointerPosition();
    const existingNodeLayer = e.target.getStage().findOne('.existingNodeLayer');
    const encounterShape = existingNodeLayer.getIntersection(pos);

    console.log(encounterShape);

    if (previousShape && encounterShape) {
      if (previousShape !== encounterShape) {
        previousShape.fire('dragleave', { evt: e.evt }, true);
        encounterShape.fire('dragenter', { evt: e.evt }, true);
        setPreviousShape(encounterShape);
      } else {
        previousShape.fire('dragover', { evt: e.evt }, true);
      }
    } else if (!previousShape && encounterShape && shapeMoving !== encounterShape) {
      setPreviousShape(encounterShape);
      encounterShape.fire('dragenter', { evt: e.evt }, true);
    } else if (previousShape && !encounterShape && shapeMoving !== encounterShape) {
      previousShape.fire('dragleave', { evt: e.evt }, true);
      setPreviousShape(null);
    }
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    
    const pos = e.target.getStage().getPointerPosition();
    const existingNodeLayer = e.target.getStage().findOne('.existingNodeLayer');
    const shape = existingNodeLayer.getIntersection(pos);
    
    if (shape) {
      previousShape.fire('drop', { evt: e.evt }, true);
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isDragging: false,
      }))
    );

    setPreviousShape(undefined);
    e.target.moveTo(existingNodeLayerRef.current);
  };

  const handleDragEnter = (index) => {
    console.log(`Node ${nodes[index].id} entered.`);
    // Perform actions on drag enter
  };

  const handleDragLeave = (index) => {
    console.log(`Node ${nodes[index].id} left.`);
    // Perform actions on drag leave
  };

  const handleDragOver = (index) => {
    console.log(`Node ${nodes[index].id} is being dragged over.`);
    // Perform actions on drag over
  };

  const handleDrop = (index) => {
    console.log(`Node ${nodes[index].id} dropped.`);
    // Perform actions on drop
  };

  

  

  return (
    <>
      <Layer name="existingNodeLayer" ref={existingNodeLayerRef}>
        {nodes.map((node, index) => (
          <Circle
            id={node.id}
            key={node.key}
            x={node.x}
            y={node.y}
            name="node"
            radius={circleRadius}
            fill={node.isDragging ? 'green' : 'blue'}
            draggable
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragEnter={() => handleDragEnter(index)}
            onDragLeave={() => handleDragLeave(index)}
            onDragOver={() => handleDragOver(index)}
            onDrop={() => handleDrop(index)}
          />
        ))}
      </Layer>
      <Layer name="moveNodeTempLayer" ref={moveNodeTempLayerRef}>
        {/* 这里放置图层内的形状和其他元素 */}
      </Layer>
    </>
  );
};

export default DrawExistingNode;
