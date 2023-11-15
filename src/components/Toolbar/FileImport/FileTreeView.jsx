// import React, { useEffect, useState } from 'react';
// import TreeView from '@mui/lab/TreeView';
// import TreeItem from '@mui/lab/TreeItem';
// import FolderIcon from '@mui/icons-material/Folder';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// function CustomTreeView({ selectedButton }) {
//   const [fileStructure, setFileStructure] = useState([]);

//   // 模拟文件结构的数据
//   useEffect(() => {
//     // 您可以根据实际需求获取文件结构的数据
//     const mockFileStructure = [
//       {
//         name: 'Folder 1',
//         type: 'folder',
//         children: [
//           { name: 'File 1-1.txt', type: 'file' },
//           { name: 'File 1-2.txt', type: 'file' },
//         ],
//       },
//       {
//         name: 'Folder 2',
//         type: 'folder',
//         children: [
//           { name: 'File 2-1.txt', type: 'file' },
//           { name: 'File 2-2.txt', type: 'file' },
//         ],
//       },
//       { name: 'File 3.txt', type: 'file' },
//     ];

//     setFileStructure(mockFileStructure);
//   }, [selectedButton]);

//   const renderTree = (nodes) => (
//     <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name} icon={getIcon(nodes)}>
//       {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
//     </TreeItem>
//   );

//   const getIcon = (node) => {
//     if (node.type === 'folder') {
//       return <FolderIcon />;
//     } else if (node.type === 'file') {
//       return <InsertDriveFileIcon />;
//     }
//     return null;
//   };

//   return (
//     <TreeView
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//     >
//       {fileStructure.map((node) => renderTree(node))}
//     </TreeView>
//   );
// }

// export default CustomTreeView;

import React, { useState, useEffect } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import { makeStyles } from '@mui/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';

const StyledTreeView = styled(TreeView)({
  height: 400,
  flexGrow: 1,
  maxWidth: 400,
});

const useStyles = makeStyles({
  treeview: {
    width: '85%',
    marginLeft: '72px',
  },
});

export default function FileTreeView() {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [fileStructure, setFileStructure] = useState([]);

  // Load file structure on mount
  useEffect(() => {
    loadFileStructure();
  }, []);

  // Handle node select
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  // Handle refresh click
  const handleRefresh = () => {
    loadFileStructure();
  };

  // Load file structure
  const loadFileStructure = () => {
    // Call API or filesystem to load real file structure
    // 您可以根据实际需求获取文件结构的数据
    const mockFileStructure = [
      {
        name: 'Folder 1',
        type: 'folder',
        children: [
          { name: 'File 1-1.txt', type: 'file' },
          { name: 'File 1-2.txt', type: 'file' },
        ],
      },
      {
        name: 'Folder 2',
        type: 'folder',
        children: [
          { name: 'File 2-1.txt', type: 'file' },
          { name: 'File 2-2.txt', type: 'file' },
        ],
      },
      { name: 'File 3.txt', type: 'file' },
    ];

    const data = [
      {
        name: 'Folder 1',
        children: [/* files and folders */],
      },
      {
        name: 'Folder 2',
        children: [/* files and folders */],
      },
    ];

    setFileStructure(mockFileStructure);
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name} icon={getIcon(nodes)}>
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
      <StyledTreeView multiSelect selected={selected} onNodeSelect={handleSelect}>
        {fileStructure.map((node) => renderTree(node))}
        {/* Render tree structure */}
      </StyledTreeView>
      <RefreshIcon onClick={handleRefresh} />
      {/* Display selected files */}
    </div>
  );
};
