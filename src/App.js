import React, { useRef, useEffect, useState, useCallback } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import Grid from '@mui/material/Grid';
import { SaveUserData } from './components/SaveUserData/SaveUserData.js';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';
import { LabelsProvider } from './components/Context/LabelContext.js'; 
import { NodeProvider } from './components/Context/NodeContext.js';


export default function App() {
  // userDataSaved
  const [userDataNode, setUserDataNode] = useState(null);
  const [userDataLabel, setUserDataLabel] = useState(null);

  // 螢幕左方工具列
  const [toolSelect, setToolSelect] = useState('');
  // 畫布上的按鈕
  const [toggleButton, setToggleButton] = useState('');
  const [fileDrag, setFileDrag] = useState([]);
  const [dropClientPosition, setDropClientPosition] = useState({ x: 0, y: 0 });
  const [konvaStageJson, setKonvaStageJson] = useState(null);

  // request StageRef when app end
  const [stageSave, setStageSave] = useState(0);

  // const [userData, setUserData] = useState(null);

  // 初始化時讀取 userData(上次關閉前的資料)
  const handleLoadUserData = async () => {
    let preUserData = await window.electronAPI.loadUserData();
    
    preUserData = JSON.parse(preUserData);

    if (Object.keys(preUserData).length === 0) {
      setUserDataNode([]);
      setUserDataLabel([]);
      return;
    } else {
      setUserDataNode(preUserData.nodes);
      setUserDataLabel(preUserData.labels);
    }
    
    // console.log(preUserData);

    // // prevent if stageP is not define
    // if (preUserData.stage === undefined) {
    //   return;
    // } else {
    //   let stageP = JSON.parse(preUserData.stage);
    //   console.log(stageP);
    //   // setUserData(stageP);
    // }
  };

  useEffect(() => {
    handleLoadUserData();
  }, []);

  // 結束應用時觸發 
  const handleStateChange = (trueOrFalse) => {
    // 处理状态变化
    // if (trueOrFalse) {
    //   let currentNumber = stageSave;
    //   setStageSave(currentNumber++);
    // }
    let currentNumber = stageSave;
    // console.log("stageSave: ", stageSave);
    setStageSave(currentNumber+1);
  };

  // change this code below to when user close the app only return once (not done yet)
  const handleStageRefChange = useCallback((newRef) => {
    if (newRef) {
      setKonvaStageJson(newRef.toJSON());
    }
    // console.log(konvaStageJson);
  }, []);

  useEffect(() => {

  }, [fileDrag]);

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
    userDataNode && userDataLabel && (
      <LabelsProvider initialLabels={userDataLabel}>
      <NodeProvider initialNodes={userDataNode}>
        <SaveUserData onStateChange={handleStateChange} konvaStageJson={konvaStageJson} />
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
                    stageSave={stageSave}
                    onStageRefChange={handleStageRefChange}
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
                    stageSave={stageSave}
                    onStageRefChange={handleStageRefChange}
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
    )
  )
};