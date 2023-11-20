import React, { useRef, useEffect, Component, useState } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainKonva from './components/MainKonva/MainKonva';
import './App.css';
import KnovaBgImg from './components/knovaBg.jsx';
// import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';

export default function App() {
  const [toolSelect, setToolSelect] = useState('');
  const [fileDrag, setFileDrag] = useState([]);
  const [dropClientPosition, setDropClientPosition] = useState({ x: 0, y: 0 });

  const handlePositionInfo = (positionInfo) => {
    // 在這裡處理從WhiteBoard的滑鼠位置
    console.log("Position info from child:", positionInfo);
  };

  // useEffect(() => {
  //   const whiteBoard = new WhiteBoard();
  //   whiteBoard.initStage(window.innerWidth,  window.innerHeight, 'white'); // 填入你的容器 ID
  //   whiteBoard.initMainLayer();
  //   whiteBoard.initBackLayer(window.innerWidth,  window.innerHeight);
  // }, []);

  useEffect(() => {

  }, [fileDrag]);


  // 回调函数，用于从子组件接收值
  const handleToolSelect = (button) => {
    // 处理子组件传递过来的值
    setToolSelect(button);
    console.log(button);
    // console.log(toolSelect);
  };

  const handleDropOutside = (e) => {
    // 讓檔案可以放在裡面
    e.preventDefault();
    console.log(e);
    setDropClientPosition({ x: e.clientX, y: e.clientY });
    const filesJSON = e.dataTransfer.getData('dragFiles');
    // if (!filesJSON) return;
    const files = JSON.parse(filesJSON);
    setFileDrag(files);
    
    console.log(files);
  };

  return (
    <Grid container>
      {/* 左邊的 Grid */}
      <Grid item xs={toolSelect ? 4 : 1} md={toolSelect ? 4 : 1}>
        {/* 呼叫你的組件 */}
        <Toolbar onToolSelect={handleToolSelect}/>
        <ToggleButtonOnMainKonva/>
      </Grid>
      {/* 右邊的內容 */}
      <Grid item xs={toolSelect ? 8 : 11} md={toolSelect ? 8 : 11}>
        <div 
          id="konva-container"
          onDrop={handleDropOutside}
          onDragOver={(e) => e.preventDefault()}
        >
          <WhiteBoard 
            fileDrop={fileDrag}
            dropClientPosition={dropClientPosition}
          />
        </div>
      </Grid>
    </Grid>
  );
}



    // <div>
    //   <Toolbar onToolSelect={handleToolSelect}/>
    //   <div 
    //     id="konva-container"
    //     onDrop={handleDropOutside}
    //     onDragOver={(e) => e.preventDefault()}
    //   >
    //     <ToggleButtonOnMainKonva/>
    //     <WhiteBoard 
    //       fileDrop={fileDrag}
    //       dropClientPosition={dropClientPosition}
    //       // onPositionInfo={handlePositionInfo}
    //     />
    //   </div>
    // </div>