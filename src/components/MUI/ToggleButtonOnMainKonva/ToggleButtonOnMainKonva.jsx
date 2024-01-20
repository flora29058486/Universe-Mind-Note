import React, { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import TitleIcon from '@mui/icons-material/Title';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

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

const ToggleButtonOnMainKonva = ({ onToggleButtonSelect, toolUsed }) => {
  // const classes = useStyles();
  const [selectedButton, setSelectedButton] = useState('');
  const [toggleButtonValue, setToggleButtonValue] = useState('');

  const handleSelectedButton = (event, newSelectedButton) => {
    onToggleButtonSelect(newSelectedButton);
    setSelectedButton(newSelectedButton);
  };

  useEffect(() => {
    if (toolUsed) {
      setSelectedButton('');
    }
  }, [toolUsed]);

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
        <ToggleButton value="create-text" aria-label="text">
          <Tooltip title="新增文字方塊" arrow>
            <TitleIcon/>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="create-folder" aria-label="create-folder">
          <Tooltip title="新增資料夾" arrow>
              <CreateNewFolderIcon/> 
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="create-arrow" aria-label="create-arrow">
          <Tooltip title="新增箭頭" arrow>
            <ArrowRightAltIcon/>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="delete" aria-label="delete">
          <Tooltip title="刪除畫布元素" arrow>
            <DeleteIcon/>
          </Tooltip>
        </ToggleButton>
        {/* <ToggleButton value="pan" aria-label="pan">
          <Tooltip title="現在沒有功能喔sorry" arrow>
            <PanToolAltIcon/>
          </Tooltip>
        </ToggleButton> */}
        {/* <ToggleButton value="zoom-out" aria-label="zoom-out">
          <ZoomInMapIcon style={{ transform: 'rotate(180deg)' }} className={classes.icon} />
        </ToggleButton> */}
      </ToggleButtonGroup>
    </div>
  );
};

export default ToggleButtonOnMainKonva;
