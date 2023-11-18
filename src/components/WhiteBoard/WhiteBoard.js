// import Konva from "konva";
// import { BackLayerRender } from "./BackLayerRender";

// export class WhiteBoard {
//     stage;
//     mainLayer;
//     backLayer;

//     backLayerRender;

//     width = 0;
//     height = 0;

//     initStage(width, height, containerId) {
//         this.width = width;
//         this.height = height;

//         this.stage = new Konva.Stage({
//             width: width,
//             height: height,
//             container: containerId
//         });

//         this.stage.draggable(true);

//         this.stage.on('dragend', (e) => {
//             console.log('dragend');
//             e.cancelBubble = true;
//             const position = e.currentTarget.position();
            
//             this.backLayerRender.updateGrid(this.width, this.height, position.x, position.y);
//         });
//     }

//     initMainLayer() {
//         this.mainLayer = new Konva.Layer();
//         this.stage.add(this.mainLayer);
//         this.mainLayer.draw();
//         this.drawSimpleShapes();
//     }

//     initBackLayer(width, height) {
//         this.backLayer = new Konva.Layer();
//         this.backLayer.listening(false);
//         this.backLayerRender = new BackLayerRender(this.backLayer);
//         this.backLayerRender.renderGrid(width, height);
//         this.stage.add(this.backLayer);
//     }

//     drawSimpleShapes() {

//         const circle = new Konva.Circle({
//             x: this.stage.width() / 2,
//             y: this.stage.height() / 2,
//             radius: 70,
//             fill: '#F9E6E0',
//             stroke: '#1486F5',
//             strokeWidth: 4,
//         });

//         const rect3 = new Konva.Rect({
//             x: 550,
//             y: 320,
//             width: 100,
//             height: 100,
//             fill: '#1486F5',
//             cornerRadius: [0, 10, 20, 30],
//         });

//         const rect4 = new Konva.Rect({
//             x: 850,
//             y: 120,
//             width: 100,
//             height: 100,
//             fill: '#FF00B8'
//         });

//         this.mainLayer.add(rect3);
//         this.mainLayer.add(rect4);
//         this.mainLayer.add(circle);
//         this.mainLayer.draw();
//     }
// }



// WhiteBoard.js
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Rect } from "react-konva";
import { BackLayerRender } from "./BackLayerRender";

const width = window.innerWidth;
const height = window.innerHeight;
const step = 60;
const padding = 200;

function generateBackgroundLayer() {
  // return [...Array(10)].map((_, i) => ({
  //   id: i.toString(),
  //   x: Math.random() * window.innerWidth,
  //   y: Math.random() * window.innerHeight,
  //   rotation: Math.random() * 180,
  //   isDragging: false,
  // }));
  return ({
    key: "backgroundLayer",
    id: "backgroundLayer",
    x: width + padding,
    y: height + padding,
    // scale: 1,
  });
}

const INITIAL_BAKEGROUND_STATE = generateBackgroundLayer();

export const WhiteBoard = () => {
  const [backgroundLayerStat, setBackgroundLayerStat] = useState(INITIAL_BAKEGROUND_STATE);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    e.cancelBubble = true;
    console.log('dragstart');
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    console.log('dragend');

    // 獲取拖動結束後的位置
    const position = e.target.position();
    console.log(position);

    // 更新位置狀態
    setPosition({ x: position.x, y: position.y });

    // let adjustedX = position.x;
    // let adjustedY = position.y;

    // if (position.x < 0) {
    //   adjustedX = backgroundLayerStat.x + (-position.x);
    // }
    // if (position.y < 0) {
    //   adjustedY = backgroundLayerStat.y + (-position.y);
    // }

    // setBackgroundLayerStat((prev) => ({
    //   ...prev,
    //   x: adjustedX,
    //   y: adjustedY,
    // }));
    // const position = e.currentTarget.position();
    // backLayerRender.updateGrid(this.width, this.height, position.x, position.y);
  };

  useEffect(() => {

  }, [position.x, position.y]);

  return (
    <Stage 
      width={width} 
      height={height}
      draggable={true}
      onDragEnd={handleDragEnd}
    >
      {/* <Layer
        key={backgroundLayerStat.id}
        id={backgroundLayerStat.id}
        x={backgroundLayerStat.x}
        y={backgroundLayerStat.y}
        // draggable
        isListening={false}
        // onDragStart={handleDragStart}
        // onDragEnd={handleDragEnd}
      >
        <BackLayerRender 
          width={width} 
          height={height} 
          positionx={position.x} 
          positiony={position.y} 
          step={step} 
        />
      </Layer> */}
      <BackLayerRender 
        width={width} 
        height={height} 
        positionx={position.x} 
        positiony={position.y} 
        step={step} 
      />
    </Stage>
  );
};
