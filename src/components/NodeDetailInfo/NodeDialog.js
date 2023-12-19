import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider, IconButton, TextField, Tabs, Tab, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddNewLabel from './AddNewLabel.js';


function getTextColorForBackground(backgroundColor) {
  // 将颜色转换为RGB值
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 根据亮度返回合适的文字颜色
  return brightness > 125 ? 'black' : 'white'; // 根据背景亮度，选择适合的文字颜色
}

const NodeDialog = ({ nodeInfo, currentNode, open, handleClose, onUpdateNodeInfo }) => {
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
  const labels = useRef(null);

  useEffect(() => {
    setDialogOpen(open); 

    if (currentNode) {
      console.log(currentNode);
      const groupId = currentNode.attrs.id;
      const node = nodeInfo.find(node => node.nodeId === groupId);
      console.log(node);
      labels.current = node.attribute;
      setNodeData({
        ...nodeData,
        nodeId: groupId,
        fileName: node.fileName,
        attribute: labels.current ? labels.current : [],
        x: currentNode.attrs.x,
        y: currentNode.attrs.y,
      });
    }
    onUpdateNodeInfo(nodeData);
  }, [currentNode, open]);

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
    setNodeData((prevData) => ({
      ...prevData,
      attribute: [...prevData.attribute, label],
    }));
  };

  const handleDeleteLabel = (labelId) => {
    setNodeData((prevData) => ({
      ...prevData,
      attribute: prevData.attribute.filter(label => label.id !== labelId),
    }));
  
    setShowChipDelete(false);
  };

  const handleChipClick = (labelId) => {
    showChipDelete === labelId ? setShowChipDelete(false) : setShowChipDelete(labelId);
  };

  const handleNodeInfoUpdate = (upadteNode) => {
    setNodeData((prevData) => {
      const updatedNodeData = {
        ...prevData,
        nodeId: upadteNode.nodeId !== undefined ? upadteNode.nodeId : prevData.nodeId,
        fileName: upadteNode.fileName !== undefined ? upadteNode.fileName : prevData.fileName,
        attribute: upadteNode.attribute !== undefined ? upadteNode.attribute : prevData.attribute,
        x: upadteNode.x !== undefined ? upadteNode.x : prevData.x,
        y: upadteNode.y !== undefined ? upadteNode.y : prevData.y,
      };
      console.log(updatedNodeData);
      return updatedNodeData;
    });
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='xs' fullWidth>
      <Tabs value={value} onChange={handleTabChange} aria-label="tabs">
        <Tab label="一般設定" />
        <Tab label="標籤管理" />
        <Tab label="新增標籤" />
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
      <Box>
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
                {editTitle ? (
                  <Button onClick={editTitle ? handleTitleSave : handleEditTitle}>
                    {'Save'}
                  </Button>
                ) : (
                  <IconButton onClick={editTitle ? handleTitleSave : handleEditTitle}>
                    <EditIcon />
                  </IconButton>
                )}
              </div>
            </DialogTitle>
            <DialogContent>
            {labels.current && labels.current.length > 0 && (
              <>
                <Divider />
                {labels.current.map((label) => (
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
            <DialogActions>
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
        {value === 2 && (
          <AddNewLabel onclose={handleAddLabelClose} addLabel={handleAddLabel} />
        )}
      </Box>
    </Dialog>
  );
};

export default NodeDialog;
