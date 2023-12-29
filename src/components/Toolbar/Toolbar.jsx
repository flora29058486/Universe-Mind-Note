import React, { useState, useEffect } from 'react';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import FolderIcon from '@mui/icons-material/Folder';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import FileTreeView from './FileImport/FileTreeView.jsx';
import LabelManager from './LabelManager/LabelManager.js';
import { useLabels } from '../Context/LabelContext.js';


const useStyles = makeStyles({
  drawer: {
    // width: '72px',
    flexGrow: 1,
    flexShrink: 0,
    // '& .MuiDrawer-paper': {
    //   width: '72px',
    //   boxSizing: 'border-box',
    // },
  },
  drawerExpanded: {
    // width: '500px', // 或是其他你想要的寬度
    flexShrink: 0,
    flexGrow: 1,
    // '& .MuiDrawer-paper': {
    //   width: '72px',
    //   boxSizing: 'border-box',
    // },
  },
  // list: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   width: '0px',
  //   overflow: 'hidden',
  //   backgroundColor: '#f0f0f0',
  //   borderRight: '1px solid #ccc',
  // },
  // listItem: {
  //   paddingTop: '12px',
  //   color: '#444',
  //   '&:hover': {
  //     backgroundColor: '#e0e0e0',
  //     color: 'black',
  //   },
  // },
  // paper: {
  //   flexGrow: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   overflowY: 'auto',
  //   paddingLeft: '16px',
  // },
});

function Toolbar({onToolSelect}) {
  const classes = useStyles();
  // const theme = useTheme(componentTheme);
  // const [isToolBarOpen, setToolBarOpen] = useState(false);
  // const [isTreeViewOpen, setTreeViewOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const { labels, addLabel, removeLabel, mergeLabels, updateLabel, searchLabelsByName } = useLabels()

  // const toggleTreeView = () => {
  //   setTreeViewOpen(!isTreeViewOpen);
  // };

  const handleButtonClick = (buttonId) => {
    if (buttonId === selectedButton) {
      onToolSelect('');
      setSelectedButton('');
    } else {
      onToolSelect(buttonId);
      setSelectedButton(buttonId);
    }
  };

  useEffect(() => {
    
  }, [selectedButton]);

  return (
    // <ThemeProvider theme={componentTheme}>
    <Grid
      container
      justifyContent="flex-start"
      wrap='nowrap'
      // alignItems="stretch"
      spacing={0}
    >
      {/* <Grid item xs={selectedButton !== '' ? 3 : 12} md={selectedButton !== '' ? 3 : 12} sx={{ height: '100vh' }}> */}
      <Grid item sx={{ height: '100vh', width: '72px'}}>
        <Drawer
          open={true} 
          variant="permanent"
          anchor="left"
          className={`${selectedButton ? classes.drawerExpanded : classes.drawer }`}
        >
          <List>
            <ListItemButton
              onClick={() => handleButtonClick('Explorer')}
              selected={selectedButton === 'Explorer'}
              sx={{
                minHeight: 72,
                maxWidth: 72,
                justifyContent: open ? 'initial' : 'center',
                px: 1,
                borderLeft: selectedButton === 'Explorer' ? '2px solid black' : '2px solid transparent',
              }}
            >
              <Tooltip title="Explorer" placement="right" arrow>
                  <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FolderIcon fontSize='large' sx={{ color: selectedButton === 'Explorer' ? 'black' : '' }} />
                  </ListItemIcon>
                </Tooltip>
            </ListItemButton>
            <ListItemButton
              onClick={() => handleButtonClick('Label')}
              selected={selectedButton === 'Label'}
              sx={{
                minHeight: 72,
                maxWidth: 72,
                justifyContent: open ? 'initial' : 'center',
                px: 1,
                borderLeft: selectedButton === 'Label' ? '2px solid black' : '2px solid transparent',
              }}
            >
              <Tooltip title="Label" placement="right" arrow>
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                  <BookmarkOutlinedIcon fontSize='large' sx={{ color: selectedButton === 'Label' ? 'black' : '' }} />
                </ListItemIcon>
              </Tooltip>
            </ListItemButton>
            <ListItemButton
              onClick={() => handleButtonClick('Extensions')}
              selected={selectedButton === 'Extensions'}
              sx={{
                minHeight: 72,
                maxWidth: 72,
                justifyContent: open ? 'initial' : 'center',
                px: 1,
                borderLeft: selectedButton === 'Extensions' ? '2px solid black' : '2px solid transparent',
              }}
            >
              <Tooltip title="Extensions" placement="right" arrow>
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ExtensionIcon fontSize='large' sx={{ color: selectedButton === 'Extensions' ? 'black' : '' }}
                  />
                </ListItemIcon>
              </Tooltip>
            </ListItemButton>
            <ListItemButton
              onClick={() => handleButtonClick('Settings')}
              selected={selectedButton === 'Settings'}
              sx={{
                minHeight: 72,
                maxWidth: 72,
                justifyContent: open ? 'initial' : 'center',
                px: 1,
                borderLeft: selectedButton === 'Settings' ? '2px solid black' : '2px solid transparent',
              }}
            >
              <Tooltip title="Settings" placement="right" arrow>
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SettingsIcon fontSize='large' sx={{ color: selectedButton === 'Settings' ? 'black' : '' }} />
                </ListItemIcon>
              </Tooltip>
            </ListItemButton>
          </List>
        </Drawer>
      </Grid>
      {/* <Grid item xs={9} md={9}> */}
      <Grid item sx={{ height: '100vh', maxWidth: 'calc(100% - 72px)', flexShrink: 1, flexGrow: 1 }}>
        {selectedButton === 'Explorer' && (
          <FileTreeView selectedButton={selectedButton} />
        )}
        {selectedButton === 'Label' && (
          <LabelManager
            labels={labels}
            onAddLabel={addLabel}
            onMergeLabels={mergeLabels}
            onUpdateLabel={updateLabel}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Toolbar;
