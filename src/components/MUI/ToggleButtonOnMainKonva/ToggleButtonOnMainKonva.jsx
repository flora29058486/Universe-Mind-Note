import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '5%',
    right: '20%',
    // left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    // backgroundColor: 'black',
    opacity: 0.7,
    borderRadius: '10px',
  },
  icon: {
    // color: 'white', 
  },
}));

const ToggleButtonOnMainKonva = ({onToggleButtonSelect}) => {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = useState('');
  const [toggleButtonValue, setToggleButtonValue] = useState('');

  const handleSelectedButton = (event, newSelectedButton) => {
    onToggleButtonSelect(newSelectedButton);
    setSelectedButton(newSelectedButton);
  };

  return (
    <div className={classes.root}>
      <ToggleButtonGroup
        value={selectedButton}
        exclusive
        onChange={handleSelectedButton}
        aria-label="toggle button group"
      >
        <ToggleButton value="create" aria-label="create">
          <CreateIcon className={classes.icon} />
        </ToggleButton>
        <ToggleButton value="copy" aria-label="copy">
          <ContentCopyIcon className={classes.icon} />
        </ToggleButton>
        <ToggleButton value="delete" aria-label="delete">
          <DeleteIcon className={classes.icon} />
        </ToggleButton>
        <ToggleButton value="zoom-in" aria-label="zoom-in">
          <ZoomInMapIcon className={classes.icon} />
        </ToggleButton>
        <ToggleButton value="pan" aria-label="pan">
          <PanToolAltIcon className={classes.icon} />
        </ToggleButton>
        <ToggleButton value="zoom-out" aria-label="zoom-out">
          <ZoomInMapIcon style={{ transform: 'rotate(180deg)' }} className={classes.icon} />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default ToggleButtonOnMainKonva;
