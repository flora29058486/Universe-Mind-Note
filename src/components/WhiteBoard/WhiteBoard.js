// WhiteBoard.js
import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { v4 as uuidv4 } from 'uuid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { BackLayerRender } from "./BackLayerRender";
import DrawExistingNode from "./DrawExistingNode.jsx";
import NodeDialog from '../NodeDetailInfo/NodeDialog.js';
import AddLabelDialog from '../NodeDetailInfo/AddLabelDialog.js';
import FolderDialog from './FolderDialog/FolderDialog.js';
import { useNodes } from '../Context/NodeContext.js';
import { useLabels } from '../Context/LabelContext.js';

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

export const WhiteBoard = ({ fileDrop, toggleButton, dropClientPosition }) => {
  const prevFileDrop = useRef(fileDrop);
  const [backgroundLayerStat, setBackgroundLayerStat] = useState(INITIAL_BAKEGROUND_STATE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [relPosToScreen, setRelPosToScreen] = useState({ x: 0, y: 0 });
  // 下面這個是拖進來時新增用
  const [dropnodeInfo, setDropNodeInfo] = useState([]);
  // NodeContextMenu
  const [contextMenu, setContextMenu] = useState(null);
  // accept nodeInfo change from DrawExistingNode
  const updateNodeInfoRef = useRef([]);
  // Dialog nodeIndo change from NodeDialog.js
  const dialogNodeInfo = useRef({});
  // contextMenu CurrentShape
  const contextMenuCurrentShape = useRef();
  // handleNodeDialogOpen
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [addLabelDialogOpen, setAddLabelDialogOpen] = useState(false);
  // save all lebels in the node
  const [labelsToDialog, setLabelsToDialog] = useState([]);
  // FolderDialog open
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderDialogNode, setFolderDialogNode] = useState(null);
  // window size
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const stageRef = useRef(null);
  
  // context
  const { labels, setLabels } = useLabels();
  const { nodes, setNodes, addNode, deleteNode } = useNodes();
    
  const generateNodes = (dropNodes, dropClientPosition) => {
    const fileCount = dropNodes.length;
    const squareSize = Math.ceil(Math.sqrt(fileCount));
    const circleRadius = 60;
    const paddingNodeCreate = 10;

    const NodesGenerate = dropNodes.map((fileInfo, counter) => {
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

  const updateNodeInfo = (dropNodes) => {
    const updatedNodeInit = dropNodes.map(filepath => {
      const fileNameWithExtension = filepath.split('\\').pop();
      const fileExtension = fileNameWithExtension.split('.').pop();
      const fileName = fileNameWithExtension.replace('.' + fileExtension, '');

      return {
        nodeId: uuidv4(),
        fileName: fileName,
        filepath: filepath,
        nodeType: 'normal',
        nodeIcon: ((fileExtension !== fileName) ? fileExtension : ''),
        attribute: [],
        childNode: [],
        x: null,
        y: null,
      };
    });

    const NodesGenerate = generateNodes(updatedNodeInit, dropClientPosition);
    console.log(NodesGenerate);
    setDropNodeInfo(NodesGenerate);
    addNode(NodesGenerate);
  };

  const generateFolderNode = (dropClientPosition) => {
    return [{
      nodeId: uuidv4(),
      fileName: "新的資料夾",
      nodeType: 'folder',
      nodeIcon: 'folder',
      attribute: [],
      childNode: [],
      x: dropClientPosition.x,
      y: dropClientPosition.y,
    }];
  };

  const handleFileIntoFolder = (updatedNodes) => {
    // If updateNodes (value from DrawExistingNode) is not equal to updateNodeInfoRef, (the value has change)
    const prevUpdatedNodes = updateNodeInfoRef.current;

    if (JSON.stringify(prevUpdatedNodes) !== JSON.stringify(updatedNodes)) {
      setNodes(updatedNodes);
      updateNodeInfoRef.current = updatedNodes;
    }
  };

  const handleDialogInfoChange = useCallback((updatedNode) => {
    const prevDialogNodeInfo = dialogNodeInfo.current;

    if (JSON.stringify(prevDialogNodeInfo) !== JSON.stringify(updatedNode)) {

      setNodes(nodes =>
        nodes.map(node => {
          if (node.nodeId === updatedNode.nodeId) {
            return { ...node, fileName: updatedNode.fileName, x: updatedNode.x, y: updatedNode.y, attribute: updatedNode.attribute };
          }
          return node;
        })
      );

      dialogNodeInfo.current = updatedNode;
    }
  }, [setNodes]);

  useEffect(() => {
    if (prevFileDrop.current !== fileDrop) {
      updateNodeInfo(fileDrop);
      prevFileDrop.current = fileDrop;
    }
  }, [fileDrop, position.x, position.y]);

  useEffect(() => {
    setNodes(prevNodeInfo =>
      prevNodeInfo.map(node => ({
        ...node,
        attribute: node.attribute.map(attr => {
          const label = labels.find(l => l.labelId === attr.labelId);
          return label ? { ...attr, ...label } : attr;
        }),
      }))
    );
  }, [labels]);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
      console.log(window.innerWidth);
      console.log(stageRef.current);

      if (stageRef.current) {
        stageRef.current.draw();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [stageSize]);
  
  const handleDragStart = (e) => {
    e.cancelBubble = true;
    console.log('dragstart');
  };

  const handleClick = useCallback((e) => {
    e.cancelBubble = true;
    console.log(e.currentTarget.getPointerPosition());
    console.log(e.currentTarget.getRelativePointerPosition());
    const pos = e.currentTarget.getRelativePointerPosition();

    if (toggleButton === "create" && e.evt.button === 0) {
      const NodesGenerate = generateFolderNode(pos);

      addNode(NodesGenerate);
    }
  }, [toggleButton, generateFolderNode, addNode]);

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

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
    contextMenuCurrentShape.current = null;
    // 這裡是 handleContextMenuClose 的邏輯
  }, [contextMenuCurrentShape]);
  
  // 右鍵點擊展開Node選單
  const handleContextMenu = useCallback((e) => {
    e.evt.preventDefault();
    handleContextMenuClose();
    
    if (e.target.attrs.name === 'node') {
      contextMenuCurrentShape.current = e.target.getParent();
      console.log(e.target);
      
      setContextMenu({
        mouseX: e.evt.clientX,
        mouseY: e.evt.clientY,
      });
      return;
    }
  }, [contextMenuCurrentShape, handleContextMenuClose]);

  const handleNodeDetailInfo = useCallback(() => {
    setNodeDialogOpen(true);
    handleContextMenuClose();
  }, [handleContextMenuClose]); 

  const handleNodeDialogClose = useCallback(() => {
    setNodeDialogOpen(false);
  }, [handleContextMenuClose]);

  // 新增標籤
  const handleAddLabelDetailInfo = useCallback(() => {
    setAddLabelDialogOpen(true);
    handleContextMenuClose();
  }, [handleContextMenuClose]);

  const handleAddLabelDialogClose = useCallback(() => {
    setAddLabelDialogOpen(false);
  }, []);

  // 刪除Node
  const handleDeleteNode = useCallback(() => {
    if (contextMenuCurrentShape.current) {
      deleteNode(contextMenuCurrentShape.current.attrs.id);
      handleContextMenuClose();
    }
  }, [deleteNode, handleContextMenuClose]);
  

  const handleFolderDialogOpen = useCallback((node) => {
    setFolderDialogOpen(true);
    setFolderDialogNode(node);
  }, []);

  const handleFolderDialogClose = useCallback(() => {
    setFolderDialogOpen(false);
    setFolderDialogNode(null);
  }, []);

  return (
    <div>
      <Stage
        width={stageSize.width} 
        height={stageSize.height}
        ref={stageRef}
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
        <DrawExistingNode
          // whiteBoard to draw node
          nodeInfo={nodes}
          // draw node to whiteBoard
          onUpdateNodeInfo={handleFileIntoFolder}
          circleRadius={60}
          onFolderOpen={handleFolderDialogOpen}
        />
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
        <MenuItem onClick={handleNodeDetailInfo}>詳細資料</MenuItem>
        <MenuItem onClick={handleContextMenuClose}>標籤管理</MenuItem>
        <MenuItem onClick={handleAddLabelDetailInfo}>新增標籤</MenuItem>
        <MenuItem onClick={handleDeleteNode}>刪除</MenuItem>
      </Menu>
      <NodeDialog
        currentNode={contextMenuCurrentShape.current}
        // labelsAlreadyExist={labelsToDialog}
        open={nodeDialogOpen}
        handleClose={handleNodeDialogClose}
        onUpdateNodeInfo={handleDialogInfoChange}
      />
      <AddLabelDialog
        currentNode={contextMenuCurrentShape.current}
        open={addLabelDialogOpen}
        handleClose={handleAddLabelDialogClose}
        onUpdateNodeInfo={handleDialogInfoChange}
      />
      {folderDialogNode &&(
        <FolderDialog 
          folderDialogOpen={folderDialogOpen} 
          onFolderDialogClose={handleFolderDialogClose} 
          folderNode={folderDialogNode}
        />
      )}
    </div>
    
  );
};
