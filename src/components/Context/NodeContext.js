import React, { createContext, useState, useContext } from 'react';
import { useLabels } from '../Context/LabelContext.js';

const NodeContext = createContext();

export const useNodes = () => useContext(NodeContext);

export const NodeProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const { labels } = useLabels();

  const addNode = (node) => {
    setNodes(prevNodes => [...prevNodes, ...node]);
  };

  const deleteNode = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.nodeId !== nodeId));
  };

  const updatedNode = (updatedNode) => {
    if (!updatedNode) return;
    if (nodes.length === 0) return;

    setNodes(nodes =>
      nodes.map(node => {
        if (node.nodeId === updatedNode.nodeId) {
          return { ...node, fileName: updatedNode.fileName, x: updatedNode.x, y: updatedNode.y, attribute: updatedNode.attribute };
        }
        return node;
      })
    );
  };

  const updateLabelChange = () => {
    console.log("Labels:", labels); // 打印標籤數據
    console.log("Nodes before update:", nodes); // 打印節點數據
  
    if (!labels || nodes.length === 0) return;
  
    setNodes(prevNodes =>
      prevNodes.map(node => {
        console.log("Processing node:", node); // 打印當前處理的節點
  
        // 檢查 node.attribute 是否存在並且是數組
        const updatedAttributes = Array.isArray(node.attribute)
          ? node.attribute.map(attr => {
              const label = labels.find(l => l.labelId === attr.labelId);
              console.log("Mapped attribute:", attr, " to label:", label); // 打印屬性轉換結果
              return label ? { ...attr, ...label } : attr;
            })
          : node.attribute; // 如果不是數組，保持原樣
  
        return { ...node, attribute: updatedAttributes };
      })
    );
  };

  // 其他管理節點的邏輯...

  return (
    <NodeContext.Provider value={{ nodes, setNodes, addNode, deleteNode, updatedNode, updateLabelChange }}>
      {children}
    </NodeContext.Provider>
  );
};
