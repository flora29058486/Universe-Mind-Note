import React, { useState, useEffect } from 'react';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';

import FileTreeView from './FileImport/FileTreeView.jsx';

const componentTheme = createTheme({
  components: {
    ExplorerButton: {
      borderLeft: '4px solid transparent'
    },
    SearchButton: {
      borderLeft: '4px solid transparent',
    },
    ExtensionsButton: {
      borderLeft: '4px solid transparent',
    },
    SettingsButton: {
      borderLeft: '4px solid transparent',
    },
  },
});

const useStyles = makeStyles({
  drawer: {
    flexShrink: 0,
    width: "15%",
    // "& .MuiDrawer-paper": {
    //   width: "15%",
    //   boxSizing: "border-box",
    //   overflowX: "hidden",
    //   marginTop: "64px"
    // }
  }
});

function Toolbar({onToolSelect}) {
  const classes = useStyles();
  // const theme = useTheme(componentTheme);
  // const [isToolBarOpen, setToolBarOpen] = useState(false);
  // const [isTreeViewOpen, setTreeViewOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');

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
    // console.log(selectedButton);
  }, [selectedButton]);

  return (
    // <ThemeProvider theme={componentTheme}>
    <>
      <Drawer open={true} variant="permanent" anchor="left" className={classes.drawer}>
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
            onClick={() => handleButtonClick('Search')}
            selected={selectedButton === 'Search'}
            sx={{
              minHeight: 72,
              maxWidth: 72,
              justifyContent: open ? 'initial' : 'center',
              px: 1,
              borderLeft: selectedButton === 'Search' ? '2px solid black' : '2px solid transparent',
            }}
          >
            <Tooltip title="Search" placement="right" arrow>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <SearchIcon fontSize='large' sx={{ color: selectedButton === 'Search' ? 'black' : '' }} />
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
        {/* FileTreeView */}
      </Drawer>
      {selectedButton === 'Explorer' && (
        <FileTreeView selectedButton={selectedButton} />
      )}
    </>
    
    // </ThemeProvider>
  );
}

export default Toolbar;
