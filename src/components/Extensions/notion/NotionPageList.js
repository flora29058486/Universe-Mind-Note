import React, { useState, useEffect, useCallback } from 'react';
import { Box, ListItem, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TreeItem, TreeView } from '@mui/x-tree-view';
// import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import NotionLogin from './NotionLogin';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
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
    display: 'flex',
    alignItems: 'center', // 垂直置中
    paddingLeft: '0px', // 左邊距
    paddingRight: '0px', // 右邊距
  },
  labelText: {
    overflow: 'hidden',
    height: '100%',
    height: '36px',
    marginTop: '1rem',
    // paddingTop: '25px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'left', // 文字置左
    textDecorationLine: 'underline', // 下划線
  },

  text: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const items = [
  {
    lastEditedTime: '2024-01-11T14:31:00.000Z',
    id: 'de815267-e21a-4bab-ab7a-445a10ad6a8d',
    url: 'https://www.notion.so/VF-Brand-de815267e21a4babab7a445a10ad6a8d',
    title: 'VF Brand'
  },
  {
    lastEditedTime: '2020-12-10T12:17:00.000Z',
    id: '9e3ddd57-497e-481c-985d-f938f74cbe9e',
    url: 'https://www.notion.so/Standardize-Typography-9e3ddd57497e481c985df938f74cbe9e',
    title: 'Standardize Typography'
  },
  {
    lastEditedTime: '2020-12-10T12:17:00.000Z',
    id: 'cd68cbb3-dca8-4bd0-bc41-e05bea16534b',
    url: 'https://www.notion.so/Task-cd68cbb3dca84bd0bc41e05bea16534b',
    title: 'Task'
  }
];

const NotionPageList = () => {
  const classes = useStyles();
  const [pageList, setPageList] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  // 只在組件首次掛載時註冊事件監聽器
  useEffect(() => {
    const handleFetchPages = (pages) => {
      setPageList(pages.map(page => {
        return {
          nodeId: page.id,
          fileName: page.title,
          // lastEditedTime: page.lastEditedTime,
          filepath: page.url,
          nodeType: 'notion',
          nodeIcon: 'notion',
          attribute: [],
          childNode: [],
          x: null,
          y: null,
        };
      }));
    };

    window.electronAPI.notionPageReceived(handleFetchPages);

    return () => {
      window.electronAPI.removeNotionPageReceived(handleFetchPages);
    };
  }, []);
  
  // useEffect(() => {
  //   // 取得資料
  //   setPageList(items.map(item => {
  //     return {
  //       nodeId: item.id,
  //       fileName: item.title,
  //       // lastEditedTime: item.lastEditedTime,
  //       filepath: item.url,
  //       nodeType: 'notion',
  //       nodeIcon: 'notion',
  //       attribute: [],
  //       childNode: [],
  //       x: null,
  //       y: null,
  //     };
  //   }));
  // }, []);

  // Handle node select
  const handleNodeSelect = (event, nodeId) => {
    // console.log(selectedPages);
    setSelectedPages(nodeId);
  };

  // Drag file transfer to app to drawExistingNode
  const handleDrag = useCallback((event, node) => {
    event.stopPropagation();

    // 目前拖曳的沒有選到
    const isNodeSelected = selectedPages.includes(node.nodeId);
    
    let dragFiles = [];
    if (isNodeSelected) {
      // 已經包含
      dragFiles = selectedPages.map(nodeId => {
        const page = pageList.find(page => page.nodeId === nodeId);
        return page;
      });
    } else {
      // 未選到，新增選取
      const currentPage = pageList.find(page => page.nodeId === node.nodeId);
      dragFiles = selectedPages.map(nodeId => {
        const page = pageList.find(page => page.nodeId === nodeId);
        return page;
      });
      dragFiles.push(currentPage);
    }
    
    const pagesJSON = JSON.stringify(dragFiles);
    event.dataTransfer.setData('notionPages', pagesJSON);
    event.dataTransfer.setData("isFileFromNotionExtension", true);
    
  }, [selectedPages, pageList]);

  const renderTree = (nodes) => (
    // console.log(nodes),
    <TreeItem
      key={nodes.nodeId} 
      nodeId={nodes.nodeId}
      classes={{
        root: classes.labelRoot,
        label: classes.labelText,
      }}
      label={nodes.fileName}
      onFocusCapture={e => e.stopPropagation()}
      draggable
      onDragStart={(event) => handleDrag(event, nodes)}
    >
    </TreeItem>
  );

  const renderPageList = () => {
    return pageList.map(page => renderTree(page));
  };

  return (
    <Paper className={classes.root} onWheel={e => e.stopPropagation()}>
      <Box>
        {pageList.length === 0 && (
          <React.Fragment>
            <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
              <NotionLogin />
            </ListItem>
          </React.Fragment>
        )}
        <div className={classes.fileListContainer}>
          <TreeView 
              multiSelect
              // defaultCollapseIcon={<ExpandMoreIcon />}
              // defaultExpandIcon={<ChevronRightIcon />}
              aria-label="notion-pages-list"
              // defaultParentIcon={<FolderIcon />}
              selected={selectedPages}
              onNodeSelect={handleNodeSelect}
            >
              {/* Render tree structure */}
              {pageList && renderPageList(pageList)}
            </TreeView>
        </div>
      </Box>
    </Paper>
  );
};

export default NotionPageList;
