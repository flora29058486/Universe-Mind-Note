import React, { useRef, useEffect, Component, useState } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import MainKonva from './components/MainKonva/MainKonva';
import './App.css';
import KnovaBgImg from './components/knovaBg.jsx';
import { WhiteBoard } from './components/WhiteBoard/WhiteBoard.js';

// export default function App() {
//   const containerRef = useRef(null);

//   // useEffect(() => {
//   //   MainKonva();
//   //   // 在 containerRef.current 中引用 DOM 元素
//   //   const containerElement = containerRef.current;
//   // }, []);

//   componentDidMount() {
//     const whiteBoard = new WhiteBoard();
//     whiteBoard.initStage(800, 600, 'container'); // 填入你的容器 ID
//     whiteBoard.initMainLayer();
//     whiteBoard.initBackLayer(800, 600);
//   }

//   return (

//     <div>
//       {/* <div>
//         <KnovaBgImg />
//       </div> */}
//       {/* <div className="large-container">
//         <ToggleButtonOnMainKonva />
//         <div ref={containerRef} id="container"></div>
//       </div> */}
//       <MainKonva />
//     </div>
//   );
// }

export default function App() {
  const [toolSelect, setToolSelect] = useState('');

  useEffect(() => {
    const whiteBoard = new WhiteBoard();
    whiteBoard.initStage( window.innerWidth,  window.innerHeight, 'white'); // 填入你的容器 ID
    whiteBoard.initMainLayer();
    whiteBoard.initBackLayer( window.innerWidth,  window.innerHeight);
  }, []);


  // 回调函数，用于从子组件接收值
  const handleToolSelect = (button) => {
    // 处理子组件传递过来的值
    setToolSelect(button);
    console.log(button);
    // console.log(toolSelect);
  };

  return (
    <div>
      <Toolbar onToolSelect={handleToolSelect}/>
      <ToggleButtonOnMainKonva/>
      <div id="white"></div>
      {/* <div className="large-container">
        <ToggleButtonOnMainKonva/>
        <div id="white"></div>
      </div> */}
    </div>
  );
}
