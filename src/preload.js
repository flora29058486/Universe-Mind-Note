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
})

// contextBridge.exposeInIsolatedWorld('foldercontents', {
//   foldercontents: () => {
//     ipcRenderer.on('onfolderopen')
//     console.log("ww")
//   },

// })
