import React, { useState, useEffect } from 'react';
import { Divider, Grid, Chip, IconButton, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import { CompactPicker } from 'react-color';

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

const AddNewLabel = ({ currentNode, onclose, addLabel }) => {
  const [attribute, setAttribute] = useState({color: '#FE9200'});
  const [selectedColor, setSelectedColor] = useState('#FE9200');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [labelsToShow, setLabelsToShow] = useState([]);
  const { nodes } = useNodes();
  const { labels } = useLabels();

  useEffect(() => {
  
    if (currentNode) {
      let currentLabels = nodes.find(node => node.nodeId === currentNode.nodeId);
      currentLabels = currentLabels ? currentLabels.attribute : [];
      console.log(currentLabels);
      const recentLabels = labels.filter(label => 
        !currentLabels.some(nodeLabel => nodeLabel.labelId === label.labelId)
      );
      // 倒序排序
      const sortedRecentLabels = [...recentLabels].reverse();
    
      // 限制要顯示的標籤數量
      setLabelsToShow(sortedRecentLabels.slice(0, MAX_LABELS_TO_SHOW));
    }

    // console.log(labelsToShow);
  }, [currentNode, nodes, labels]);

  const styles = {
    swatch: {
      width: '50px',
      height: '50px',
      borderRadius: '4px',
      backgroundColor: selectedColor,
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  const handleCloseDialog = () => {
    handleAddAttribute(attribute);
    console.log(attribute);
    // setAttribute({color: '#FE9200'});
    onclose(false);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    setAttribute((prev) => ({
      ...prev,
      color: color.hex,
    }));
  };

  const handleAddLabelName = (e) => {
    e.stopPropagation();
    setAttribute((prev) => ({
      ...prev,
      labelName: e.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      setAttribute((prev) => ({
        ...prev,
        labelName: e.target.value,
      }));
      handleCloseDialog();
    }
  };

  const handleAddAttribute = (label) => {
    const createAttribute = {...label, labelId: uuidv4()};
    addLabel(createAttribute);
  };

  return (
    <>
      <DialogTitle>Add New Label</DialogTitle>
      <DialogContent>
      {labelsToShow.length > 0 && (
        <>
          <DialogContentText>
            快速新增先前標籤
          </DialogContentText>
          <DialogContent sx={{ pb: 0, px: 0 }}>
            {/* 最近使用過的標籤 */}
            <Grid container spacing={1}>
              {labelsToShow.map((label) => (
                <Grid item key={label.labelId}>
                  <Chip
                    label={label.labelName}
                    style={{ backgroundColor: label.color, color: getTextColorForBackground(label.color) }}
                    clickable
                    // 添加您的 onClick 事件處理函數
                  />
                </Grid>
              ))}
              <Grid item>
                <IconButton>
                  <AddIcon />
                  {/* 添加按鈕的 onClick 事件處理函數 */}
                </IconButton>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider variant="middle" style={{ margin: '1rem 0' }} />
        </>
      )}
        <DialogContentText>
          新增全新標籤
        </DialogContentText>
        <div style={styles.swatch} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
        {displayColorPicker ? (
          <div style={{ ...styles.popover, zIndex: '2' }}>
            <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
            <CompactPicker onChange={handleColorChange} />
          </div>
        ) : null}
        <TextField
          autoFocus
          onChange={handleAddLabelName}
          onKeyDown={handleKeyDown}
          margin="dense"
          id="name"
          label="Label Name"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Save</Button>
      </DialogActions>
    </>
  );
};

export default AddNewLabel;
