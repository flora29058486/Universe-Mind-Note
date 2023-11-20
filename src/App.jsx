import React, { useRef, useEffect, Component, useState } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import MainKonva from './components/MainKonva/MainKonva';
import './App.css';
import KnovaBgImg from './components/knovaBg.jsx';
// import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';

export default function App() {
  const [toolSelect, setToolSelect] = useState('');
  const [fileDrag, setFileDrag] = useState([]);

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
    const filesJSON = e.dataTransfer.getData('dragFiles');
    console.log(filesJSON);
    // if (!filesJSON) return;
    const files = JSON.parse(filesJSON);
    setFileDrag(files);
  };

  return (
    <div>
      <Toolbar onToolSelect={handleToolSelect}/>
      <ToggleButtonOnMainKonva/>
      <div 
        id="konva-container"
        onDrop={handleDropOutside}
        onDragOver={(e) => e.preventDefault()}
      >
        <WhiteBoard 
          fileDrop={fileDrag}
          // onPositionInfo={handlePositionInfo}
        />
        {/* <div id="white"></div> */}
      </div>
    </div>
  );
}
