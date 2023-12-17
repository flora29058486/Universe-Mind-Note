import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider } from '@mui/material';

const NodeDialog = ({ nodeInfo, currentNode, open, handleClose, onUpdateNodeInfo }) => {
  const [nodes, setNodes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(open);
  const [currentNodeId, setCurrentNodeId] = useState('');
  const [currentNodeLocation, setCurrentNodeLocation] = useState({x: 0, y: 0});
  const [nodeName, setNodeName] = useState('');
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
    // update open status (whiteBoard)
    handleClose(true);
  };

  const handleNameChange = (event) => {
    setNodeName(event.target.value);
  };

  const handleSave = () => {
    const updateNode = {fileName: nodeName, nodeId: currentNodeId, x: currentNodeLocation.x, y: currentNodeLocation.y};
    nodesRef.current = updateNode;
    console.log(updateNode);
    handleCloseDialog();
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>
        <input type="text" value={nodeName} onChange={handleNameChange} />
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
