// // MainKonva.js
// // import React from 'react';
// // import styles from './MainKonva.module.css'; // 导入局部样式
// import Konva from 'konva';

// var stage = new Konva.Stage({
//   container: 'container',
//   width: window.innerWidth,
//   height: window.innerHeight
// });

// var layer = new Konva.Layer();
// stage.add(layer);

// // 初始化畫布大小和位置
// var canvasWidth = stage.width();
// var canvasHeight = stage.height();
// var offsetX = 0;
// var offsetY = 0;
// var scale = 1;

// // 函數用於更新畫布大小
// function updateCanvasSize() {
//   stage.width(canvasWidth);
//   stage.height(canvasHeight);
//   layer.batchDraw();
// }

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
//   var zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
//   zoomCanvas(zoomFactor);
// });

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
//   width: 100,
//   height: 100,
//   fill: 'red',
//   draggable: true
// });

// layer.add(rect);

// layer.batchDraw();

// first we need to create a stage
var stage = new Konva.Stage({
  container: 'container',   // id of container <div>
  width: 500,
  height: 500
});

// then create layer
var layer = new Konva.Layer();

// create our shape
var circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4
});

// add the shape to the layer
layer.add(circle);

// add the layer to the stage
stage.add(layer);

// draw the image
layer.draw();