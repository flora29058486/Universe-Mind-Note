import React, { useState, useEffect } from 'react';
import { ButtonBase, Dialog, Divider, Grid, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';

function FolderDialog({ folderDialogOpen, onFolderDialogClose, folderNode }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' 或 'list'
  const [nodeImages, setNodeImages] = useState({});
  const [folderCurrent, setFolderCurrent] = useState(folderNode); // 當前資料夾

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadImages = async () => {
      try {
        const imageLoadPromises = folderCurrent.childNode.map(async node => {
          const imageUrl = await processNodeImg(node);
          return { nodeId: node.nodeId, imageUrl };
        });
  
        // 使用 Promise.all 等待所有圖片加載完成
        const loadedImages = await Promise.all(imageLoadPromises);
  
        const newImages = {};
        loadedImages.forEach(item => {
          newImages[item.nodeId] = item.imageUrl;
        });
        setNodeImages(newImages);
      } catch (error) {
        if (isActive) {
          console.error(error);
        }
      }
    };

    if (folderCurrent && folderCurrent.childNode) {
      loadImages();
    }

    return () => {
      isActive = false;
    };

  }, [folderCurrent]);

  const processNodeImg = async (node) => {
    if (node.nodeType === 'folder') {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA1klEQVR4nO2WXwrCMAzGK4jgDRLxBB7B3ULv5PTBMwlrFA8geAD/HGKJRIqbiJuCsG4P5oM+9eH7NUnbzzmTqZAeJgP2sGLCqxDq62KPN/ZwZA8zF0tMsHw3roAQSr4dTeMAeLgEkzoD3bg+e1wXIHtV12scQIpTftrX3XjIHk6PSsA8GoBEXKHKodVh3joBkOcsQfpzC5pQnmFSVqITgK8+YgBkLUAbQrVrKPYQkT3F2N1nxGUkyzBp4Ts+VwEI0hYDyaI+lhOkZSUiRbJzMK+NZKa/1R38hE+Lh2UeTwAAAABJRU5ErkJggg=="; // Folder icon base64
    } else {
      const icon = await window.electronAPI.loadIcon(node.filepath);
      return icon; // 確保這返回的是一個字符串 URL
    }
  };

  const handleFolderNodeOpen = async (node) => {
    if (node.nodeType === 'folder') {
      setFolderCurrent(node);
      console.log("folder", node);
      return;
    } else if (node.nodeType === 'normal') {
      console.log("normal", node);
      try {
        await window.electronAPI.openFile(node.filepath);
      } catch (error) {
        console.error('Error opening file:', error);
      }
    } else {
      console.log(node.nodeType);
      return;
    };
  };

  return (
    <Dialog open={folderDialogOpen} onClose={onFolderDialogClose} fullWidth maxWidth="md" PaperProps={{ style: { overflowY: 'auto', maxHeight: '60vh', padding: '10px', minHeight: '680px' } }} >
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        aria-label="View mode"
      >
        <ToggleButton value="grid" aria-label="Grid view">
          <ReorderRoundedIcon/>
          <span style={{ marginLeft: '4px' }}></span>
          Grid
        </ToggleButton>
        <ToggleButton value="list" aria-label="List view">
          <ViewModuleRoundedIcon />
          <span style={{ marginLeft: '4px' }}></span>
          List
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'grid' ? (
        <Grid 
          container 
          spacing={2} 
          sx={{ padding: '20px',
          '& > .MuiGrid-item': { // 直接針對子元素 Grid item 應用樣式
            pt: 0.5,
          }, 
        }} >
          {folderCurrent.childNode.map(node => (
          <React.Fragment key={node.nodeId}>
            <Grid item xs={3}>
              <ButtonBase
                onDragStart={(e) => e.preventDefault()}
                onClick={(event) => {
                  if (event.detail === 2) {
                    // 双击事件处理程序
                    handleFolderNodeOpen(node);
                  }
                }}
                sx={{ mt: 0.5 }}
                style={{ width: '100%' }}
              >
                <Card
                  style={{ width: '100%' }}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15), 0 2px 4px -2px rgba(0,0,0,0.15)', // 自定義陰影
                }}>
                  <CardMedia
                    component="img"
                    height="80"
                    sx={{
                      objectFit: 'contain', // 防止圖片拉伸
                      height: 'auto', // 讓高度自適應
                      maxHeight: "80px", // 最大高度為 80px
                      maxWidth: '100%', // 最大寬度為容器寬度
                      marginTop: '8px',
                      // margin: 'auto', // 自動邊距實現水平和垂直居中
                      display: 'block', // 使用塊狀元素以利於居中
                    }}
                    image={nodeImages[node.nodeId] || ''}
                    alt={node.fileName}
                  />
                  <CardContent sx={{ '&:last-child': { pt:0.5, pb: 0.5 } }}>
                    <Typography
                      variant="h6" 
                      component="div" 
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        alignSelf: 'center',
                        textOverflow: 'ellipsis', 
                        width: '100%',
                      }}>
                      {node.fileName}
                    </Typography>
                  </CardContent>
                </Card>
              </ButtonBase>
            </Grid>
          </React.Fragment>
          ))}
        </Grid>
      ) : (
        <List >
          {folderCurrent.childNode.map((node, index) => (
          <React.Fragment key={node.nodeId}>
            <ButtonBase 
              onClick={(event) => {
                if (event.detail === 2) {
                  // 双击事件处理程序
                  handleFolderNodeOpen(node);
                }
              }}
              style={{ width: '100%' }}
            >
              <ListItem
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                  height: '72px',
                }}
              >
                <ListItemIcon sx={{ width: 45, height: 45 }}>
                  <img src={nodeImages[node.nodeId] || ''} alt={node.fileName} />
                </ListItemIcon>
                <ListItemText primary={node.fileName + (node.nodeIcon && node.nodeIcon !== "folder" ? "." + node.nodeIcon : "")} />
              </ListItem>
            </ButtonBase>
            {index < folderCurrent.childNode.length - 1 && <Divider />}
          </React.Fragment>
          ))}
        </List>
      )}
    </Dialog>
  );
}

export default FolderDialog;
