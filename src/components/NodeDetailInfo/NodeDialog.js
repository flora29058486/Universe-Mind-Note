import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider, IconButton, InputBase, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const NodeDialog = ({ nodeInfo, currentNode, open, handleClose, onUpdateNodeInfo }) => {
  const [nodes, setNodes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(open);
  const [currentNodeId, setCurrentNodeId] = useState('');
  const [currentNodeLocation, setCurrentNodeLocation] = useState({x: 0, y: 0});
  const [nodeName, setNodeName] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const nodesRef = useRef([]);

  useEffect(() => {
    setDialogOpen(open);
    setNodes(nodeInfo);

    if (currentNode) {
      console.log(currentNode);
      const groupId = currentNode.attrs.id;
      const node = nodeInfo.find(node => node.nodeId === groupId);
      setCurrentNodeId(groupId);
      setCurrentNodeLocation({x: currentNode.attrs.x, y: currentNode.attrs.y});
      setNodeName(node.fileName);
    }

    onUpdateNodeInfo(nodesRef.current);
  }, [currentNode, open]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditTitle(false);
    // update open status (whiteBoard)
    handleClose(true);
  };

  const handleEditTitle = () => {
    setEditTitle(true);
  };

  const handleNameChange = (event) => {
    setNodeName(event.target.value);
  };

  const handleTitleSave = (e) => {
    e.stopPropagation();

    const updateNode = {fileName: nodeName, nodeId: currentNodeId, x: currentNodeLocation.x, y: currentNodeLocation.y};
    handleNodeInfoUpdate(updateNode);
    setEditTitle(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      const updateNode = {fileName: nodeName, nodeId: currentNodeId, x: currentNodeLocation.x, y: currentNodeLocation.y};
      handleNodeInfoUpdate(updateNode);
      setEditTitle(false);
    }
  };

  const handleSave = () => {
    const updateNode = {fileName: nodeName, nodeId: currentNodeId, x: currentNodeLocation.x, y: currentNodeLocation.y};
    handleNodeInfoUpdate(updateNode);
    console.log(updateNode);
    handleCloseDialog();
  };

  const handleNodeInfoUpdate = (upadteNode) => {
    nodesRef.current = upadteNode;
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='xs' fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editTitle ? (
            <TextField
              value={nodeName}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              autoFocus
              fullWidth
              variant="standard"
              inputProps={{ style: { fontSize: '1.5rem' } }}
            />
          ) : (
            <span style={{ fontSize: '1.5rem' }}>{nodeName}</span>
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
        {nodeInfo.attribute && nodeInfo.attribute.length > 0 && (
          <>
            <Divider />
            {nodeInfo.attribute.map((label) => (
              <Chip key={label} label={label} />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
