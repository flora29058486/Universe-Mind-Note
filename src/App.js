import React, { useRef, useEffect, Component, useState, useCallback } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainKonva from './components/MainKonva/MainKonva.js';
import './App.css';
// import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { LabelsProvider } from './components/Context/LabelContext.js'; 
import { NodeProvider } from './components/Context/NodeContext.js';;


export default function App() {
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

    const filesJSON = e.dataTransfer.getData('dragFiles');
    const files = JSON.parse(filesJSON);
    setFileDrag(files);
  }, [dropClientPosition]);

  return (
    <LabelsProvider>
    <NodeProvider>
      <Grid container>
        {/* 左邊的 Grid */}
        <Grid item xs={toolSelect ? 4 : 1} md={toolSelect ? 4 : 1}>
          {/* 呼叫你的組件 */}
          <Toolbar onToolSelect={handleToolSelect}/>
        </Grid>
        {/* 右邊的內容 */}
        <Grid item xs={toolSelect ? 8 : 11} md={toolSelect ? 8 : 11} position={"relative"}>
          <ToggleButtonOnMainKonva onToggleButtonSelect={handleToggleButtonSelect}/>
          <div 
            id="konva-container"
            onDrop={handleDropOutside}
            onDragOver={(e) => e.preventDefault()}
          >
            <WhiteBoard
              fileDrop={fileDrag}
              toggleButton={toggleButton}
              dropClientPosition={dropClientPosition}
            />
          </div>
        </Grid>
      </Grid>
    </NodeProvider>
    </LabelsProvider>
  );
}
