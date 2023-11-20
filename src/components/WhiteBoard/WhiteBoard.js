// WhiteBoard.js
import React, { useState, useEffect, useRef, useId } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { v4 as uuidv4 } from 'uuid';
import { BackLayerRender } from "./BackLayerRender";
import DrawNode from "./DrawNode.jsx";
import DrawExistingNode from "./DrawExistingNode.jsx";

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

export const WhiteBoard = ({fileDrop, dropClientPosition}) => {
  const [backgroundLayerStat, setBackgroundLayerStat] = useState(INITIAL_BAKEGROUND_STATE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [relPosToScreen, setRelPosToScreen] = useState({ x: 0, y: 0 });
  // 這是全部Node的資訊
  const [nodeInfo, setNodeInfo] = useState([]);
  // 下面這個是拖進來時新增用
  const [dropnodeInfo, setDropNodeInfo] = useState([]);


  const updateNodeInfo = (newFileDrop) => {
    const updatedNodeInfo = newFileDrop.map(filePath => {
      const fileNameWithExtension = filePath.split('\\').pop(); // 取得檔案名稱含副檔名
      const fileExtension = fileNameWithExtension.split('.').pop(); // 取得副檔名
      const fileName = fileNameWithExtension.replace('.' + fileExtension, ''); // 取得不含副檔名的檔案名稱部分

      return {
        nodeId: uuidv4(),
        fileName: fileName,
        nodeType: 'normal',


        nodeIcon: fileExtension,
        attribute: [],
        childNode: [],
        x: null,
        y: null,
      };
    });

    // 更新 nodeInfo
    setDropNodeInfo(updatedNodeInfo);
    setNodeInfo(prevNodeInfo => [...prevNodeInfo, ...updatedNodeInfo]);
    console.log(updatedNodeInfo);
  };


    // // 呼叫這個函數來更新 nodeInfo
    // updateNodeInfo();

  useEffect(() => {
    updateNodeInfo(fileDrop);
  }, [position.x, position.y, fileDrop]);

  // 接收從DrawNode回傳資料
  const handleNodeCreate = (newNode) => {
    setNodeInfo(prevNodeInfo => {
      const updatedNodes = prevNodeInfo.map(existingNode => {
        // 在 newNode 陣列中尋找與現有節點相同 nodeId 的節點
        const foundNode = newNode.find(newNodeItem => newNodeItem.id === existingNode.nodeId);
  
        // 如果找到相符的 nodeId，則更新其座標
        if (foundNode) {
          return {
            ...existingNode,
            x: foundNode.x,
            y: foundNode.y,
          };
        }
        return existingNode; // 其他情況返回原來的節點資訊
      });
      return updatedNodes; // 返回更新後的 nodeInfo
    });
    console.log(nodeInfo);
  };

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
    console.log(e.target);


    console.log(position);
    console.log(rel);
    // 更新位置狀態
    setPosition({ x: position.x, y: position.y });
    setRelPosToScreen(rel);
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
      {/* <DrawNode
        fileCount={fileDrop.length}
        circleRadius={60}
        positionx={position.x} 
        positiony={position.y} 
      /> */}
      <Layer>
        <DrawExistingNode
          nodeInfo={nodeInfo}
          circleRadius={60}
        />
        <DrawNode
          dropnodeInfo={dropnodeInfo}
          circleRadius={60}
          positionx={dropClientPosition.x} 
          positiony={dropClientPosition.y} 
          // 接收回傳值
          onNodeCreate={handleNodeCreate}
        />
        {/* <Circle
          key="{node.key}" // 或者適合的唯一屬性
          id="{node.id}"
          x={0}
          y={0}
          radius={60}
          fill="black" // 字符串形式的顏色
        /> */}
      </Layer>
    </Stage>
  );
};
