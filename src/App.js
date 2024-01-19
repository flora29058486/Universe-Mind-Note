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
  const [toolUsed, setToolUsed] = useState(false);
  // 畫布上的按鈕
  const [toggleButton, setToggleButton] = useState('');
  const [fileDropType, setFileDropType] = useState('');
  const [fileDrag, setFileDrag] = useState([]);
  const [dropClientPosition, setDropClientPosition] = useState({ x: 0, y: 0 });
  const [konvaStageJson, setKonvaStageJson] = useState(null);
  // 畫布背景
  const [currentBg, setCurrentBg] = useState('line');

  // request StageRef when app end
  const [stageSave, setStageSave] = useState(0);
  // textLayerData
  const [textLayerOnLoad, setTextLayerOnLoad] = useState(null);
  const [textLayerData, setTextLayerData] = useState(null);
  // nodeFinder
  const [nodeFind, setNodeFind] = useState(null);

  // const [userData, setUserData] = useState(null);

  // 初始化時讀取 userData(上次關閉前的資料)
  const handleLoadUserData = async () => {
    let preUserData = await window.electronAPI.loadUserData();
    
    preUserData = JSON.parse(preUserData);

    if (Object.keys(preUserData).length === 0) {
      if (preUserData.nodes === undefined) {
        setUserDataNode([]);
      };
      if (preUserData.labels === undefined) {
        setUserDataLabel([]);
      };
      if (preUserData.text === undefined) {
        setTextLayerOnLoad([]);
      };
      return;
    } else {
      setUserDataNode(preUserData.nodes);
      setUserDataLabel(preUserData.labels);
      setTextLayerOnLoad(preUserData.text);
    }
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

  const handleTextLayerSave = useCallback((textLayer) => {
    setTextLayerData(textLayer);
  }, []);

  useEffect(() => {

  }, [fileDrag, fileDropType, currentBg]);

  // 背景按鈕選擇
  const handleBackgroundChange = useCallback((bg) => {
    setCurrentBg(bg);
  }, []);

  // 搜尋節點
  function handleSearchResults(findedNodes) {
    setNodeFind(findedNodes);
  }

  // 工具列選擇 ToggleButtonOnMainKonva 參數設定
  const handleToolSelect = useCallback((button) => {

    setToolSelect(button);
  }, []);

  const handleToggleButtonSelect = useCallback((tool) => {
    setToolUsed(false);
    setToggleButton(tool);
  }, []);

  const handleToolUsed = useCallback(() => {
    setToolUsed(true);
    setToggleButton('');
  }, []);

  const handleDropOutside = useCallback((e) => {
    // 讓檔案可以放在裡面
    e.preventDefault();
    setDropClientPosition({ x: e.clientX, y: e.clientY });

    const isFileFromTreeView = e.dataTransfer.getData('isFileFromTreeView') ? e.dataTransfer.getData('isFileFromTreeView') : false;
    const isFileFromNotionExtension = e.dataTransfer.getData('isFileFromNotionExtension') ? e.dataTransfer.getData('isFileFromNotionExtension') : false;

    if (isFileFromTreeView) {
      const filesJSON = e.dataTransfer.getData('dragFiles');
      const files = JSON.parse(filesJSON);
      setFileDrag(files);
      setFileDropType('normal');
      e.dataTransfer.clearData(['isFileFromTreeView']);
    } else if (isFileFromNotionExtension) {
      const filesJSON = e.dataTransfer.getData('notionPages');
      const files = JSON.parse(filesJSON);
      setFileDrag(files);
      setFileDropType('notion');
      e.dataTransfer.clearData(['isFileFromNotionExtension']);
    } else {
      return;
    }
  }, [dropClientPosition, setFileDrag, setFileDropType]);

  return (
    userDataNode && userDataLabel && (
      <LabelsProvider initialLabels={userDataLabel}>
      <NodeProvider initialNodes={userDataNode}>
        <SaveUserData onStateChange={handleStateChange} konvaStageJson={konvaStageJson} textLayerData={textLayerData} />
        <Grid container sx={{ overflow: 'hidden', position: 'relative', flexWrap: 'nowrap' }}>
          <ToggleButtonOnMainKonva onToggleButtonSelect={handleToggleButtonSelect} toolUsed={toolUsed}/>
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
                <Toolbar onToolSelect={handleToolSelect} currentBg={handleBackgroundChange} onSearchResults={handleSearchResults}/>
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
              <Toolbar onToolSelect={handleToolSelect} currentBg={handleBackgroundChange} onSearchResults={handleSearchResults}/>
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
                    textLayerSave={handleTextLayerSave}
                    textLaterLoad={textLayerOnLoad}
                    onStageRefChange={handleStageRefChange}
                    fileDropType={fileDropType}
                    fileDrop={fileDrag}
                    toggleButton={toggleButton}
                    toolUsed={handleToolUsed}
                    dropClientPosition={dropClientPosition}
                    currentBg={currentBg}
                    nodeFind={nodeFind}
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
                    textLayerSave={handleTextLayerSave}
                    textLaterLoad={textLayerOnLoad}
                    onStageRefChange={handleStageRefChange}
                    fileDropType={fileDropType}
                    fileDrop={fileDrag}
                    toggleButton={toggleButton}
                    toolUsed={handleToolUsed}
                    dropClientPosition={dropClientPosition}
                    currentBg={currentBg}
                    nodeFind={nodeFind}
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