import Konva from "konva";
import { BackLayerRender } from "./BackLayerRender";

export class WhiteBoard {
    stage;
    mainLayer;
    backLayer;

    backLayerRender;

    width = 0;
    height = 0;

    initStage(width, height, containerId) {
        this.width = width;
        this.height = height;

        this.stage = new Konva.Stage({
            width: width,
            height: height,
            container: containerId
        });

        this.stage.draggable(true);

        this.stage.on('dragend', (e) => {
            console.log('dragend');
            const position = e.currentTarget.position();
            
            this.backLayerRender.updateGrid(this.width, this.height, position.x, position.y);
        });
    }

    initMainLayer() {
        this.mainLayer = new Konva.Layer();
        this.stage.add(this.mainLayer);
        this.mainLayer.draw();
        this.drawSimpleShapes();
    }

    initBackLayer(width, height) {
        this.backLayer = new Konva.Layer();
        this.backLayer.listening(false);
        this.backLayerRender = new BackLayerRender(this.backLayer);
        this.backLayerRender.renderGrid(width, height);
        this.stage.add(this.backLayer);
    }

    drawSimpleShapes() {

    const circle = new Konva.Circle({
        x: this.stage.width() / 2,
        y: this.stage.height() / 2,
        radius: 70,
        fill: '#F9E6E0',
        stroke: '#1486F5',
        strokeWidth: 4,
    });

        const rect3 = new Konva.Rect({
            x: 550,
            y: 320,
            width: 100,
            height: 100,
            fill: '#1486F5',
            cornerRadius: [0, 10, 20, 30],
        });

        const rect4 = new Konva.Rect({
            x: 850,
            y: 120,
            width: 100,
            height: 100,
            fill: '#FF00B8'
        });

        this.mainLayer.add(rect3);
        this.mainLayer.add(rect4);
        this.mainLayer.add(circle);
        this.mainLayer.draw();
    }
}

// import React, { useEffect, useRef } from 'react';
// import Konva from 'konva';
// import BackLayerRender from "./BackLayerRender.jsx";

// function WhiteBoard() {
//     const width = 800;
//     const height = 600;
//     const containerRef = useRef(null);  // 使用 useRef 創建容器的參考

//     useEffect(() => {
//         const containerId = containerRef.current.id; // 取得容器的 id
//         const stage = new Konva.Stage({
//             width: width,
//             height: height,
//             container: containerId
//         });

//         stage.draggable(true);

//         stage.on('dragend', (e) => {
//             console.log('dragend');
//             const position = e.currentTarget.position();
//             backLayerRender.updateGrid(width, height, position.x, position.y);
//         });

//         const mainLayer = new Konva.Layer();
//         stage.add(mainLayer);

//         const circle = new Konva.Circle({
//             x: stage.width() / 2,
//             y: stage.height() / 2,
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

//         mainLayer.add(rect3);
//         mainLayer.add(rect4);
//         mainLayer.add(circle);
//         mainLayer.draw();

//         const backLayer = new Konva.Layer();
//         backLayer.listening(false);
//         const backLayerRender = new BackLayerRender(backLayer);
//         backLayerRender.renderGrid(width, height);
//         stage.add(backLayer);
//     }, [containerRef]);

//     return (
//         <div ref={containerRef}></div>
//     );
// }

// export default WhiteBoard;
