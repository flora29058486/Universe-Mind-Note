// import Konva from "konva";

// export class BackLayerRender {
//   currentX = -120;
//   currentY = -120;
//   width = 0;
//   height = 0;
//   step = 60;
//   layer;
//   points = new Map();

//   constructor(layer) {
//     this.layer = layer;
//   }

//   updateGrid(width, height, x, y) {
//     const position  = this.getLayerPoint(x, y);

//     if (position.x < 0) {
//       width = width + (-position.x);
//     }
//     if (position.y < 0) {
//       height = height + (-position.y);
//     }

//     const newx = -position.x;
//     const newy = - position.y;
//     const newShapes = [];
//     for(let y = newy; y < height; y = y + this.step) {
//       for(let x = newx; x < width; x = x + this.step) {
//         if (!this.points.has(x.toString() +  y.toString())) {
//           const rect = this.createRect(x, y);
//           rect.listening(false);
//           rect.perfectDrawEnabled(false);
//           rect.shadowForStrokeEnabled(false);
//           rect.hitStrokeWidth(0);
//           newShapes.push(rect);
//           this.points.set(x.toString() +  y.toString(), rect);
//         }
//       }
//     }
//     if (newShapes.length > 0) {
//       this.layer.add(...newShapes);
//     }
//   }

//   renderGrid(width, height) {
//     const position  = this.getLayerPoint(this.currentX, this.currentY);
//     for(let y = position.y; y < height; y = y + this.step) {
//       for(let x = position.x; x < width + 200; x = x + this.step) {
//         const rect = this.createRect(x, y);
//         rect.listening(false);
//         rect.perfectDrawEnabled(false);
//         rect.shadowForStrokeEnabled(false);
//         rect.hitStrokeWidth(0);
//         this.points.set(x.toString() +  y.toString(), rect);
//         this.layer.add(rect)
//       }
//     }
//     this.layer.draw();
//   }

//   createRect(x, y) {
//     var rect = new Konva.Rect({
//       x: x,
//       y: y,
//       width: this.step,
//       height: this.step,
//       stroke: '#e2e2ea',
//       strokeWidth: 1,
//       lineCap: 'round',
//       lineJoin: 'round',
//     });
//     return rect;
//   }

//   getLayerPoint(x, y) {
//     let nextx = x;
//     let nexty = y;

//     while(Math.round(nextx) % this.step !== 0) {
//       nextx++;
//     }
//     while(Math.round(nexty) % this.step !== 0) {
//       nexty++;
//     }

//     return {x: Math.round(nextx), y: Math.round(nexty) };
//   }
// }





// export const BackLayerRender = ({ width, height, positionx , positiony, step }) => {
//   const createRect = (x, y) => {
//     return (
//       <Rect
//         x={x}
//         y={y}
//         width={step}
//         height={step}
//         stroke="#e2e2ea"
//         strokeWidth={1}
//         lineCap="round"
//         lineJoin="round"
//       />
//     );
//   };

//   const renderGrid = () => {
//     const rects = [];
//     for (let y = 0; y < height + 200; y += step) {
//       for (let x = 0; x < width + 200; x += step) {
//         rects.push(createRect(x, y));
//       }
//     }
//     return rects;
//   };

//   return <>{renderGrid()}</>;
// };


import React, { useState, useEffect } from 'react';
import { Rect, Layer } from "react-konva";

export const BackLayerRender = ({ width, height, positionx, positiony, step }) => {
  const [position, setPosition] = useState({ x: -120, y: -120 });
  const [grid, setGrid] = useState([]);

  // Smooth math for point
  function getLayerPoint(x, y, step) {
    let nextx = x;
    let nexty = y;

    while(Math.round(nextx) % step !== 0) {
      nextx++;
    }
    while(Math.round(nexty) % step !== 0) {
      nexty++;
    }

    return {x: Math.round(nextx), y: Math.round(nexty) };
  }

  const renderGrid = (width, height, x, y, step) => {

    const position = getLayerPoint(x, y, step);
    if (position.x < 0) {
      width = width + (-position.x);
    };
    if (position.y < 0) {
      height = height + (-position.y);
    };

    const newx = -position.x;
    const newy = -position.y;

    const rects = [];
    for (let y = newy; y < height; y += step) {
      for (let x = newx; x < width; x += step) {
        rects.push(createRect(x, y));
      }
    }
    return rects;
  };

  const createRect = (x, y) => {
    return (
      <Rect
        key={`${x}-${y}`} // Adding a unique key for each rectangle
        x={x}
        y={y}
        width={step}
        height={step}
        stroke="#e2e2ea"
        strokeWidth={1}
        lineCap="round"
        lineJoin="round"
        isListening={false}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
        hitStrokeWidth={0}
      />
    );
  };

  useEffect(() => {
    // setPosition(positionx, positiony);
    // setGrid(renderGrid(width, height, position.x, position.y, step));
    setGrid(renderGrid(width, height, positionx, positiony, step));
    console.log(grid);
  }, [positionx, positiony]);

  return (<Layer>
    {grid}
  </Layer>);
};
