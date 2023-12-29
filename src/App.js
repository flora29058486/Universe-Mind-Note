import React, { useRef, useEffect, Component, useState, useCallback } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainKonva from './components/MainKonva/MainKonva.js';
import './App.css';
// import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { SaveUserData } from './components/SaveUserData/SaveUserData.js';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { LabelsProvider } from './components/Context/LabelContext.js'; 
import { NodeProvider } from './components/Context/NodeContext.js';


export default function App() {
  const [konvaData, setKonvaData] = useState({});
  // 螢幕左方工具列
  const [toolSelect, setToolSelect] = useState('');
  // 畫布上的按鈕
  const [toggleButton, setToggleButton] = useState('');
  const [fileDrag, setFileDrag] = useState([]);
  const [dropClientPosition, setDropClientPosition] = useState({ x: 0, y: 0 });
  // galaxy lables state
  // const [labels, setLabels] = useState([]);
  // const labelsFromWhiteBoard = useRef([]);

  useEffect(() => {

  }, [fileDrag]);

  // useEffect(() => {
  //   const whiteBoard = new WhiteBoard();
  //   whiteBoard.initStage(window.innerWidth,  window.innerHeight, 'white'); // 填入你的容器 ID
  //   whiteBoard.initMainLayer();
  //   whiteBoard.initBackLayer(window.innerWidth,  window.innerHeight);
  // }, []);


  // 子组件接收值
  const handleToolSelect = useCallback((button) => {

    setToolSelect(button);
  }, []);

  const handleToggleButtonSelect = useCallback((tool) => {

    setToggleButton(tool);
  }, []);

  const handleDropOutside = useCallback((e) => {
    // 讓檔案可以放在裡面
    e.preventDefault();
    setDropClientPosition({ x: e.clientX, y: e.clientY });

    const isFileFromTreeView = e.dataTransfer.getData('isFileFromTreeView') ? e.dataTransfer.getData('isFileFromTreeView') : false;

    if (isFileFromTreeView) {
      const filesJSON = e.dataTransfer.getData('dragFiles');
      const files = JSON.parse(filesJSON);
      setFileDrag(files);
      e.dataTransfer.clearData(['isFileFromTreeView']);
    } else {
      return;
    }
  }, [dropClientPosition]);

  return (
    <LabelsProvider>
    <NodeProvider>
      <SaveUserData />
      {/* <Grid container overflow={"hidden"} position={"relative"}> */}
      <Grid container sx={{ overflow: 'hidden', position: 'relative', flexWrap: 'nowrap' }}>
        <ToggleButtonOnMainKonva onToggleButtonSelect={handleToggleButtonSelect}/>
        {/* 左邊的 Grid */}
        {
          toolSelect
            ? (
              // 當 toolSelect 為 true，使用 sx 屬性動態設定樣式
              <Grid item
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start',
                }} 
                xs={toolSelect ? 3 : 1}
              >
                <Toolbar onToolSelect={handleToolSelect}/>
              </Grid>
            )
            : (
              // 當 toolSelect 為 false，使用固定的像素值
              <Grid item
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start',
                  width: '72px'
                }}
              >
              <Toolbar onToolSelect={handleToolSelect}/>
            </Grid>
            )
        }
        {/* 右邊的 Grid */}
        {
          toolSelect
            ? (
              // 當 toolSelect 為 true，使用 sx 屬性動態設定樣式
              <Grid item
                sx={{
                  height: '100vh',
                  flexGrow: 1,
                }}
                xs={toolSelect ? 9 : 11}
              >
                <div id="konva-container" onDrop={handleDropOutside} onDragOver={(e) => e.preventDefault()}>
                  <WhiteBoard
                    fileDrop={fileDrag}
                    toggleButton={toggleButton}
                    dropClientPosition={dropClientPosition}
                  />
                </div>
              </Grid>
            )
            : (
              // 當 toolSelect 為 false，使用固定的像素值
              <Grid item
                sx={{
                  height: '100vh',
                  maxWidth: 'calc(100% - 72px)',
                  flexGrow: 1,
                }}
              >
                <div id="konva-container" onDrop={handleDropOutside} onDragOver={(e) => e.preventDefault()}>
                  <WhiteBoard
                    fileDrop={fileDrag}
                    toggleButton={toggleButton}
                    dropClientPosition={dropClientPosition}
                  />
                </div>
              </Grid>
            )
        }  
      </Grid>
    </NodeProvider>
    </LabelsProvider>
  );
}
