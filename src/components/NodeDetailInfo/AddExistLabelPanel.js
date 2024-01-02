import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, Checkbox, ListItemText, ListItemIcon, Button, Paper, Divider, ListItemButton, Typography, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@material-ui/core/styles';

import { useLabels } from '../Context/LabelContext.js';
import { useNodes } from '../Context/NodeContext.js';

const useStyles = makeStyles({
  paper: {
    height: '100%', /* 設置最大高度 */
    marginTop: '1rem',
  },
  labelList: {
    height: '30vh', /* 設置最大高度 */
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
});

function AddExistLabelPanel({ currentNode }) {
  const classes = useStyles();
  const { labels } = useLabels();
  const { nodes } = useNodes();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLabels, setFilteredLabels] = useState([]);

  useEffect(() => {

    function filterAvailableLabels(labels, currentNode) {
      if (!labels || !currentNode || !currentNode.attribute) {
        return [];
      } else {
        const node = nodes.find(node => node.nodeId === currentNode.nodeId);
        
        return labels.filter(label => {
          // 檢查當前標籤的 labelId 是否不存在於 node.attribute 中
          return !node.attribute.some(attr => attr.labelId === label.labelId);
        });
      }
    }

    if (searchTerm === '') {
      const filterLabels = filterAvailableLabels(labels, currentNode);
      setFilteredLabels(filterLabels);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filterLabels = filterAvailableLabels(labels, currentNode);
      const filteredLabels = filterLabels.filter(label => 
        label.labelName.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredLabels(filteredLabels);
    }
  }, [searchTerm, labels, currentNode]);

  return (
    <Paper className={classes.paper}>
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
              <ListItem>
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
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </div>
    </Paper>
  );
}

export default AddExistLabelPanel;
