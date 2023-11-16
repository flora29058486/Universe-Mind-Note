import React, { useState, useEffect } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import { makeStyles } from '@mui/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles({
  treeview: {
    marginLeft: '-20px',
  },
  fileListContainer: {
    height: '80vh', /* 設置最大高度 */
    overflowY: 'auto', /* 啟用垂直滾動條 */
    overflowX: 'hidden', /* 啟用水平滾動條 */
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
})

const StyledTreeView = styled(TreeView)({
  height: '80vh', // 佔滿視窗高度
  flexGrow: 1,
});

export default function FileTreeView() {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [fileStructure, setFileStructure] = useState();
  const [folderPaths, setFolderPaths] = useState([]);

  // Load file structure on mount
  useEffect(() => {

  }, []);

  // Handle node select
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

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
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.label} icon={getIcon(nodes)}>
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
    <div className={classes.treeview}>
      <div className={classes.fileListContainer}>
        <StyledTreeView multiSelect selected={selected} onNodeSelect={handleSelect}>
        {fileStructure && renderTree(fileStructure)}
          {/* Render tree structure */}
        </StyledTreeView>
      </div>
      <RefreshIcon onClick={handleRefresh} />
      <CreateNewFolderIcon onClick={handleFolderImport}/>
      {/* Display selected files */}
    </div>
  );
};
