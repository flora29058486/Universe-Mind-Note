// WhiteBoard.js
import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { v4 as uuidv4 } from 'uuid';
import { throttle } from 'lodash-es';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { BackLayerRender } from "./BackLayerRender";
import DrawExistingNode from "./DrawExistingNode.jsx";
import ImageTextLayer from './ImageTextLayer.js';
import NodeDialog from '../NodeDetailInfo/NodeDialog.js';
import AddLabelDialog from '../NodeDetailInfo/AddLabelDialog.js';
import FolderDialog from './FolderDialog/FolderDialog.js';
import { useNodes } from '../Context/NodeContext.js';
import { useLabels } from '../Context/LabelContext.js';

const width = window.innerWidth;
const height = window.innerHeight;
const step = 60;
const padding = 500;
const screenLeftSidePixel = 350;

function generateBackgroundLayer() {
  return ({
    key: "backgroundLayer",
    id: "backgroundLayer",
    x: width + 2*padding,
    y: height + 2*padding,
  });
}

const INITIAL_BAKEGROUND_STATE = generateBackgroundLayer();

export const WhiteBoard = ({ stageSave, textLayerSave, textLaterLoad, onStageRefChange, fileDropType, fileDrop, toggleButton, toolUsed, dropClientPosition }) => {

  const prevFileDrop = useRef(fileDrop);
  const fileDropTypeRef = useRef(fileDropType);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // NodeContextMenu
  const [contextMenu, setContextMenu] = useState(null);
  // Dialog nodeIndo change from NodeDialog.js
  const dialogNodeInfo = useRef({});
  // contextMenu CurrentShape
  const contextMenuCurrentShape = useRef();
  // handleNodeDialogOpen
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [addLabelDialogOpen, setAddLabelDialogOpen] = useState(false);
  // FolderDialog open
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderDialogNode, setFolderDialogNode] = useState(null);
  // window size
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [stageScale, setStageScale] = useState(1);
  const stageRef = useRef(null);
  // 文字方塊
  const [texts, setTexts] = useState([]);
  const [editingTextId, setEditingTextId] = useState(null);

  // context
  const { labels, setLabels } = useLabels();
  const { nodes, setNodes, addNode, deleteNode } = useNodes();

  // Stageinfo safe to userData
  useEffect(() => {
    console.log('stageSave', stageSave)
    if (stageRef.current) {
      onStageRefChange(stageRef.current);
    }
  }, [stageSave]);

  // 讀取關閉前文字與圖片圖層
  useEffect(() => {
    if (!textLaterLoad) return;
    setTexts(textLaterLoad);
  }, [textLaterLoad]);

  // 紀錄文字圖層
  useEffect(() => {
    const canvasState = stageRef.current.toJSON();
    const parse = JSON.parse(canvasState);
    const textLayerGroups = parse.children[3].children;
    const textLayer = textLayerGroups.map(group => { return group.children[0].attrs });
    textLayerSave(textLayer);
  }, [texts]);

  const generateNodes = (dropNodes, nodePosition) => {
    const fileCount = dropNodes.length;
    const squareSize = Math.ceil(Math.sqrt(fileCount));
    const circleRadius = 60;
    const paddingNodeCreate = 10;

    const NodesGenerate = dropNodes.map((fileInfo, counter) => {
      const nodeId = fileInfo.nodeId;
      const fileName = fileInfo.fileName;
      const startx = nodePosition.x - ((squareSize - 1) * (circleRadius + 0.5 * paddingNodeCreate)) - screenLeftSidePixel;
      const starty = nodePosition.y - ((squareSize - 1) * (circleRadius + 0.5 * paddingNodeCreate));

      return {
        ...fileInfo,
        key: fileName + nodeId,
        x: startx + (counter % squareSize) * (circleRadius * 2 + paddingNodeCreate),
        y: starty + Math.floor(counter / squareSize) * (circleRadius * 2 + paddingNodeCreate),
      };
    });

    return NodesGenerate;
  };

  const updateNodeInfo = (dropNodes, nodeType) => {
    let updatedNodeInit;

    if (nodeType === 'normal') {
      updatedNodeInit = dropNodes.map(filepath => {
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
    } else if (nodeType === 'notion') {
      updatedNodeInit = dropNodes.map(page => {
        return {
          nodeId: uuidv4(),
          fileName: page.fileName,
          filepath: page.filepath,
          nodeType: 'notion',
          nodeIcon: 'notion',
          attribute: [],
          childNode: [],
          x: null,
          y: null,
        }
      });
    }

    let nodePosition = { x: dropClientPosition.x - position.x, y: dropClientPosition.y - position.y };

    const NodesGenerate = generateNodes(updatedNodeInit, nodePosition);
    addNode(NodesGenerate);
  };

  const generateFolderNode = (folderPosition) => {
    return [{
      nodeId: uuidv4(),
      fileName: "新的資料夾",
      nodeType: 'folder',
      nodeIcon: 'folder',
      attribute: [],
      childNode: [],
      x: folderPosition.x,
      y: folderPosition.y,
    }];
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
    if (fileDropTypeRef.current !== fileDropType) {
      fileDropTypeRef.current = fileDropType;
    }
  }, [fileDropType]);

  useEffect(() => {
    if (prevFileDrop.current !== fileDrop) {
      updateNodeInfo(fileDrop, fileDropTypeRef.current);
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

  // resize window
  // 使用 useCallback 创建一个稳定的 handleResize 函数
  const handleResize = useCallback(throttle(() => {
    setStageSize({ width: window.innerWidth, height: window.innerHeight });

    if (stageRef.current) {
      console.log(stageRef.current)
      stageRef.current.draw();
    }
  }, 200), []);

  // wheel zoom event listener
  useEffect(() => {
    const handleWheel = (e) => {
      const stage = stageRef.current;
  
      const zoomFactor = e.deltaY > 0 ? 0.97 : 1.03;
      setStageScale(prevScale => {
        const newScale = prevScale * zoomFactor;
        return Math.max(0.5, Math.min(1.8, newScale));
      });
      stage.batchDraw();
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel(); // 如果有正在等待的节流函数，取消它
    };
  }, [handleResize]);

  // 新增文字方塊
  const addText = (newText) => {
    setTexts(prevTexts => [...prevTexts, newText]);
  };

  const updateText = (id, newText) => {
    // console.log('updateText', id, newText)
    setTexts(prevTexts => prevTexts.map(text => text.id === id ? { ...text, ...newText } : text));
  };
  
  const handleDragStart = (e) => {
    e.cancelBubble = true;
    console.log('dragstart');
  };

  const handleClick = useCallback((e) => {
    e.cancelBubble = true;
    // console.log(e.currentTarget.getPointerPosition());
    // console.log(e.currentTarget.getRelativePointerPosition());
    const pos = e.currentTarget.getRelativePointerPosition();

    if (toggleButton === "create-folder" && e.evt.button === 0) {
      const NodesGenerate = generateFolderNode(pos);
      toolUsed('');
      addNode(NodesGenerate);
    } else if (toggleButton === "create-text" && e.evt.button === 0) {
      const newText = {
        x: pos.x,
        y: pos.y,
        text: "新的文字方塊",
        fontSize: 20,
        fill: 'black',
        align: 'left',
        id: uuidv4(),
      };
      setEditingTextId(newText.id);
      toolUsed('');
      addText(newText); // 添加到文本数组状态
    }
  }, [toggleButton, generateFolderNode, addNode]);

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    console.log('dragend');
    
    // 獲取拖動結束後的位置
    const position = e.target.position();
    const rel = e.target.getRelativePointerPosition();
    // console.log(e.target);


    // console.log("position", position);
    // 更新位置狀態
    setPosition({ x: position.x, y: position.y });
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

  const handleDeleteText = useCallback((textId) => {
    setTexts(prevTexts => prevTexts.filter(text => text.id !== textId));
  }, []);

  return (
    <div>
      <Stage
        width={stageSize.width} 
        height={stageSize.height}
        scale={{x: stageScale, y: stageScale}}
        draggable={true}
        ref={stageRef}
        id='stage'
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <BackLayerRender
          width={(stageSize.width + 2*padding)/stageScale} 
          height={(stageSize.height + 2*padding)/stageScale} 
          positionx={(position.x + padding)/stageScale}
          positiony={(position.y + padding)/stageScale}
          step={step}
        />
        <DrawExistingNode
          nodeInfo={nodes}
          circleRadius={48}
          onFolderOpen={handleFolderDialogOpen}
        />
        <ImageTextLayer
          texts={texts}
          currentTextId={editingTextId}
          onUpdateText={updateText}
          onDeleteText={handleDeleteText}
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
        {/* <MenuItem onClick={handleContextMenuClose}>標籤管理</MenuItem> */}
        <MenuItem onClick={handleAddLabelDetailInfo}>新增標籤</MenuItem>
        <MenuItem onClick={handleDeleteNode}>刪除</MenuItem>
      </Menu>
      <NodeDialog
        currentNode={contextMenuCurrentShape.current}
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
