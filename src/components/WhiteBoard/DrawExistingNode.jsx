import React, { useState, useEffect, useRef } from 'react';
import { Circle, Layer, Text, Group } from 'react-konva';
import { useNodes } from '../Context/NodeContext.js';

const DrawExistingNode = ({ nodeInfo, circleRadius, onFolderOpen }) => {
  const { nodes, setNodes, updateNodePosition, nodeIntoFolder } = useNodes();
  const [nodesInThisFile, setNodesInThisFile] = useState([]);
  const [previousShape, setPreviousShape] = useState(null);
  const [nodeMoving, setNodeMoving] = useState(null);
  const existingNodeLayerRef = useRef();
  const moveNodeTempLayerRef = useRef();

  useEffect(() => {
    // 設定繪製的所有node
    const updatedNodes = nodeInfo.map(async (node) => {
      let fileIconBase64;
      const filePath = node.filepath;

      if (node.nodeType === 'folder') {
        fileIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA1klEQVR4nO2WXwrCMAzGK4jgDRLxBB7B3ULv5PTBMwlrFA8geAD/HGKJRIqbiJuCsG4P5oM+9eH7NUnbzzmTqZAeJgP2sGLCqxDq62KPN/ZwZA8zF0tMsHw3roAQSr4dTeMAeLgEkzoD3bg+e1wXIHtV12scQIpTftrX3XjIHk6PSsA8GoBEXKHKodVh3joBkOcsQfpzC5pQnmFSVqITgK8+YgBkLUAbQrVrKPYQkT3F2N1nxGUkyzBp4Ts+VwEI0hYDyaI+lhOkZSUiRbJzMK+NZKa/1R38hE+Lh2UeTwAAAABJRU5ErkJggg==";
      } else {
        fileIconBase64 = await window.electronAPI.loadIcon(filePath);
      };
      const img = new Image();
      img.src = fileIconBase64;
      img.onload = () => {
        // 在此處更新狀態或進行其他操作
      };
    
      return {
        nodeId: node.nodeId,
        fileName: node.fileName,
        filepath: node.filepath,
        nodeType: node.nodeType,
        nodeIcon: node.nodeIcon,
        attribute: node.attribute,
        childNode: node.childNode,
        x: node.x,
        y: node.y,
        isDragging: false,
        fileIcon: img, // 將 fileIcon 加入節點對象
        key: node.fileName + node.nodeId,
      };
    });

    // 在這裡等待所有 Promise 完成後，再設置 nodes 的狀態
    Promise.all(updatedNodes).then((updatedNodesArray) => {
      setNodesInThisFile(updatedNodesArray);
    });

  }, [nodeInfo]);

  const handleDragStart = (e) => {
    e.target.moveTo(moveNodeTempLayerRef.current);
    
    const id = e.target.id();

    setNodesInThisFile((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isDragging: node.nodeId === id,
      }))
    );
  };

  const handleDragMove = (e) => {
    const shapeMoving = e.target;

    // Change the Layer of MovingNode to temp Layer
    const pos = e.target.getStage().getPointerPosition();
    const existingNodeLayer = e.target.getStage().findOne('.existingNodeLayer');
    const encounterShape = existingNodeLayer.getIntersection(pos);

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

    // Set moving node Info
    const nodeId = e.target.attrs.id;
    // Find the node with nodeId
    setNodeMoving(nodesInThisFile.find(node => node.nodeId === nodeId));
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    
    const pos = e.target.getStage().getPointerPosition();
    const existingNodeLayer = e.target.getStage().findOne('.existingNodeLayer');
    // console.log(e.target.attrs.id)
    // console.log(e.target.position())
    updateNodePosition(e.target.attrs.id, e.target.position().x, e.target.position().y);
  
    const shape = existingNodeLayer.getIntersection(pos);
    
    if (shape) {
      previousShape.fire('drop', { evt: e.evt }, true);
    }

    setNodesInThisFile((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isDragging: false,
      }))
    );

    setPreviousShape(undefined);
    e.target.moveTo(existingNodeLayerRef.current);
  };

  const handleDragEnter = (node, index) => {
    const dropFolder = node;

    // if DragEnter a folder, change folder size and set moving node opacity
    if (dropFolder.nodeType === 'folder' && nodeMoving !== null) {
      const scaleGroups = existingNodeLayerRef.current.find(`#${dropFolder.nodeId}`);
      const movingNodeGroups = moveNodeTempLayerRef.current.find(`#${nodeMoving.nodeId}`);
      
      if (scaleGroups.length > 0) {
        const scaleGroup = scaleGroups[0];
        scaleGroup.scale({x: 1.2, y: 1.2});
  
        const movingNodeGroup = movingNodeGroups[0];
        movingNodeGroup.opacity(0.2);
        
        existingNodeLayerRef.current.batchDraw();
      }
    } else {
      return;
    }
  };

  const handleDragLeave = (node, index) => {
    const dropFolder = node;

    // if DragLeave a folder, change folder size and set moving node opacity
    if (dropFolder.nodeType === 'folder' && nodeMoving !== null) {
      const scaleGroups = existingNodeLayerRef.current.find(`#${dropFolder.nodeId}`);
      const movingNodeGroups = moveNodeTempLayerRef.current.find(`#${nodeMoving.nodeId}`);

      if (scaleGroups.length > 0) {
        const scaleGroup = scaleGroups[0];
        scaleGroup.scale({x: 1, y: 1});
  
        const movingNodeGroup = movingNodeGroups[0];
        movingNodeGroup.opacity(1);
        
        existingNodeLayerRef.current.batchDraw();
      }
    } else {
      return;
    }
  };

  const handleClick = (e, node) => {
    e.cancelBubble = true;

    // console.log(e.evt.button);
    // Open nodeDialog
    if (node.nodeType !== 'folder' && e.evt.button === 0) {
      // console.log('Open nodeDialog');
    };
  };

  const handleDblClick = async (node, index) => {
    const clickedNodeId = node.nodeId;
    const clickedNode = nodeInfo.find((node) => node.nodeId === clickedNodeId);

    if (node.nodeType !== 'folder') {

      // Open the nodefile on computer
      const openNodeFilePath = clickedNode.filepath;
      console.log(openNodeFilePath);
      try {
        await window.electronAPI.openFile(openNodeFilePath);
        console.log(clickedNode);
      } catch (error) {
        console.error('Error opening file:', error);
      }
    } else if (node.nodeType === 'folder') {
      // Open the folder
      onFolderOpen(node);
      return;
    }
  };

  const handleDragOver = (node, index) => {


  };

  const handleDrop = (node, index) => {
    const dropFolder = node;

    if (dropFolder.nodeType === 'folder' && nodeMoving !== null) {

      // change folder size back
      const scaleGroups = existingNodeLayerRef.current.find(`#${dropFolder.nodeId}`);
      if (scaleGroups.length > 0) {
        const scaleGroup = scaleGroups[0];
        scaleGroup.scale({x: 1, y: 1});
        
        existingNodeLayerRef.current.batchDraw();
      }

      
      const nodeToDropId = nodeMoving.nodeId;
      const folderId = dropFolder.nodeId;
      // const updatedChildInfo = [...dropFolder.childNode, nodeMoving];
      // const updatedNode = { ...dropFolder, childNode: updatedChildInfo };

      // const updatedNodes = nodesInThisFile
      //   .map((n) => (n.nodeId === dropFolder.nodeId ? updatedNode : n))
      //   .filter((n) => n.nodeId !== nodeToDropId);

      nodeIntoFolder(nodeToDropId, folderId);

      setNodeMoving(null);
    } else {
      return;
    }
  };

  return (
    <>
      <Layer name="existingNodeLayer" ref={existingNodeLayerRef}>
        {nodesInThisFile.map((node, index) => (
          <Group
            id={node.nodeId}
            x={node.x}
            y={node.y}
            key={node.key}
            draggable
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragEnter={() => handleDragEnter(node, index)}
            onDragLeave={() => handleDragLeave(node, index)}
            onDragOver={() => handleDragOver(node, index)}
            onDrop={() => handleDrop(node, index)}
          >
            <Circle
              key={node.key + "FileIcon"}
              name="node"
              radius={circleRadius}
              fillPatternImage={node.fileIcon}
              fillPatternOffset={{ x: 16 , y: 16 }}
              // fillPatternScale={ x: e.target.radius() * 2 / img.width, y: e.target.radius() * 2 / img.height }
              fillPatternRepeat={'no-repeat'}
              fillPatternScaleX={2}
              fillPatternScaleY={2}
              onClick={(e) => handleClick(e, node)}
              onDblClick={() => handleDblClick(node, index)}
            />
            <Text
              text={node.fileName}
              key={node.key + "fileName"}
              fontSize={17}
              fill="black"
              align="center"
              width={circleRadius * 2} // 文字框寬度與 Circle 半徑相同
              height={40} // 文字框高度
              offsetY={-circleRadius*0.7} // 微調位置，加上一些偏移量
              offsetX={circleRadius} // 水平居中
              wrap="char" // 換行
              ellipsis={true} // 省略號
              listening={false} // 不接收事件
            />
          </Group>
        ))}
      </Layer>
      <Layer name="moveNodeTempLayer" ref={moveNodeTempLayerRef}>
        {/* 这里放置图层内的形状和其他元素 */}
      </Layer>
    </>
  );
};

export default DrawExistingNode;
