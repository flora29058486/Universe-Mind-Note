// import React, { useRef, useEffect } from 'react';
// import Konva from 'konva';

// const MainKonva = () => {
//   // test
//   const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
//   const stageRef = useRef(null);

//   const VIRTUAL_WIDTH = window.innerWidth;
//   const VIRTUAL_HEIGHT = window.innerHeight;
//   const PADDING = 500;  
//   const NUMBER = 200;

//   useEffect(() => {
//     // 背景圖片
//     // const backgroundImage = new Image();
//     // backgroundImage.src = '../../img/konvaBg.jpg';

//     const stage = new Konva.Stage({
//       container: stageRef.current,
//       width: VIRTUAL_WIDTH + PADDING * 2,
//       height: VIRTUAL_HEIGHT + PADDING * 2,
//       draggable: true,
//     });

//     const backgroundLayer = new Konva.Layer();
//     backgroundLayer.zIndex(-1);
//     const layer = new Konva.Layer();
//     stage.add(backgroundLayer);
//     stage.add(layer);
//     // let backgroundImage;

//   const loadBackgroundImage = () => {
//     backgroundLayer.destroy();
//     const backgroundImage = new Image();
//     backgroundImage.src = '../../img/konvaBg.jpg';
//     backgroundImage.onload = () => {
//       const backgroundRect = new Konva.Rect({
//         x: stagePos.x || 0,
//         y: stagePos.y || 0,
//         width: VIRTUAL_WIDTH + PADDING * 2,
//         height: VIRTUAL_HEIGHT + PADDING * 2,
//         fillPatternImage: backgroundImage,
//         fillPatternRepeat: 'repeat',
//       });
//       backgroundLayer.add(backgroundRect);
//     };
//     console.log("redraw");
//     stage.add(backgroundLayer);
//     backgroundLayer.batchDraw();
//   };

//   loadBackgroundImage();


//           // 創建隨機圓形圖形
//           function generateNode() {
//             return new Konva.Circle({
//               x: VIRTUAL_WIDTH * Math.random(),
//               y: VIRTUAL_HEIGHT * Math.random(),
//               radius: 50,
//               fill: 'red',
//               stroke: 'black',
//             });
//           }
          
//           for (let i = 0; i < NUMBER; i++) {
//             layer.add(generateNode());
//           }
    
//           // 滾輪縮放stage
//           var scaleBy = 1.03;
//           stage.on('wheel', (e) => {
//             // stop default scrolling
//             e.evt.preventDefault();
    
//             var oldScale = stage.scaleX();
//             var pointer = stage.getPointerPosition();
    
//             var mousePointTo = {
//               x: (pointer.x - stage.x()) / oldScale,
//               y: (pointer.y - stage.y()) / oldScale,
//             };
    
//             // how to scale? Zoom in? Or zoom out?
//             let direction = e.evt.deltaY > 0 ? -1 : 1;
    
//             // when we zoom on trackpad, e.evt.ctrlKey is true
//             // in that case lets revert direction
//             if (e.evt.ctrlKey) {
//               direction = -direction;
//             }
    
//             if (direction > 0 && oldScale <= 2) {
//               var newScale = oldScale * scaleBy
//             } else if (direction < 0 && oldScale >= 0.5) {
//               var newScale = oldScale / scaleBy
//             } else {
//               return newScale;
//             }
    
//             stage.scale({ x: newScale, y: newScale });
    
//             var newPos = {
//               x: pointer.x - mousePointTo.x * newScale,
//               y: pointer.y - mousePointTo.y * newScale,
//             };
    
//             stage.position(newPos);
//             console.log(newPos);
//             // 重新載入背景圖片
//             loadBackgroundImage();
//           });
          
//           stage.on('dragmove', () => {
//             // 重新載入背景圖片
//             loadBackgroundImage();
//           });


//     // backgroundImage.onload = () => {
//     //   const stage = new Konva.Stage({
//     //     container: stageRef.current,
//     //     width: VIRTUAL_WIDTH + PADDING * 2,
//     //     height: VIRTUAL_HEIGHT + PADDING * 2,
//     //     draggable: true,
//     //   });
    
//     //   const layer = new Konva.Layer();
//     //   stage.add(layer);

//     //   let backgroundImage;
//     //   const loadBackgroundImage = () => {

//     //     backgroundImage.onload = () => {
//     //       const backgroundRect = new Konva.Rect({
//     //         x: 0,
//     //         y: 0,
//     //         width: VIRTUAL_WIDTH + PADDING * 2,
//     //         height: VIRTUAL_HEIGHT + PADDING * 2,
//     //         fillPatternImage: backgroundImage,
//     //         fillPatternRepeat: 'repeat',
//     //       });
//     //       layer.add(backgroundRect);
//     //       layer.batchDraw();
//     //     };
//     //   };

//     //   loadBackgroundImage();

//     //   // 创建背景矩形，填充颜色为淡灰色
//     //   const backgroundRect = new Konva.Rect({
//     //     x: 0,
//     //     y: 0,
//     //     width: VIRTUAL_WIDTH + PADDING * 2,
//     //     height: VIRTUAL_HEIGHT + PADDING * 2,
//     //     // fill: 'lightgray', // 设置填充颜色
//     //     fillPatternImage: backgroundImage,
//     //     fillPatternRepeat: 'repeat',
//     //   });
//     //   layer.add(backgroundRect);

      
//     //   // 創建隨機圓形圖形
//     //   function generateNode() {
//     //     return new Konva.Circle({
//     //       x: VIRTUAL_WIDTH * Math.random(),
//     //       y: VIRTUAL_HEIGHT * Math.random(),
//     //       radius: 50,
//     //       fill: 'red',
//     //       stroke: 'black',
//     //     });
//     //   }
      
//     //   for (let i = 0; i < NUMBER; i++) {
//     //     layer.add(generateNode());
//     //   }

//     //   // 滾輪縮放stage
//     //   var scaleBy = 1.03;
//     //   stage.on('wheel', (e) => {
//     //     // stop default scrolling
//     //     e.evt.preventDefault();

//     //     var oldScale = stage.scaleX();
//     //     var pointer = stage.getPointerPosition();

//     //     var mousePointTo = {
//     //       x: (pointer.x - stage.x()) / oldScale,
//     //       y: (pointer.y - stage.y()) / oldScale,
//     //     };

//     //     // how to scale? Zoom in? Or zoom out?
//     //     let direction = e.evt.deltaY > 0 ? -1 : 1;

//     //     // when we zoom on trackpad, e.evt.ctrlKey is true
//     //     // in that case lets revert direction
//     //     if (e.evt.ctrlKey) {
//     //       direction = -direction;
//     //     }

//     //     if (direction > 0 && oldScale <= 2) {
//     //       var newScale = oldScale * scaleBy
//     //     } else if (direction < 0 && oldScale >= 0.5) {
//     //       var newScale = oldScale / scaleBy
//     //     } else {
//     //       return newScale;
//     //     }

//     //     stage.scale({ x: newScale, y: newScale });

//     //     var newPos = {
//     //       x: pointer.x - mousePointTo.x * newScale,
//     //       y: pointer.y - mousePointTo.y * newScale,
//     //     };

//     //     stage.position(newPos);
//     //     // 重新載入背景圖片
//     //     loadBackgroundImage();
//     //   });

//     //   stage.on('dragmove', () => {
//     //     // 重新載入背景圖片
//     //     loadBackgroundImage();
//     //   });

//     // };
//   }, []);

//   return (
//     <div ref={stageRef}></div>
//   );
// };

// export default MainKonva;




import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
// import { BackLayerRender } from './BackLayerRender';

const WhiteBoard = () => {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const step = 60;

  useEffect(() => {
    const stage = new Konva.Stage({
      width: width,
      height: height,
      container: stageRef.current,
      draggable: true,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    let backLayerRender;

    const loadBackground = () => {
      if (backLayerRender) {
        backLayerRender.updateGrid(width, height, stage.x(), stage.y());
      }
    };

    stage.on('dragmove', () => {
      loadBackground();
    });

    const handleWheel = (e) => {
      e.evt.preventDefault();

      const oldScale = scale;
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;

      const newScale = direction > 0 ? oldScale * 1.03 : oldScale / 1.03;

      setScale(newScale);

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      loadBackground();
    };

    stage.on('wheel', handleWheel);

    backLayerRender = new BackLayerRender(layer, step);
    backLayerRender.renderGrid(width, height);
    loadBackground();
  }, [scale]);

  return <div ref={stageRef}></div>;
};

export default WhiteBoard;
