import React, { useEffect, useRef } from 'react';
import { useLabels } from '../Context/LabelContext.js'; 
import { useNodes } from '../Context/NodeContext.js';


export const SaveUserData = () => {
  // UserData Init and save
  const { labels } = useLabels();
  const { nodes } = useNodes();
  // 使用 useRef 來保存當前的 labels 和 nodes
  const currentLabels = useRef(labels);
  const currentNodes = useRef(nodes);

  // 當 labels 或 nodes 改變時，更新 useRef 的值
  useEffect(() => {
    currentLabels.current = labels;
    currentNodes.current = nodes;
  }, [labels, nodes]);
  
  // 只在組件首次掛載時註冊事件監聽器
  useEffect(() => {
    const handleSaveDataRequest = () => {
      // 使用 currentLabels.current 和 currentNodes.current 獲取最新的值
      window.electronAPI.saveUserData({ labels: currentLabels.current, nodes: currentNodes.current });
    };

    window.electronAPI.requestSaveData(handleSaveDataRequest);

    return () => {
      window.electronAPI.removeRequestSaveData(handleSaveDataRequest);
    };
  }, []);

  return null;
};

export default SaveUserData;