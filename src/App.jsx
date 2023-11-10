import React, { useRef, useEffect, Component } from 'react';
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
  useEffect(() => {
      const whiteBoard = new WhiteBoard();
      whiteBoard.initStage( window.innerWidth,  window.innerHeight, 'white'); // 填入你的容器 ID
      whiteBoard.initMainLayer();
      whiteBoard.initBackLayer( window.innerWidth,  window.innerHeight);
  }, []);

  return (
    <div className="large-container">
      <Toolbar />
      <ToggleButtonOnMainKonva/>
      <div id="white"></div>
    </div>
  );
}
