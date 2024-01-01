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
  saveUserData: ({ labels, nodes, stage }) => {
    ipcRenderer.send('save-user-data', { labels, nodes, stage });
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
})
