import React, { useState, useEffect, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import FolderIcon from '@mui/icons-material/Folder';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import FileTreeView from './FileImport/FileTreeView.jsx';
import LabelManager from './LabelManager/LabelManager.js';
import NotionPageList from '../Extensions/notion/NotionPageList.js';
import BackgroundChange from './Manage/BackgroundChange.js';
import { useLabels } from '../Context/LabelContext.js';

function Toolbar({ onToolSelect, currentBg }) {
  const [selectedButton, setSelectedButton] = useState('');
  // const [currentBg, setCurrentBg] = useState('');
  const { labels, addLabel, removeLabel, mergeLabels, updateLabel, searchLabelsByName } = useLabels()

  const handleButtonClick = (buttonId) => {
    if (buttonId === selectedButton) {
      onToolSelect('');
      setSelectedButton('');
    } else {
      onToolSelect(buttonId);
      setSelectedButton(buttonId);
    }
  };

  const handleBackgroundChange = useCallback((bg) => {
    currentBg(bg);
  }, []);

  useEffect(() => {
    
  }, [selectedButton]);

  return (
    <Grid
      container
      justifyContent="flex-start"
      wrap='nowrap'
      spacing={0}
    >
      <Grid item sx={{ height: '100vh', width: '72px'}}>
        <Drawer
          open={true} 
          variant="permanent"
          anchor="left"
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
              onClick={() => handleButtonClick('Manage')}
              selected={selectedButton === 'Manage'}
              sx={{
                minHeight: 72,
                maxWidth: 72,
                justifyContent: open ? 'initial' : 'center',
                px: 1,
                borderLeft: selectedButton === 'Manage' ? '2px solid black' : '2px solid transparent',
              }}
            >
              <Tooltip title="Manage" placement="right" arrow>
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SettingsIcon fontSize='large' sx={{ color: selectedButton === 'Manage' ? 'black' : '' }} />
                </ListItemIcon>
              </Tooltip>
            </ListItemButton>
          </List>
        </Drawer>
      </Grid>
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
        {selectedButton === 'Extensions' && (
          <NotionPageList />
        )}
        {selectedButton === 'Manage' && (
          <BackgroundChange onBackgroundChange={handleBackgroundChange}/>
        )}
      </Grid>
    </Grid>
  );
}

export default Toolbar;
