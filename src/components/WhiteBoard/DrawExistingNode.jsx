import React, { useState, useEffect, useRef } from 'react';
import { Circle, Layer, Text, Group, Rect } from 'react-konva';
import { useNodes } from '../Context/NodeContext.js';
import { set } from 'lodash-es';

const DrawExistingNode = ({ nodeInfo, circleRadius, onFolderOpen, findNodeResult }) => {
  const { nodes, setNodes, updateNodePosition, nodeIntoFolder } = useNodes();
  // nodeOnhover interaction
  const [hoverNodeId, setHoverNodeId] = useState(null);
  const [hoverRectId, setHoverRectId] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const [hoverNodeDetailInfo, setHoverNodeDetailInfo] = useState([]);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  // const [isMouseInsideCircle, setIsMouseInsideCircle] = useState(false);
  // const [isMouseInsideSmallCircle, setIsMouseInsideSmallCircle] = useState(false);
  // 搜尋節點
  const [findedNodes, setFindedNodes] = useState(null);

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
        fileIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABg0lEQVR4nO3YzyvDcRzH8dfN3Un+gbWShJZEkiQtSRJaLCX8EVYODlKUww7IDr4H5SJyU3Pxa34Nm18HhzH7pty/4dte8ge8D+y72bs+r3rc38/rGzAzMzMz82q2haBtIWtb4F/k1pG3LTzmLITxH8vE8PIcA72QWcNMyQOeVkBPLWOupAEPUdBr91EspldRWZKA1BLotbfdBvJ+knyYKtjn1aj7vtcaEQMuF0Av2Ts/x0946iMZcsWAxBzolexWPXk3XhSQdjALFupkvoKv2wHybqxoIO0rOUTehssepDE9Qg0gB4SoAcSA1DA1gBwwSA0gBtwMUAOIAdf91AByQB81gBhw1UsNIAYke6gB5IAgNYC0/GU3NYAc0EUNIAZcdFIDiAHnHdQAckA7NYAYcNZGDSAGnLZQA8gBzdQAYkCiiRpADDgJUAPIAY3UAGLAcT01gBxQRw0gzdn3u/mjWpYzJ+6XX4u5jeqIE/e5+cMaliMn7nOzm1XTYoCZmZmZGX65b1fjrzHebGEuAAAAAElFTkSuQmCC";
      } else if (node.nodeType === 'notion') {
        fileIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADeUlEQVR4nO3Ze+ieYxgH8M9+0bA5rAlRM3OYhAlppCGHRltp1GpjrUgNm2RhoZwV4h+UOTVbaiORkantj22smeSQOUTNKRQZI+e9uuv61dPb+zzv733f53l7n/p96/7vvu/r+t7PfX+v67kuRjGKgcQYHIipOB2zsADX4248huewBo/g/CqdGYdJOAnnYi6uxq14GM9iLbbgU/yIRhdjLQ4tw+EJeAJf4o8unWk1fsfXeA8b8Hx8ga3YHXMS+Ut6JfBCG0f+xvf4CJvwMp7Gg1iGq8KJs3EiDsPebWxOw7sZG89g324J/JrZKJ3UTJyKydhPdRiLhzJf4wuc0c1G2dP+ATP0FxeG3WT/X9yFPTvZoNWVWay/OATbMj68jaNHujjv7q/A+C4ULCnLcSGnM0PF0ju5CffiUazCK/GmPggB+avJ/k5c1AuBNHbgvjB+R8hoenAvYj3eibub1OSfEhWskVGpnggMwmiLMo0lRfsmJDcFutexGo/jftwS7ytF6YtxDk7BFEyMxzunbALvZzQ/ReTLMBtnRbQ+IoLhkHKwR9kESgn3HaJRJoEqMD4idlKr6Ti8wKdKCIyNzHN6SN18XIvbCvQ7yernEayabSzuJ4Fj8VPB/M057yGl1tsjyRueuw6XxoH0jcC8OMnfCtYsKbB3Q2be0hH4VDqBYSwoWJNO+cg6E2hEZjumzgQauLIuBHZgV4u1O0MuB57AFlyXs/7VuhAYwls5e8yrA4GEE+KHqFVafHAdCIifllb7pKy0FgRSVP04Z685dSAgUu3hakN2fBeVuoEnkPBkzn676kJgf3zbZu+lg0xAVCQqJ/BnhQRE+aRSAlsrJjCpqXzZKJvA7BIIpP+DMwuKukuqJJDwUgcE9sE1cerNc1MUPrnFmqGoxjWaxhVKIjAxMsqREFgUWeZX+BBv4jU8FY82D6nmc3M0SG7H8QVzOyaQcFrOg+43hnqxv2gACBzTq/3mu9qu29Lp6U6Iat606EXMirJMOrw78VnGdqpYd4xxcbeHN1kWhai9cBCOinrmeZGcLYyfmVQTegDLoxe2Lh769qiX5klp0Uh+dIWpXRosc/wy0v5AHlLj7r+Snfo51C4VjDdGlF4ZveN7cGM0Qy7AAUrA3LgCu6MFm7qVn0T0fiOuyvJM6TyVFy+P4Dgj7vnkuPejGIUBwP9w+kiX3uvrjAAAAABJRU5ErkJggg=="
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

  const generateAdditionalCircles = (count, paddingWidth) => {
    // 中心點的偏移量應該根據圓的總數來計算
    const isEven = count % 2 === 0;
    const offset = isEven ? (paddingWidth / 2) * (count - 1) : paddingWidth * Math.floor(count / 2);
  
    return Array.from({ length: count }, (_, i) => {
      return {
        // 對於偶數個圓，第一個圓從 -offset 開始並逐漸增加 paddingWidth
        // 對於奇數個圓，中間的圓位於中心點，其他圓相應分佈於兩側
        x: -offset + paddingWidth * i,
        y: 0,
      };
    });
  };

  // 搜尋節點
  useEffect(() => {
    if (!findNodeResult) return;
    console.log(findNodeResult);
    setFindedNodes(findNodeResult);
  }, [findNodeResult]);

  useEffect(() => {
    if (!hoverNodeId) return;

    const node = nodes.find(n => n.nodeId === hoverNodeId);
    if (!node || !node.attribute || node.attribute.length === 0) return;

    // 如果 attribute 長度大於 4，則只取前四個
    const attribute = node.attribute.slice(0, 4);
    const position = generateAdditionalCircles(attribute.length, 80);
    // 使用 map 函數來轉換 position 數組並設置詳細信息
    const returnInfo = position.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      attribute: attribute[i],
    }));
    setHoverNodeDetailInfo(returnInfo);
  }, [hoverNodeId, nodes, circleRadius, setHoverNodeDetailInfo]);

  const handleDragStart = (e) => {
    setIsDraggingNode(true);
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
    setIsDraggingNode(false);
    const pos = e.target.getStage().getPointerPosition();
    const existingNodeLayer = e.target.getStage().findOne('.existingNodeLayer');
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

  const handleMouseEnter = (e, node) => {
    setHoverRectId(node.nodeId);
    // console.log("Enter big")
    // setIsMouseInsideCircle(true);
    const stage = e.target.getStage()
    stage.container().style.cursor = 'pointer';
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverNodeId(node.nodeId);
    }, 325); // 延遲200毫秒
  };

  const handleMouseLeave = (e, node) => {
    setHoverRectId(null);
    const stage = e.target.getStage();
    stage.container().style.cursor = 'default';
    setHoverNodeId(null);
    setHoverNodeDetailInfo([]);
    clearTimeout(hoverTimeoutRef.current);

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

    if (node.nodeType === 'normal') {

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
    } else if (node.nodeType === 'notion') {
      // Open the notion url
      window.electronAPI.openUrl(node.filepath);
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
            {(hoverRectId === node.nodeId) && (
              <Rect
                width={circleRadius*2} // 正方形的寬度
                height={circleRadius*2} // 正方形的高度
                offset={{ x: circleRadius, y: circleRadius }} // 正方形的中心點
                shadowBlur={2}
                fill={'rgba(230,233,236,0.03)'}
                cornerRadius={6}
                isListening={false}
              />
            )}
            {findedNodes && findedNodes.some(findedNode => findedNode.nodeId === node.nodeId) && (
              <Circle
                radius={circleRadius + 10}
                stroke="#DAA520"
                strokeWidth={3}
                fill="transparent"
              />
            )}
            <Circle
              name="node"
              // radius={(hoverNodeId === node.nodeId) ? circleRadius*1.9 : circleRadius}
              radius={circleRadius}
              fillPatternImage={node.fileIcon}
              // 64px img setting
              fillPatternOffset={{ x: 24 , y: 24 }}
              // fillPatternScale={ x: e.target.radius() * 2 / img.width, y: e.target.radius() * 2 / img.height }
              // stroke={"black"}
              // strokeWidth={1}
              fillPatternRepeat={'no-repeat'}
              fillPatternScaleX={1}
              fillPatternScaleY={1}
              onMouseEnter={(e) => handleMouseEnter(e, node)}
              onMouseLeave={(e) => handleMouseLeave(e, node)}
              onClick={(e) => handleClick(e, node)}
              onDblClick={() => handleDblClick(node, index)}
            />
            <Text
              text={node.fileName}
              fontSize={16}
              fill="black"
              align="center"
              width={circleRadius * 2} // 文字框寬度與 Circle 半徑相同
              height={60} // 文字框高度
              offsetY={-circleRadius*0.7} // 微調位置，加上一些偏移量
              offsetX={circleRadius} // 水平居中
              wrap="char" // 換行
              ellipsis={true} // 省略號
              listening={false} // 不接收事件
            />
            {(hoverNodeId === node.nodeId) && hoverNodeDetailInfo.length > 0 && !isDraggingNode &&
              hoverNodeDetailInfo.map((info, index) => (
              <Group
                id={info.attribute.labelId}
                key={info.attribute.labelId}
                offsetX={info.x}
                offsetY={circleRadius*2}
              >
                <Circle
                  fill={info.attribute.color}
                  radius={circleRadius*0.25}
                  listening={false}
                  // onDblClick={() => console.log("DDD")}
                  // onMouseEnter={handleSmallCircleMouseEnter}
                  // onMouseLeave={handleSmallCircleMouseLeave}
                />
                <Text
                  text={info.attribute.labelName}
                  fontSize={14}
                  fill="black"
                  align="center"
                  width={circleRadius * 0.5 * 2} // 文字框寬度與 Circle 半徑相同
                  offsetX={circleRadius * 0.5} // 水平居中
                  offsetY={-circleRadius * 0.5}
                  height={20} // 文字框高度
                  wrap="char" // 換行
                  ellipsis={true} // 省略號
                  listening={false} // 不接收事件
                />
              </Group>
              ))
            }
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
