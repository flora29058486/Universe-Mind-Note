import React, { useEffect, useState, useRef } from 'react';
import { useLabels } from '../Context/LabelContext.js'; 
import { useNodes } from '../Context/NodeContext.js';


export const SaveUserData = ({ onStateChange, konvaStageJson, textLayerData }) => {
  // UserData Init and save
  const { labels } = useLabels();
  const { nodes } = useNodes();
  // 使用 useRef 來保存當前的 labels 和 nodes
  const currentLabels = useRef(labels);
  const currentNodes = useRef(nodes);
  const currentStage = useRef(konvaStageJson);
  const currentTextLayerData = useRef(textLayerData);

  let counter = 0;

  // 當 labels 或 nodes 改變時，更新 useRef 的值
  useEffect(() => {
    currentLabels.current = labels;
    currentNodes.current = nodes;
    onStateChange(counter);
    counter++;
  }, [labels, nodes]);

  // konvaStageRef change
  useEffect(() => {
    // console.log("should not repidly console");
    currentStage.current = konvaStageJson;
  }, [konvaStageJson]);

  // textLayerData change
  useEffect(() => {
    currentTextLayerData.current = textLayerData;
    // console.log("textLayerData change", textLayerData)
  }, [textLayerData]);


  // 只在組件首次掛載時註冊事件監聽器
  useEffect(() => {
    const handleSaveDataRequest = () => {
      // 使用 currentLabels.current 和 currentNodes.current 獲取最新的值
      // onStateChange(true);
      // console.log("should not console")
      window.electronAPI.saveUserData({ labels: currentLabels.current, nodes: currentNodes.current, stage: currentStage.current, text: currentTextLayerData.current });
    };

    window.electronAPI.requestSaveData(handleSaveDataRequest);

    return () => {
      window.electronAPI.removeRequestSaveData(handleSaveDataRequest);
    };
  }, []);

  return null;
};

export default SaveUserData;