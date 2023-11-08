import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

const MainKonva = () => {
  // test
  const stageRef = useRef(null);

  const VIRTUAL_WIDTH = window.innerWidth;
  const VIRTUAL_HEIGHT = window.innerHeight;
  const PADDING = 500;  
  const NUMBER = 200;
  let scale = 1;

  useEffect(() => {
    // 背景圖片
    const backgroundImage = new Image();
    backgroundImage.src = '../../img/konvaBg.jpg';

    backgroundImage.onload = () => {
      const stage = new Konva.Stage({
        container: stageRef.current,
        width: VIRTUAL_WIDTH + PADDING * 2,
        height: VIRTUAL_HEIGHT + PADDING * 2,
        draggable: true,
      });
    
      const layer = new Konva.Layer();

      // 创建背景矩形，填充颜色为淡灰色
      const backgroundRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: VIRTUAL_WIDTH + PADDING * 2,
        height: VIRTUAL_HEIGHT + PADDING * 2,
        // fill: 'lightgray', // 设置填充颜色
        fillPatternImage: backgroundImage,
        fillPatternRepeat: 'repeat',
      });
      layer.add(backgroundRect);

      
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
      
      for (let i = 0; i < NUMBER; i++) {
        layer.add(generateNode());
      }

      // 將圖形圖層添加到舞台
      stage.add(layer);

      // 动态渲染背景
      stage.on('xChange yChange scaleChange', function () {
        // 获取当前的缩放比例
        const scaleX = stage.scaleX();
        const scaleY = stage.scaleY();

        // 根据画布的位置和缩放比例来动态更新背景的位置和大小
        const newX = -stage.x() / scaleX - PADDING;
        const newY = -stage.y() / scaleY - PADDING;
        const newWidth = (VIRTUAL_WIDTH + PADDING * 2) / scaleX;
        const newHeight = (VIRTUAL_HEIGHT + PADDING * 2) / scaleY;

        backgroundRect.setAttrs({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });

        layer.batchDraw();
      });

      // 函數用於縮放畫布
      function zoomCanvas(factor) {
        if (scale * factor < 0.2 || scale * factor > 5) {
          return;
        } else {
          scale *= factor;
        }
        stage.scale({ x: scale, y: scale });

        layer.batchDraw();
      }

      // 處理滾輪事件以縮放畫布
      window.addEventListener('wheel', function (e) {
        e.preventDefault();
        var zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
        zoomCanvas(zoomFactor);
      }, {passive: false});
      
    };
  }, []);

  return (
    <div ref={stageRef}></div>
  );
};

export default MainKonva;

