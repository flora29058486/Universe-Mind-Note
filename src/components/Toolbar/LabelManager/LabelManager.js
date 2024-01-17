import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, Checkbox, ListItemText, ListItemIcon, Button, Paper, Divider, ListItemButton, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CompactPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';

import { useLabels } from '../../Context/LabelContext.js';
import { useNodes } from '../../Context/NodeContext.js';

const useStyles = makeStyles({
  paper: {
    height: '100%', /* 設置最大高度 */
  },
  labelList: {
    height: 'calc(100vh - 145px)', /* 設置最大高度 */
    overflowY: 'auto', /* 啟用垂直滾動條 */
    overflowX: 'hidden', /* 啟用水平滾動條 */
    "&::-webkit-scrollbar": {
      width: '10px', /* 滾動條寬度 */
    },
    scrollbarWidth: 'thin', /* 滾動條寬度（Firefox支援） */
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: '#888', /* 滾動條顏色 */
      borderRadius: '6px', /* 圓角 */
      transition: 'background-color 1.2s ease', /* 顏色漸變動畫 */
    },
    "&:hover::-webkit-scrollbar-thumb": {
      backgroundColor: '#555', /* 滑鼠懸停時滾動條顏色改變 */
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: 'transparent', /* 滾動條背景顏色 */
    },
  },
  popover: {
    marginTop: '160px',
    position: 'absolute',
    zIndex: '2',
  },
  popoverOfNewLabel: {
    // position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  swatch: {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    backgroundColor: '#fff', // 初始化為白色或其他預設顏色
    cursor: 'pointer',
  },
});

function LabelManager({ labels, onMergeLabels, onUpdateLabel }) {
  const classes = useStyles();
  const { addLabel, removeLabel } = useLabels();
  const { nodes, setNodes } = useNodes();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLabels, setFilteredLabels] = useState(labels); // 过滤后的标签列表
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null); // 追踪哪個 label 正在被編輯
  // normal color picker of existing label
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  // color picker of new label
  const [newLabelColor, setNewLabelColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [popoverStyle, setPopoverStyle] = useState({marginTop: '40px'});

  const updatePopoverStyle = (event) => {
    setNewLabelColor(!newLabelColor);
    const elementRect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - elementRect.bottom;
  
    if (spaceBelow < 300) {
      setPopoverStyle({ marginTop: '-130px' });
      console.log("spaceBelow")
    } else {
      setPopoverStyle({ marginTop: '10px' });
    }
  };

  useEffect(() => {
    console.log(selectedLabels);
  }, [selectedLabels]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredLabels(labels);
    } else {
      console.log(searchTerm);
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredLabels = labels.filter(label => 
        label.labelName.toLowerCase().includes(lowercasedFilter)
      );
      console.log(filteredLabels);
      setFilteredLabels(filteredLabels);
    }
  }, [searchTerm, labels]);

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

  const handleDelete = () => {
    selectedLabels.forEach(labelId => {
      removeLabel(labelId);
      setNodes(prevNodes => 
        prevNodes.map(node => 
          ({ ...node, attribute: node.attribute.filter(label => label.labelId !== labelId) })
        )
      );
    });
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

  const addNewLabelFromLabelManager = () => {
    setNewLabelColor(false);

    if (selectedColor === '') {
      addLabel({ labelName: searchTerm, color: "#FCDC00"});
      // onUpdateLabel(label);
    } else {
      // label = { ...label, color: selectedColor };
      // onUpdateLabel(label);
      addLabel({ labelName: searchTerm, color: selectedColor});
    }
  };

  return (
    <Paper className={classes.paper} onWheel={e => e.stopPropagation()}>
      <Box padding={2}>
        <TextField
          id="filled-search"
          fullWidth
          label="搜尋標籤"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'action.active' }} />
            ),
            sx: {
              // // fontSize
              // '.MuiInputBase-input': {
              //   fontSize: '1.2rem', 
              // },
              borderRadius: '30px',
              boxShadow: '0 2px 3px rgba(0, 0, 0, 0.15)',
            },
          }}
        />
      </Box>
      <div className={classes.labelList}>
        <List>
          {filteredLabels.map((label, index) => (
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
                    <div className={classes.popover}>
                      <div className={classes.cover} onClick={colorChangeFinish(label.labelId)} />
                      <CompactPicker color={selectedColor} onChange={handleColorChange} 
                      />
                    </div>
                  ) : null}
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
                  <ListItemText primary={
                    <Typography variant="body1" style={{
                      maxWidth: '100%', // 根据您的布局调整这个宽度
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {label.labelName}
                    </Typography>
                  } />
                </ListItemButton>
              )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        {searchTerm !== '' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', ml: 3, pb: 3 }}>
            <Typography variant="body1" sx={{ mb:1 }}>
              新增標籤：
            </Typography>
            <Button onClick = {(e) => updatePopoverStyle(e)} sx={{ alignSelf: 'flex-start', maxWidth: '95%' }}>
              <LocalOfferIcon></LocalOfferIcon>
              <span style={{ marginRight: '1rem' }}></span>
              <Typography variant="body1" style={{
                // maxWidth: 'calc(80%)', // 根据您的布局调整这个宽度
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {searchTerm}
              </Typography>
            </Button>
            {newLabelColor ? (
              <div className={classes.popoverOfNewLabel} style={{ ...popoverStyle }}>
                <div className={classes.cover} onClick={addNewLabelFromLabelManager} />
                <CompactPicker color={selectedColor} onChange={handleColorChange} 
                />
              </div>
            ) : null}
          </Box>
        )}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button onClick={handleMerge} disabled>Merge Label</Button>
        <Button 
          onClick={handleDelete} 
          disabled={selectedLabels.length === 0} 
          variant="outlined"
          sx={{ ml: 2 }}
          startIcon={<DeleteIcon />}
        >Delete Label</Button>
      </Box>
    </Paper>
  );
}

export default LabelManager;
