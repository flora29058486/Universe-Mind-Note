// MyComponent.js
import React from 'react';
import styles from './MyComponent.module.css'; // 导入局部样式

const MyComponent = () => {
  return (
    <div className={styles.container}>
      <button className={`tw-button ${styles.customButton}`}>My Button</button>
    </div>
  );
};

export default MyComponent;
