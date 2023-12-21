import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, Checkbox, ListItemText, ListItemIcon, Button, Paper, Divider, ListItemButton, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CompactPicker } from 'react-color';

function LabelManager({ labels, onRemoveLabel, onMergeLabels, onUpdateLabel }) {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null); // 追踪哪個 label 正在被編輯
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');;

  const styles = {
    swatch: {
      width: '50px',
      height: '50px',
      borderRadius: '4px',
      backgroundColor: selectedColor,
      cursor: 'pointer',
    },
    popover: {
      marginTop: '160px',
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

  const handleToggle = (labelId) => {
    console.log(labelId);
    const currentIndex = selectedLabels.indexOf(labelId);
    const newChecked = [...selectedLabels];

    if (currentIndex === -1) {
      newChecked.push(labelId);
      setEditingLabelId(labelId);
    } else {
      newChecked.splice(currentIndex, 1);
      setEditingLabelId(null);
    }

    setSelectedLabels(newChecked);
    setShowCheckboxes(newChecked.length > 0);
  };

  const handleMerge = () => {
    onMergeLabels(selectedLabels);
    setSelectedLabels([]);
    setShowCheckboxes(false);
    setEditingLabelId(null);
  };

  const handleUpdateLabelName = (labelId, newName) => {
    let label = labels.find(label => label.labelId === labelId);
    label = { ...label, labelName: newName };

    onUpdateLabel(label);
    setEditingLabelId(null);
  };

  const handleColorChange = (color) => {
    // onUpdateLabel(labelId, newName);
    setSelectedColor(color.hex);
  };

  const colorChangeFinish = (labelId) => () => {
    setDisplayColorPicker(false);
    let label = labels.find(label => label.labelId === labelId);

    if (selectedColor === '') {
      onUpdateLabel(label);
    } else {
      label = { ...label, color: selectedColor };
      onUpdateLabel(label);
    }
  };

  return (
    // <Paper style={{ padding: '20px' }}>
    <Paper>
      <List>
        {labels.map((label, index) => (
          <React.Fragment key={label.labelId}>
            {index > 0 && <Divider component="li" />}
            <ListItem secondaryAction={
              showCheckboxes ? (
                <Checkbox
                  edge="end"
                  onChange={() => handleToggle(label.labelId)}
                  checked={selectedLabels.indexOf(label.labelId) !== -1}
                />
              ) : null
            }>
            {editingLabelId === label.labelId ? (
              // 如果當前標籤處於編輯模式
              <React.Fragment>
                <IconButton onClick = {() => setDisplayColorPicker(!displayColorPicker)}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: label.color,
                    borderRadius: '50%',
                  }} />
                </IconButton>
                {displayColorPicker ? (
                  <div style={{ ...styles.popover, zIndex: '2' }}>
                    <div style={styles.cover} onClick={colorChangeFinish(label.labelId)} />
                    <CompactPicker color={selectedColor} onChange={handleColorChange} 
                    />
                  </div>
                ) : null}
                {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                  onChange={(e) => handleUpdateLabelName(label.labelId, e.target.value)}
                  fullWidth
                  defaultValue={label.labelName}
                  InputProps={{
                    endAdornment: (
                      <EditIcon />
                    ),
                  }}
                />
                
                <EditIcon sx={{ color: 'action.active', ml: 1, mb: 2 }} />
                </Box> */}
                <TextField
                  onBlur={(e) => handleUpdateLabelName(label.labelId, e.target.value)}
                  fullWidth
                  defaultValue={label.labelName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <EditIcon sx={{ color: 'action.active' }} />
                    ),
                  }}
                />
              </React.Fragment>
            ) : (
              // 正常模式
              <ListItemButton onClick={() => handleToggle(label.labelId)}>
                <ListItemIcon>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: label.color,
                    borderRadius: '50%'
                  }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1">{label.labelName}</Typography>} />
              </ListItemButton>
            )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      <Button onClick={handleMerge}>Merge Selected</Button>
    </Paper>
  );
}

export default LabelManager;
