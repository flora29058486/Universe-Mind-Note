import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LabelContext = createContext();

export const useLabels = () => useContext(LabelContext);

export const LabelsProvider = ({ children }) => {
  const [labels, setLabels] = useState([]);

  const addLabel = (newLabel) => {
    console.log(newLabel);
    setLabels(prevLabels => [...prevLabels, { ...newLabel, labelId: uuidv4() }]);
  };

  const removeLabel = (labelId) => {
    setLabels(prevLabels => prevLabels.filter(label => label.labelId !== labelId));
  };

  const updateLabel = (label) => {
    console.log(label);
    setLabels(prevLabels => prevLabels.map(l => l.labelId === label.labelId ? label : l));
  };

  const mergeLabels = (labelIds, newLabelName) => {
    // 先移除所有需要合并的标签
    const filteredLabels = labels.filter(label => !labelIds.includes(label.labelId));
    // 创建一个新的合并后的标签
    const mergedLabel = { labelId: uuidv4(), name: newLabelName };
    // 将新标签添加到数组中
    setLabels([...filteredLabels, mergedLabel]);
  };

  const searchLabelsByName = name => {
    return labels.filter(label => label.name.toLowerCase().includes(name.toLowerCase()));
  };

  const value = {
    labels,
    setLabels,
    addLabel,
    removeLabel,
    mergeLabels,
    updateLabel,
    searchLabelsByName,
  };

  return <LabelContext.Provider value={value}>{children}</LabelContext.Provider>;
};
