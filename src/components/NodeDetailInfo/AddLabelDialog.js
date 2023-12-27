import React, { useState, useEffect, useRef } from 'react';
import { Box, Dialog } from '@mui/material';

import AddNewLabel from './AddNewLabel.js';
import { useNodes } from '../Context/NodeContext.js';
import { useLabels } from '../Context/LabelContext.js';

const AddLabelDialog = ({ currentNode, open, handleClose, onUpdateNodeInfo }) => {
  const { nodes, setNodes } = useNodes();
  const { setLabels } = useLabels();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [currentNodePassToAddLabel, setCurrentNodePassToAddLabel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(open);
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
      setCurrentNodePassToAddLabel(node);
      labels.current = node.attribute;
      setNodeData({
        nodeId: groupId,
        fileName: node.fileName,
        attribute: labels.current ? labels.current : [],
        x: currentNode.attrs.x,
        y: currentNode.attrs.y,
      });
    }
  }, [currentNode, open, nodes]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShowChipDelete(false);
    setCurrentNodePassToAddLabel(null);
    // update open status (whiteBoard)
    handleClose(true);
  };
  
  const handleAddLabelClose = () => {
    setDialogOpen(false);
    // update open status (whiteBoard)
    handleClose(true);
    setCurrentNodePassToAddLabel(null);
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
      labels.current = updatedNodeData.attribute;
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

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} aria-labelledby="node-dialog-title" maxWidth='xs' fullWidth>
      <Box>
        <AddNewLabel currentNode={currentNodePassToAddLabel} onclose={handleAddLabelClose} addLabel={handleAddLabel} />
      </Box>
    </Dialog>
  );
};

export default AddLabelDialog;
