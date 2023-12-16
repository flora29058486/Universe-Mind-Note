// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  startDrag: (fileName) => {
    ipcRenderer.send('  ', fileName)
  },
  loadFolder: async () => { 
    const files = await ipcRenderer.invoke('dialog:openFolder');
    console.log("ww")
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

// contextBridge.exposeInIsolatedWorld('foldercontents', {
//   foldercontents: () => {
//     ipcRenderer.on('onfolderopen')
//     console.log("ww")
//   },

// })
