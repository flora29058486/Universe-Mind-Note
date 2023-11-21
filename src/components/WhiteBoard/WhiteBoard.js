// WhiteBoard.js
import React, { useState, useEffect, useRef, useId } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { v4 as uuidv4 } from 'uuid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { BackLayerRender } from "./BackLayerRender";
import DrawExistingNode from "./DrawExistingNode.jsx";

const width = window.innerWidth;
const height = window.innerHeight;
const step = 60;
const padding = 200;
const screenLeftSidePixel = 480;

function generateBackgroundLayer() {
  return ({
    key: "backgroundLayer",
    id: "backgroundLayer",
    x: width,
    y: height + padding,
    // scale: 1,
  });
}

const INITIAL_BAKEGROUND_STATE = generateBackgroundLayer();

export const WhiteBoard = ({fileDrop, toggleButton, dropClientPosition}) => {
  const prevFileDrop = useRef(fileDrop);
  const [backgroundLayerStat, setBackgroundLayerStat] = useState(INITIAL_BAKEGROUND_STATE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [relPosToScreen, setRelPosToScreen] = useState({ x: 0, y: 0 });
  // 這是全部Node的資訊
  const [nodeInfo, setNodeInfo] = useState([]);
  // 下面這個是拖進來時新增用
  const [dropnodeInfo, setDropNodeInfo] = useState([]);
  // NodeContextMenu
  const [contextMenu, setContextMenu] = useState(null);
  // FolderNodeCreateButton
  const [folderCreatePosition, setFolderCreatePosition] = useState(null);
    
  const generateNodes = (nodeInfo, dropClientPosition) => {
    const fileCount = nodeInfo.length;
    const squareSize = Math.ceil(Math.sqrt(fileCount));
    const circleRadius = 60;
    const paddingNodeCreate = 10;

    const NodesGenerate = nodeInfo.map((fileInfo, counter) => {
      const nodeId = fileInfo.nodeId;
      const fileName = fileInfo.fileName;
      const startx = dropClientPosition.x - ((squareSize - 1) * (circleRadius + 0.5 * paddingNodeCreate)) - screenLeftSidePixel;
      const starty = dropClientPosition.y - ((squareSize - 1) * (circleRadius + 0.5 * paddingNodeCreate));
      
      return {
        ...fileInfo,
        key: fileName + nodeId,
        x: startx + (counter % squareSize) * (circleRadius * 2 + paddingNodeCreate),
        y: starty + Math.floor(counter / squareSize) * (circleRadius * 2 + paddingNodeCreate),
      };
    });

    return NodesGenerate;
  };

  const updateNodeInfo = (nodeInfo) => {
    const updatedNodeInit = nodeInfo.map(filePath => {
      const fileNameWithExtension = filePath.split('\\').pop();
      const fileExtension = fileNameWithExtension.split('.').pop();
      const fileName = fileNameWithExtension.replace('.' + fileExtension, '');

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

    const NodesGenerate = generateNodes(updatedNodeInit, dropClientPosition);
    console.log(NodesGenerate);
    setDropNodeInfo(NodesGenerate);
    setNodeInfo(prevNodeInfo => [...prevNodeInfo, ...NodesGenerate]);
  };

  const generateFolderNode = (dropClientPosition) => {
    console.log(folderCreatePosition);
    return [{
      nodeId: uuidv4(),
      fileName: null,
      nodeType: 'folder',
      nodeIcon: 'folder',
      attribute: [],
      childNode: [],
      x: dropClientPosition.x,
      y: dropClientPosition.y,
    }];
  };

  useEffect(() => {
    if (prevFileDrop.current !== fileDrop) {
      updateNodeInfo(fileDrop);
      prevFileDrop.current = fileDrop;
    }
  }, [fileDrop, position.x, position.y]);

  const handleDragStart = (e) => {
    e.cancelBubble = true;
    console.log('dragstart');
  };

  const handleClick = (e) => {
    e.cancelBubble = true;
    console.log(e.currentTarget.getPointerPosition());
    console.log(e.currentTarget.getRelativePointerPosition());
    const pos = e.currentTarget.getRelativePointerPosition();
    if (toggleButton === "create") {
      const NodesGenerate = generateFolderNode(pos);
      console.log(NodesGenerate);
      setNodeInfo(prevNodeInfo => [...prevNodeInfo, ...NodesGenerate]);
    };
  }

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
  
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  // 右鍵點擊展開Node選單
  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    handleContextMenuClose();
    
    if (e.target.attrs.name === 'node') {
      console.log(e.target);
      
      setContextMenu({
        mouseX: e.evt.clientX,
        mouseY: e.evt.clientY,
      });
      return;
    }
  };

  return (
    <div>
      <Stage
        width={width} 
        height={height}
        draggable={true}
        id='stage'
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <BackLayerRender 
          width={width} 
          height={height} 
          positionx={position.x} 
          positiony={position.y} 
          step={step} 
        />
        <Layer>
          <DrawExistingNode
            nodeInfo={nodeInfo}
            circleRadius={60}
          />
          {/* <DrawFolderNode
            folderCreatePosition={folderCreatePosition}
            circleRadius={60}
          /> */}
        </Layer>
      </Stage>
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        onContextMenu={(e) => {
          e.preventDefault(); // 防止瀏覽器預設的右鍵菜單
          handleContextMenuClose(); // 關閉右鍵打開的 Menu
        }}
      >
        <MenuItem onClick={handleContextMenuClose}>Copy</MenuItem>
        <MenuItem onClick={handleContextMenuClose}>Print</MenuItem>
        <MenuItem onClick={handleContextMenuClose}>Highlight</MenuItem>
        <MenuItem onClick={handleContextMenuClose}>Email</MenuItem>
      </Menu>
    </div>
    
  );
};
