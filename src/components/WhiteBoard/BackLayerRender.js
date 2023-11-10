import Konva from "konva";

export class BackLayerRender {
  currentX = -120;
  currentY = -120;
  width = 0;
  height = 0;
  step = 60;
  layer;
  points = new Map();

  constructor(layer) {
    this.layer = layer;
  }

  updateGrid(width, height, x, y) {
    const position  = this.getLayerPoint(x, y);

    if (position.x < 0) {
      width = width + (-position.x);
    }
    if (position.y < 0) {
      height = height + (-position.y);
    }

    const newx = -position.x;
    const newy = - position.y;
    const newShapes = [];
    for(let y = newy; y < height; y = y + this.step) {
      for(let x = newx; x < width; x = x + this.step) {
        if (!this.points.has(x.toString() +  y.toString())) {
          const rect = this.createRect(x, y);
          rect.listening(false);
          rect.perfectDrawEnabled(false);
          rect.shadowForStrokeEnabled(false);
          rect.hitStrokeWidth(0);
          newShapes.push(rect);
          this.points.set(x.toString() +  y.toString(), rect);
        }
      }
    }
    if (newShapes.length > 0) {
      this.layer.add(...newShapes);
    }
  }

  renderGrid(width, height) {
    const position  = this.getLayerPoint(this.currentX, this.currentY);
    for(let y = position.y; y < height; y = y + this.step) {
      for(let x = position.x; x < width + 200; x = x + this.step) {
        const rect = this.createRect(x, y);
        rect.listening(false);
        rect.perfectDrawEnabled(false);
        rect.shadowForStrokeEnabled(false);
        rect.hitStrokeWidth(0);
        this.points.set(x.toString() +  y.toString(), rect);
        this.layer.add(rect)
      }
    }
    this.layer.draw();
  }

  createRect(x, y) {
    var rect = new Konva.Rect({
      x: x,
      y: y,
      width: this.step,
      height: this.step,
      stroke: '#e2e2ea',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
    });
    return rect;
  }

  getLayerPoint(x, y) {
    let nextx = x;
    let nexty = y;

    while(Math.round(nextx) % this.step !== 0) {
      nextx++;
    }
    while(Math.round(nexty) % this.step !== 0) {
      nexty++;
    }

    return {x: Math.round(nextx), y: Math.round(nexty) };
  }
}

// import React, { useEffect } from 'react';
// import Konva from "konva";

// export default function BackLayerRender() {
//     const currentX = -120;
//     const currentY = -120;
//     const width = 0;
//     const height = 0;
//     const step = 60;

//     const layer = new Konva.Layer();
//     const points = new Map();

//     useEffect(() => {
//         const updateGrid = (width, height, x, y) => {
//             const position = getLayerPoint(x, y);

//             if (position.x < 0) {
//                 width = width + (-position.x);
//             }
//             if (position.y < 0) {
//                 height = height + (-position.y);
//             }

//             const newx = -position.x;
//             const newy = -position.y;
//             const newShapes = [];
//             for (let y = newy; y < height; y = y + step) {
//                 for (let x = newx; x < width; x = x + step) {
//                     if (!points.has(x.toString() + y.toString())) {
//                         const rect = createRect(x, y);
//                         rect.listening(false);
//                         rect.perfectDrawEnabled(false);
//                         rect.shadowForStrokeEnabled(false);
//                         rect.hitStrokeWidth(0);
//                         newShapes.push(rect);
//                         points.set(x.toString() + y.toString(), rect);
//                     }
//                 }
//             }
//             if (newShapes.length > 0) {
//                 layer.add(...newShapes);
//             }
//         };

//         const renderGrid = (width, height) => {
//             const position = getLayerPoint(currentX, currentY);
//             for (let y = position.y; y < height; y = y + step) {
//                 for (let x = position.x; x < width + 200; x = x + step) {
//                     const rect = createRect(x, y);
//                     rect.listening(false);
//                     rect.perfectDrawEnabled(false);
//                     rect.shadowForStrokeEnabled(false);
//                     rect.hitStrokeWidth(0);
//                     points.set(x.toString() + y.toString(), rect);
//                     layer.add(rect);
//                 }
//             }
//             layer.draw();
//         };

//         const createRect = (x, y) => {
//             var rect = new Konva.Rect({
//                 x: x,
//                 y: y,
//                 width: step,
//                 height: step,
//                 stroke: '#e2e2ea',
//                 strokeWidth: 1,
//                 lineCap: 'round',
//                 lineJoin: 'round',
//             });
//             return rect;
//         };

//         const getLayerPoint = (x, y) => {
//             let nextx = x;
//             let nexty = y;

//             while (Math.round(nextx) % step !== 0) {
//                 nextx++;
//             }
//             while (Math.round(nexty) % step !== 0) {
//                 nexty++;
//             }

//             return { x: Math.round(nextx), y: Math.round(nexty) };
//         };

//         renderGrid(width, height);
//     }, []);

//     return null;  // BackLayerRender 組件本身不需要渲染任何內容
// }
