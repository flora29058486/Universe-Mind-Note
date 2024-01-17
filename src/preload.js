// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadUserData: async () => {
    try {
      // 使用 ipcRenderer 來發送 'user-data-loaded' 請求到主進程
      const userData = await ipcRenderer.invoke('user-data-loaded');
      return userData;
    } catch (error) {
      console.error('Error while loading userData electronAPI:', error);
      throw error;
    }
  },
  requestSaveData: (callback) => {
    ipcRenderer.on('request-save-data', callback);
  },
  removeRequestSaveData: (callback) => {
    ipcRenderer.removeListener('request-save-data', callback);
  },
  saveUserData: ({ labels, nodes, stage, text }) => {
    ipcRenderer.send('save-user-data', { labels, nodes, stage, text });
  },
  loadFolder: async () => { 
    const files = await ipcRenderer.invoke('dialog:openFolder');
    return files;
  },
  openFile: async (filePath) => {
    await ipcRenderer.invoke('main:openFile', filePath);
    return;
  },
  loadIcon: async (filePath) => {
    try {
      // 使用 ipcRenderer 來發送 'main:openFile' 請求到主進程
      const iconData = await ipcRenderer.invoke('main:loadIcon', filePath);
      return iconData; // 返回從主進程獲取的文件圖示 base64 字符串
    } catch (error) {
      console.error('Error while opening file via electronAPI:', error);
      throw error;
    }
  },
  // 打開預設瀏覽器上的網站
  openUrl: async (url) => {
    try {
      // 使用 ipcRenderer 來發送 'main:openURL' 請求到主進程
      await ipcRenderer.invoke('main:openURL', url);
    } catch (error) {
      console.error('Error while opening url via electronAPI:', error);
      throw error;
    }
  },
  // 使用 ipcRenderer 來發送 'get-env-var' 請求到主進程
  getEnvVar: async (key) => {
    try {
      // console.log('get-env-var', key);
      const value = await ipcRenderer.invoke('get-env', key);
      return value;
    } catch (error) {
      console.error('Error while getting env var via electronAPI:', error);
      throw error;
    }
  },
  notionPageReceived: (callback) => {
    ipcRenderer.on('notion-page-received', (_event, value) => callback(value));
  },
  removeNotionPageReceived: (callback) => {
    ipcRenderer.removeListener('notion-page-received', callback);
  },
})
