/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';
// import Konva from 'konva';


// var VIRTUAL_WIDTH = 3000;  // 非常大的虛擬畫布寬度
// var VIRTUAL_HEIGHT = 3000; // 非常大的虛擬畫布高度
// var VIEW_WIDTH = window.innerWidth; // 視圖寬度
// var VIEW_HEIGHT = window.innerHeight; // 視圖高度
// var PADDING = 500; // 填充，用於滾動平滑性
// var NUMBER = 200; // 要生成的圓形數量
// var scale = 1; // 縮放規模

// // 創建虛擬畫布
// var virtualStage = new Konva.Stage({
//   container: 'container',
//   width: VIRTUAL_WIDTH + PADDING * 2,
//   height: VIRTUAL_HEIGHT + PADDING * 2,
//   draggable: true,
// });
// // // Allow continuous zooming out
// // virtualStage.scale({ minX: 0.01, minY: 0.01 });

// // 創建圖層
// var layer = new Konva.Layer();
// virtualStage.add(layer);

// // 創建隨機圓形圖形
// function generateNode() {
//   return new Konva.Circle({
//     x: VIRTUAL_WIDTH * Math.random(),
//     y: VIRTUAL_HEIGHT * Math.random(),
//     radius: 50,
//     fill: 'red',
//     stroke: 'black',
//   });
// }

// // 在虛擬畫布上添加多個圓形圖形
// for (var i = 0; i < NUMBER; i++) {
//   layer.add(generateNode());
// }

// // 計算視圖窗口初始位置，使畫布中央可見
// // var initialViewX = (VIRTUAL_WIDTH - VIEW_WIDTH) / 2;
// // var initialViewY = (VIRTUAL_HEIGHT - VIEW_HEIGHT) / 2;

// // 設定視圖窗口的初始位置
// // virtualStage.container().style.transform = 'translate(' + (-initialViewX) + 'px, ' + (-initialViewY) + 'px)';
// // virtualStage.x(initialViewX);
// // virtualStage.y(initialViewY);

// // 函數用於縮放畫布
// function zoomCanvas(factor) {
//   // 縮放規模限制
//   if (scale * factor < 0.2 || scale * factor > 5) {
//     return;
//   } else {
//     scale *= factor;
//   }
//   // 縮放虛擬畫布
//   virtualStage.scale({ x: scale, y: scale });
//   layer.batchDraw();
// }

// // 處理滾輪事件以縮放畫布
// window.addEventListener('wheel', function (e) {
//   e.preventDefault();
//   var zoomFactor = e.deltaY > 0 ? 1.05 : 0.95;
//   zoomCanvas(zoomFactor);
// }, {passive: false});

// <div id="scroll-container"></div>
// var scrollContainer = document.getElementById('scroll-container');
// function repositionStage() {
//   var dx = scrollContainer.scrollLeft - PADDING;
//   var dy = scrollContainer.scrollTop - PADDING;
//   virtualStage.container().style.transform =
//     'translate(' + dx + 'px, ' + dy + 'px)';
//   virtualStage.x(-dx);
//   virtualStage.y(-dy);
// }
// scrollContainer.addEventListener('scroll', repositionStage);
// repositionStage();

// console.log('👋 This message is being logged by "renderer.js", included via webpack');

// import react from 'react';
// import MainKonva from './components/MainKonva/MainKonva'; // 引入您的 React 组件
// // var MainKonva = document.getElementById('hehe');
// MainKonva();
// function App() {
//   return (
//     <div>aaaa</div>
//   );
// }

// export default App;

// import React from 'react'; // Import React
// import ReactDOM from 'react-dom'; // Import ReactDOM
// import App from './App.js';
// import MainKonva from './components/MainKonva/MainKonva'; // 引入您的 React 组件
// MainKonva()
// ReactDOM.render(React.createElement(App), document.getElementById('root')); // Render the App component


// function App() {
//   var MainKonva = document.getElementById('hehe');
//   MainKonva.innerText = 'aaa'
// }

// export default App;