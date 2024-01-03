import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider, Grid, IconButton, TextField, Tabs, Tab, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { debounce } from 'lodash-es';
import { useNodes } from '../Context/NodeContext.js';
import { useLabels } from '../Context/LabelContext.js';

const MAX_LABELS_TO_SHOW = 6;

function getTextColorForBackground(backgroundColor) {
  // 将颜色转换为RGB值
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 根据亮度返回合适的文字颜色
  return brightness > 125 ? 'black' : 'white';
}

const NodeDialog = ({ currentNode, open, handleClose, onUpdateNodeInfo }) => {
  const { nodes, setNodes } = useNodes();
  const { labels, setLabels } = useLabels();
  const [dialogOpen, setDialogOpen] = useState(open);
  const [value, setValue] = React.useState(0);
  const [editTitle, setEditTitle] = useState(false);
  const [showChipDelete, setShowChipDelete] = useState(false);
  const [deleteLabelId, setDeleteLabelId] = useState([]);
  const [isDeleteLabel, setIsDeleteLabel] = useState(false);
  const [nodeData, setNodeData] = useState({
    nodeId: '',
    fileName: '',
    attribute: [],
    x: 0,
    y: 0,
  });
  const [nodeLabels, setNodeLabels] = useState(null);


  const recentLabels = labels.filter(label => 
    nodeLabels === null || !nodeLabels.some(nodeLabel => nodeLabel.labelId === label.labelId)
  )
  // 倒序排序
  const sortedRecentLabels = [...recentLabels].reverse();

  // 限制要顯示的標籤數量
  const labelsToShow = sortedRecentLabels.slice(0, MAX_LABELS_TO_SHOW);

  useEffect(() => {
    if (deleteLabelId.length > 0 && isDeleteLabel) {
      console.log("useEffect deleteLabelId", deleteLabelId)

      // 更新標籤，如果沒有node使用這個標籤，就刪除
      setLabels(prevLabels => {
        // 過濾出還在使用中的標籤
        const updatedLabels = prevLabels.filter(label => {
          // 檢查當前標籤是否在任何節點的 attribute 屬性中
          const isLabelUsed = nodes.some(node =>
            node.attribute.some(attr => attr.labelId === label.labelId)
          );
          const nn = nodes.find(node => node.attribute.some(attr => attr.labelId === label.labelId));
          console.log(nn);
          console.log("isLabelUsed", isLabelUsed);
          // 如果標籤在使用中，則保留這個標籤
          return isLabelUsed;
        });
    
        // 過濾出 labelIdArray 中不再使用的標籤ID
        const labelsToRemove = deleteLabelId.filter(labelId =>
          !nodes.some(node =>
            node.attribute.some(attr => attr.labelId === labelId)
          )
        );
    
        // 僅用於除錯的日誌，輸出將被移除的標籤
        console.log('Labels to remove:', labelsToRemove);
    
        return updatedLabels;
      });

      setIsDeleteLabel(false);
      setDeleteLabelId([]); // 清除暫存的標籤刪除請求
    }
  }, [nodes, deleteLabelId, isDeleteLabel]);
  
  useEffect(() => {
    setDialogOpen(open);
  
    if (currentNode) {
      const groupId = currentNode.attrs.id;
      const node = nodes.find(node => node.nodeId === groupId);
      setNodeLabels(node.attribute);

      // 1
      setNodeData({
        nodeId: groupId,
        fileName: node.fileName,
        attribute: nodeLabels ? nodeLabels : [],
        x: currentNode.attrs.x,
        y: currentNode.attrs.y,
      });
    }
  }, [currentNode, open, nodes]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditTitle(false);
    setShowChipDelete(false);

    handleClose(true);
  }, [handleClose]);

  const handleNodeInfoUpdate = (updateNode) => {

    // 2
    setNodeData((prevData) => {
      const updatedNodeData = {
        ...prevData,
        nodeId: updateNode.nodeId !== undefined ? updateNode.nodeId : prevData.nodeId,
        fileName: updateNode.fileName !== undefined ? updateNode.fileName : prevData.fileName,
        attribute: updateNode.attribute !== undefined ? updateNode.attribute : prevData.attribute,
        x: updateNode.x !== undefined ? updateNode.x : prevData.x,
        y: updateNode.y !== undefined ? updateNode.y : prevData.y,
      };
      // console.log(updatedNodeData);
      return updatedNodeData;
    });
  };

  const handleTabChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);
  
  const handleEditTitle = () => {
    setEditTitle(true);
  };
  
  const handleTitleChange = (event) => {
    setNodeData({
      ...nodeData,
      fileName: event.target.value,
    });
  };

  const handleAddLabelClose = () => {
    setDialogOpen(false);
    // update open status (whiteBoard)
    handleClose(true);
  };

  const handleTitleSave = (e) => {
    e.stopPropagation();

    const updateNode = {fileName: nodeData.fileName, nodeId: nodeData.nodeId, x: nodeData.x, y: nodeData.y};
    handleNodeInfoUpdate(updateNode);
    setEditTitle(false);
  };

  // press "Enter"
  const handleKeyDown = useCallback((e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleNodeInfoUpdate({ fileName: nodeData.fileName });
      setEditTitle(false);
    }
  }, [nodeData.fileName, handleNodeInfoUpdate]);

  // 更新第一個 state
  const updateFirstState = () => {
    setIsDeleteLabel(true);
  };

  const handleSave = useCallback(() => {
    onUpdateNodeInfo(nodeData);
    updateFirstState();
    handleCloseDialog();
  }, [nodeData, onUpdateNodeInfo, handleCloseDialog]);

  const handleAddLabel = useCallback((label) => {
    // 更新節點數據

    // 4
    setNodeData(prevData => ({
      ...prevData,
      attribute: [...prevData.attribute, label],
    }));

    // 同時更新全局標籤
    setLabels(prevLabels => {
      const labelExists = prevLabels.some(l => l.labelId === label.labelId);
      if (!labelExists) {
        return [...prevLabels, label];
      }
      return prevLabels;
    });
  }, [setNodeData, setLabels, nodes]);

  const handleDeleteLabel = useCallback((labelId) => {
    // 視覺上暫時看不到被刪除的標籤
    setNodeLabels(prevLabels => prevLabels.filter(label => label.labelId !== labelId));
    // 改變save之前的node資訊 => 少了標籤
    setNodeData((prevData) => {
      const newAttributes = prevData.attribute.filter(label => label.labelId !== labelId);
      return {
        ...prevData,
        attribute: newAttributes,
      };
    });
  
    // 設置被刪除的 labelId (傳遞給handleSave)
    setDeleteLabelId(prevId => [...prevId, labelId]);

    setShowChipDelete(false);
  }, [setNodeData, setShowChipDelete]);

  const handleChipClick = useCallback((labelId) => {
    setShowChipDelete((prev) => prev === labelId ? false : labelId);
  }, []);

  return (
    <Dialog 
      open={dialogOpen} 
      onClose={handleCloseDialog} 
      aria-labelledby="node-dialog-title" 
      maxWidth='xs' fullWidth 
      PaperProps={{ style: { overflowY: 'auto', maxHeight: '60vh', padding: '10px', minHeight: '480px', display: 'flex', flexDirection: 'column' } }}
    >
      <Tabs value={value} onChange={handleTabChange} aria-label="tabs">
        <Tab label="一般設定" />
        {/* <Tab label="標籤管理" /> */}
        {/* <Tab label="新增標籤" /> */}
      </Tabs>
      {/* <TabPanel value={value} index={0}>
        Content for Tab 1
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NodeDialog /> 
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Tab 3
      </TabPanel> */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {value === 0 && (
          <>
            <DialogTitle>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {editTitle ? (
                  <TextField
                    value={nodeData.fileName}
                    onChange={handleTitleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    fullWidth
                    variant="standard"
                    inputProps={{ style: { fontSize: '1.5rem' } }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{nodeData.fileName}</span>
                )}
                {editTitle ? null : (
                  <IconButton onClick={editTitle ? handleTitleSave : handleEditTitle}>
                    <EditIcon />
                  </IconButton>
                )}
              </div>
            </DialogTitle>
            <DialogContent>
            {nodeLabels && nodeLabels.length > 0 && (
              <>
                <Divider variant="middle" style={{ margin: '1rem 0' }} />
                {nodeLabels.map((label) => (
                  <div key={label.labelId} style={{ display: 'inline-block', marginRight: '0.25rem' , marginRight: '0.25rem', marginTop: '0.5rem' }}>
                    <Chip
                      label={label.labelName}
                      style={{
                        // width: '92px',
                        minWidth: '92px',
                        height: '34px',
                        color: getTextColorForBackground(label.color),
                        backgroundColor: label.color,
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.16)', // Adding shadow
                        border: '1px solid #D2B4DE', // Adding a border
                        // borderRadius: '0.8rem', // Rounded corners
                        fontSize: '1rem', // Larger font size
                      }}
                      clickable={true}
                      onClick={() => handleChipClick(label.labelId)}
                      onDelete={showChipDelete === label.labelId ? () => handleDeleteLabel(label.labelId) : undefined}
                    />
                  </div>
                ))}
              </>
            )}
            </DialogContent>
            <DialogActions sx={{ alignSelf: 'flex-end' }}>
              {/* <Button onClick={handleAddAttribute} variant="contained" startIcon={<BookmarkAddOutlinedIcon />}>
                Add label
              </Button> */}
              {/* <IconButton onClick={handleAddAttribute} aria-label="AddCircleIcon" color="primary">
                <BookmarkAddOutlinedIcon />
              </IconButton> */}
              <Button onClick={handleSave} color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
        {value === 1 && (
          <DialogTitle>
            {/* Your content for Tab 1 */}
          </DialogTitle>
        )}
        {/* {value === 2 && (
          <AddNewLabel onclose={handleAddLabelClose} addLabel={handleAddLabel} />
        )} */}
      </Box>
    </Dialog>
  );
};

export default NodeDialog;
