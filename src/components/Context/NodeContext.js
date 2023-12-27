import React, { createContext, useState, useContext } from 'react';
import { useLabels } from '../Context/LabelContext.js';

const NodeContext = createContext();

export const useNodes = () => useContext(NodeContext);

export const NodeProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const { labels, removeLabel } = useLabels();

  const addNode = (node) => {
    console.log(node);
    setNodes(prevNodes => [...prevNodes, ...node]);
  };

  const deleteNode = (nodeId) => {
    const nodeToDelete = nodes.find(node => node.nodeId === nodeId);
    if (!nodeToDelete) {
      console.log("Node not found:", nodeId);
      return;
    }
    
    // 所有要刪除的標籤
    const labelsToDelete = new Set(nodeToDelete.attribute.map(attr => attr.labelId));
    console.log(labelsToDelete);

    // 歷遍所有節點，過濾需要刪除的標籤
    nodes.forEach(node => {
      if (node.nodeId !== nodeId) {
        node.attribute.forEach(attr => {
          if (labelsToDelete.has(attr.labelId)) {
            labelsToDelete.delete(attr.labelId);
          }
        });
      }
    });

    // 處理需要刪除的標籤
    labelsToDelete.forEach(labelId => {
      console.log("Deleting label:", labelId);
      removeLabel(labelId);
    });

    // 刪除節點
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
