import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider, Grid, IconButton, TextField, Tabs, Tab, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(open);
  const [value, setValue] = React.useState(0);
  const [editTitle, setEditTitle] = useState(false);
  const [showChipDelete, setShowChipDelete] = useState(false);
  const [nodeData, setNodeData] = useState({
    nodeId: '',
    fileName: '',
    attribute: [],
    x: 0,
    y: 0,
  });
  const nodeLabels = useRef(null);


  const recentLabels = labels.filter(label => 
    nodeLabels.current === null || !nodeLabels.current.some(nodeLabel => nodeLabel.labelId === label.labelId)
  )
  // 倒序排序
  const sortedRecentLabels = [...recentLabels].reverse();

  // 限制要顯示的標籤數量
  const labelsToShow = sortedRecentLabels.slice(0, MAX_LABELS_TO_SHOW);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      // 当 nodeData 更新且不是首次渲染时，调用 onUpdateNodeInfo
      // 未來改在這裡執行，不用傳出函數到WhiteBoard.js
      onUpdateNodeInfo(nodeData);
    }
  }, [nodeData, onUpdateNodeInfo]);
  
  useEffect(() => {
    setDialogOpen(open);
  
    if (currentNode) {
      const groupId = currentNode.attrs.id;
      const node = nodes.find(node => node.nodeId === groupId);
      nodeLabels.current = node.attribute;
      setNodeData({
        nodeId: groupId,
        fileName: node.fileName,
        attribute: nodeLabels.current ? nodeLabels.current : [],
        x: currentNode.attrs.x,
        y: currentNode.attrs.y,
      });
    }
  }, [currentNode, open, nodes]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditTitle(false);
    setShowChipDelete(false);
    // update open status (whiteBoard)
    handleClose(true);
  };
  
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  
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
  const handleKeyDown = (e) => {
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      const updateNode = {fileName: nodeData.fileName};
      handleNodeInfoUpdate(updateNode);
      setEditTitle(false);
    }
  };

  const handleSave = () => {
    const updateNode = {fileName: nodeData.fileName};
    handleNodeInfoUpdate(updateNode);
    handleCloseDialog();
  };

  const handleAddLabel = (label) => {
    // 更新節點數據
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
  };

  const handleDeleteLabel = (labelId) => {
    setNodeData((prevData) => {
      const newAttributes = prevData.attribute.filter(label => label.labelId !== labelId);
      const updatedNodeData = {
        ...prevData,
        attribute: newAttributes,
      };
      nodeLabels.current = updatedNodeData.attribute;
      return updatedNodeData;
    });

    // 更新全局標籤，如果該標籤不再與任何節點相關聯
    setLabels(prevLabels => {
      const isLabelUsed = nodes.some(node => node.attribute.some(attr => attr.labelId === labelId));
      console.log(isLabelUsed);
      if (isLabelUsed) {
        return prevLabels.filter(label => label.labelId !== labelId);
      }
      return prevLabels;
    });
  
    setShowChipDelete(false);
  };

  const handleChipClick = (labelId) => {
    showChipDelete === labelId ? setShowChipDelete(false) : setShowChipDelete(labelId);
  };

  const handleNodeInfoUpdate = (updateNode) => {
    setNodeData((prevData) => {
      const updatedNodeData = {
        ...prevData,
        nodeId: updateNode.nodeId !== undefined ? updateNode.nodeId : prevData.nodeId,
        fileName: updateNode.fileName !== undefined ? updateNode.fileName : prevData.fileName,
        attribute: updateNode.attribute !== undefined ? updateNode.attribute : prevData.attribute,
        x: updateNode.x !== undefined ? updateNode.x : prevData.x,
        y: updateNode.y !== undefined ? updateNode.y : prevData.y,
      };
      console.log(updatedNodeData);
      return updatedNodeData;
    });
  };

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
        <Tab label="標籤管理" />
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
            {nodeLabels.current && nodeLabels.current.length > 0 && (
              <>
                <Divider variant="middle" style={{ margin: '1rem 0' }} />
                {nodeLabels.current.map((label) => (
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
