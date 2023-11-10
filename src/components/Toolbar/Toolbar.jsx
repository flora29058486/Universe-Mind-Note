import React, { useState, useEffect } from 'react';
import { styled, useTheme, createTheme } from '@mui/material/styles';
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



function Toolbar() {
  // const theme = useTheme(componentTheme);
  // const [isToolBarOpen, setToolBarOpen] = useState(false);
  // const [isTreeViewOpen, setTreeViewOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');

  // const toggleTreeView = () => {
  //   setTreeViewOpen(!isTreeViewOpen);
  // };

  const handleButtonClick = (buttonId) => {
    if (buttonId === selectedButton) {
      setSelectedButton('');
    } else {
      setSelectedButton(buttonId);
    }
  };

  useEffect(() => {
    console.log(selectedButton);
  }, [selectedButton]);

  return (
    <div>
      <Drawer open={true} variant="persistent">
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
      </Drawer>
      {selectedButton === 'Explorer' && (
        <div style={{ marginLeft: '72px' }}>
          {/* 右侧渲染 CustomTreeView */}
          <FileTreeView selectedButton={selectedButton} />
        </div>
      )}
    </div>
  );
}

export default Toolbar;
