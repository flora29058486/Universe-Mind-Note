import React, { useState, useEffect } from 'react';
import { Paper, Box, ToggleButtonGroup, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TextSettingToggleButton({ textProps, onTextPropsChange, isFocus, onDelText }) {
  // console.log("textprops", textProps)
  const [alignment, setAlignment] = useState(textProps.align);
  const [fontSize, setFontSize] = useState(textProps.fontSize);

  // 当父组件的textProps变化时，更新状态
  useEffect(() => {
    if (textProps.align !== alignment) {
      setAlignment(textProps.align);
    }
    if (textProps.fontSize !== fontSize) {
      setFontSize(textProps.fontSize);
    }
  }, [textProps, alignment, fontSize]);
  
  const handleDeleteText = () => {
    onDelText(true);
  };

  // 当对齐方式改变时，调用onTextPropsChange来更新父组件的状态
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    onTextPropsChange('align', newAlignment);
  };

  // 确保当用户直接在输入框中更改字体大小时，也更新父组件的状态
  const handleFontSizeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setFontSize(value);
      onTextPropsChange('fontSize', value);
    }
  };

  const handleMouseDown = () => {
    isFocus(true);
  };

  const handleClose = () => {
    isFocus(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%', // 使 Box 撑满 Paper 的宽度
        }}
      >
        <TextField
          type="number"
          size="small"
          // label="字體大小"
          value={fontSize}
          onChange={handleFontSizeChange}
          onMouseDown={handleMouseDown}
          // onMouseUp={handleMouseUp}
          // onFocus={handleIsFocused}
          onBlur={handleClose}
          sx={{ m: 1, width: '100px' }}
        />
        <IconButton
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={handleDeleteText}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
