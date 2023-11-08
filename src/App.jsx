import React, { useRef, useEffect } from 'react';
import ToggleButtonOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import MainKonva from './components/MainKonva/MainKonva';
import './App.css';
import KnovaBgImg from './components/knovaBg.jsx';

export default function App() {
  const containerRef = useRef(null);

  // useEffect(() => {
  //   MainKonva();
  //   // 在 containerRef.current 中引用 DOM 元素
  //   const containerElement = containerRef.current;
  // }, []);

  return (

    <div>
      {/* <div>
        <KnovaBgImg />
      </div> */}
      {/* <div className="large-container">
        <ToggleButtonOnMainKonva />
        <div ref={containerRef} id="container"></div>
      </div> */}
      <MainKonva />
    </div>
  );
}
