import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     position: 'absolute',
//     top: '40px',
//     // right: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 1,
//     // backgroundColor: 'black',
//     opacity: 1,
//     borderRadius: '10px',
//     border: '1px solid black',
//   },
//   icon: {
//     // color: 'white', 
//   },
// }));

const ToggleButtonOnMainKonva = ({onToggleButtonSelect}) => {
  // const classes = useStyles();
  const [selectedButton, setSelectedButton] = useState('');
  const [toggleButtonValue, setToggleButtonValue] = useState('');

  const handleSelectedButton = (event, newSelectedButton) => {
    onToggleButtonSelect(newSelectedButton);
    setSelectedButton(newSelectedButton);
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '40px', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      zIndex: 1, 
      opacity: 1, 
      borderRadius: '10px', 
      border: '1px solid black' 
    }}>
      <ToggleButtonGroup
        value={selectedButton}
        exclusive
        onChange={handleSelectedButton}
        aria-label="toggle button group"
      >
        <ToggleButton value="create-folder" aria-label="create-folder">
          <Tooltip title="新增資料夾" arrow>
            <CreateNewFolderIcon/>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="copy" aria-label="copy">
          <ContentCopyIcon/>
        </ToggleButton>
        <ToggleButton value="delete" aria-label="delete">
          <DeleteIcon/>
        </ToggleButton>
        <ToggleButton value="zoom-in" aria-label="zoom-in">
          <ZoomInMapIcon/>
        </ToggleButton>
        <ToggleButton value="pan" aria-label="pan">
          <PanToolAltIcon/>
        </ToggleButton>
        {/* <ToggleButton value="zoom-out" aria-label="zoom-out">
          <ZoomInMapIcon style={{ transform: 'rotate(180deg)' }} className={classes.icon} />
        </ToggleButton> */}
      </ToggleButtonGroup>
    </div>
  );
};

export default ToggleButtonOnMainKonva;
