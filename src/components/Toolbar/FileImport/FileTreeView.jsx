import React, { useState, useEffect, useCallback } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import { makeStyles } from '@mui/styles';
import { Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FileDragToKonva from './FileDragToKonva.jsx';

const useStyles = makeStyles({
  treeview: {
    height: '100%', /* 設置最大高度 */
  },
  fileListContainer: {
    height: 'calc(98vh - 24px)', /* 設置最大高度 */
    overflowY: 'auto', /* 啟用垂直滾動條 */
    // overflowX: 'hidden', /* 禁用水平滾動條 */
    "&::-webkit-scrollbar": {
      width: '10px', /* 滾動條寬度 */
    },
    scrollbarWidth: 'thin', /* 滾動條寬度（Firefox支援） */
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: '#888', /* 滾動條顏色 */
      borderRadius: '6px', /* 圓角 */
      transition: 'background-color 1.2s ease', /* 顏色漸變動畫 */
    },
    "&:hover::-webkit-scrollbar-thumb": {
      backgroundColor: '#555', /* 滑鼠懸停時滾動條顏色改變 */
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: 'transparent', /* 滾動條背景顏色 */
    },
  },
  labelRoot: {
    overflow: 'hidden',
  },
  labelText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})

export default function FileTreeView() {
  const classes = useStyles();
  const [selectedNode, setSelectedNode] = useState([]);
  const [fileStructure, setFileStructure] = useState();
  const [folderPaths, setFolderPaths] = useState([]);
  const [dragFiles, setDragFiles] = useState();

  useEffect(() => {

  }, [dragFiles]);

  // Handle node select
  const handleNodeSelect = (event, nodeId) => {
    console.log(selectedNode);
    setSelectedNode(nodeId);
  };

  const handleMouseDownOnSelectNode = useCallback((event, node) => {
    // prevent default behavior (render to top folder)
    event.stopPropagation();

    event.dataTransfer.setData("isFileFromTreeView", true);

    const isNodeSelected = selectedNode.includes(node.id);
    const filesToDrag = isNodeSelected ? selectedNode : [node.id];
    setDragFiles(filesToDrag);

    const filesJSON = JSON.stringify(filesToDrag);
    event.dataTransfer.setData("dragFiles", filesJSON);

  }, [selectedNode, setDragFiles]);

  // const handleDrop = (event) => {
  //   event.stopPropagation();  
  //   // event.preventDefault();
  //   console.log(dragFiles);
  //   // setDragFiles(files);
  // };

  // Handle refresh click
  const handleRefresh = async () => {
    // await handleFolderImport();
  };

  // Handle create new folder click
  const handleFolderImport = async () => {
    try {
      const files = await window.electronAPI.loadFolder();
      // console.log(files);
      setFileStructure(files);

      // save the folder path
      if (files && files.length > 0) {
        const newFolderPath = files[0].absolutePath; // Assuming the folder path is in the first item of the files array

        // Update folder paths array
        setFolderPaths(prevPaths => [...prevPaths, newFolderPath]);
      }

    } catch (error) {
      console.error('Error reading folder:', error);
    }
  };
  
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id} 
      nodeId={nodes.id}
      classes={{
        root: classes.labelRoot,
        label: classes.labelText,
      }}
      label={nodes.label}
      onFocusCapture={e => e.stopPropagation()}
      draggable
      onDragStart={(event) => handleMouseDownOnSelectNode(event, nodes)}
      onDrag={() => {
        // console.log("onDrag");
      }}
      // onDragEnd={(event) => handleDrop(event)}
      // icon={getIcon(nodes)}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  const getIcon = (node) => {
    if (node.children) {
      return <FolderIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };

  return (
    <Paper className={classes.treeview}>
      {dragFiles && <FileDragToKonva files={dragFiles} />}
      <RefreshIcon onClick={handleRefresh} />
      <CreateNewFolderIcon onClick={handleFolderImport}/>
      <div className={classes.fileListContainer}>
        <TreeView 
          multiSelect 
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          aria-label="multi-select"
          // defaultParentIcon={<FolderIcon />}
          selected={selectedNode} 
          onNodeSelect={handleNodeSelect}
        >
          {fileStructure && renderTree(fileStructure)}
          {/* Render tree structure */}
        </TreeView>
      </div>
    </Paper>
  );
};
