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

import './index.css';
import Konva from 'konva';

// var stage = new Konva.Stage({
//   // container: 'container',
//   // width: window.innerWidth,
//   // height: window.innerHeight
//   container: 'container',
//   width: undefined,
//   height: undefined,
// });

// // Allow continuous zooming out
// stage.scale({ minX: 0.01, minY: 0.01 });

// var layer = new Konva.Layer();
// stage.add(layer);

// // Create the circle
// var circle = new Konva.Circle({
//   x: 100, 
//   y: 100,
//   radius: 50,
//   fill: 'blue' 
// });

// // // Add circle to layer
// // layer.add(circle);
// // layer.draw();

// // // Add transformer
// // var tr = new Konva.Transformer();

// // // Transform handlers
// // circle.on('transform', function() {
// //   // redraw layer on transform
// //   layer.batchDraw(); 
// // });

// // circle.on('transformend', function() {
// //   // redraw layer on end
// //   layer.batchDraw();
// // });

// // circle.add(tr);

// // 創建一個矩形形狀作為背景
// var backgroundRect = new Konva.Rect({
//   x: 0,
//   y: 0,
//   width: 3000,
//   height: 3000,
//   fill: 'lightgray' // 設定背景顏色
// });

// // 將背景矩形添加到圖層
// layer.add(backgroundRect);
// layer.draw();

// // 初始化畫布的大小和位置
// var canvasWidth = stage.width();
// var canvasHeight = stage.height();
// var offsetX = 0;
// var offsetY = 0;
// var scale = 1;

// // 函數用於更新畫布和背景的位置
// function updateCanvasSize() {
//   // backgroundRect.width(canvasWidth);
//   // backgroundRect.height(canvasHeight);
//   stage.width(canvasWidth);
//   stage.height(canvasHeight);
//   layer.batchDraw();
// }

// // 監聽拖曳事件，並根據拖曳距離調整背景的位置
// stage.on('dragmove', function (e) {
//   var dragDistance = e.target.getAbsolutePosition();
//   offsetX = -dragDistance.x;
//   offsetY = -dragDistance.y;
//   backgroundRect.x(offsetX);
//   backgroundRect.y(offsetY);
//   layer.batchDraw();
// });

// // 函數用於平移畫布
// function translateCanvas(dx, dy) {
//   offsetX += dx;
//   offsetY += dy;
//   layer.position({ x: offsetX, y: offsetY });
//   layer.batchDraw();
// }

// // 函數用於縮放畫布
// function zoomCanvas(factor) {
//   scale *= factor;
//   stage.scale({ x: scale, y: scale });
//   layer.batchDraw();
// }

// // 處理滾輪事件以縮放畫布
// window.addEventListener('wheel', function (e) {
//   e.preventDefault();
//   var zoomFactor = e.deltaY > 0 ? 1.05 : 0.95;
//   zoomCanvas(zoomFactor);
// }, {passive: false});

// // 處理拖動事件以平移畫布
// var isDragging = false;
// var lastX, lastY;

// stage.on('mousedown', function (e) {
//   isDragging = true;
//   lastX = e.evt.clientX;
//   lastY = e.evt.clientY;
// });

// stage.on('mousemove', function (e) {
//   if (isDragging) {
//     var currentX = e.evt.clientX;
//     var currentY = e.evt.clientY;
//     var dx = currentX - lastX;
//     var dy = currentY - lastY;
//     translateCanvas(dx, dy);
//     lastX = currentX;
//     lastY = currentY;
//   }
// });

// stage.on('mouseup', function () {
//   isDragging = false;
// });

// // 設定無限大畫布
// var initialCanvasSize = 3000; // 初始畫布大小
// canvasWidth = canvasHeight = initialCanvasSize;
// updateCanvasSize();

// // 添加一些示例形狀
// var rect = new Konva.Rect({
//   x: 800,
//   y: 800,
//   width: 300,
//   height: 300,
//   fill: 'red',
//   draggable: true
// });

// layer.add(rect);

// layer.batchDraw();

var VIRTUAL_WIDTH = 3000;  // 非常大的虛擬畫布寬度
var VIRTUAL_HEIGHT = 3000; // 非常大的虛擬畫布高度
var VIEW_WIDTH = window.innerWidth; // 視圖寬度
var VIEW_HEIGHT = window.innerHeight; // 視圖高度
var PADDING = 500; // 填充，用於滾動平滑性
var NUMBER = 200; // 要生成的圓形數量
var scale = 1; // 縮放規模

// 創建虛擬畫布
var virtualStage = new Konva.Stage({
  container: 'container',
  width: VIRTUAL_WIDTH + PADDING * 2,
  height: VIRTUAL_HEIGHT + PADDING * 2,
  draggable: true,
});
// // Allow continuous zooming out
// virtualStage.scale({ minX: 0.01, minY: 0.01 });

// 創建圖層
var layer = new Konva.Layer();
virtualStage.add(layer);

// 創建隨機圓形圖形
function generateNode() {
  return new Konva.Circle({
    x: VIRTUAL_WIDTH * Math.random(),
    y: VIRTUAL_HEIGHT * Math.random(),
    radius: 50,
    fill: 'red',
    stroke: 'black',
  });
}

// 在虛擬畫布上添加多個圓形圖形
for (var i = 0; i < NUMBER; i++) {
  layer.add(generateNode());
}

// 計算視圖窗口初始位置，使畫布中央可見
// var initialViewX = (VIRTUAL_WIDTH - VIEW_WIDTH) / 2;
// var initialViewY = (VIRTUAL_HEIGHT - VIEW_HEIGHT) / 2;

// 設定視圖窗口的初始位置
// virtualStage.container().style.transform = 'translate(' + (-initialViewX) + 'px, ' + (-initialViewY) + 'px)';
// virtualStage.x(initialViewX);
// virtualStage.y(initialViewY);

// 函數用於縮放畫布
function zoomCanvas(factor) {
  // 縮放規模限制
  if (scale * factor < 0.2 || scale * factor > 5) {
    return;
  } else {
    scale *= factor;
  }
  // 縮放虛擬畫布
  virtualStage.scale({ x: scale, y: scale });
  layer.batchDraw();
}

// 處理滾輪事件以縮放畫布
window.addEventListener('wheel', function (e) {
  e.preventDefault();
  var zoomFactor = e.deltaY > 0 ? 1.05 : 0.95;
  zoomCanvas(zoomFactor);
}, {passive: false});

// <div id="scroll-container"></div>
var scrollContainer = document.getElementById('scroll-container');
function repositionStage() {
  var dx = scrollContainer.scrollLeft - PADDING;
  var dy = scrollContainer.scrollTop - PADDING;
  virtualStage.container().style.transform =
    'translate(' + dx + 'px, ' + dy + 'px)';
  virtualStage.x(-dx);
  virtualStage.y(-dy);
}
scrollContainer.addEventListener('scroll', repositionStage);
repositionStage();

console.log('👋 This message is being logged by "renderer.js", included via webpack');
