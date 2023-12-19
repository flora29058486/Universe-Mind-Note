import React, { useState } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, DialogContentText, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { CompactPicker } from 'react-color';

const AddNewLabel = ({ onclose, addLabel }) => {
  const [attribute, setAttribute] = useState({color: '#FE9200'});
  const [selectedColor, setSelectedColor] = useState('#FE9200');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

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
        <DialogContentText>
          Set Label's name and color
        </DialogContentText>
        <div style={styles.swatch} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
        {displayColorPicker ? (
          <div style={{ ...styles.popover, zIndex: '2' }}>
            <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
            <CompactPicker color={selectedColor} onChange={handleColorChange} 
            />
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
